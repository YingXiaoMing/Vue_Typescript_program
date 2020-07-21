<template>
    <div>
        <a-table :columns="column" size="small"
        bordered :dataSource="data" :loading="vloading" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
            <template slot="action" slot-scope="text, record">
                <span>
                    <a v-if="!record.isAllowModification" @click="makeEmployeeDataEditable(record.key, false)">查看</a>
                    <a v-else @click="makeEmployeeDataEditable(record.key, true)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a :class="{'disabled-button': !record.isAllowModification}" @click="revokeClick(record.key)">撤销</a>
                </span>
            </template>
        </a-table>
        <a-modal :visible="dialog.visible" :title="dialog.title"
         @cancel="cancelHandle" :width="928" @ok="okHandle" class='recordModal'>
            <component :is="dialog.name" ref="dialog" :data="dialog.data"></component>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList, Pagination } from '@/interface';
import { Table, Divider, message } from 'ant-design-vue';
import { ScopedSlot } from 'vue/types/vnode';
import TransferModal from '@/components/PositionModal/transfer.vue';
import DismissModal from '@/components/PositionModal/dismiss.vue';
import moment from 'moment';
import RehabModal from '@/components/PositionModal/rehab.vue';
import DepartureModal from '@/components/PositionModal/departure.vue';
import ServeModal from '@/components/PositionModal/serve.vue';
import './recordTable.less';
import { getEmployeeModificationByRecordId, DeletePositionRecord } from '@/api/operation';
import _ from 'lodash';

interface TableData {
    key: string;
    num: string;
    name: string;
    transfer: string;
    type: string;
    position: string;
    newPosition: string;
    lastOperatorDateTime: string;
    reason: string;
    employeeId: string;
    employeePositionChangeTypeId: string;
    effectiveDate: string;
    createDateTime: string;
    isAllowModification: boolean;
}
interface FormData {
    name: string;
    num: string;
    id: string;
    effectiveDate: string;
    reason?: string;
    employeeId: string;
}
@Component({
    components: {
        'a-table': Table,
        's-transfer': TransferModal,
        's-dismiss': DismissModal,
        's-rehab': RehabModal,
        's-departure': DepartureModal,
        's-serve': ServeModal,
    },
    props: {
        tabList: Array,
    },
})
export default class RecordTable extends Vue {
    public $refs!: {
        dialog: HTMLFormElement,
    };
    @Prop() private vloading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private pagination: Pagination = this.paginationData;
    private dateFormat = 'YYYY-MM-DD';
    private dialog = {
        visible: false,
        name: '',
        title: '',
        data: {},
    };
    private data: TableData[] = this.tabList;
    private formData: FormData = {
        name: '',
        num: '',
        id: '',
        effectiveDate: '',
        reason: '',
        employeeId: '',
    };
    private column: ColumnList[] = [{
        title: '序号',
        width: 48,
        dataIndex: 'Index',
        align: 'center',
        scopedSlots: { customRender: 'Index' },
    }, {
        title: '工单号',
        dataIndex: 'workOrderNumber',
        align: 'center',
        scopedSlots: { customRender: 'num' },
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
        title: '生效时间',
        dataIndex: 'lastOperatorDateTime',
        align: 'center',
        scopedSlots: { customRender: 'lastOperatorDateTime' },
    }, {
        title: '状态',
        dataIndex: 'recordStateName',
        width: 88,
        align: 'center',
        scopedSlots: { customRender: 'recordStateName' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 98,
        scopedSlots: { customRender: 'action' },
    }, {
        title: '操作时间',
        dataIndex: 'createDateTime',
        align: 'center',
        scopedSlots: { customRender: 'createDateTime' },
    }];
    @Watch('tabList')
    private tabListChange(value: any) {
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
    private okHandle() {
        this.$refs.dialog.sumbitData((run: boolean) => {
            if (run) {
                this.cancelHandle();
                this.$emit('loadData');
                return;
            }
        });
    }
    private revokeClick(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        const thiz = this;
        this.$confirm({
            title: '撤销工单确认',
            okText: '确认',
            okType: 'danger',
            content: '注意！当你撤销职位变更工单的操作，当工单撤销后，该工单下的职位变动记录将被取消，无法恢复，请谨慎操作。',
            cancelText: '取消',
            onOk() {
                DeletePositionRecord(key).then(() => {
                    thiz.$emit('loadData');
                });
            },
        });
    }
    private makeEmployeeDataEditable(key: string, isEdit: boolean) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        const typeName = target.transfer;
        getEmployeeModificationByRecordId(key).then((res) => {
            const data = res.data;
            switch (typeName) {
                case '调职':
                    this.dialog = {
                        name: 's-transfer',
                        title: '调职操作',
                        visible: true,
                        data: {
                            id: data.id,
                            employeeId: data.employeeId,
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            orderNum: data.workOrderNumber,
                            reason: data.reason,
                            employeePositionChangeTypeId: data.employeePositionModificationTypeId,
                            employeePositionChangeTypeName: data.employeePositionModificationTypeName,
                            effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                            newPositionName: data.newPositionFullPath,
                            orginPositionName: data.originalPositionFullPath,
                            position: data.originalPositionId,
                            newPosition: data.newPositionFullIds,
                            newPositionId: data.newPositionId,
                            isEdit,
                        },
                    };
                    break;
                case '离职':
                    this.dialog = {
                        name: 's-departure',
                        title: '离职操作',
                        visible: true,
                        data: {
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            id: data.id,
                            employeeId: data.employeeId,
                            effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                            reason: data.reason,
                            orderNum: data.workOrderNumber,
                            employeePositionChangeTypeId: data.employeePositionModificationTypeId,
                            employeePositionChangeTypeName: data.employeePositionModificationTypeName,
                            isEdit,
                        },
                    };
                    break;
                case '复职':
                    this.dialog = {
                        name: 's-rehab',
                        title: '复职操作',
                        visible: true,
                        data: {
                            isEdit,
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            orderNum: data.workOrderNumber,
                            id: data.id,
                            employeeId: data.employeeId,
                            effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                            reason: data.reason,
                            employeePositionChangeTypeName: data.employeePositionModificationTypeName,
                            positionName: data.newPositionFullPath,
                            positionId: data.newPositionId,
                        },
                    };
                    break;
                case '撤职':
                    this.dialog = {
                        name: 's-dismiss',
                        title: '撤职操作',
                        visible: true,
                        data: {
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            id: data.id,
                            employeeId: data.employeeId,
                            effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                            reason: data.reason,
                            orderNum: data.workOrderNumber,
                            dismissTypeId: data.originalPositionId,
                            isEdit,
                            positionId: data.originalPositionFullPath,
                            employeePositionChangeTypeName: data.employeePositionModificationTypeName,
                        },
                    };
                    break;
                case '任职':
                    this.dialog = {
                        name: 's-serve',
                        title: '任职操作',
                        visible: true,
                        data: {
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            id: data.id,
                            employeeId: data.employeeId,
                            typeId: data.employeePositionModificationTypeName,
                            effectiveDate: moment(data.effectiveDate).format(this.dateFormat),
                            reason: data.reason,
                            position: data.newPositionFullIds,
                            orderNum: data.workOrderNumber,
                            positionName: data.newPositionFullPath,
                            isEdit,
                            newPositionId: data.newPositionId,
                        },
                    };
                    break;
                default:
                    message.warning('请查看其他职位操作记录工单');
                    break;
            }
        });
    }
    private cancelHandle() {
        this.dialog = {
            visible: false,
            name: '',
            title: '',
            data: {},
        };
    };
    private loadTableData() {
        this.$emit('loadData');
    }
}
</script>

