<template>
    <div>
        <a-table :pagination="false" :columns="column" size="small"
        bordered :dataSource="data" :loading="vloading">
            <template slot="action" slot-scope="text, record">
                <span>
                    <a @click="toggle(record.key)">编辑</a>
                </span>
            </template>
        </a-table>
        <a-position-modal :visible="modalVisible"
        @cancel="cancelHandle" :formData="formData"
        :type="type" @loadTableData="loadTableData"></a-position-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList } from '@/interface';
import { Table, Divider } from 'ant-design-vue';
import { ScopedSlot } from 'vue/types/vnode';
import Transfer from '../transfer/index.vue';
import PositionModal from '@/components/PositionModal/index.vue';
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
        'a-position-modal': PositionModal,
    },
    props: {
        tabList: Array,
    },
})
export default class RecordTable extends Vue {
    @Prop() private vloading!: boolean;
    @Prop() private tabList!: TableData[];
    private modalVisible: boolean = false;
    private data: TableData[] = this.tabList;
    private type: number = 0;
    private formData: FormData = {
        name: '',
        num: '',
        id: '',
        effectiveDate: '',
        reason: '',
        employeeId: '',
    };
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
        title: '生效时间',
        dataIndex: 'lastOperatorDateTime',
        align: 'center',
        scopedSlots: { customRender: 'lastOperatorDateTime' },
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
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (_.isEqual(target.transfer, '调职')) {
            this.type = 1;
            this.formData = {
                name: target.name,
                num: target.num,
                effectiveDate: target.lastOperatorDateTime,
                id: target.key,
                employeeId: target.employeeId,
            }
        } else if (_.isEqual(target.transfer, '离职')) {
            this.type = 2;
        } else if (_.isEqual(target.transfer, '撤职')) {
            this.type = 3;
            this.formData = {
                name: target.name,
                num: target.num,
                id: target.key,
                effectiveDate: target.lastOperatorDateTime,
                reason: target.reason,
                employeeId: target.employeeId,
            };
        } else if (_.isEqual(target.transfer, '复职')) {
            this.type = 4;
            this.formData = {
                name: target.name,
                num: target.num,
                id: target.key,
                effectiveDate: target.lastOperatorDateTime,
                reason: target.reason,
                employeeId: target.employeeId,
            };
        }
        this.modalVisible = true;
    }
    private cancelHandle() {
        this.modalVisible = false;
    }
    private loadTableData() {
        this.modalVisible = false;
        this.$emit('loadData');
    }
}
</script>

