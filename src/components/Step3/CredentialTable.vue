<template>
<div>
    <a-table bordered size="small" :loading="loading"
    :columns="column" :dataSource="data"
    >
        <template slot="name" slot-scope="text,record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value, record.key, 'name')"></a-input>
            <template v-else>{{ text }}</template>
        </template>
        <template slot="credentialType" slot-scope="text,record">
            <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'credentialType')">
                <a-select-option v-for="(item,index) in credentialOption" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{ text.label }}</template>
        </template>
        <template slot="issueDate" slot-scope="text,record">
            <a-date-picker v-if="record.editable" :defaultValue="text?momentFromDate(text):text" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, 'issueDate')"></a-date-picker>
            <template v-else>{{ text }}</template>
        </template>
        <template slot="expireDate" slot-scope="text,record">
            <a-date-picker v-if="record.editable" :defaultValue="text?momentFromDate(text):text" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, 'expireDate')"></a-date-picker>
            <template v-else>{{ text === `9999-12-31`?`永久` : text }} </template>
        </template>
        <template slot="attachment" slot-scope="text,record">
            <a @click="openAttachmentDialog(record.key, record.employeeCredentialAttachments)">查看</a>
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
    :attachmentList="fileList" :employeePropertyId="employeePropertyId" :pathName="pathName" keyName="employeeCredentialAttachments"></a-attachment>
    </div>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, DatePicker, Input, Select, message, Modal } from 'ant-design-vue';
import { ColumnList, SelectValue, RemoteAttachmentData, AttachmentData } from '@/interface';
import moment from 'moment';
import jsonpatch from 'fast-json-patch';
import Attach from '@/components/Attach/index.vue';
import { putEmployeeCredentialData, deleteEmployeeCredentialData, getEmployeeAttachmentById } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    key: string;
    name: string;
    credentialType: {
        key: string;
        label: string;
    };
    issueDate: string;
    editable: boolean;
    expireDate: string;
    employeeCredentialAttachments: RemoteAttachmentData[];
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
        'a-modal': Modal,
        'a-attachment': Attach,
    },
})
export default class CredentialTable extends Vue {
    @Prop({ default: [] }) private credentialOption!: SelectValue[];
    @Prop() private tabList!: TableData[];
    @Prop({ default: '' }) private employeeId!: string;
    @Prop({ default: false }) private loading!: boolean;
    private pathName: string = 'employeecredential';
    private employeePropertyId = '';
    private fileList: AttachmentData[] = [];
    private visible: boolean = false;
    private cacheOriginData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private data: TableData[] = [];
    private column: ColumnList[] = [{
        title: '证件/证书类型',
        dataIndex: 'credentialType',
        align: 'center',
        scopedSlots: { customRender: 'credentialType' },
    }, {
        title: '证书名称',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '颁发日期',
        dataIndex: 'issueDate',
        align: 'center',
        scopedSlots: { customRender: 'issueDate' },
    }, {
        title: '证书到期日期',
        dataIndex: 'expireDate',
        align: 'center',
        scopedSlots: { customRender: 'expireDate' },
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
    private openAttachmentDialog(key: string, data: RemoteAttachmentData[]) {
        getEmployeeAttachmentById(this.employeeId, key, 'employeecredential').then((res: any) => {
            this.visible = true;
            this.fileList  = _.map(res.employeeCredentialAttachments, (item) => {
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
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    private handleChange(value: any, key: string, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
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
    private removeRow(key: string) {
        deleteEmployeeCredentialData(this.employeeId, key).then((res) => {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
        }).catch((err) => {
            message.error('删除失败');
        });
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
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        const params =  this.compareNewAndOldValue(target, this.cacheOriginData[key]);
        putEmployeeCredentialData(this.employeeId, target.key, params).then((res) => {
            target.editable = false;
        }).catch((err) => {
            message.error('更新失败');
        });
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            typeId: newValue.credentialType.key,
            name: newValue.name,
            issueDate: newValue.issueDate,
            expireDate: newValue.expireDate,
        };
        const oldValues = {
            typeId: oldValue.credentialType.key,
            name: oldValue.name,
            issueDate: oldValue.issueDate,
            expireDate: oldValue.expireDate,
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
}
</script>
