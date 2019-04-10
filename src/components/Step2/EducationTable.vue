<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data">
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
            <a-select labelInValue  v-if="record.editable" :defaultValue="{ key: text.value }" @change="e => handleChange(e.target.value,record.key, 'educationLevel')">
                <a-select-option v-for="(item,index) in educationLevelOption" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{ text.label }}</template>
        </template>

        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
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
import { Emit } from 'vue-property-decorator';
import { Table, Divider, DatePicker, Input, Select } from 'ant-design-vue';
import { ColumnList } from '@/interface';
import moment from 'moment';
import _ from 'lodash';
interface TableData {
    schoolName: string;
    major: string;
    educationLevel: {
        value: string;
        label: string;
    };
    startedDate: string;
    endDate: string;
    key: number;
    editable: boolean;
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
    private dateFormat = 'YYYY-MM-DD';
    private cacheOriginData: any = [];
    private educationLevelOption = [{
        value: '1',
        label: '博士',
    }, {
        value: '2',
        label: '硕士',
    }, {
        value: '3',
        label: '本科',
    }, {
        value: '4',
        label: '专科',
    }, {
        value: '5',
        label: '无',
    }];
    private data: TableData[] = [{
        schoolName: '北滘中学',
        major: '初中',
        startedDate: '2008-09-01',
        endDate: '2011-07-21',
        educationLevel: {
            value: '1',
            label: '博士',
        },
        key: 1,
        editable: false,
    }];
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
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
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
        const target = newData.filter(item => item.key === key)[0];
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
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }
    @Emit()
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        target.editable = false;
    }
    @Emit()
    private addEducationRow(value: TableData) {
        const key = this.data.length + 1;
        const newObj = {...value, key, ...{editable: false}};
        this.data.push(newObj);
    }
}
</script>

