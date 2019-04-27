<template>
    <a-table bordered size='small' :pagination="false" 
    :columns="column" :dataSource="data" :loading="loading">
        <template slot="description" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, 'description')"></a-input>
            <template v-else>{{text}}</template>
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
                <a>下载</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)" class="red">删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { Table, Divider, Input, message } from 'ant-design-vue';
import Component from 'vue-class-component';
import { ColumnList, AttachmentData } from '@/interface';
import { Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import jsonpatch from 'fast-json-patch';
import { getEmployeeAttachmentDescriptionById, getEmployeeAttachmentById, deleteEmployeeAttachment } from '@/api/staff';
interface TableData {
    name: string;
    key: string;
    description: string;
    editable: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-input': Input,
    },
})
export default class AttachmentTable extends Vue {
    @Prop({default: []}) private dataList!: AttachmentData[];
    @Prop({default: ''}) private employeeId!: string;
    @Prop({default: ''}) private employeePropertyId!: string;
    @Prop({ default: '' }) private pathName!: string;
    @Prop({ default: ''}) private keyName!: string;
    private data: TableData[] = this.dataList;
    private loading: boolean = false;
    private cacheOriginData: any = [];
    private column: ColumnList[] = [{
        title: '文件名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '文件描述',
        dataIndex: 'description',
        align: 'center',
        scopedSlots: { customRender: 'description' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('dataList')
    private dataOnChange(value: AttachmentData[]) {
        this.data = value;
    }
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    private removeRow(key: string) {
        deleteEmployeeAttachment(this.employeeId, this.employeePropertyId, key, this.pathName).then((res: any) => {
            this.loadData();
        }).catch(() => {
            message.error('删除失败');
        });
    }
    private cancel(key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;

    }
    private loadData() {
        this.loading = true;
        getEmployeeAttachmentById(this.employeeId, this.employeePropertyId, this.pathName).then((res: any) => {
            this.data = _.map(res[this.keyName], (item) => {
                return {
                    key: item.id,
                    name: item.attachmentInfo.fileName,
                    description: item.description,
                    editable: false,
                };
            });
            this.loading = false;
        });
    }
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target.description === '') {
            message.error('文件描述不能为空');
            return;
        }
        if (target) {
            const diff = this.compareNewAndOldValue(target, this.cacheOriginData[key]);
            if (diff.length > 0) {
                getEmployeeAttachmentDescriptionById(this.employeeId, this.employeePropertyId, key, this.pathName, diff).then((res) => {
                    this.loadData();
                }).catch(() => {
                    message.error('更新失败');
                });
            }
        }
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            description: newValue.description,
        };
        const oldValues = {
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
}
</script>