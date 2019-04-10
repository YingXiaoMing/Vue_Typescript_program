<template>
    <a-table :pagination="false" bordered
    size="small" :columns="column" :dataSource="data">
        <template v-for="(item,u) in ['companyName','position','salary','reference',
        'referencePhoneNumber','endedJobReason']" :slot="item" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value, record.key, item)"></a-input>
            <template v-else>{{ text }}</template>
        </template>
        <template v-for="(col,u) in ['startedDate','endDate']" :slot="col" slot-scope="text, record">
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
import { Table, Divider, DatePicker, Input } from 'ant-design-vue';
import { Emit } from 'vue-property-decorator';
import { ColumnList } from '@/interface';
import moment from 'moment';
interface TableData {
    companyName: string;
    position: string;
    startedDate: string;
    endDate: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
    endedJobReason: string;
    key: number;
    editable: boolean;
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
    private cacheOriginData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private data: TableData[] = [{
        companyName: '新感觉有限公司',
        position: '程序员',
        startedDate: '2016-08-02',
        endDate: '2018-07-11',
        salary: '10',
        reference: '吴亦凡',
        referencePhoneNumber: '13128565246',
        endedJobReason: '出去创业',
        key: 1,
        editable: false,
    }];
    private column: ColumnList[] = [{
        title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        scopedSlots: { customRender: 'companyName' },
    }, {
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '入职日期',
        dataIndex: 'startedDate',
        align: 'center',
        scopedSlots: { customRender: 'startedDate' },
    }, {
        title: '离职日期',
        dataIndex: 'endDate',
        align: 'center',
        scopedSlots: { customRender: 'endDate' },
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
    },{
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private cancel(key: number) {
        const newData = [...this.data];
        const target = newData.filter(item => item.key === key)[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
    }
    @Emit()
    private handleChange(value: any, key: number, name: string) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }
    @Emit()
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        target.editable = false;
    }
    @Emit()
    private addWorkExperienceRow(value: TableData) {
        console.log(value);
        const key = this.data.length + 1;
        const newObj = {...value, key, ...{editable: false}};
        this.data.push(newObj);
    }
}
</script>
