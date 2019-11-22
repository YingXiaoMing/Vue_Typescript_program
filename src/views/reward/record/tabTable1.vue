<template>
    <div>
        <a-table :columns="column" bordered size="small" :loading="loading"
        :dataSource="data" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
            <template slot="action" slot-scope="text, record">
                <span>
                    <a class="disabled-button">撤销</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="makeTableRowEditable(record.key)">编辑</a>
                </span>
            </template>
        </a-table>
        <a-reward-modal :visible="modalVisible" @cancel="cancelHandle" :formData="formData"
        @refreshTableData="refreshTableData" :ETag="etag"></a-reward-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table } from 'ant-design-vue';
import { ColumnList, Pagination } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import RewardModal from '@/components/RewardModal/index.vue';
interface TableData {
    key: string;
    orderNum: string;
    status: string;
    operator: string;
    operateTime: string;
    name: string;
    num: string;
    position: string;
    isReward: string;
    rewardType: string;
    date: string;
    solution: string;
    situationDescription: string;
    typeId: string;
    id: string;
    employeeId: string;
}
interface FormData {
    situationDescription: string;
    solution: string;
    effectiveDate: string;
    name: string;
    num: string;
    prizePenaltyTypeId: {
        key: string;
        label: string;
    };
    id: string;
    employeeId: string;
    type: number;
}
@Component({
    components: {
        'a-table': Table,
        'a-reward-modal': RewardModal,
    },
})
export default class Tab1Table extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private modalVisible: boolean = false;
    private etag: string = '';
    private formData: FormData = {
        solution: '',
        situationDescription: '',
        effectiveDate: '',
        name: '',
        num: '',
        prizePenaltyTypeId: {
            key: '',
            label: '',
        },
        id: '',
        employeeId: '',
        type: 0,
    };
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
        title: '执行日期',
        dataIndex: 'date',
        align: 'center',
        scopedSlots: { customRender: 'date' },
    }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        scopedSlots: { customRender: 'date' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }, {
        title: '最后操作人',
        dataIndex: 'operator',
        align: 'center',
        scopedSlots: { customRender: 'operator' },
    }, {
        title: '最后操作时间',
        dataIndex: 'operateTime',
        align: 'center',
        scopedSlots: { customRender: 'operateTime' },
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
    private makeTableRowEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        let type = 0;
        if (_.isEqual(target.isReward, '奖励类')) {
            type = 1;
        }
        this.formData = {
            name: target.name,
            num: target.num,
            effectiveDate: target.date,
            situationDescription: target.situationDescription,
            solution: target.solution,
            prizePenaltyTypeId: {
                key: target.typeId,
                label: target.rewardType,
            },
            employeeId: target.employeeId,
            id: target.id,
            type,
        };
        this.modalVisible = true;
    }
    private cancelHandle() {
        this.modalVisible = false;
    }
    private refreshTableData() {
        this.$emit('refreshData');
        this.modalVisible = false;
    }
}
</script>

