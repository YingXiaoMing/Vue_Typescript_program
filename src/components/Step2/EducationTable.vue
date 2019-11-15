<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
        <template v-for="(item,u) in ['schoolName','major']" :slot="item" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value, record.key, item)"></a-input>
            <template v-else>{{ text }}</template>
        </template>
        <template v-for="(col,u) in ['startedDate','endDate']" :slot="col" slot-scope="text, record">
            <a-date-picker v-if="record.editable" :value="momentFromDate(text)" :format="dateFormat"
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
                    <a @click="makeEducationRowNotEditable(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="makeEducationRowEditable(record.key)" :class="{'disabled-button': record.disable}">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)" :class="{'disabled-button': record.disable}">删除</a>
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
    disable: boolean;
    [key: string]: any;
}
interface RemoteTableData {
    educationLevelId: string;
    schoolName: string;
    major: string;
    startedDate: string;
    endedDate: string;
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
    @Prop({default: ''}) private ETag!: string;
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
        width: 120,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    private momentFromDate(date: string) {
        if (_.isEmpty(date)) { return null; }
        return moment(date, this.dateFormat);
    }
    private transformRemoteData(remoteData: TableData[]): RemoteTableData[] {
        const newData: RemoteTableData[] = _.map(remoteData, (item) => {
            return {
                educationLevelId: item.educationLevel.key,
                schoolName: item.schoolName,
                major: item.major,
                startedDate: item.startedDate,
                endedDate: item.endDate,
            };
        });
        return newData;
    }
    @Emit()
    private makeEducationRowEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            this.cacheOriginData = _.cloneDeep(this.data);
            target.editable = !target.editable;
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
    private makeEducationRowNotEditable(key: string) {
        const target = _.find(this.cacheOriginData, ['key', key]);
        const targetIndex = _.findIndex(this.data, ['key', key]);
        this.data.splice(targetIndex, 1, target);
        this.setOtherRowsDisabled(key, this.data, false);
    }
    @Emit()
    private handleChange(value: any, key: number, name: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target) {
            target[name] = value;
        }
    }
    @Emit()
    private removeRow(key: string) {
        deleteEmployeeEducationHistory(this.employeeId, key).then((res) => {
            this.$emit('loadData');
        }).catch((err) => {
            message.error('删除失败');
        });
    }
    private isNullEducation(target: TableData): boolean {
        if (_.isEmpty(target.schoolName) || _.isEmpty(target.major) || _.isEmpty(target.startedDate) || _.isEmpty(target.endDate)) {
            message.error('教育经历信息不完整');
            return false;
        }
        return true;
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullEducation(target)) {
            if (this.compareStartDateAndEndDate(target.startedDate, target.endDate)) {
                message.error('结束日期不能早于开始日期');
                return;
            }
            const newData = _.cloneDeep(this.data);
            const newValue = this.transformRemoteData(newData);
            const oldValue = this.transformRemoteData(this.cacheOriginData);
            const params =  this.compareNewAndOldValue(newValue, oldValue);
            putEmployeeEducationHistory(this.employeeId, params, {
                'If-Match': this.ETag,
            }).then((res) => {
                message.success('更新成功');
                this.$emit('loadData');
            });
        }
    }
    private compareStartDateAndEndDate(startDate: string, endDate: string) {
        return moment(startDate).isAfter(endDate);
    }
    private compareNewAndOldValue(newValue: RemoteTableData[], oldValue: RemoteTableData[]) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
}
</script>

