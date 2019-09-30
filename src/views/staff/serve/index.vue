<template>
    <div class="wrapper">
        <div class="staff-head">
            <a-row :gutter="24">
                <a-col  :lg="8" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入员工姓名或工号">
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
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
            <a-row :gutter="24">
              <a-col :lg="10" :md="12" :sm="24">
                  <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="现有职位">
                      <a-card :class="{ServeCard: OriginPostionOptions.length > 0}" style="width: 100%">
                          <p></p>
                          <p v-for="item in OriginPostionOptions">{{item.label}}</p>
                      </a-card>
                  </a-form-item>
              </a-col>
            </a-row>
            <a-form :form="form">
                <a-row>
                    <a-col :lg="10" :md="12" :sm="24">
                        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="任职职位">
                            <a-cascader :options="cascderOption" style="width:100%" v-decorator="['newPosition']"
                            :displayRender="({labels, selectedOptions}) => labels.join('->')"
                            @change="(value, selectOption) => onChange(value, selectOption)"></a-cascader>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="10" :md="12" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生效日期">
                        <a-date-picker v-decorator="['effectiveDate']"></a-date-picker>
                    </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :lg="20" :md="24" :sm="24">
                        <a-form-item :labelCol="labelCol2" :wrapperCol="wrapperCol2" label="任职原因">
                            <a-textarea v-decorator="['reason']" :rows="4"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-row class='bottom_button'>
                <a-button type="primary" @click="save">保存</a-button>
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
import { newEmployeePositionDelegated } from '@/api/operation';
import _ from 'lodash';
import './index.less';
import moment from 'moment';
import { SelectValue, CascderOption, CascderOptionItem } from '@/interface';
import { getOrginzationData } from '@/api/basic';
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
})
export default class Serve extends Vue {
    private dateForm = 'YYYY-MM-DD';
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
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
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
        this.fetch('');
        getOrginzationData().then((res: any) => {
            const data = res.data;
            const Options: CascderOption[] = [];
            const TopParentNode: CascderOption = {
                value: data.id,
                label: data.name,
                companyId: data.id,
                description: 'company',
                children: [],
            };
            if (data.subCompanies) {
                this.traverseStepNodechilden(data.subCompanies, TopParentNode, 'company');
            }
            if (data.departments) {
                this.traverseStepNodechilden(data.departments, TopParentNode, 'department');
            }
            Options.push(TopParentNode);
            this.cascderOption = Options;
        });
    }
    private traverseStepNodechilden(data: any, TopParentNode: CascderOption, descriptionName: string) {
        const thiz = this;
        if (data) {
            data.map((node: any, index: number) => {
                index ++;
                const childrenNode: CascderOption = {value: node.id, label: node.name, children: [], description: descriptionName, companyId: ''};
                if (_.isEqual(descriptionName, 'company')) {
                    childrenNode.companyId = node.id;
                } else if (_.isEqual(descriptionName, 'department')) {
                    childrenNode.companyId = node.companyId;
                }
                if (node.subCompanies) {
                    thiz.traverseStepNodechilden(node.subCompanies, childrenNode, 'company');
                }
                if (node.departments) {
                    thiz.traverseStepNodechilden(node.departments, childrenNode, 'department');
                }
                if (node.positions) {
                    // tslint:disable-next-line:no-shadowed-variable
                    node.positions.forEach((node: any, index: number) => {
                        index ++;
                        const object: CascderOptionItem = {
                            value: node.id,
                            label: node.name,
                            key: node.id,
                            departmentId: node.departmentId,
                            description:  'position',
                            companyId: TopParentNode.companyId,
                        };
                        if (childrenNode.children) {
                            childrenNode.children.push(object);
                        }
                    });
                }
                if (TopParentNode.children) {
                    TopParentNode.children.push(childrenNode);
                }
            });
        }
    }
    private save() {
        if (_.isEqual(this.employeeId, '')) {
            message.error('请指定某一个员工');
            return;
        }
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                newEmployeePositionDelegated(this.employeeId, {
                    companyId: this.companyId,
                    departmentId: this.departmentId,
                    positionId: this.positionId,
                    effectiveDate: moment(values.effectiveDate).format(this.dateForm),
                    reason: values.reason,
                }).then(() => {
                    this.form.resetFields();
                    this.searchEmployeePositionData(this.employeeId);
                    message.success('员工任职成功');
                });
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
            this.OriginPostionOptions = _.map(data.positions, (item: any) => {
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
}
</script>

