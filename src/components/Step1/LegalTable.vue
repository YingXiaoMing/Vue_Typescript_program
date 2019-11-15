<template>
    <a-table :pagination="false" bordered :columns="column" :dataSource="data"
     size="small" :loading="loading">
        <template slot="legalNum" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, 'legalNum')"></a-input>
            <template v-else>{{text}}</template>
        </template>
        <template v-for="(col,u) in ['issueDate','expireDate']" :slot="col" slot-scope="text, record">
            <a-date-picker v-if="record.editable" :value="momentFromDate(text)" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, col)"></a-date-picker>
            <template v-else>{{ text }}</template>
        </template>
        <template slot="legalType" slot-scope="text, record">
            <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'legalType')">
                <a-select-option v-for="(item,index) in LegalTypeOption" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>
        <template slot="action" slot-scope="text, record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="makeLegalDocumentRowNotEditable(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="makeLegalDocumentRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)" :class="{'disabled-button': record.disable}">删除</a>
            </span>
        </template>
     </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import { Table, Divider, Input, DatePicker, Select, message } from 'ant-design-vue';
import Component from 'vue-class-component';
import { ColumnList, RemoteLegalTableData } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
import { getLegalIdentiticationTypeOption } from '@/api/basic';
import { getEmployeeLegalData, patchEmployeeLegalData, newEmployeeLegalData, deleteEmployeeLegalData } from '@/api/staff';
import { BasicData, SelectValue } from '@/interface';
import _ from 'lodash';
import jsonpatch from 'fast-json-patch';
interface TableData  {
    legalType: {
        key: string,
        label: string,
    };
    legalNum: string;
    issueDate: string;
    expireDate: string;
    editable: boolean;
    disable: boolean;
    isNew: boolean;
    key: string;
    [key: string]: any;
}
interface RemoteTableData {
    typeId: string;
    idNumber: string;
    issueDate: string | null;
    expireDate: string | null;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class LegalTable extends Vue {
    @Prop() private options!: SelectValue[];
    @Prop() private tabList!: TableData[];
    @Prop({default : true}) private isNew!: boolean;
    @Prop({default : false}) private tloading!: boolean;
    @Prop({default: ''}) private employeeId!: string;
    @Prop({default: ''}) private ETag!: string;
    private LegalTypeOption: SelectValue[] = this.options;
    private $store: any;
    private cacheOriginData: any = [];
    private etag: string = this.ETag;
    private loading: boolean = this.tloading;
    private column: ColumnList[] = [{
        title: '证件类型',
        dataIndex: 'legalType',
        align: 'center',
        scopedSlots: { customRender: 'legalType' },
    }, {
        title: '证件号码',
        dataIndex: 'legalNum',
        align: 'center',
        scopedSlots: { customRender: 'legalNum' },
    }, {
        title: '开始日期',
        dataIndex: 'issueDate',
        align: 'center',
        scopedSlots: { customRender: 'issueDate' },
    }, {
        title: '到期日期',
        dataIndex: 'expireDate',
        align: 'center',
        scopedSlots: { customRender: 'expireDate' },
    }, {
        title: '操作',
        width: 130,
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private dateFormat = 'YYYY-MM-DD';
    private data: TableData[] = this.tabList;
    private isNullLegal(target: TableData): boolean {
        if (_.isEmpty(target.legalNum) || _.isEmpty(target.expireDate) || _.isEmpty(target.issueDate)) {
            message.error('身份证件信息不完整');
            return false;
        }
        return true;
    }
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    @Watch('options')
    private optionChange(value: any) {
        this.LegalTypeOption = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('tloading')
    private loadingChange(value: any) {
        this.loading = value;
    }
    @Watch('ETag')
    private ETagChange(value: string) {
        this.etag = value;
    }
    private makeLegalDocumentRowEditable(key: string) {
        this.cacheOriginData = this.deleteLast(_.cloneDeep(this.data));
        const targetRow = this.getEditableRow(this.data, key);
        if (targetRow) {
            targetRow.editable = !targetRow.editable;
            this.setOtherRowsDisabled(key, this.data, true);
        }
    }
    private setOtherRowsDisabled(key: string, arr: TableData[], disabled: boolean) {
        arr.filter((item) => {
            if (!_.isEqual(item.key, key)) {
                item.disable = disabled;
            }
        });
    }
    private getEditableRow(data: TableData[], key: string) {
        return data.filter((item) => _.isEqual(item.key, key))[0];
    }

    private makeLegalDocumentRowNotEditable(key: string) {
        const target = _.find(this.cacheOriginData, ['key', key]);
        const targetIndex = _.findIndex(this.data, ['key', key]);
        this.data.splice(targetIndex, 1, target);
        this.setOtherRowsDisabled(key, this.data, false);
    }
    private handleChange(value: any, key: string, name: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target[name] = value;
        }
    }
    private saveRow(key: string) {
        const target = this.getEditableRow(this.data, key);
        if (target && this.isNullLegal(target) && this.compareStartedDateAndEndDate(target.issueDate, target.expireDate)) {
            if (this.isNew) {
                this.saveNewData(target, key);
            } else {
                const newData = this.deleteLast(_.cloneDeep(this.data));
                const newDto = this.mapModelDataToDto(newData);
                const oldDto = this.mapModelDataToDto(this.cacheOriginData);
                const diff = this.compareNewAndOldValue(newDto, oldDto);
                this.remoteUpdateEmployeeLegalData(key, diff, target);
            }
        }
    }
    private compareStartedDateAndEndDate(startedDate: string, endDate: string) {
        if (moment(startedDate).isAfter(moment().format(this.dateFormat))) {
            message.error('开始日期不能迟于当前日期');
            return false;
        }
        if (moment(startedDate).isAfter(endDate)) {
            message.error('开始日期不能迟于到期日期');
            return false;
        }
        return true;
    }
    private deleteLast(arr: any) {
        return arr.slice(0, arr.length - 1);
    }
    private mapModelDataToDto(remoteData: TableData[]): RemoteTableData[] {
        const newData: RemoteTableData[] = _.map(remoteData, (item) => {
            return {
                typeId: item.legalType.key,
                idNumber: item.legalNum,
                issueDate: item.issueDate,
                expireDate: item.expireDate,
            };
        });
        return newData;
    }
    private remoteUpdateEmployeeLegalData(key: string, diff: any, target: any) {
        if (diff.length > 0) {
            patchEmployeeLegalData(this.employeeId, diff, {
                'If-Match': this.etag,
            }).then((res) => {
                this.$emit('loadData');
            }).catch((err) => {
                message.error('更新失败');
            });
        } else {
            target.editable = false;
        }
    }
    private compareNewAndOldValue(newValue: RemoteTableData[], oldValue: RemoteTableData[]) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
    private saveNewData(target: any, key: string) {
        const newData = [...this.data];
        newData.pop();
        this.$store.dispatch('ReplaceLegalList', newData);
        target.editable = false;
        this.setOtherRowsDisabled(key, this.data, false);
    }
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullLegal(target) && this.compareStartedDateAndEndDate(target.issueDate, target.expireDate)) {
            if (this.isNew) {
                this.firstAddRow(target, key);
            } else {
                newEmployeeLegalData(this.employeeId, {
                    typeId: target.legalType.key,
                    idNumber: target.legalNum,
                    issueDate: target.issueDate,
                    expireDate: target.expireDate,
                }).then((res) => {
                    this.$emit('loadData');
                }).catch((err) => {
                    message.error('新增失败');
                });
            }
        }
    }
    private firstAddRow(target: any, key: string) {
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        this.$store.dispatch('ReplaceLegalList', newData);
        this.data.push({
            legalType: this.LegalTypeOption[0],
            disable: false,
            legalNum: '',
            issueDate: '',
            expireDate: '',
            editable: true,
            isNew: true,
            key: index,
        });
    }
    private removeRow(key: string) {
        if (this.data.length === 2) {
            message.error('请至少保留一条身份证信息');
            return;
        }
        if (this.isNew) {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
            this.$store.dispatch('RemoveLegalList', key);
        } else {
            deleteEmployeeLegalData(this.employeeId, key).then((res) => {
                this.$emit('loadData');
            }).catch((err) => {
                message.error('删除失败');
            });
        }
    }

}
</script>
