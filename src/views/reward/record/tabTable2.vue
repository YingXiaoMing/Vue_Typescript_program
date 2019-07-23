<template>
    <a-table :columns="column" bordered size="small"
    :loading="loading" :dataSource="data" :pagination="pagination">
        <template slot="action" slot-scope="text, record">
            <span>
                <a>编辑</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table } from 'ant-design-vue';
import { ColumnList, Pagination } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
interface TableData {
    key: string;
    num: string;
    name: string;
    position: string;
    isReward: string;
    rewardType: string;
    date: string;
}
@Component({
    components: {
        'a-table': Table,
    },
})
export default class Tab2Table extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private data: TableData[] = this.tabList;
    private pagination: Pagination = this.paginationData;
    private column: ColumnList[] = [{
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
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '奖/惩',
        dataIndex: 'isReward',
        align: 'center',
        scopedSlots: { customRender: 'isReward' },
    }, {
        title: '类型',
        dataIndex: 'rewardType',
        align: 'center',
        scopedSlots: { customRender: 'rewardType' },
    }, {
        title: '生效日期',
        dataIndex: 'date',
        align: 'center',
        scopedSlots: { customRender: 'date' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('paginationData')
    private paginationDataChange(value: any) {
        this.pagination = value;
    }
}
</script>
