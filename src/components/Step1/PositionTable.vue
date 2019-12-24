<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type='vertical'></a-divider>
                    <a @click="makePositionRowNotEditable(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <template v-if="!record.mainPosition">
                    <a @click="removeRow(record.key)">删除</a>
                </template>
            </span>
        </template>
        <template slot="position" slot-scope="text,record">
            <a-cascader style='width:100%' :options="cascderOption"
             v-if="record.editable" :value="record.selectOption" placeholder="请选择职位"
             @change="(value,selectOption) => onChange(value,selectOption,'position',record.key)"
             :displayRender="({labels, selectedOptions}) => labels.join('->')">
             </a-cascader>
            <template v-else>{{text}}</template>
        </template>
        <template slot="mainPosition" slot-scope="text,record">
            <a-radio :checked="text" @change="onRadioChange(record.key)" :disabled="record.editable"></a-radio>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Cascader, Divider, Radio, message, Button, Tooltip } from 'ant-design-vue';
import { ColumnList, CascderOption, CascderOptionItem, RemoteCompanyOrgaizationData, CascderServerOption, RemotePositionsTableData } from '@/interface';
import { getOrginzationData } from '@/api/basic';
import { conversionOrganizationData } from '@/utils';
import { newEmployeePostionData, deleteEmployeePostionData, getEmployeePositionData, putEmployeeBasicData } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    editable: boolean;
    isNew: boolean;
    key: string;
    mainPosition: boolean;
    position: string;
    positionId: string;
    departmentId?: string;
    companyId?: string;
    selectOption: string[];
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-cascader': Cascader,
        'a-divider': Divider,
        'a-radio': Radio,
        'a-button': Button,
        'a-tooltip': Tooltip,
    },
})
export default class PhoneTable extends Vue {
    @Prop({default: ''}) private employeeId!: string;
    @Prop() private tabList!: TableData[];
    @Prop({default : true}) private isNew!: boolean;
    private loading: boolean = false;
    private $store: any;
    private cacheOriginData: any = [];
    private cascderOption: CascderOption[] = [];
    private data: TableData[] = this.tabList;
    private column: ColumnList[] = [{
        title: '职位信息',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '主职位',
        dataIndex: 'mainPosition',
        align: 'center',
        scopedSlots: { customRender: 'mainPosition' },
    }, {
        title: '操作',
        width: 130,
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private created() {
        getOrginzationData().then((res: any) => {
            const data: RemoteCompanyOrgaizationData = res.data;
            this.cascderOption = conversionOrganizationData(data, {
                isOperation: false,
            });
        });
    }
    @Emit()
    private onChange(value: string[], selectOption: CascderOptionItem[], name: string, key: number) {
        const newData = [...this.data];
        const newLabel = _.map(selectOption, (item) => {
            return item.label;
        });
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (target && value.length > 0) {
            target.position = _.join(newLabel, '->');
            target.selectOption = value;
            if (selectOption[selectOption.length - 1].key) {
                target.positionId = value[value.length - 1];
                target.companyId = selectOption[selectOption.length - 1].companyId;
                target.departmentId = selectOption[selectOption.length - 1].departmentId;
            }
            this.data = newData;
        }
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        this.cacheOriginData = this.deleteLast(_.cloneDeep(this.data));
        if (target && this.isNullPosition(target) && this.filterDuplicateData(target)) {
            target.editable = false;
            const newData = [...this.data];
            newData.pop();
            this.$store.dispatch('ReplacePositionList', newData);
        }
    }
    private deleteLast(arr: any) {
        return arr.slice(0, arr.length - 1);
    }
    @Emit()
    private onRadioChange(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (this.isNew) {
            const newData = [...this.data];
            newData.filter((item) => {
                _.isEqual(item.key, key) ? item.mainPosition = true : item.mainPosition = false;
            });
            this.data  = newData;
        } else {
            // 更换主职位
            const patch = [
                    { op: 'replace', path: '/principalPositionId', value: target.key },
                ];
            putEmployeeBasicData(this.employeeId, patch, {}).then((res) => {
                message.success('更换成功');
                this.$emit('loadData');
            }).catch(() => {
                message.error('更换主职位失败');
            });
        }
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Emit()
    private makePositionRowNotEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        const str = target.position;
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private makePositionRowNotEditable(key: string) {
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
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target && this.isNullPosition(target) && this.filterDuplicateData(target)) {
            if (this.isNew) {
                this.firstAddRow(target, key);
            } else {
                newEmployeePostionData(this.employeeId, {
                    companyId: target.companyId,
                    departmentId: target.departmentId,
                    positionId: target.positionId,
                }).then((res) => {
                    this.$emit('loadData');
                });
            }
        }
    }
    private firstAddRow(target: any, key: string) {
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        this.$store.dispatch('ReplacePositionList', newData);
        this.data.push({
            position: '',
            key: index,
            mainPosition: false,
            editable: true,
            isNew: true,
            selectOption: [],
            positionId: '',
        });
    }
    private isNullPosition(target: TableData): boolean {
        if (target.positionId === '') {
            message.error('请选择有效的职位');
            return false;
        }
        return true;
    }
    private filterDuplicateData(target: TableData): boolean {
        if (this.data.length > 1 && this.filterDoublePosition(target)) {
            message.error('请勿添加重复职位');
            return false;
        }
        return true;
    }
    private filterDoublePosition(target: any) {
        if (this.isNew) {
            const newData = [...this.data];
            newData.pop();
            return _.some(newData, { positionId: target.positionId });
        } else {
            return _.some(this.cacheOriginData, { positionId: target.positionId });
        }
    }
    @Emit()
    private removeRow(key: string) {
        if (this.data.length === 2) {
            message.error('请至少保留一条职位信息');
            return;
        }
        if (this.isNew) {
            const newData = this.data.filter((item) => !_.isEqual(item.key, key));
            this.data = newData;
            this.$store.dispatch('RemovePositionList', key);
        } else {
            deleteEmployeePostionData(this.employeeId, key).then((res) => {
                this.$emit('loadData');
            }).catch((err) => {
                message.error('删除失败');
            });
        }
    }

}
</script>
