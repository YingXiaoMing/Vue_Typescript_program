<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
        <template v-for="(col,u) in ['name','tel1','tel2','remark']" :slot="col" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"></a-input>
            <template v-else>{{text}}</template>
        </template>
        <template slot="action" slot-scope="text, record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="cancel(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)">删除</a>
            </span>
        </template>
        <template slot="relationship" slot-scope="text, record">
            <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'relationship')">
                <a-select-option v-for="(item,index) in relationShipType" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table, Divider, Input, Select, message } from 'ant-design-vue';
import { ColumnList, SelectValue, BasicData } from '@/interface';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { getRelationship } from '@/api/basic';
import { getEmployeeContractData, putEmployeeContractData, newEmployeeContractData, deleteEmployeeContractData } from '@/api/staff';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
interface TableData {
    key: string;
    relationship: {
        key: string,
        label: string,
    };
    name: string;
    tel1: string;
    tel2: string;
    remark: string;
    editable: boolean;
    isNew: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-input': Input,
        'a-divider': Divider,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class PhoneTable extends Vue {
    @Prop() private options!: SelectValue[];
    @Prop() private tabList!: TableData[];
    @Prop({default : false}) private tloading!: boolean;
    @Prop({default : true}) private isNew!: boolean;
    @Prop({default: ''}) private employeeId!: string;
    private loading: boolean = this.tloading;
    private $store: any;
    private relationShipType: SelectValue[] = [];
    private cacheOriginData: any = [];
    private data: TableData[] = this.tabList;
    private column: ColumnList[] = [{
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '关系',
        dataIndex: 'relationship',
        align: 'center',
        scopedSlots: { customRender: 'relationship' },
    }, {
        title: '联系电话1',
        dataIndex: 'tel1',
        align: 'center',
        scopedSlots: { customRender: 'tel1' },
    }, {
        title: '联系电话2',
        dataIndex: 'tel2',
        align: 'center',
        scopedSlots: { customRender: 'tel2' },
    }, {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        scopedSlots: { customRender: 'remark' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private cancel(key: number) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
    }
    @Emit()
    private handleChange(value: any, key: number, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    private isNullContact(target: TableData): boolean {
        if (target.name === '' || target.tel1 === '' || target.tel2 === '') {
            message.error('紧急联系人资料请填写完整');
            return false;
        }
        return true;
    }
    @Watch('options')
    private optionChange(value: any) {
        this.relationShipType = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('tloading')
    private loadingChange(value: any) {
        this.loading = value;
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullContact(target)) {
            if (this.isNew) {
                this.saveNewData(target);
            } else {
                const diff = this.compareNewAndOldValue(target, this.cacheOriginData[key]);
                this.remoteUpdateEmployeeContactData(key, diff, target);
            }
        }
    }
     private remoteUpdateEmployeeContactData(key: string, diff: any, target: any) {
        if (diff.length > 0) {
            putEmployeeContractData(this.employeeId, key, diff).then((res) => {
                this.loadContractData();
            }).catch((err) => {
                message.error('更新失败');
            });
        } else {
            target.editable = false;
        }
    }
    private saveNewData(target: any) {
        target.editable = false;
        const newData = [...this.data];
        newData.pop();
        this.$store.dispatch('ReplaceEmergencyContactsList', newData);
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            name: newValue.name,
            phoneNumber1: newValue.tel1,
            phoneNumber2: newValue.tel2,
            note: newValue.remark,
            relationshipId: newValue.relationship.key,
        };
        const oldValues = {
            name: oldValue.name,
            phoneNumber1: oldValue.tel1,
            phoneNumber2: oldValue.tel2,
            note: oldValue.remark,
            relationshipId: oldValue.relationship.key,
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
    private loadContractData() {
        this.loading = true;
        getEmployeeContractData(this.employeeId).then((res: any) => {
            const newData = _.map(res, (item) => {
                const targetLegalType = _.find(this.relationShipType, { key: item.relationshipId});
                return {
                    name: item.name,
                    tel1: item.phoneNumber1,
                    tel2: item.phoneNumber2,
                    remark: item.note,
                    key: item.id,
                    editable: false,
                    relationship: targetLegalType ? targetLegalType : {key: '', label: ''},
                    isNew: false,
                };
            });
            this.data = newData;
            this.data.push({
                name: '',
                tel1: '',
                tel2: '',
                remark: '',
                key: '1',
                editable: true,
                relationship: this.relationShipType[0],
                isNew: true,
            });
            this.loading = false;
        }).catch((err) => {
            this.loading = false;
            message.error('加载数据失败，请联系管理员');
        });
    }
    @Emit()
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target && this.isNullContact(target)) {
            if (this.isNew) {
                this.firstAddRow(target, key);
            } else {
                newEmployeeContractData(this.employeeId, {
                    name: target.name,
                    phoneNumber1: target.tel1,
                    phoneNumber2: target.tel2,
                    note: target.remark,
                    relationshipId: target.relationship.key,
                }).then((res) => {
                    this.loadContractData();
                }).catch((err) => {
                    message.error('新增失败');
                });
            }
        }
    }
    private firstAddRow(target: any, key: string) {
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        this.$store.dispatch('ReplaceEmergencyContactsList', newData);
        this.data.push({
            relationship: this.relationShipType[0],
            name: '',
            tel1: '',
            tel2: '',
            editable: true,
            isNew: true,
            remark: '',
            key: index,
        });
    }
    @Emit()
    private removeRow(key: string) {
        if (this.data.length === 2) {
            message.error('必须存在一条紧急联系人信息');
            return;
        }
        if (this.isNew) {
            const newData = this.data.filter((item) => !_.isEqual(item.key, key));
            this.data = newData;
            this.$store.dispatch('RemoveEmergencyContactsList', key);
        } else {
            deleteEmployeeContractData(this.employeeId, key).then((res) => {
                this.loadContractData();
            }).catch((err) => {
                message.error('删除失败');
            });
        }
    }
}
</script>
