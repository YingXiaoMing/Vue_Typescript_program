<template>
    <a-table bordered size="small" :columns="column" :dataSource="data" :pagination="false">
        <template slot="name" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key)"></a-input>
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
                <a class="red" @click="deleteRow(record.key)">删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, Input, message } from 'ant-design-vue';
import { ColumnList } from '@/interface';
import _ from 'lodash';
import jsonpatch from 'fast-json-patch';
import { editPosition, getPosition, deletePosition, newPostion } from '@/api/operation';
interface TableData {
    key: string;
    parentCompanyId: string;
    parentDepartmentId: string;
    name: string;
    editable: boolean;
    isNew: boolean;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-input': Input,
    },
})
export default class VTable extends Vue {
    @Prop() private tabList!: TableData[];
    private companyId: string = '';
    private departmentId: string = '';
    private column: ColumnList[] = [{
        title: '职位名称',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
        width: 120,
    }];
    private data: TableData[] = this.tabList;
    private cacheOriginData: any = [];
    @Watch('tabList')
    private dataChange(value: any) {
        this.data = value;
    }
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
        this.companyId = target.parentCompanyId;
        this.departmentId = target.parentDepartmentId;
    }
    private loadPositionData() {
        getPosition(this.companyId, this.departmentId).then((res) => {
            this.data = _.map(res, (item) => {
                return {
                    key: item.id,
                    name: item.positionFullPath,
                    parentCompanyId: this.companyId,
                    parentDepartmentId: item.departmentId,
                    id: item.id,
                    editable: false,
                    isNew: false,
                };
            });
            this.data.push({
                key: '1',
                name: '',
                parentCompanyId: this.companyId,
                parentDepartmentId: this.departmentId,
                editable: true,
                isNew: true,
            });
        });
    }
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        this.companyId = target.parentCompanyId;
        this.departmentId = target.parentDepartmentId;
        if (target && this.isNullData(target)) {
            newPostion(target.parentCompanyId, target.parentDepartmentId, {
                name: target.name,
            }).then(() => {
                this.loadPositionData();
            });
        }
    }
    private cancel(key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
    }
    private handleChange(value: any, key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target.name = value;
        }
    }
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target && this.isNullData(target)) {
            const diff = this.compareNewAndOldValue(target, this.cacheOriginData[key]);
            if (diff.length > 0 ) {
                editPosition(target.parentCompanyId, target.parentDepartmentId, target.key, diff).then((res) => {
                    this.loadPositionData();
                });
            } else {
                target.editable = false;
            }
        }
    }
    private deleteRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        this.companyId = target.parentCompanyId;
        this.departmentId = target.parentDepartmentId;
        if (target) {
            deletePosition(target.parentCompanyId, target.parentDepartmentId, target.key).then (() => {
                this.loadPositionData();
            });
        }
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            name: newValue.name,
        };
        const oldValues = {
            name: oldValue.name,
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
    private isNullData(target: TableData): boolean {
        if (target.name === '' ) {
            message.error('名称不能为空');
            return false;
        }
        return true;
    }
}
</script>

