<template>
    <div>
        <a-table bordered size='small' :loading="loading"
        :columns="column" :dataSource="data">
            <template v-for="(col,u) in ['name','description']" :slot="col" slot-scope="text, record">
                <a-input v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"></a-input>
                <template v-else>{{text}}</template>
            </template>
            <template slot="attachment" slot-scope="text,record">
                <a @click="openAttachmentDialog(record.key)">查看</a>
            </template>
            <template slot="action" slot-scope="text,record">
                <template v-if="record.editable">
                    <span>
                        <a @click="saveRow(record.key)">保存</a>
                        <a-divider type='vertical'></a-divider>
                        <a @click="makeDocumentRowNotEditable(record.key)">取消</a>
                    </span>
                </template>
                <span v-else>
                    <a @click="makeDocumentRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="removeRow(record.key)" :class="[{'disabled-button': record.disable}, 'red']">删除</a>
                </span>
            </template>
        </a-table>
        <a-attachment :employeeId="employeeId" :visible="visible" @cancel="handleCancel"
    :attachmentList="fileList" :employeePropertyId="employeePropertyId" :pathName="pathName" keyName="employeeRelatedDocumentAttachments"></a-attachment>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, DatePicker, Input, Select, message } from 'ant-design-vue';
import {  ColumnList, RemoteAttachmentData, AttachmentData, RemoteDocumentTableData } from '@/interface';
import Attach from '@/components/Attach/index.vue';
import jsonpatch from 'fast-json-patch';
import { putEmployeeRelatedDocument, deleteEmployeeRelatedDocument, getEmployeeRelatedDocument, getEmployeeAttachmentById  } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    key: string;
    name: string;
    description: string;
    disable: boolean;
    editable: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-date-picker': DatePicker,
        'a-input': Input,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-attachment': Attach,
    },
})
export default class ContractTable extends Vue {
    @Prop({ default: '' }) private employeeId!: string;
    @Prop() private tabList!: TableData[];
    @Prop({ default: false }) private loading!: boolean;
    @Prop({default: ''}) private ETag!: string;
    private pathName = 'EmployeeRelatedDocument';
    private fileList: AttachmentData[] = [];
    private visible: boolean = false;
    private employeePropertyId = '';
    private cacheOriginData: any = [];
    private data: TableData[] = [];
    private column: ColumnList[] = [{
        title: '文档名称',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '文档描述',
        dataIndex: 'description',
        align: 'center',
        scopedSlots: { customRender: 'description' },
    }, {
        title: '附件',
        dataIndex: 'attachment',
        align: 'center',
        scopedSlots: { customRender: 'attachment' },
    }, {
        title: '操作',
        dataIndex: 'action',
        width: 120,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    private isNullData(target: TableData): boolean {
        if ( _.isEmpty(target.name) || _.isEmpty(target.description)) {
            message.error('文档资料不完整');
            return false;
        }
        return true;
    }
    private openAttachmentDialog(key: string) {
        getEmployeeAttachmentById(this.employeeId, key, this.pathName).then((res: any) => {
            this.visible = true;
            const data = res.data;
            this.fileList  = _.map(data.employeeRelatedDocumentAttachments, (item) => {
                return {
                    key: item.id,
                    name: item.attachmentInfo.originalName,
                    description: item.description,
                    editable: false,
                    disable: false,
                };
            });
            this.employeePropertyId = key;
        });
    }
    private handleCancel() {
        this.visible = false;
    }
    private handleOk() {
        this.visible = false;
    }
    private makeDocumentRowNotEditable(key: string) {
        const target = _.find(this.cacheOriginData, ['key', key]);
        const targetIndex = _.findIndex(this.data, ['key', key]);
        this.data.splice(targetIndex, 1, target);
        this.setOtherRowsDisabled(key, this.data, false);
    }
    private setOtherRowsDisabled(key: string, arr: TableData[], disabled: boolean) {
        arr.filter((item) => {
            if (!_.isEqual(item.key, key)) {
                item.disable = disabled;
            }
        });
    }
    private removeRow(key: string) {
        deleteEmployeeRelatedDocument(this.employeeId, key).then((res) => {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
        }).catch((err) => {
            message.error('删除失败');
        });
    }
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullData(target)) {
            const newData = _.cloneDeep(this.data);
            const newValue = this.transformRemoteData(newData);
            const oldValue = this.transformRemoteData(this.cacheOriginData);
            const param = this.compareNewAndOldValue(newValue, oldValue);
            putEmployeeRelatedDocument(this.employeeId, param, {
                'If-Match': this.ETag,
            }).then((res) => {
                message.success('更新成功');
                this.$emit('loadData');
            }).catch((err) => {
                message.error('更新失败');
            });
        }
    }
    private compareNewAndOldValue(newValue: RemoteDocumentTableData[], oldValue: RemoteDocumentTableData[]) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
    private handleChange(value: any, key: string, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    private transformRemoteData(remoteData: TableData[]): RemoteDocumentTableData[] {
        const newData: RemoteDocumentTableData[] = _.map(remoteData, (item) => {
            return {
                name: item.name,
                description: item.description,
            };
        });
        return newData;
    }
    private makeDocumentRowEditable(key: string) {
        const target = this.data.filter((item) => item.key === key)[0];
        if (target) {
            this.cacheOriginData = _.cloneDeep(this.data);
            target.editable = !target.editable;
            this.setOtherRowsDisabled(key, this.data, true);
        }
    }
}
</script>
