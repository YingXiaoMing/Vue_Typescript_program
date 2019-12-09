<template>
    <div>
        <a-table :columns="column" bordered size="small"
        :loading="loading" :dataSource="data" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
            <template slot="isWithSalary" slot-scope="text,record">
                <span v-if="text === true">是</span>
                <span v-else>否</span>
            </template>
            <template slot="action" slot-scope="text,record">
                <span>
                    <a v-if="!record.isAllowModification" @click="makeTableRowEditable(record.key, false)">查看</a>
                    <a v-else @click="makeTableRowEditable(record.key, true)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a :class="{'disabled-button': !record.isAllowModification}" @click="revokeClick(record.key)">撤销</a>
                </span>
            </template>
        </a-table>
        <a-modal :visible="dialog.visible" :title="dialog.title"
        @cancel="cancelHandle" :width="928" @ok="okHandle" class="attendModal">
            <component :is="dialog.name" ref="dialog" :data="dialog.data"></component>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table } from 'ant-design-vue';
import { ColumnList, Pagination } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import AttendModal from '@/components/AttendModal/index.vue';
import Vacate from '@/components/AttendModal/vacate.vue';
import Business from '@/components/AttendModal/business.vue';
import { getAskforLeaveOvertimeBusinesstripRecordByEmployeeId, DeleteAttendRecord } from '@/api/operation';
import Overtime from '@/components/AttendModal/overtime.vue';
import moment from 'moment';
import _ from 'lodash';
interface TableData {
    key: string;
    num: string;
    name: string;
    position: string;
    type: string;
    typeName: string;
    totalHours: string;
    startTime: string;
    endTime: string;
    isWithSalary: boolean;
    employeeId: string;
    reason: string;
    note: string;
    timeoffOvertimeBusinesstripTypeId: string;
    businesstripLocaltion: string;
    operateTime: string;
    status: string;
}
interface FormData {
    timeoffOvertimeBusinesstripTypeId: string;
    startDateTime: string;
    endedDateTime: string;
    isWithSalary: boolean;
    totalHours: string;
    businesstripLocaltion?: string;
    id: string;
    employeeId: string;
    reason?: string;
    note: string;
    name: string;
    num: string;
}
@Component({
    components: {
        'a-table': Table,
        'a-attend-modal': AttendModal,
        'a-vacate': Vacate,
        'a-business': Business,
        'a-overtime': Overtime,
    },
})
export default class RecordTable extends Vue {
    public $refs!: {
        dialog: HTMLFormElement,
    };
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private dateFormat = 'YYYY-MM-DD hh:mm';
    private data: TableData[] = this.tabList;
    private type: number = 0;
    private $confirm: any;
    private pagination: Pagination = this.paginationData;
    private modalVisible: boolean = false;
    private dialog = {
        visible: false,
        name: '',
        title: '',
        data: {},
    };
    private formData: FormData = {
        timeoffOvertimeBusinesstripTypeId: '',
        startDateTime: '',
        endedDateTime: '',
        isWithSalary: false,
        totalHours: '',
        businesstripLocaltion: '',
        id: '',
        employeeId: '',
        reason: '',
        note: '',
        name: '',
        num: '',
    }
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
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '类别',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '类型',
        dataIndex: 'typeName',
        align: 'center',
        scopedSlots: { customRender: 'typeName' },
    }, {
        title: '是否有薪',
        dataIndex: 'isWithSalary',
        align: 'center',
        scopedSlots: { customRender: 'isWithSalary' },
    }, {
        title: '时长',
        dataIndex: 'totalHours',
        align: 'center',
        scopedSlots: { customRender: 'totalHours' },
    }, {
        title: '开始时间',
        dataIndex: 'startTime',
        align: 'center',
        scopedSlots: { customRender: 'startTime' },
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        align: 'center',
        scopedSlots: { customRender: 'endTime' },
    }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        scopedSlots: { customRender: 'status' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
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
            content: '注意！当你撤职考勤工单的操作，当工单撤销后，该工单下的考勤记录将被取消，无法恢复，请谨慎操作。',
            cancelText: '取消',
            onOk() {
                DeleteAttendRecord(target.employeeId, key).then(() => {
                    thiz.$emit('refreshData');
                });
            },
        });
    }
    private makeTableRowEditable(key: string, isEdit: boolean) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        getAskforLeaveOvertimeBusinesstripRecordByEmployeeId(target.employeeId, target.key).then((res: any) => {
            const data = res.data;
            switch (target.type) {
                case '出差':
                    this.dialog = {
                        name: 'a-business',
                        title: '出差记录',
                        visible: true,
                        data: {
                            startDateTime: moment(data.startDateTime).format(this.dateFormat),
                            endedDateTime: moment(data.endedDateTime).format(this.dateFormat),
                            isWithSalary: data.isWithSalary,
                            totalHours: data.totalHours,
                            id: data.id,
                            businesstripLocaltion: data.businesstripLocaltion,
                            employeeId: data.employeeId,
                            reason: data.reason,
                            note: data.note,
                            timeoffOvertimeBusinesstripTypeId: data.askforLeaveOvertimeBusinesstripTypeId,
                            timeoffOvertimeBusinesstripTypeName: data.askforLeaveOvertimeBusinesstripTypeName,
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            orderNum: data.workOrderNumber,
                            isEdit,
                        },
                    };
                    break;
                case '请假':
                    this.dialog = {
                        name: 'a-vacate',
                        title: '请假记录',
                        visible: true,
                        data: {
                            startDateTime: moment(data.startDateTime).format(this.dateFormat),
                            endedDateTime: moment(data.endedDateTime).format(this.dateFormat),
                            isWithSalary: data.isWithSalary,
                            totalHours: data.totalHours,
                            id: data.id,
                            businesstripLocaltion: data.businesstripLocaltion,
                            employeeId: data.employeeId,
                            reason: data.reason,
                            note: data.note,
                            timeoffOvertimeBusinesstripTypeId: data.askforLeaveOvertimeBusinesstripTypeId,
                            timeoffOvertimeBusinesstripTypeName: data.askforLeaveOvertimeBusinesstripTypeName,
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            orderNum: data.workOrderNumber,
                            isEdit,
                        },
                    };
                    break;
                case '加班':
                    this.dialog = {
                        name: 'a-overtime',
                        title: '加班记录',
                        visible: true,
                        data: {
                            startDateTime: moment(data.startDateTime).format(this.dateFormat),
                            endedDateTime: moment(data.endedDateTime).format(this.dateFormat),
                            isWithSalary: data.isWithSalary,
                            totalHours: data.totalHours,
                            id: data.id,
                            businesstripLocaltion: data.businesstripLocaltion,
                            employeeId: data.employeeId,
                            reason: data.reason,
                            note: data.note,
                            timeoffOvertimeBusinesstripTypeId: data.askforLeaveOvertimeBusinesstripTypeId,
                            timeoffOvertimeBusinesstripTypeName: data.askforLeaveOvertimeBusinesstripTypeName,
                            name: data.employeeFullName,
                            num: data.employeeStringID,
                            orderNum: data.workOrderNumber,
                            isEdit,
                        },
                    };
                    break;
                default:
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
    }
    private okHandle() {
        this.$refs.dialog.sumbitData((run: boolean) => {
            if (run) {
                this.cancelHandle();
                this.$emit('refreshData');
                return;
            }
        });
    }
}
</script>

