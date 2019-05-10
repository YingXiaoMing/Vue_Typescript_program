<template>
    <a-table :pagination="false" :columns="column" size="small"
    bordered :dataSource="data"></a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList } from '@/interface';
import { Table, Divider } from 'ant-design-vue';
import { ScopedSlot } from 'vue/types/vnode';
import Transfer from '../transfer/index.vue';
interface TableData {
    key: string;
    num: string;
    name: string;
    transfer: string;
    type: string;
    position: string;
    newPosition: string;
}
@Component({
    components: {
        'a-table': Table,
    },
    props: {
        tabList: Array,
    },
})
export default class RecordTable extends Vue {
    @Prop() private tabList!: TableData[];
    private data: TableData[] = this.tabList;
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
        title: '调/离职',
        dataIndex: 'transfer',
        align: 'center',
        scopedSlots: { customRender: 'transfer' },
    }, {
        title: '调/离职类型',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '原职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '新职位',
        dataIndex: 'newPosition',
        align: 'center',
        scopedSlots: { customRender: 'newPosition' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
}
</script>

