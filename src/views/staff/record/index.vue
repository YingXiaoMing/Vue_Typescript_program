<template>
    <div class='wrapper'>
        <div class='staff-head'>
            <a-row :gutter="24">
                <a-form :form="form">
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item>
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                            @search="handleChange" @select="onSelect" @focus="focusHandle">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                <a-input @change="e => valueChange(e.target.value)"></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="3" :md="12" :sm="24">
                        <a-form-item>
                            <a-checkbox v-decorator="['IsIncludeTerminated', { valuePropName: 'checked', initialValue: false }]">包含离职员工</a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary" @click="fastQuery">快速查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-recordTable :tabList="recordData" :vloading="loading" @loadData="loadData"></a-recordTable>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import RecordTable from './recordTable.vue';
import { searchEmployeeData } from '@/api/staff';
import { getEmployeeModificationRecord } from '@/api/operation';
import { RemotePostionChangeRecord } from '@/interface';
import './index.less';
import _ from 'lodash';
import moment from 'moment';
import { Pagination } from '@/interface';
import { Row, Col, Form, AutoComplete, Select, Button, Input, message } from 'ant-design-vue';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
interface TableData {
    key: string;
    num: string;
    name: string;
    transfer: string;
    type: string;
    position: string;
    newPosition: string;
    lastOperatorDateTime: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-select-option': Select.Option,
        'a-auto-complete': AutoComplete,
        'a-input': Input,
        'a-recordTable': RecordTable,
        'a-button': Button,
    },
    name: 'staffrecord',
})
export default class Record extends Vue {
    private dateFormat = 'YYYY-MM-DD';
    private employeeDataList: EmployeeData[] = [];
    private searchKey: string = '';
    private recordData: TableData[] = [];
    private loading: boolean = false;
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this, {
            IsIncludeTerminated: false,
        });
        this.fetch('');
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private changeDataToParamas(params: URLSearchParams, data: boolean, paramName: string) {
        if (data) {
            params.set(paramName, data.toString());
        }
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        this.changeDataToParamas(params, this.form.getFieldValue('IsIncludeTerminated'), 'FilterProperties.IsIncludeTerminated');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.id,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.employeeStringID,
                    name: item.fullName,
                };
            });
        });
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private fastQuery() {
        if (_.isEqual(this.searchKey, '')) {
            message.error('员工输入框不能为空');
        } else {
            this.loadData();
        }
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private loadData() {
        this.loading = true;
        getEmployeeModificationRecord(this.searchKey).then((res: any) => {
            this.loading = false;
            const records: RemotePostionChangeRecord[] = res.data;
            this.recordData = _.map(records, (item) => {
                return {
                    key: item.id,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    transfer: item.employeePositionChangeClassifyName,
                    type: item.employeePositionChangeTypeName,
                    position: item.orginalPositionFullPath,
                    newPosition: item.newPositionFullPath,
                    lastOperatorDateTime: moment(item.effectiveDate).format(this.dateFormat),
                    reason: item.reason ? item.reason : '',
                    employeeId: item.employeeId,
                    employeePositionChangeTypeId: item.employeePositionChangeTypeId,
                    effectiveDate: item.effectiveDate,
                    recordStateValue: item.recordStateValue,
                    recordStateName: item.recordStateName,
                    workOrderNumber: item.workOrderNumber,
                    isAllowModification: item.isAllowModification,
                };
            });
        });
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.searchKey = item.value;
        }
    }
}
</script>

