<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-col  :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入员工姓名或工号">
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索" @focus="focusHandle"
                        @search="handleChange" @select="onSelect" v-model="searchKey">
                            <template slot="dataSource">
                                <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                            </template>
                             <a-input @change="e => valueChange(e.target.value)"></a-input>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工工号">
                        <a-input disabled v-model="employeeNum"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名">
                        <a-input disabled v-model="employeeName"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-divider>员工任职</a-divider>
            <a-form :form="form">
            <a-row>
                <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="工单号">
                        <a-input disabled v-decorator="['workOrderNum', {initialValue: '系统自动生成'}]"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="任职类型">
                        <a-select labelInValue v-decorator="['typeId',  {initialValue: positionDelegateTypeOption[0]}]">
                          <a-select-option v-for="item in positionDelegateTypeOption" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="现有职位">
                        <a-card class="ServeCard" style="width: 100%">
                            <p v-for="item in OriginPostionOptions">{{item.label}}</p>
                        </a-card>
                    </a-form-item>
                </a-col>
            </a-row>
                <a-row>
                    <a-col :lg="10" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="任职职位">
                            <a-cascader :options="cascderOption" style="width:100%" v-decorator="['newPosition', {rules: [{ required: true, message: ' ' }]}]"
                            :displayRender="({labels, selectedOptions}) => labels.join('->')" placeholder="请选择职位"
                            @change="(value, selectOption) => onChange(value, selectOption)"></a-cascader>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生效日期">
                        <a-date-picker v-decorator="['effectiveDate', {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                    </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :lg="20" :md="24" :sm="24">
                        <a-form-item :labelCol="labelCol2" :wrapperCol="wrapperCol2" label="任职原因">
                            <a-textarea v-decorator="['reason', {rules: [{ required: true, message: ' ' }]}]" :rows="4"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-row class='bottom_button'>
                <a-button class='serve_btn' type="primary" @click="save">保存</a-button>
            </a-row>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Row, Col, Input, Select, AutoComplete, Form, Divider, DatePicker, Button, Card, Cascader, message } from 'ant-design-vue';
import { searchEmployeeData, getEmployeePositionData } from '@/api/staff';
import { putEmployeePositionModification, getEmployeePositionDelegatedType } from '@/api/operation';
import _ from 'lodash';
import './index.less';
import moment from 'moment';
import { SelectValue, CascderOption, CascderOptionItem, BasicData } from '@/interface';
import { getOrginzationData } from '@/api/basic';
import { conversionOrganizationData } from '@/utils';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-select-option': Select.Option,
        'a-input': Input,
        'a-form-item': Form.Item,
        'a-auto-complete': AutoComplete,
        'a-divider': Divider,
        'a-date-picker': DatePicker,
        'a-textarea': Input.TextArea,
        'a-button': Button,
        'a-card': Card,
        'a-cascader': Cascader,
        'a-form': Form,
    },
    name: 'staffServe',
})
export default class Serve extends Vue {
    private dateForm = 'YYYY-MM-DD';
    private labelCol = { xs: {span: 24}, xl: {span: 10}, xxl: {span: 8}};
    private wrapperCol = { xs: {span: 24}, xl: {span: 14}, xxl: {span: 16}};
    private labelCol1 = { xs: {span: 24}, sm: {span: 4}};
    private wrapperCol1 = { xs: {span: 24}, sm: {span: 20}};
    private labelCol2 = { xs: {span: 24}, sm: {span: 2}};
    private wrapperCol2 = { xs: {span: 24}, sm: {span: 22}};
    private employeeDataList: EmployeeData[] = [];
    private cascderOption: CascderOption[] = [];
    private searchName: string = '';
    private searchKey: string = '';
    private positionId: string = '';
    private departmentId: string = '';
    private companyId: string = '';
    private employeeName: string = '';
    private employeeNum: string = '';
    private employeeId: string = '';
    private OriginPostionOptions: SelectValue[] = [];
    private positionDelegateTypeOption: SelectValue[] = [];
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
        this.fetch('');
        getEmployeePositionDelegatedType().then((res: any) => {
            const data = res.data;
            this.positionDelegateTypeOption = this.transformSelectData(data);
        });
        getOrginzationData().then((res: any) => {
            const data = res.data;
            this.cascderOption = conversionOrganizationData(data, {
                isOperation: false,
            });
        });
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private save() {
        if (_.isEqual(this.employeeId, '')) {
            message.error('请指定某一个员工');
            return;
        }
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                putEmployeePositionModification({
                    employeeId: this.employeeId,
                    newPositionCompanyId: this.companyId,
                    newPositionDepartmentId: this.departmentId,
                    newPositionId: this.positionId,
                    employeePositionModificationTypeId: values.typeId.key,
                    effectiveDate: moment(values.effectiveDate).format(this.dateForm),
                    reason: values.reason,
                }).then(() => {
                    this.form.resetFields();
                    this.searchEmployeePositionData(this.employeeId);
                    message.success('员工任职成功');
                });
            } else {
                const keyString = [...err][0];
                switch (keyString) {
                    case 'newPosition':
                        message.error('任职职位不能为空');
                        break;
                    case 'effectiveDate':
                        message.error('请填写生效日期');
                        break;
                    case 'reason':
                        message.error('请填写原因');
                        break;
                    default:
                        break;
                };
            }
        });
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private onChange(value: string[], selectOption: CascderOptionItem[]) {
        if (value.length > 0 && selectOption[selectOption.length - 1].key) {
            this.positionId = value[value.length - 1];
            this.departmentId = selectOption[selectOption.length - 1].departmentId;
            this.companyId = selectOption[selectOption.length - 1].companyId;
        }
    }
    private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            this.employeeId = item.value;
            this.searchEmployeePositionData(item.value);
        }
    }
    private searchEmployeePositionData(employeeId: string) {
        getEmployeePositionData(employeeId).then((res: any) => {
            const data = res.data;
            this.OriginPostionOptions = _.map(data.Positions, (item: any) => {
                return {
                    key: item.id,
                    label: item.positionFullPath,
                };
            });
        });
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.Id,
                    text: item.EmployeeStringID + '-' + item.FullName,
                    id: item.EmployeeStringID,
                    name: item.FullName,
                };
            });
        });
    }
}
</script>

