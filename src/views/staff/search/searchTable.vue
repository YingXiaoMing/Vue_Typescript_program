<template>
    <a-table :columns="column" :bordered="true" size="small" :loading="loading" :dataSource="data" :pagination="pagination"
    @change="tableChange">
        <template slot="Index" slot-scope="text,record, index">
            <span>{{ index + 1 }}</span>
        </template>
        <template slot="action" slot-scope="text,record">
            <span>
                <a @click="makeEmployeeDataEditable(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="transfer(record.key)">调职</a>
            </span>
        </template>
        <template slot="position" slot-scope="position">
            <span class='position-Tag' v-for="t in position"><a-tag :color="t.isDefault? '#108ee9': '#2db7f5'">{{t.positionFullPath}}</a-tag></span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch, Provide } from 'vue-property-decorator';
import { setEmployeeID } from '@/utils/cookie';
import _ from 'lodash';
import { Table, Divider, Tag } from 'ant-design-vue';
import { ColumnList, Pagination } from '@/interface';
import './searchTable.less';
interface PositionTable {
    positionFullPath: string;
}
interface TableData {
    key: string;
    id: string;
    gender: string;
    name: string;
    num: string;
    tel: string;
    employeeDate: string;
    highEducation: string;
    employeeStatus: string;
    workplace: string;
    position: PositionTable[];
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-tag': Tag,
    },
})
export default class SearchTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private data: TableData[] = this.tabList;
    private pagination: Pagination = this.paginationData;
    private $router: any;
    private $store: any;
    private column: ColumnList[] = [{
        title: '序号',
        dataIndex: 'Index',
        width: 44,
        align: 'center',
        scopedSlots: { customRender: 'Index' },
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
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '联系电话',
        dataIndex: 'tel',
        align: 'center',
        scopedSlots: { customRender: 'tel' },
    }, {
        title: '入职日期',
        dataIndex: 'employeeDate',
        align: 'center',
        scopedSlots: { customRender: 'employeeDate' },
    }, {
        title: '最高学历',
        dataIndex: 'highEducation',
        align: 'center',
        scopedSlots: { customRender: 'highEducation' },
    }, {
        title: '在职状态',
        dataIndex: 'employeeStatus',
        align: 'center',
        scopedSlots: { customRender: 'employeeStatus' },
    }, {
        title: '工作地点',
        dataIndex: 'workplace',
        align: 'center',
        scopedSlots: { customRender: 'workplace' },
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
    private tableChange(pagination: any, filters: any, sorter: any) {
        const pageSize = pagination.pageSize;
        const pageNum = pagination.current;
        this.$emit('tableChange', pageNum, pageSize);
    }
    private makeEmployeeDataEditable(key: string) {
        this.$store.dispatch('changeEmployeeStatus', 3);
        this.$store.dispatch('ChangeEditEmployeeId', key);
        setEmployeeID(key);
        this.$router.replace({
            path: '/staff/edit',
        });
        // this.$router.push('/staff/edit');
    }
    private transfer(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        const newData = {...{employeeId: target.num, employeeName: target.name, employeeNum: target.id}};
        this.$router.push({
            name: 'staff-transfer',
            params: {
                form: newData,
            },
        });
    }
}
</script>

