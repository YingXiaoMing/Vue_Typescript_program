<template>
    <a-table :pagination="false" bordered :loading="loading"
    size="small" :columns="column" :dataSource="data">
        <template v-for="(item,u) in ['companyName','positionName','salary','reference',
        'referencePhoneNumber','endedJobReason']" :slot="item" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value, record.key, item)"></a-input>
            <template v-else>{{ text }}</template>
        </template>
        <template v-for="(col,u) in ['startedDate','endedDate']" :slot="col" slot-scope="text, record">
            <a-date-picker v-if="record.editable" :defaultValue="text?momentFromDate(text):text" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, col)"></a-date-picker>
            <template v-else>{{ text }}</template>
        </template>
        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type='vertical'></a-divider>
                    <a @click="cancel(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)">删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table, Divider, DatePicker, Input, message } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList } from '@/interface';
import jsonpatch from 'fast-json-patch';
import { putEmployeeWorkExperience, deleteEmployeeWorkExperience } from '@/api/staff';
import _ from 'lodash';
import moment from 'moment';
interface TableData {
    companyName: string;
    positionName: string;
    startedDate: string;
    endDate: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
    endedJobReason: string;
    key: string;
    editable: boolean;
    [key: string]: any;
}
interface RemoteTableData {
    companyName: string;
    positionName: string;
    startedDate: string;
    endedDate: string;
    endedJobReason: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-date-picker': DatePicker,
        'a-input': Input,
    },
})
export default class WorkExperienceTable extends Vue {
    @Prop() private tabList!: TableData[];
    @Prop({ default: false }) private loading!: boolean;
    @Prop({ default: '' }) private employeeId!: string;
    @Prop({default: ''}) private ETag!: string;
    private cacheOriginData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private data: TableData[] = this.tabList;
    private column: ColumnList[] = [{
        title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        scopedSlots: { customRender: 'companyName' },
    }, {
        title: '职位',
        dataIndex: 'positionName',
        align: 'center',
        scopedSlots: { customRender: 'positionName' },
    }, {
        title: '入职日期',
        dataIndex: 'startedDate',
        align: 'center',
        scopedSlots: { customRender: 'startedDate' },
    }, {
        title: '离职日期',
        dataIndex: 'endedDate',
        align: 'center',
        scopedSlots: { customRender: 'endedDate' },
    }, {
        title: '工资',
        dataIndex: 'salary',
        align: 'center',
        scopedSlots: { customRender: 'salary' },
    }, {
        title: '证明人',
        dataIndex: 'reference',
        align: 'center',
        scopedSlots: { customRender: 'reference' },
    }, {
        title: '证明人电话',
        dataIndex: 'referencePhoneNumber',
        align: 'center',
        scopedSlots: { customRender: 'referencePhoneNumber' },
    }, {
        title: '离职原因',
        dataIndex: 'endedJobReason',
        align: 'center',
        scopedSlots: { customRender: 'endedJobReason' },
    }, {
        title: '操作',
        dataIndex: 'action',
        width: 120,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Emit()
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            this.cacheOriginData = _.cloneDeep(this.data);
            target.editable = !target.editable;
        }
    }
    @Emit()
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
    private handleChange(value: any, key: string, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private removeRow(key: string) {
        deleteEmployeeWorkExperience(this.employeeId, key).then((res) => {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
        }).catch((err) => {
            message.error('删除失败');
        });
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            const newData = _.cloneDeep(this.data);
            const newValue = this.transformRemoteData(newData);
            const oldValue = this.transformRemoteData(this.cacheOriginData);
            const params =  this.compareNewAndOldValue(newValue, oldValue);
            putEmployeeWorkExperience(this.employeeId, params, {
                'If-Match': this.ETag,
            }).then((res) => {
                this.$emit('loadData');
            });
        }
    }
    private transformRemoteData(remoteData: TableData[]): RemoteTableData[] {
        const newData: RemoteTableData[] = _.map(remoteData, (item) => {
            return {
                companyName: item.companyName,
                positionName: item.positionName,
                startedDate: item.startedDate,
                endedDate: item.endedDate,
                endedJobReason: item.endedJobReason,
                salary: item.salary,
                reference: item.reference,
                referencePhoneNumber: item.reference,
            };
        });
        return newData;
    }
    private compareNewAndOldValue(newValue: RemoteTableData[], oldValue: RemoteTableData[]) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
}
</script>
