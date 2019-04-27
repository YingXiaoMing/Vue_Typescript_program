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
                        <a @click="cancel(record.key)">取消</a>
                    </span>
                </template>
                <span v-else>
                    <a @click="toggle(record.key)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="removeRow(record.key)" class="red">删除</a>
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
import {  ColumnList, RemoteAttachmentData, AttachmentData } from '@/interface';
import Attach from '@/components/Attach/index.vue';
import jsonpatch from 'fast-json-patch';
import { putEmployeeRelatedDocument, deleteEmployeeRelatedDocument, getEmployeeRelatedDocument, getEmployeeAttachmentById  } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    key: string;
    name: string;
    description: string;
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
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    private openAttachmentDialog(key: string) {
        getEmployeeAttachmentById(this.employeeId, key, this.pathName).then((res: any) => {
            this.visible = true;
            this.fileList  = _.map(res.employeeRelatedDocumentAttachments, (item) => {
                return {
                    key: item.id,
                    name: item.attachmentInfo.fileName,
                    description: item.description,
                    editable: false,
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
    private cancel(key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
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
        const params =  this.compareNewAndOldValue(target, this.cacheOriginData[key]);
        putEmployeeRelatedDocument(this.employeeId, target.key, params).then((res) => {
            target.editable = false;
        }).catch((err) => {
            message.error('更新失败');
        });
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            name: newValue.name,
            description: newValue.description,
        };
        const oldValues = {
            name: oldValue.name,
            description: oldValue.description,
        };
        const diff = jsonpatch.compare(oldValues, newValues);
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
    private toggle(key: string) {
        const target = this.data.filter((item) => item.key === key)[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
}
</script>
