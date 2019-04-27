<template>
    <a-table :columns="column" bordered size="small" :loading="loading" :dataSource="data">
        <template slot="action" slot-scope="text,record">
            <span >
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a>调职</a>
                <a-divider type="vertical"></a-divider>
                <a class='red'>删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import { Table, Divider } from 'ant-design-vue';
import { ColumnList } from '@/interface';
interface TableData {
    key: string;
    id: string;
    gender: string;
    name: string;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
    },
})
export default class SearchTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    private data: TableData[] = this.tabList;
    private $router: any;
    private $store: any;
    private column: ColumnList[] = [{
        title: '员工ID',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'num' },
    }, {
        title: '员工工号',
        dataIndex: 'id',
        align: 'center',
        scopedSlots: { customRender: 'id' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        scopedSlots: { customRender: 'gender' },
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
    private toggle(key: string) {
        this.$store.dispatch('changeEmployeeStatus', 3);
        this.$store.dispatch('ChangeEmployeeId', key);
        this.$router.push('/staff/add');
    }
}
</script>

