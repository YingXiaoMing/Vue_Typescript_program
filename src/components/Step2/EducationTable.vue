<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
        <template v-for="(item,u) in ['schoolName','major']" :slot="item" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value, record.key, item)"></a-input>
            <template v-else>{{ text }}</template>
        </template>

        <template v-for="(col,u) in ['startedDate','endDate']" :slot="col" slot-scope="text, record">
            <a-date-picker v-if="record.editable" :defaultValue="text?momentFromDate(text):text" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, col)"></a-date-picker>
            <template v-else>{{ text }}</template>
        </template>
        
        <template slot="educationLevel" slot-scope="text,record">
            <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'educationLevel')">
                <a-select-option v-for="(item,index) in educationLevelOption" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{ text.label }}</template>
        </template>

        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type='vertical'></a-divider>
                    <a @click="cancel(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)">删除</a>
            </span>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, DatePicker, Input, Select, message } from 'ant-design-vue';
import { ColumnList, SelectValue } from '@/interface';
import moment from 'moment';
import _ from 'lodash';
import { putEmployeeEducationHistory, deleteEmployeeEducationHistory } from '@/api/staff';
import jsonpatch from 'fast-json-patch';

interface TableData {
    schoolName: string;
    major: string;
    educationLevel: {
        key: string;
        label: string;
    };
    startedDate: string;
    endDate: string;
    key: string;
    editable: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-date-picker': DatePicker,
        'a-input': Input,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class EducationTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: TableData[];
    @Prop({ default: [] }) private educationLevelOption!: SelectValue[];
    @Prop({ default: '' }) private employeeId!: string;
    private data: TableData[] = this.tabList;
    private dateFormat = 'YYYY-MM-DD';
    private cacheOriginData: any = [];
    private column: ColumnList[] = [{
        title: '学校/受教育机构名称',
        dataIndex: 'schoolName',
        align: 'center',
        scopedSlots: { customRender: 'schoolName' },
    }, {
        title: '专业/受教育学科',
        dataIndex: 'major',
        align: 'center',
        scopedSlots: { customRender: 'major' },
    }, {
        title: '学历',
        dataIndex: 'educationLevel',
        align: 'center',
        scopedSlots: { customRender: 'educationLevel' },
    }, {
        title: '开始时间',
        dataIndex: 'startedDate',
        align: 'center',
        scopedSlots: { customRender: 'startedDate' },
    }, {
        title: '结束时间',
        dataIndex: 'endDate',
        align: 'center',
        scopedSlots: { customRender: 'endDate' },
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
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Emit()
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private cancel(key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
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
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private removeRow(key: string) {
        deleteEmployeeEducationHistory(this.employeeId, key).then((res) => {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
        }).catch((err) => {
            message.error('删除失败');
        });
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        const params =  this.compareNewAndOldValue(target, this.cacheOriginData[key]);
        putEmployeeEducationHistory(this.employeeId, target.key, params).then((res) => {
            target.editable = false;
        }).catch((err) => {
            message.error('更新失败');
        });
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            educationLevelId: newValue.educationLevel.key,
            schoolName: newValue.schoolName,
            major: newValue.schoolName,
            startedDate: newValue.startedDate,
            endedDate: newValue.endDate,
        };
        const oldValues = {
            educationLevelId: oldValue.educationLevel.key,
            schoolName: oldValue.schoolName,
            major: oldValue.schoolName,
            startedDate: oldValue.startedDate,
            endedDate: oldValue.endDate,
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
}
</script>

