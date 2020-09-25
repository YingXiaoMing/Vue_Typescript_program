<template>
    <div>
        <a-table :columns="column" bordered size="small" :dataSource="data" 
        :loading="tloading" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList, Pagination } from '@/interface';

interface TableData {
    key: string;
    orderNum: string;
    num: string;
    name: string;
    employmentStartedDate: string;
    yearWillGotWithSalaryHours: string;
    lastYearLeftWithSalaryHours: string;
    yearGotWithSalaryHours: string;
    yearUsedWithSalaryHours: string;
    blockedWithSalaryHours: string;
    toDateWithSalaryHours: string;
    toDayWithSalaryHours: string;
}
@Component({
    components: {},
})
export default class RecordTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private tloading: boolean = this.loading;
    private data: TableData[] = this.tabList;
    private pagination: Pagination = this.paginationData;
    private column: ColumnList[] = [{
        title: '序号',
        width: 48,
        dataIndex: 'Index',
        align: 'center',
        scopedSlots: { customRender: 'Index' },
    }, {
        title: '员工工号',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'num' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '入职日期',
        dataIndex: 'employmentStartedDate',
        align: 'center',
        scopedSlots: { customRender: 'employmentStartedDate' },
    }, {
        title: '本年年资可获有薪假H',
        dataIndex: 'yearWillGotWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'yearWillGotWithSalaryHours' },
    }, {
        title: '上一年剩余有薪假H',
        dataIndex: 'lastYearLeftWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'lastYearLeftWithSalaryHours' },
    }, {
        title: '本年已获得有薪假H',
        dataIndex: 'yearGotWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'yearGotWithSalaryHours' },
    }, {
        title: '本年已使用有薪假H',
        dataIndex: 'yearUsedWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'yearUsedWithSalaryHours' },
    }, {
        title: '待核销有薪假H',
        dataIndex: 'blockedWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'blockedWithSalaryHours' },
    }, {
        title: '至指定查询日期可用有薪假H',
        dataIndex: 'toDateWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'toDateWithSalaryHours' },
    }, {
        title: '当天可用有薪假H',
        dataIndex: 'toDayWithSalaryHours',
        align: 'center',
        scopedSlots: { customRender: 'toDayWithSalaryHours' },
    }];
    @Watch('loading')
    private loadingChange(value: boolean) {
        this.tloading = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        console.log('rest');
        console.log(value);
        this.data = value;
    }
    @Watch('paginationData')
    private paginationDataChange(value: any) {
        this.pagination = value;
    }
    private tableChange(pagination: any, filters: any, sorter: any) {
        const pageSize = pagination.pageSize;
        const pageNum = pagination.current;
        this.$emit('tableChange', pageNum, pageSize);
    }
}
</script>

