<template>
    <div>
        <a-table :columns="column" bordered size="small" :loading="loading"
        :dataSource="data" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
            <template slot="action" slot-scope="text, record">
                <span>
                    <a v-if="!record.isAllowModification"  @click="makeTableRowEditable(record.key, false)">查看</a>
                    <a v-else @click="makeTableRowEditable(record.key, true)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a :class="{'disabled-button': !record.isAllowModification}" @click="revokeClick(record.key)">撤销</a>
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
import moment from 'moment';
import _ from 'lodash';
import { getPrizePenaltyRecordByEmployeeId, DeletePrizePenaltyRecord } from '@/api/operation';
import RewardModal from '@/components/RewardModal/index.vue';
interface TableData {
    key: string;
    orderNum: string;
    status: string;
    operator: string;
    createDateTime: string;
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
    isAllowModification: string;
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
    workOrderNumber: string;
    id: string;
    employeeId: string;
    type: number;
    isEdit: boolean;
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
    private dateFormat = 'YYYY-MM-DD';
    private etag: string = '';
    private $confirm: any;
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
        workOrderNumber: '',
        employeeId: '',
        type: 0,
        isEdit: true,
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
        dataIndex: 'createDateTime',
        align: 'center',
        scopedSlots: { customRender: 'createDateTime' },
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
    private revokeClick(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        const thiz = this;
        this.$confirm({
            title: '撤销工单确认',
            okText: '确认',
            okType: 'danger',
            content: '注意！当你撤职奖惩工单的操作，当工单撤销后，该工单下的奖惩记录将被取消，无法恢复，请谨慎操作。',
            cancelText: '取消',
            onOk() {
                DeletePrizePenaltyRecord(target.employeeId, key).then(() => {
                    thiz.$emit('refreshData');
                });
            },
        });
    }
    private makeTableRowEditable(key: string, isEdit: boolean) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        let type = 0;
        if (_.isEqual(target.isReward, '奖励类')) {
            type = 1;
        }
        getPrizePenaltyRecordByEmployeeId(target.employeeId, target.id).then((res: any) => {
            const data = res.data;
            this.formData = {
                name: data.employeeFullName,
                num: data.employeeStringID,
                effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                situationDescription: data.situationDescription,
                solution: data.solution,
                prizePenaltyTypeId: {
                    key: data.prizePenaltyTypeId,
                    label: data.prizePenaltyTypeName,
                },
                employeeId: data.employeeId,
                id: data.id,
                workOrderNumber: data.workOrderNumber,
                type,
                isEdit,
            };
            this.modalVisible = true;
        });
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

