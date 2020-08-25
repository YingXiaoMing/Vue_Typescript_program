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
                    <a @click="makeAttachRowNotEditable(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="makeAttachRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="donwloadFile(record.key)" :class="{'disabled-button': record.disable}">下载</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)" :class="[{'disabled-button': record.disable}, 'red']">删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { message } from 'ant-design-vue';
import { ColumnList, AttachmentData } from '@/interface';
import { Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import { Table, Input, Divider } from 'ant-design-vue';
import jsonpatch from 'fast-json-patch';
import config from '@/utils/config';
import Component from 'vue-class-component';
import { getEmployeeAttachmentDescriptionById, getEmployeeAttachmentById, deleteEmployeeAttachment } from '@/api/staff';
interface TableData {
    name: string;
    key: string;
    description: string;
    editable: boolean;
    disable: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-input': Input,
        'a-divider': Divider,
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
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('dataList')
    private dataOnChange(value: AttachmentData[]) {
        this.data = value;
    }
    private makeAttachRowEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    private donwloadFile(key: string) {
        const url = config.baseUrl + '/employee/' + this.employeeId + '/' + this.pathName + '/' + this.employeePropertyId + '/Attachment/' + key;
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }
    private removeRow(key: string) {
        deleteEmployeeAttachment(this.employeeId, this.employeePropertyId, key, this.pathName).then((res: any) => {
            this.loadData();
        }).catch(() => {
            message.error('删除失败');
        });
    }
    private makeAttachRowNotEditable(key: string) {
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
            const data = res.data;
            this.data = _.map(data[this.keyName], (item) => {
                return {
                    key: item.id,
                    name: item.attachmentInfo.originalName,
                    description: item.description,
                    editable: false,
                    disable: false,
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
