<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
         <!-- Phone Type -->
        <template slot="phoneType" slot-scope="text,record">
            <a-select labelInValue v-if="record.editable" :value="text"
            @change="e => handleChange(e,record.key, 'phoneType')">
              <a-select-option v-for="(item,index) in phoneType" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>

        <template slot="phoneNum" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, 'phoneNum')"></a-input>
            <template v-else>{{text}}</template>
        </template>

        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type='vertical'></a-divider>
                    <a @click="makePhoneRowNotEditable(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <template v-if="record.isRequired === 'true'">
                    <a-tooltip placement="top" title="系统必须保留一个主号码，如需删除主号码，请将其它号码设置为主号码">
                        <a @click="makePhoneRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                    </a-tooltip>
                </template>
                <template v-else>
                    <a @click="makePhoneRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="removeRow(record.key)" :class="{'disabled-button': record.disable}">删除</a>
                </template>
                
            </span>
        </template>

        <template slot="isRequired" slot-scope="text,record">
            <a-select v-if="record.editable" :value="text" 
            @change="e => handleChange(e,record.key, 'isRequired')">
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
            </a-select>
            <template v-else-if="text === 'true'">
                <a-checkbox defaultChecked></a-checkbox>
            </template>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import { Table, Divider, Checkbox, Select, Input, message, Tooltip} from 'ant-design-vue';
import { ColumnList, SelectValue, BasicData } from '@/interface';
import { getPhoneTypeOption } from '@/api/basic';
import { getEmployeePhoneData, putEmployeePhoneData, newEmployeePhoneData, deleteEmployeePhoneData, replaceeEmployeeMainPhoneNum } from '@/api/staff';
import jsonpatch from 'fast-json-patch';
interface TableData {
    phoneType: {
        key: string,
        label: string,
    };
    phoneNum: string;
    isRequired: string;
    editable: boolean;
    isNew: boolean;
    disable: boolean;
    key: string;
    [key: string]: any;
}
interface RemoteTableData {
    isDefault: string;
    typeId: string;
    phoneNumber: {
        number: string;
    };
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-checkbox': Checkbox,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-input': Input,
        'a-tooltip': Tooltip,
    },
})
export default class PhoneTable extends Vue {
    @Prop() private options!: SelectValue[];
    @Prop() private tabList!: TableData[];
    @Prop({default : false}) private tloading!: boolean;
    @Prop({default : true}) private isNew!: boolean;
    @Prop({default : '' }) private employeeId!: string;
    @Prop({default: ''}) private ETag!: string;
    private $store: any;
    private loading: boolean = this.tloading;
    private cacheOriginData: any = [];
    private phoneType: SelectValue[] = [];
    private column: ColumnList[] = [{
        title: '电话类型',
        dataIndex: 'phoneType',
        align: 'center',
        scopedSlots: { customRender: 'phoneType' },
    }, {
        title: '电话号码',
        dataIndex: 'phoneNum',
        align: 'center',
        scopedSlots: { customRender: 'phoneNum' },
    }, {
        title: '主号码',
        dataIndex: 'isRequired',
        align: 'center',
        scopedSlots: { customRender: 'isRequired' },
    }, {
        title: '操作',
        width: 130,
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private data: TableData[] = this.tabList;
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    @Watch('options')
    private optionChange(value: any) {
        this.phoneType = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('tloading')
    private loadingChange(value: any) {
        this.loading = value;
    }
    private deleteLast(arr: any) {
        return arr.slice(0, arr.length - 1);
    }
    private makePhoneRowEditable(key: string) {
        this.cacheOriginData = this.deleteLast(_.cloneDeep(this.data));
        const targetRow = this.getEditableRow(this.data, key);
        if (targetRow) {
            targetRow.editable = !targetRow.editable;
            this.setOtherRowsDisabled(key, this.data, true);
        }
    }
    private setOtherRowsDisabled(key: string, arr: TableData[], disabled: boolean) {
        arr.filter((item) => {
            if (!_.isEqual(item.key, key)) {
                item.disable = disabled;
            }
        });
    }
    private getEditableRow(data: TableData[], key: string) {
        return data.filter((item) => _.isEqual(item.key, key))[0];
    }
    private makePhoneRowNotEditable(key: string) {
        const target = _.find(this.cacheOriginData, ['key', key]);
        const targetIndex = _.findIndex(this.data, ['key', key]);
        this.data.splice(targetIndex, 1, target);
        this.setOtherRowsDisabled(key, this.data, false);
    }

    private isNullPhoneNum(target: TableData): boolean {
        if (_.isEmpty(target.phoneNum)) {
            message.error('联系电话信息不完整');
            return false;
        }
        return true;
    }

    private isExistMainPhoneNum() {
        if (this.isNew) {
            return _.some(this.data, { isRequired: 'true' });
        } else {
            return _.some(this.cacheOriginData, {isRequired: 'true'});
        }
    }

    private transformRemoteData(remoteData: TableData[]): RemoteTableData[] {
        const newData: RemoteTableData[] = _.map(remoteData, (item) => {
            return {
                typeId: item.phoneType.key,
                isDefault: item.isRequired,
                phoneNumber: {
                    number: item.phoneNum,
                },
            };
        });
        return newData;
    }

    @Emit()
    private handleChange(value: any, key: number, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    private findAndReplaceRequired(data: TableData[], key: string) {
        data.filter((item) => {
            if (!_.isEqual(item.key, key)) {
                item.isRequired = 'false';
            }
        });
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (!this.isExistMainPhoneNum()) {
            message.error('必须存在一个主号码');
            return;
        }
        if (target && this.isNullPhoneNum(target)) {
            if (this.isNew) {
                this.saveNewData(target, key);
            } else {
                if (_.isEqual(target.isRequired, 'true')) {
                    this.findAndReplaceRequired(this.data, key);
                }
                // 否则会更新数据
                const newData = this.deleteLast(_.cloneDeep(this.data));
                const newValue = this.transformRemoteData(newData);
                const oldValue = this.transformRemoteData(this.cacheOriginData);
                const diff = this.compareNewAndOldValue(newValue, oldValue);
                this.remoteUpdateEmployeePhoneData(key, diff, target);
            }
        }
    }
    private remoteUpdateEmployeePhoneData(key: string, diff: any, target: TableData) {
        if (diff.length > 0) {
            putEmployeePhoneData(this.employeeId, diff, {
                'If-Match': this.ETag,
            }).then((res) => {
                this.$emit('loadData');
            });
        } else {
            target.editable = false;
        }
    }
    private compareNewAndOldValue(newValue: RemoteTableData[], oldValue: RemoteTableData[]) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
    private saveNewData(target: TableData, key: string) {
        const newData = [...this.data];
        if (_.isEqual(target.isRequired, 'true')) {
            this.findAndReplaceRequired(newData, key);
        }
        newData.pop();
        this.$store.dispatch('ReplacePhoneNumberList', newData);
        target.editable = false;
        this.setOtherRowsDisabled(key, this.data, false);
    }
    @Emit()
    private addRow(key: string) {
        if (!this.isExistMainPhoneNum()) {
            message.error('必须存在一个主号码');
            return;
        }
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target && this.isNullPhoneNum(target)) {
            if (this.isNew) {
                this.firstAddRow(target, key);
            } else {
                newEmployeePhoneData(this.employeeId, {
                    typeId: target.phoneType.key,
                    phoneNumber: {
                        number: target.phoneNum,
                    },
                }).then((res: any) => {
                    // 更换手机号码
                    const newId = res.id;
                    if (_.isEqual(target.isRequired, 'true') && target.isNew) {
                        replaceeEmployeeMainPhoneNum(this.employeeId, newId).then(() => {
                            this.$emit('loadData');
                        }).catch((err) => {
                            message.error('设置主号码失败,请重新设置。');
                        });
                    } else {
                        this.$emit('loadData');
                    }
                }).catch((err) => {
                    message.error('新增失败');
                });
            }
        }
    }
    private firstAddRow(target: any, key: string) {
        const index = key + 1;
        const newData = [...this.data];
        if (_.isEqual(target.isRequired, 'true')) {
            this.findAndReplaceRequired(newData, key);
        }
        target.editable = false;
        target.isNew = false;
        this.$store.dispatch('ReplacePhoneNumberList', newData);
        this.data.push({
            phoneType: this.phoneType[0],
            phoneNum: '',
            isRequired: 'false',
            editable: true,
            isNew: true,
            disable: false,
            key: index,
        });
    }
    @Emit()
    private removeRow(key: string) {
        if (this.data.length === 2) {
            message.error('请至少添加一条联系电话信息');
            return;
        }
        if (this.isNew) {
            const newData = this.data.filter((item) => !_.isEqual(item.key, key));
            this.data = newData;
            this.$store.dispatch('RemovePhoneNumberList', key);
        } else {
            deleteEmployeePhoneData(this.employeeId, key).then((res) => {
                this.$emit('loadData');
            }).catch((err) => {
                message.error('删除失败');
            });
        }
    }
}
</script>

