<template>
    <div>
        <a-table :columns="column" bordered size="small" :dataSource="data">
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
    operateTime: string;
}
@Component({
    components: {},
})
export default class RecordTable extends Vue {
    private data: TableData[] = [{
        key: '1',
        orderNum: 'JC201911210001',
        num: 'S00124',
        name: '张三',
        position: '新感觉有限公司->乐从分公司->研发部->研发经理',
        typeName: '奖励',
        type: '小功',
        effectedDate: '2019-11-30',
        status: '已取消',
        operator: 'S0254 小丽',
        operateTime: '2019-11-22 17:58:31',
    }, {
        key: '2',
        orderNum: 'JC201911210001',
        num: 'S00124',
        name: '张三',
        position: '新感觉有限公司->乐从分公司->研发部->研发经理',
        typeName: '惩罚',
        type: '小过',
        effectedDate: '2019-11-30',
        status: '已取消',
        operator: 'S0254 小丽',
        operateTime: '2019-11-22 17:58:31',
    }];
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
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '奖/惩',
        dataIndex: 'typeName',
        align: 'center',
        scopedSlots: { customRender: 'typeName' },
    }, {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '执行日期',
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
        dataIndex: 'operateTime',
        align: 'center',
        scopedSlots: { customRender: 'operateTime' },
    }];
}
</script>

