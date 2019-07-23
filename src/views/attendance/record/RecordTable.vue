<template>
    <div>
        <a-table :columns="column" bordered size="small"
        :loading="loading" :dataSource="data" :pagination="pagination">
            <template slot="isWithSalary" slot-scope="text,record">
                <span v-if="text === true">是</span>
                <span v-else>否</span>
            </template>
            <template slot="action" slot-scope="text,record">
                <span>
                    <a @click="toggle(record.key)">编辑</a>
                </span>
            </template>
        </a-table>
        <a-attend-modal :visible="modalVisible" @cancel="cancelHandle"
        :formData="formData" @refreshTableData="refreshTableData" :type="type"></a-attend-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table } from 'ant-design-vue';
import { ColumnList, Pagination } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import AttendModal from '@/components/AttendModal/index.vue';
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
    },
})
export default class RecordTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop() private paginationData!: Pagination;
    private data: TableData[] = this.tabList;
    private type: number = 0;
    private pagination: Pagination = this.paginationData;
    private modalVisible: boolean = false;
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
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (_.isEqual(target.type, '出差')) {
            this.type = 2;
        } else if (_.isEqual(target.type, '请假')) {
            this.type = 1;
        } else if (_.isEqual(target.type, '加班')) {
            this.type = 3;
        }
        this.formData = {
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

