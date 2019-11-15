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
                    <a @click="makeTableRowEditable(record.key)">编辑</a>
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
import Overtime from '@/components/AttendModal/overtime.vue';
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
    private data: TableData[] = this.tabList;
    private type: number = 0;
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
    private makeTableRowEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (_.isEqual(target.type, '出差')) {
            this.dialog = {
                name: 'a-business',
                title: '出差记录',
                visible: true,
                data: {
                    startDateTime: target.startTime,
                    endedDateTime: target.endTime,
                    isWithSalary: target.isWithSalary,
                    totalHours: target.totalHours,
                    id: target.key,
                    businesstripLocaltion: target.businesstripLocaltion,
                    employeeId: target.employeeId,
                    reason: target.reason,
                    note: target.note,
                    timeoffOvertimeBusinesstripTypeId: target.timeoffOvertimeBusinesstripTypeId,
                    name: target.name,
                    num: target.num,
                },
            };
        } else if (_.isEqual(target.type, '请假')) {
            this.dialog = {
                name: 'a-vacate',
                title: '请假记录',
                visible: true,
                data: {
                    startDateTime: target.startTime,
                    endedDateTime: target.endTime,
                    isWithSalary: target.isWithSalary,
                    totalHours: target.totalHours,
                    id: target.key,
                    businesstripLocaltion: target.businesstripLocaltion,
                    employeeId: target.employeeId,
                    reason: target.reason,
                    note: target.note,
                    timeoffOvertimeBusinesstripTypeId: target.timeoffOvertimeBusinesstripTypeId,
                    name: target.name,
                    num: target.num,
                },
            };
        } else if (_.isEqual(target.type, '加班')) {
            this.dialog = {
                name: 'a-overtime',
                title: '加班记录',
                visible: true,
                data: {
                    startDateTime: target.startTime,
                    endedDateTime: target.endTime,
                    isWithSalary: target.isWithSalary,
                    totalHours: target.totalHours,
                    id: target.key,
                    businesstripLocaltion: target.businesstripLocaltion,
                    employeeId: target.employeeId,
                    reason: target.reason,
                    note: target.note,
                    timeoffOvertimeBusinesstripTypeId: target.timeoffOvertimeBusinesstripTypeId,
                    name: target.name,
                    num: target.num,
                },
            };
        }
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

