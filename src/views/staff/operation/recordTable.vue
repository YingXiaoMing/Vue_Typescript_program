<template>
    <div>
        <a-table bordered size="small" :columns="column"  :dataSource="data" :loading="tloading"
        :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ColumnList, Pagination } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
interface TableData {
    key: string;
    orderNum: string;
    num: string;
    name: string;
    position: string;
    typeName: string;
    type: string;
    effectedDate: string;
    status: string;
    operator: string;
    createDateTime: string;
}
@Component({
    components: {},
})
export default class RecordTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop({ default: [] }) private tabList!: TableData[];
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
        title: '工单号',
        dataIndex: 'orderNum',
        align: 'center',
        scopedSlots: { customRender: 'orderNum' },
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
        title: '调/离职',
        dataIndex: 'typeName',
        align: 'center',
        scopedSlots: { customRender: 'typeName' },
    }, {
        title: '调/离职类型',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '原职位',
        dataIndex: 'orginPosition',
        align: 'center',
        scopedSlots: { customRender: 'orginPosition' },
    }, {
        title: '新职位',
        dataIndex: 'newPosition',
        align: 'center',
        scopedSlots: { customRender: 'newPosition' },
    }, {
        title: '生效日期',
        dataIndex: 'effectedDate',
        align: 'center',
        scopedSlots: { customRender: 'effectedDate' },
    }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        scopedSlots: { customRender: 'status' },
    }, {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',
        scopedSlots: { customRender: 'operator' },
    }, {
        title: '操作时间',
        dataIndex: 'createDateTime',
        align: 'center',
        scopedSlots: { customRender: 'createDateTime' },
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
