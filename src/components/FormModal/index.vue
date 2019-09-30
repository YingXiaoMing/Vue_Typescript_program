<template>
    <a-modal :visible="isVisible" @cancel="cancelHandle" okText="查询" width="1040px" @ok="okHandle">
        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item v-bind="formItemLayout" label="查询关键字">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="searchForm">
                    <a-col :span="12">
                        <fieldset>
                            <legend>基本信息条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="员工状态">
                                <a-form-item class='form-inline'>
                                    <a-checkbox  :checked="employeeStatusCheckAll"
                                    @change="onEmployeeStatusCheckAllChange" v-decorator="['employeeStatusCheckAll']">全部</a-checkbox>
                                </a-form-item>
                                <a-form-item class='form-inline'>
                                    <a-checkbox-group v-decorator="['employeeStatusCheckedList']" :options="employeeStatusOptions"
                                    @change="onEmployeeStatusChange">
                                    </a-checkbox-group>
                                </a-form-item>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="工作性质">
                                <a-form-item class='form-inline'>
                                    <a-checkbox :checked="employeeTypeCheckAll"
                                    @change="onEmployeeTypeCheckAllChange" v-decorator="['employeeTypeCheckAll']">全部</a-checkbox>
                                </a-form-item>
                                <a-form-item class='form-inline'>
                                    <a-checkbox-group v-decorator="['employeeTypeCheckedList']" :options="employeeTypeOptions"
                                    @change="onEmployeeTypeChange"></a-checkbox-group>
                                </a-form-item>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="性别">
                                <a-form-item class='form-inline'>
                                    <a-checkbox :checked="employeeGenderCheckAll"
                                    @change="onEmployeeGenderCheckAllChange" v-decorator="['employeeGenderCheckAll']">全部</a-checkbox>
                                </a-form-item>
                                <a-form-item class='form-inline'>
                                    <a-checkbox-group v-decorator="['employeeGenderCheckedList']" :options="employeeGenderOptions"
                                    @change="onEmployeeGenderChange">
                                    </a-checkbox-group>
                                </a-form-item>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="婚否">
                                <a-form-item class='form-inline'>
                                    <a-checkbox :checked="employeeMarryStatusCheckAll" v-decorator="['employeeMarryStatusCheckAll']"
                                    @change="onEmployeeMarryStatusCheckAllChange">全部</a-checkbox>
                                </a-form-item>
                                <a-form-item class='form-inline'>
                                    <a-checkbox-group v-decorator="['employeeMarryStatusCheckedList']" :options="employeeMarryStatusOptions"
                                    @change="onEmployeeMarryStatusChange"></a-checkbox-group>
                                </a-form-item>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="学历">
                                <a-checkbox-group v-decorator="['highEducation']">
                                    <a-checkbox v-for="item in highEducation" :value="item.key">{{item.label}}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="工作地点">
                                <a-checkbox-group v-decorator="['workplace']">
                                    <a-checkbox v-for="item in workplaceOption" :value="item.key">{{item.label}}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="离职类型">
                                <a-select mode="multiple"  v-decorator="['endJobType']">
                                  <a-select-option v-for="item in endJobType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12">
                        <fieldset>
                            <legend>员工联系地址条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="地址类型">
                                <a-select v-decorator="['addressType', {initialValue: addressTypeOption[0].key}]">
                                  <a-select-option v-for="item in addressTypeOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="所属省">
                                <a-select v-decorator="['province', {initialValue: province}]"  @change="e => onAreaCityChange(e, 'province')">
                                  <a-select-option v-for="item in provinceOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="所属市">
                                <a-select v-decorator="['city', { initialValue : city}]" @change="e => onAreaCityChange(e, 'city')">
                                  <a-select-option v-for="item in cityOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="所属区">
                                <a-select v-decorator="['area', { initialValue : area }]" @change="e => onAreaCityChange(e, 'area')">
                                  <a-select-option v-for="item in areaOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                        <fieldset class="department">
                            <legend>部门职位条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="组织架构">
                                <a-tree-select :multiple="true" :options="treeData"
                                noChildrenText="空" v-decorator="['text']"/>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12" style="marginTop: 10px">
                        <fieldset>
                            <legend>入职离职日期范围</legend>
                            <a-form-item v-bind="formItemLayout2" label="入职日期">
                                <a-range-picker v-decorator="['employeeDate']" format="YYYY-MM-DD">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="离职日期">
                                <a-range-picker v-decorator="['endJobDate']" format="YYYY-MM-DD">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="生日日期">
                                <a-range-picker v-decorator="['birthRange']" format="YYYY-MM-DD">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="生日月份">
                                <a-select v-decorator="['birthMonth', {initialValue: birthOption[0].key}]">
                                  <a-select-option v-for="item in birthOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12" style="marginTop: 10px">
                        <fieldset>
                            <legend>证书合同日期范围</legend>
                            <a-form-item v-bind="formItemLayout2" label="证书类型">
                                <a-select v-decorator="['credentialType']">
                                  <a-select-option v-for="item in credentialType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="证书日期">
                                <a-range-picker v-decorator="['credentialDate']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="合同类型">
                                <a-select v-decorator="['contractType', {initialValue: contractType[0].key}]">
                                  <a-select-option v-for="item in contractType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="合同日期">
                                <a-range-picker v-decorator="['contractDate']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                </a-row>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { Modal, Row, Col, Form, Input, Checkbox, Radio, Select, Calendar, DatePicker, Icon } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import { getWorkLocation, getCredentialTypeOption, getContractTypeOption, getEducationLevelOption,
getEmployeeEndJonType, getEmploymentTypeOption, getAddressTypeOption } from '@/api/basic';
import _ from 'lodash';
import provinceData from '@/utils/province';
import { getCompanyOrganizationChart } from '@/api/operation';
import './index.less';
import cityData from '@/utils/city';
import areaData from '@/utils/area';
import { SelectValues } from '../../interface/index';
import URLSearchParams from 'url-search-params';
import moment from 'moment';
interface Data {
    title: string;
    value: string;
    description: string;
    key: string;
}
interface TableData {
    label: string;
    id: string;
    description: string;
    children: Data[];
}
interface TypeOption {
    value: string;
    label: string;
}
@Component({
    components: {
        'a-modal': Modal,
        'a-row': Row,
        'a-col': Col,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-checkbox-group': Checkbox.Group,
        'a-checkbox': Checkbox,
        'a-radio-group': Radio.Group,
        'a-radio': Radio,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-range-picker': DatePicker.RangePicker,
        'a-icon': Icon,
        'a-tree-select': Treeselect,
    },
})
export default class FormModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    private dateFormat: string = 'YYYY-MM-DD';
    private searchData = {
        workplace: '',
        credentialType: '',
        contractType: '',
        highEducation: '',
        endJobType: '',
        birthMonth: '1',
    };
    private endJobType: SelectValue[] = [];
    private highEducation: SelectValue[] = [];
    private workplaceOption: SelectValue[] = [];
    private addressTypeOption: SelectValue[] = [];
    private provinceOption = provinceData;
    private cityOption: string[] = [];
    private areaOption: string[] = [];
    private province: string = '';
    private city: string = '';
    private area: string = '';
    private treeData: TableData[] = [{ id: '', label: '', description: '', children: [] }];
    private credentialType: SelectValue[] = [];
    private contractType: SelectValue[] = [];
    private birthOption: SelectValue[] = [{
        key: '全部',
        label: '全部',
    }, {
        key: '1',
        label: '一月',
    }, {
        key: '2',
        label: '二月',
    }, {
        key: '3',
        label: '三月',
    }, {
        key: '4',
        label: '四月',
    }, {
        key: '5',
        label: '五月',
    }, {
        key: '6',
        label: '六月',
    }, {
        key: '7',
        label: '七月',
    }, {
        key: '8',
        label: '八月',
    }, {
        key: '9',
        label: '九月',
    }, {
        key: '10',
        label: '十月',
    }, {
        key: '11',
        label: '十一月',
    }, {
        key: '12',
        label: '十二月',
    }];
    private employeeStatusCheckAll: boolean = false;
    private employeeTypeCheckAll: boolean = false;
    private employeeGenderCheckAll: boolean = false;
    private employeeMarryStatusCheckAll: boolean = false;
    private employeeStatusOptions = ['正式员工', '试用期员工', '离职员工'];
    private employeeTypeOptions: TypeOption[] = [];
    private employeeGenderOptions = [{
        label: '男',
        value: '1',
    }, {
        label: '女',
        value: '2',
    }];
    private employeeMarryStatusOptions = [{
        label: '未婚',
        value: '1',
    }, {
        label: '已婚',
        value: '2',
    }];
    private employeeStatusCheckedList = [];
    private employeeTypeCheckedList = [];
    private employeeGenderCheckedList = [];
    private employeeMarryStatusCheckedList = [];
    private form: any;
    private $form: any;
    private formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private formItemLayout2 = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    private isVisible: boolean = this.visible;
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    private created() {
        this.form = this.$form.createForm(this);
        this.provinceOption = _.fill(provinceData, '全部', 0, 1);
        this.province = '广东省';
        this.cityOption = cityData.广东省;
        this.cityOption = _.fill(this.cityOption, '全部', 0, 1);
        this.city = '全部';
        this.area = '全部';
        this.getBasicData();
        this.getOrganizationData();
    }
    private okHandle() {
        this.form.validateFields((err: any, values: any) => {
            const  param = new URLSearchParams();
            this.changeListDataToParams(param, values.employeeGenderCheckedList, 'FilterProperties.GenderValues');
            this.changeListDataToParams(param, values.employeeMarryStatusCheckedList, 'FilterProperties.MarriageStateValues');
            this.changeListDataToParams(param, values.highEducation, 'FilterProperties.HighestEducationIds');
            this.changeListDataToParams(param, values.workplace, 'FilterProperties.WorkingLocationIds');
            this.changeListDataToParams(param, values.employeeTypeCheckedList, 'FilterProperties.EmploymentTypeIds');
            this.changeListDataToParams(param, values.endJobType, 'FilterProperties.EndedJobTypeIds');
            this.changeBetweenDateToParams(param, values.employeeDate, 'FilterProperties.EmploymentStartedDateStartValue', 'FilterProperties.EmploymentStartedDateEndValue');
            this.changeBetweenDateToParams(param, values.endJobDate, 'FilterProperties.EmploymentEndedDateStartValue', 'FilterProperties.EmploymentEndedDateEndValue');
            this.changeBetweenDateToParams(param, values.birthRange, 'FilterProperties.DateOfBirthStartValue', 'FilterProperties.DateOfBirthEndValue');
            this.changeBetweenDateToParams(param, values.contractDate, 'FilterProperties.ContractIssueStartValue', 'FilterProperties.ContractIssueEndValue');
            this.changeBetweenDateToParams(param, values.credentialDate, 'FilterProperties.CredentialIssueStartValue', 'FilterProperties.CredentialIssueEndValue');
            this.changeDataToParamas(param, values.province, 'FilterProperties.ContactAddressProvinceOrState');
            this.changeDataToParamas(param, values.city, 'FilterProperties.ContactAddressCity');
            this.changeDataToParamas(param, values.area, 'FilterProperties.ContactAddressStreet');
            this.changeDataToParamas(param, values.birthMonth, 'FilterProperties.BirthMonth');
            this.changeDataToParamas(param, values.credentialType, 'FilterProperties.CredentialTypeId');
            this.changeDataToParamas(param, values.contractType, 'FilterProperties.ContractTypeId');
            this.$emit('searchData', param);
            console.log(param.toString());
        });
    }
    // 单独处理省市区
    private changeDataToParamas(params: URLSearchParams, data: string, paramName: string) {
        if (data && !_.isEqual(data, '全部')) {
            params.append(paramName, data);
        }
    }

    private changeListDataToParams(params: URLSearchParams, data: string[], paramName: string) {
        if ( data && data.length > 0) {
            data.filter((item: string) => {
                params.append(paramName, item);
            });
        }
    }
    private changeBetweenDateToParams(params: URLSearchParams, data: any, startDateParam: string, endDateParam: string) {
        if (data && data.length === 2) {
            params.append(startDateParam, moment(data[0]).format(this.dateFormat));
            params.append(endDateParam, moment(data[1]).format(this.dateFormat));
        }
    }

    private onEmployeeStatusCheckAllChange(e: any) {
        Object.assign(this, {
            employeeStatusCheckedList: e.target.checked ? this.employeeStatusOptions : [],
            employeeStatusCheckAll: e.target.checked,
        });
        this.form.setFieldsValue({
            employeeStatusCheckAll: e.target.checked,
            employeeStatusCheckedList: e.target.checked ? this.employeeStatusOptions : [],
        });
    }
    private onEmployeeStatusChange(checkedList: string[]) {
        this.employeeStatusCheckAll = checkedList.length === this.employeeStatusOptions.length;
        this.form.setFieldsValue({
            employeeStatusCheckAll: checkedList.length === this.employeeStatusOptions.length,
        });
    }
    private onEmployeeTypeCheckAllChange(e: any) {
        const newAllCheckOptions = _.map(this.employeeTypeOptions, 'value');
        Object.assign(this, {
            employeeTypeCheckedList: e.target.checked ? newAllCheckOptions : [],
            employeeTypeCheckAll: e.target.checked,
        });
        this.form.setFieldsValue({
            employeeTypeCheckAll: e.target.checked,
            employeeTypeCheckedList: e.target.checked ? newAllCheckOptions : [],
        });
    }
    private onEmployeeTypeChange(checkedList: string[]) {
        this.employeeTypeCheckAll = checkedList.length === this.employeeTypeOptions.length;
        this.form.setFieldsValue({
            employeeTypeCheckAll: this.employeeTypeCheckAll,
        });
    }
    private onEmployeeGenderCheckAllChange(e: any) {
        const newAllCheckOptions = _.map(this.employeeGenderOptions, 'value');
        Object.assign(this, {
            employeeGenderCheckedList: e.target.checked ? newAllCheckOptions : [],
            employeeGenderCheckAll: e.target.checked,
        });
        this.form.setFieldsValue({
            employeeGenderCheckedList: e.target.checked ? newAllCheckOptions : [],
        });
    }
    private onEmployeeGenderChange(checkedList: string[]) {
        this.employeeGenderCheckAll = checkedList.length === this.employeeGenderOptions.length;
        this.form.setFieldsValue({
            employeeGenderCheckAll: this.employeeGenderCheckAll,
        });
    }
    private onEmployeeMarryStatusCheckAllChange(e: any) {
        const newAllCheckOptions = _.map(this.employeeMarryStatusOptions, 'value');
        Object.assign(this, {
            employeeMarryStatusCheckedList: e.target.checked ? newAllCheckOptions : [],
            employeeMarryStatusCheckAll: e.target.checked,
        });
        this.form.setFieldsValue({
            employeeMarryStatusCheckedList: e.target.checked ? newAllCheckOptions : [],
        });
    }
    private onEmployeeMarryStatusChange(checkedList: string[]) {
        this.employeeMarryStatusCheckAll = checkedList.length === this.employeeMarryStatusOptions.length;
        this.form.setFieldsValue({
            employeeMarryStatusCheckedList: this.employeeMarryStatusCheckAll,
        });
    }
    private getOrganizationData() {
        getCompanyOrganizationChart().then((res: any) => {
            const data = res.data;
            const newData: TableData = {
                label: data.name,
                id: data.id,
                description: 'company',
                children: [],
            };
            if (data.subCompanies) {
                this.traverseStepNodeChild(data.subCompanies, newData, 'company');
            }
            if (res.departments) {
                this.traverseStepNodeChild(data.departments, newData, 'department');
            }
            this.treeData = _.castArray(newData);
        });
    }
    private traverseStepNodeChild(data: any, TopParentNode: any, descriptionName: string) {
        if (data) {
            const target = _.map(data, (item) => {
                let newTarget;
                if (_.isEqual(descriptionName, 'position')) {
                    newTarget = {
                        label: item.name,
                        id: item.id,
                        description: descriptionName,
                    };
                } else {
                    newTarget = {
                        label: item.name,
                        id: item.id,
                        description: descriptionName,
                        children: [],
                    };
                }
                if (item.subCompanies) {
                    this.traverseStepNodeChild(item.subCompanies, newTarget, 'company');
                }
                if (item.departments) {
                    this.traverseStepNodeChild(item.departments, newTarget, 'department');
                }
                if (item.subDepartments) {
                    this.traverseStepNodeChild(item.subDepartments, newTarget, 'department');
                }
                if (item.positions) {
                    this.traverseStepNodeChild(item.positions, newTarget, 'position');
                }
                return newTarget;
            });
            TopParentNode.children = _.concat(TopParentNode.children, target);
        }
    }
    private onAreaCityChange(value: string, fieldName: string) {
        switch (fieldName) {
            case 'province':
                if (_.isEqual(value, '全部')) {
                    this.city = '全部';
                    this.area = '全部';
                    this.cityOption = [];
                    this.areaOption = [];
                    break;
                }
                this.province = value;
                this.cityOption = cityData[value];
                this.areaOption = areaData[cityData[value][0]];
                this.cityOption = _.fill(this.cityOption, '全部', 0 , 1);
                this.areaOption = _.fill(this.areaOption, '全部', 0 , 1);
                this.city = '全部';
                this.area = '全部';
                this.form.setFieldsValue({
                    city: '全部',
                    area: '全部',
                });
                break;
            case 'city':
                if (_.isEqual(value, '全部')) {
                    this.area = '全部';
                    this.areaOption = [];
                    break;
                }
                this.city = value;
                this.areaOption = areaData[value];
                this.areaOption = _.fill(this.areaOption, '全部', 0 , 1);
                this.area = '全部';
                this.form.setFieldsValue({
                    area: '全部',
                });
                break;
            default:
                this.area = value;
                break;
        }
    }
    private getBasicData() {
        getWorkLocation().then((res) => {
            this.workplaceOption = this.transformSelectData(res.data);
            this.searchData.workplace = this.workplaceOption[0].key;
        });
        getCredentialTypeOption().then((res) => {
            this.credentialType = this.transformSelectData(res.data);
            this.credentialType = _.fill(this.credentialType, {key: '全部', label: '全部'}, 0 , 1);
            this.searchData.credentialType = this.credentialType[0].key;
        });
        getContractTypeOption().then((res) => {
            this.contractType = this.transformSelectData(res.data);
            this.contractType = _.fill(this.contractType, {key: '全部', label: '全部'}, 0 , 1);
            this.searchData.contractType = this.contractType[0].key;
        });
        getEducationLevelOption().then((res) => {
            this.highEducation = this.transformSelectData(res.data);
            this.searchData.highEducation = this.highEducation[0].key;
        });
        getEmployeeEndJonType().then((res) => {
            this.endJobType = this.transformSelectData(res.data);
            this.searchData.endJobType = this.endJobType[0].key;
        });
        // 获取工作性质
        getEmploymentTypeOption().then((res) => {
            this.employeeTypeOptions = this.transformTypeData(res.data);
        });
        // 获取地址类型
        getAddressTypeOption().then((res) => {
            this.addressTypeOption = this.transformSelectData(res.data);
        });
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
    }

    private transformTypeData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                value: item.id,
                label: item.name,
            };
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
}
</script>

