<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-form :form="form">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item label="输入员工姓名或工号" v-bind="formItemLayout">
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                            @search="handleChange" @select="onSelect" @focus="focusHandle">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                <a-input @change="e => valueChange(e.target.value)"></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item label="输入工单号" v-bind="formItemLayout">
                            <a-input></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="4" :md="12" :sm="24">
                        <a-form-item>
                            <a-checkbox v-decorator="['IsIncludeTerminated', { valuePropName: 'checked', initialValue: false }]">包含离职员工</a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="6" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary">快速查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>
            <a-operation-recordTable></a-operation-recordTable>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { searchEmployeeData } from '@/api/staff';
import OperationRecordTable from './recordTable.vue';
import _ from 'lodash';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
@Component({
    components: {
        'a-operation-recordTable': OperationRecordTable,
    },
})
export default class Operation extends Vue {
    private form: any;
    private $form: any;
    private searchKey: string = '';
    private employeeDataList: EmployeeData[] = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private created() {
        this.form = this.$form.createForm(this, {
            IsIncludeTerminated: false,
        });
        this.fetch('');
    }
    private handleChange(value: string) {
        this.fetch(value);
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
    private changeDataToParamas(params: URLSearchParams, data: boolean, paramName: string) {
        if (data) {
            params.set(paramName, data.toString());
        }
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.searchKey = item.value;
        }
    }
}
</script>

