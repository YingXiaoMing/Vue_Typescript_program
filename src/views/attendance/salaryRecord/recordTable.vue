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
    position: string;
    typeName: string;
    type: string;
    startDateTime: string;
    endedDateTime: string;
    isWithSalary: string;
    totalHours: string;
    operator: string;
    operateTime: string;
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
        width: 44,
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
        dataIndex: 'employeeDate',
        align: 'center',
        scopedSlots: { customRender: 'employeeDate' },
    }, {
        title: '本年年资可获有薪假h',
        dataIndex: 'typeName',
        align: 'center',
        scopedSlots: { customRender: 'typeName' },
    }, {
        title: '往年年资剩余有薪假h',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '本年已获得有薪假h',
        dataIndex: 'isWithSalary',
        align: 'center',
        scopedSlots: { customRender: 'isWithSalary' },
    }, {
        title: '本年已使用有薪假h',
        dataIndex: 'totalHours',
        align: 'center',
        scopedSlots: { customRender: 'totalHours' },
    }, {
        title: '冻结已获得有薪假h',
        dataIndex: 'startDateTime',
        align: 'center',
        scopedSlots: { customRender: 'startDateTime' },
    }, {
        title: '冻结可预支有薪假h',
        dataIndex: 'endedDateTime',
        align: 'center',
        scopedSlots: { customRender: 'endedDateTime' },
    }, {
        title: '至指定查询日期可预支有薪假',
        dataIndex: 'status',
        align: 'center',
        scopedSlots: { customRender: 'status' },
    }, {
        title: '本年可用有薪假h',
        dataIndex: 'operator',
        align: 'center',
        scopedSlots: { customRender: 'operator' },
    }];
    @Watch('loading')
    private loadingChange(value: boolean) {
        this.tloading = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
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

