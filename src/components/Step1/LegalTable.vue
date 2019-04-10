<template>
    <a-table :pagination="false" bordered :columns="column" :dataSource="data"
     size="small">
        <template slot="legalNum" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, 'legalNum')"></a-input>
            <template v-else>{{text}}</template>
        </template>
        <template v-for="(col,u) in ['issueDate','expireDate']" :slot="col" slot-scope="text, record">
            <a-date-picker v-if="record.editable" :defaultValue="text?momentFromDate(text):text" :format="dateFormat"
            @change="(date,dateString) => handleChange(dateString, record.key, col)"></a-date-picker>
            <template v-else>{{ text }}</template>
        </template>
        <template slot="legalType" slot-scope="text, record">
            <a-select labelInValue  v-if="record.editable" :defaultValue="{ key: text.value }" @change="e => handleChange(e.target.value,record.key, 'legalType')">
                <a-select-option v-for="(item,index) in LegalType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
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
     </a-table>
</template>


<script lang="ts">
import Vue from 'vue';
import { Table, Divider, Input, DatePicker, Select } from 'ant-design-vue';
import Component from 'vue-class-component';
import { ColumnList } from '@/interface';
import { Emit } from 'vue-property-decorator';
import moment from 'moment';
interface TableData  {
    legalType: {
        value: string,
        label: string,
    };
    legalNum: string;
    issueDate: string | null;
    expireDate: string | null;
    editable: boolean;
    isNew: boolean;
    key: number;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class LegalTable extends Vue {
    private cacheOriginData: any = [];
    private LegalType = [{
        value: '1',
        label: '身份证',
    }, {
        value: '2',
        label: '护照',
    }, {
        value: '3',
        label: '台胞证',
    }, {
        value: '4',
        label: '港澳通行证',
    }];
    private column: ColumnList[] = [{
        title: '证件类型',
        dataIndex: 'legalType',
        align: 'center',
        scopedSlots: { customRender: 'legalType' },
    }, {
        title: '证件号码',
        dataIndex: 'legalNum',
        align: 'center',
        scopedSlots: { customRender: 'legalNum' },
    }, {
        title: '开始日期',
        dataIndex: 'issueDate',
        align: 'center',
        scopedSlots: { customRender: 'issueDate' },
    }, {
        title: '到期日期',
        dataIndex: 'expireDate',
        align: 'center',
        scopedSlots: { customRender: 'expireDate' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private dateFormat = 'YYYY-MM-DD';
    private data: TableData[] = [{
        legalType: {
            value: '1',
            label: '身份证',
        },
        legalNum: '440681199502165623',
        issueDate: '1995-02-13',
        expireDate: '2019-04-01',
        editable: true,
        isNew: true,
        key: 1,
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
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        target.editable = false;
    }
    @Emit()
    private addRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const index = key + 1;
        target.editable = false;
        target.isNew = false;
        this.data.push({
            legalType: {
                value: '1',
                label: '身份证',
            },
            legalNum: '',
            issueDate: null,
            expireDate: null,
            editable: true,
            isNew: true,
            key: index,
        });
    }
    @Emit()
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }

}
</script>
