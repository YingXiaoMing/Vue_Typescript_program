<template>
    <div>
        <a-table bordered size='small' :loading="loading"
        :columns="column" :dataSource="data">
            <template v-for="(col,u) in ['name','contractNum', 'note']" :slot="col" slot-scope="text, record">
                <a-input v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"></a-input>
                <template v-else>{{text}}</template>
            </template>
            <template slot="contractType" slot-scope="text,record">
                <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'contractType')">
                    <a-select-option v-for="(item,index) in contractOption" :key="index" :value="item.key">{{ item.label }}</a-select-option>
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
    :attachmentList="fileList" :employeePropertyId="employeePropertyId" :pathName="pathName" keyName="employeeContractAttachments"></a-attachment>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, DatePicker, Input, Select, message } from 'ant-design-vue';
import { SelectValue, ColumnList, RemoteAttachmentData, AttachmentData, RemoteContractTableData } from '@/interface';
import Attach from '@/components/Attach/index.vue';
import jsonpatch from 'fast-json-patch';
import moment from 'moment';
import { putEmployeeContactData, deleteEmployeeContactData, getEmployeeContactData, getEmployeeAttachmentById  } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    key: string;
    contractType: {
        key: string;
        label: string;
    };
    name: string;
    contractNum: string;
    issueDate: string;
    expireDate: string;
    note: string;
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
    @Prop({ default: [] }) private contractOption!: SelectValue[];
    @Prop({ default: false }) private loading!: boolean;
    @Prop({default: ''}) private ETag!: string;
    private pathName = 'EmployeeContract';
    private fileList: AttachmentData[] = [];
    private visible: boolean = false;
    private employeePropertyId = '';
    private dateFormat = 'YYYY-MM-DD';
    private cacheOriginData: any = [];
    private data: TableData[] = [];
    private column: ColumnList[] = [{
        title: '合同类型',
        dataIndex: 'contractType',
        align: 'center',
        scopedSlots: { customRender: 'contractType' },
    }, {
        title: '合同名称',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '合同编号',
        dataIndex: 'contractNum',
        align: 'center',
        scopedSlots: { customRender: 'contractNum' },
    }, {
        title: '生效日期',
        dataIndex: 'issueDate',
        align: 'center',
        scopedSlots: { customRender: 'issueDate' },
    }, {
        title: '合同到期日期',
        dataIndex: 'expireDate',
        align: 'center',
        scopedSlots: { customRender: 'expireDate' },
    }, {
        title: '备注',
        dataIndex: 'note',
        align: 'center',
        scopedSlots: { customRender: 'note' },
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
    private openAttachmentDialog(key: string) {
        getEmployeeAttachmentById(this.employeeId, key, this.pathName).then((res: any) => {
            this.visible = true;
            const data = res.data;
            this.fileList  = _.map(data.employeeContractAttachments, (item) => {
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
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
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
        deleteEmployeeContactData(this.employeeId, key).then((res) => {
            this.$emit('loadData');
        }).catch((err) => {
            message.error('删除失败');
        });
    }
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            const newData = _.cloneDeep(this.data);
            const newValue = this.transformRemoteData(newData);
            const oldValue = this.transformRemoteData(this.cacheOriginData);
            const params =  this.compareNewAndOldValue(newValue, oldValue);
            console.log('qingnibua');
            putEmployeeContactData(this.employeeId, params, {
                'If-Match': this.ETag,
            }).then((res) => {
                this.$emit('loadData');
            }).catch((err) => {
                message.error('更新失败');
            });
        }
    }
    private transformRemoteData(remoteData: TableData[]): RemoteContractTableData[] {
        const newData: RemoteContractTableData[] = _.map(remoteData, (item) => {
            return {
                typeId: item.contractType.key,
                name: item.name,
                issueDate: item.issueDate,
                expireDate: item.expireDate,
                no: item.contractNum,
                note: item.note,
            };
        });
        return newData;
    }
    private compareNewAndOldValue(newValue: RemoteContractTableData[], oldValue: RemoteContractTableData[]) {
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
    private toggle(key: string) {
        const target = this.data.filter((item) => item.key === key)[0];
        if (target) {
            this.cacheOriginData = _.cloneDeep(this.data);
            target.editable = !target.editable;
        }
    }
}
</script>
