<template>
    <div>
        <a-table :pagination="false" :columns="column" size="small"
        bordered :dataSource="data" :loading="vloading">
            <template slot="Index" slot-scope="text,record, index">
                <span>{{ index + 1 }}</span>
            </template>
            <template slot="action" slot-scope="text, record">
                <span>
                    <a @click="makeEmployeeDataEditable(record.key)" v-if="record.isAllowModification">编辑</a>
                </span>
            </template>
        </a-table>
        <a-modal :visible="dialog.visible" :title="dialog.title"
         @cancel="cancelHandle" :width="928" @ok="okHandle">
            <component :is="dialog.name" ref="dialog" :data="dialog.data"></component>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList } from '@/interface';
import { Table, Divider } from 'ant-design-vue';
import { ScopedSlot } from 'vue/types/vnode';
import TransferModal from '@/components/PositionModal/transfer.vue';
import DismissModal from '@/components/PositionModal/dismiss.vue';
import RehabModal from '@/components/PositionModal/rehab.vue';
import DepartureModal from '@/components/PositionModal/departure.vue';
import ServeModal from '@/components/PositionModal/serve.vue';
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
        align: 'center',
        scopedSlots: { customRender: 'recordStateName' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tabList')
    private tabListChange(value: any) {
        this.data = value;
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
    private makeEmployeeDataEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (_.isEqual(target.transfer, '调职')) {
            this.formData = {
                name: target.name,
                num: target.num,
                effectiveDate: target.lastOperatorDateTime,
                id: target.key,
                employeeId: target.employeeId,
            };
            this.dialog = {
                name: 's-transfer',
                title: '调职操作',
                visible: true,
                data: {
                    name: target.name,
                    num: target.num,
                    id: target.key,
                    employeeId: target.employeeId,
                    effectiveDate: target.effectiveDate,
                    employeePositionChangeTypeId: target.employeePositionChangeTypeId,
                    position: target.position,
                },
            };
        } else if (_.isEqual(target.transfer, '离职')) {
            this.dialog = {
                name: 's-departure',
                title: '离职操作',
                visible: true,
                data: {
                    name: target.name,
                    num: target.num,
                    id: target.key,
                    employeeId: target.employeeId,
                    effectiveDate: target.effectiveDate,
                    reason: target.reason,
                    employeePositionChangeTypeId: target.employeePositionChangeTypeId,
                },
            };
        } else if (_.isEqual(target.transfer, '撤职')) {
            this.dialog = {
                name: 's-dismiss',
                title: '撤职操作',
                visible: true,
                data: {
                    name: target.name,
                    num: target.num,
                    id: target.key,
                    employeeId: target.employeeId,
                    effectiveDate: target.effectiveDate,
                    reason: target.reason,
                },
            };
        } else if (_.isEqual(target.transfer, '复职')) {
            this.dialog = {
                name: 's-rehab',
                title: '复职操作',
                visible: true,
                data: {
                    name: target.name,
                    num: target.num,
                    id: target.key,
                    employeeId: target.employeeId,
                    effectiveDate: target.effectiveDate,
                    reason: target.reason,
                },
            };
        } else if (_.isEqual(target.transfer, '入职')) {
            this.dialog = {
                name: 's-serve',
                title: '入职操作',
                visible: true,
                data: {
                    name: target.name,
                    num: target.num,
                    id: target.key,
                    employeeId: target.employeeId,
                    effectiveDate: target.effectiveDate,
                    reason: target.reason,
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
    };
    private loadTableData() {
        this.$emit('loadData');
    }
}
</script>

