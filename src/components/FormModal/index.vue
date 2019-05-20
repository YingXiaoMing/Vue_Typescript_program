<template>
    <a-modal :visible="isVisible" @cancel="cancelHandle" okText="查询" width="920px">
        <a-form>
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item v-bind="formItemLayout" label="查询关键字">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="24" class="searchForm">
                    <a-col :span="12">
                        <fieldset>
                            <legend>基本信息条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="员工状态">
                                <a-checkbox-group v-decorator="['employeeStatus']">
                                    <a-checkbox value="正式员工">正式员工</a-checkbox>
                                    <a-checkbox value="试用期员工">试用期员工</a-checkbox>
                                    <a-checkbox value="离职员工">离职员工</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="工作性质">
                                <a-checkbox-group v-decorator="['employeeType']">
                                    <a-checkbox value="全职">全职</a-checkbox>
                                    <a-checkbox value="兼职">兼职</a-checkbox>
                                    <a-checkbox value="临时">临时</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="性别">
                                <a-radio-group v-decorator="['gender', {initialValue: '全部'}]">
                                    <a-radio value="全部">全部</a-radio>
                                    <a-radio value="男">男</a-radio>
                                    <a-radio value="女">女</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="婚否">
                                <a-radio-group v-decorator="['isMarried', {initialValue: '全部'}]">
                                    <a-radio value="全部">全部</a-radio>
                                    <a-radio value="未婚">未婚</a-radio>
                                    <a-radio value="已婚">已婚</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="学历">
                                <a-select  v-decorator="['highEducation']" v-model="searchData.highEducation">
                                  <a-select-option v-for="item in highEducation" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="工作地点">
                                <a-checkbox-group v-decorator="['workplace']">
                                    <a-checkbox v-for="item in workplaceOption" :value="item.key">{{item.label}}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="离职类型">
                                <a-select  v-decorator="['endJobType']" v-model="searchData.endJobType">
                                  <a-select-option v-for="item in endJobType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12">
                        <fieldset>
                            <legend>员工其它条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="所属省">
                                <a-select v-decorator="['province']" :value="province" @change="e => onAreaCityChange(e, 'province')">
                                  <a-select-option v-for="item in provinceOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="所属市">
                                <a-select v-decorator="['city']" :value="city" @change="e => onAreaCityChange(e, 'city')">
                                  <a-select-option v-for="item in cityOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="所属区">
                                <a-select v-decorator="['area']" :value="area" @change="e => onAreaCityChange(e, 'area')">
                                  <a-select-option v-for="item in areaOption" :value="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                        <fieldset class="department">
                            <legend>部门职位条件</legend>
                            <a-form-item v-bind="formItemLayout2" label="组织架构">
                                <a-tree-select treeCheckable :treeData="treeData" />
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12" style="marginTop: 10px">
                        <fieldset>
                            <legend>入职离职日期范围</legend>
                            <a-form-item v-bind="formItemLayout2" label="入职日期">
                                <a-range-picker v-decorator="['employeeDate']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="离职日期">
                                <a-range-picker v-decorator="['endJobDate']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="生日范围">
                                <a-range-picker v-decorator="['birthRange']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="生日月份">
                                <a-select v-decorator="['birthMonth']" v-model="searchData.birthMonth">
                                  <a-select-option v-for="item in birthOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </fieldset>
                    </a-col>
                    <a-col :span="12" style="marginTop: 10px">
                        <fieldset>
                            <legend>证书合同日期范围</legend>
                            <a-form-item v-bind="formItemLayout2" label="证书类型">
                                <a-select v-decorator="['credentialType']" v-model="searchData.credentialType">
                                  <a-select-option v-for="item in credentialType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="证书日期">
                                <a-range-picker v-decorator="['credentialDate']">
                                    <a-icon slot="suffixIcon" type="smile"></a-icon>
                                </a-range-picker>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="合同类型">
                                <a-select labelInValue v-decorator="['contractType']" v-model="searchData.contractType">
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
                </a-col>
            </a-row>
          
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Modal, Row, Col, Form, Input, Checkbox, Radio, Select, Calendar, DatePicker, Icon, TreeSelect } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import { getWorkLocation, getCredentialTypeOption, getContractTypeOption, getEducationLevelOption, getEmployeeEndJonType } from '@/api/basic';
import _ from 'lodash';
import provinceData from '@/utils/province';
import { getCompanyOrganizationChart } from '@/api/operation';
import './index.less';
import cityData from '@/utils/city';
import areaData from '@/utils/area';
interface Data {
    title: string;
    value: string;
    description: string;
    key: string;
}
interface TableData {
    title: string;
    value: string;
    description: string;
    key: string;
    children: Data[];
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
        'a-tree-select': TreeSelect,
    },
})
export default class FormModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
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
    private provinceOption = provinceData;
    private cityOption: string[] = [];
    private areaOption: string[] = [];
    private province: string = '';
    private city: string = '';
    private area: string = '';
    private treeData: TableData[] = [{ value: '', key: '', title: '', description: '', children: [] }];
    private credentialType: SelectValue[] = [];
    private contractType: SelectValue[] = [];
    private birthOption: SelectValue[] = [{
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
        this.getBasicData();
        this.getOrganizationData();
    }
    private getOrganizationData() {
        getCompanyOrganizationChart().then((res: any) => {
            const newData: TableData = {
                title: res.name,
                value: res.id,
                description: 'company',
                key: res.id,
                children: [],
            };
            if (res.subCompanies) {
                this.traverseStepNodeChild(res.subCompanies, newData, 'company');
            }
            if (res.departments) {
                this.traverseStepNodeChild(res.departments, newData, 'department');
            }
            this.treeData = _.castArray(newData);
        });
    }
    private traverseStepNodeChild(data: any, TopParentNode: any, descriptionName: string) {
        if (data) {
            const target = _.map(data, (item) => {
                const newTarget = {
                    title: item.name,
                    value: item.id,
                    key: item.id,
                    description: descriptionName,
                    children: [],
                };
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
                this.province = value;
                this.city = cityData[value][0];
                this.area = areaData[cityData[value][0]][0];
                this.cityOption = cityData[value];
                this.areaOption = areaData[cityData[value][0]];
                break;
            case 'city':
                this.city = value;
                this.area = areaData[value][0];
                this.areaOption = areaData[value];
            default:
                this.area = value;
                break;
        }
    }
    private getBasicData() {
        getWorkLocation().then((res) => {
            this.workplaceOption = this.transformSelectData(res);
            this.searchData.workplace = this.workplaceOption[0].key;
        });
        getCredentialTypeOption().then((res) => {
            this.credentialType = this.transformSelectData(res);
            this.searchData.credentialType = this.credentialType[0].key;
        });
        getContractTypeOption().then((res) => {
            this.contractType = this.transformSelectData(res);
            this.searchData.contractType = this.contractType[0].key;
        });
        getEducationLevelOption().then((res) => {
            this.highEducation = this.transformSelectData(res);
            this.searchData.highEducation = this.highEducation[0].key;
        });
        getEmployeeEndJonType().then((res) => {
            this.endJobType = this.transformSelectData(res);
            this.searchData.endJobType = this.endJobType[0].key;
        });
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
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

