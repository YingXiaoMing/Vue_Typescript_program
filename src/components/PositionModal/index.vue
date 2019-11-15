<template>
    <a-modal :visible="isVisible" title="记录查询" @cancel="cancelHandle"
    :width="928" class="PositionModal" @ok="save">
        <template>
            <a-form :form="form5">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="员工工号" v-bind="formItemLayout">
                            <a-input disabled v-decorator="['num', {initialValue: formModal.num}]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="员工姓名" v-bind="formItemLayout">
                            <a-input disabled v-decorator="['name', {initialValue: formModal.name}]"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </template>
        <template v-if="type === 1">
            <a-divider>调职操作</a-divider>
            <a-form :form="form1">
              <a-row>
                <a-col :span="18">
                    <a-form-item label="原职位" v-bind="formItemLayout2">
                        <a-input disabled value="新感觉有限公司->乐从分公司->研发部->研发主管"></a-input>
                    </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                    <a-form-item label="调职类型" v-bind="formItemLayout">
                        <a-select>
                            <a-select-option value="平调"></a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="生效日期" v-bind="formItemLayout">
                        <a-date-picker v-decorator="['effectiveDate', {initialValue: momentDate(formData1.effectiveDate)}]"></a-date-picker>
                    </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="18">
                    <a-form-item label="新职位" v-bind="formItemLayout2">
                        <a-cascader :options="cascderOption"></a-cascader>
                    </a-form-item>
                </a-col>
              </a-row>
            </a-form>
        </template>
        <template v-else-if="type === 2">
            <a-divider>离职操作</a-divider>
            <a-form :form="form2">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="离职类型" v-bind="formItemLayout">
                            <a-select>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="生效日期" v-bind="formItemLayout">
                            <a-date-picker></a-date-picker>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                <a-col :span="18">
                    <a-form-item label="离职原因" v-bind="formItemLayout2">
                        <a-textarea></a-textarea>
                    </a-form-item>
                </a-col>
                </a-row>
            </a-form>
        </template>
        <template v-else-if="type === 3">
            <a-divider>撤职操作</a-divider>
            <a-form :form="form3">
                <a-row>
                    <a-row>
                        <a-col :span="18">
                            <a-form-item label="撤职职位" v-bind="formItemLayout2">
                                <a-select v-decorator="['positionId', {initialValue: formData3.selectOption.length > 0 ? formData3.selectOption[0].key: ''}]">
                                    <a-select-option v-for="(item, index) in formData3.selectOption"
                                    :key="index" :value="item.key">{{ item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="生效日期" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['effectiveDate', {initialValue: momentDate(formData3.effectiveDate)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                    </a-row>
                  
                </a-row>
                <a-row>
                  <a-col :span="18">
                      <a-form-item label="撤职原因" v-bind="formItemLayout2">
                          <a-textarea v-decorator="['reason', {initialValue: formData3.reason}]"></a-textarea>
                      </a-form-item>
                  </a-col>
                </a-row>
            </a-form>
        </template>
        <template v-else-if="type === 4">
            <a-divider>复职操作</a-divider>
            <a-form :form="form4">
              <a-row>
                <a-col :span="18">
                    <a-form-item label="复职职位" v-bind="formItemLayout2">
                        <a-select v-decorator="['reinstatedPositionId', {initialValue: formData4.selectOption.length > 0 ? formData4.selectOption[0].key: ''}]">
                                    <a-select-option v-for="(item, index) in formData4.selectOption"
                                    :key="index" :value="item.key">{{ item.label }}</a-select-option>
                                </a-select>
                    </a-form-item>
                </a-col>
             </a-row>
             <a-row>
               <a-col :span="12">
                    <a-form-item label="生效日期" v-bind="formItemLayout">
                        <a-date-picker v-decorator="['effectiveDate', {initialValue: momentDate(formData4.effectiveDate)}]"></a-date-picker>
                    </a-form-item>
                </a-col>
             </a-row>
             <a-row>
                <a-col :span="18">
                    <a-form-item label="复职原因" v-bind="formItemLayout2">
                        <a-textarea v-decorator="['reason', {initialValue: formData4.reason}]"></a-textarea>
                    </a-form-item>
                </a-col>
             </a-row>
            </a-form>
        </template>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import './index.less';
import _ from 'lodash';
import moment from 'moment';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { getEmployeePositionDismissedRecord, getEmployeePositionReinstatedRecord, updateEmployeePositionReinstatedRecord, getEmployeePositionTransferRecord } from '@/api/operation';
import { CascderOption, CascderOptionItem, PositionReinstatedRecordData, PositionDismissedRecordData, PositionTransferRecordData } from '@/interface';
import { getOrginzationData } from '@/api/basic';
import { Modal, Form, Row, Col, Input, Select, Divider, DatePicker, Cascader } from 'ant-design-vue';
interface FormData {
    name: string;
    num: string;
    id: string;
    effectiveDate: string;
    reason: string;
}
interface EmployeePositionReinstatedData {
    reinstatedPositionId: string;
    effectiveDate: string;
    reason: string;
}
@Component({
    components: {
        'a-modal': Modal,
        'a-form': Form,
        'a-col': Col,
        'a-row': Row,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-select': Select,
        'a-date-picker': DatePicker,
        'a-cascader': Cascader,
        'a-divider': Divider,
        'a-textarea': Input.TextArea,
        'a-select-option': Select.Option,
    },
})
export default class PositionModal extends Vue {
    @Prop({ default: false }) private visible!: boolean;
    @Prop({ default: 1 }) private type!: number;
    @Prop({ default: () => ({name: '', num: ''}) }) private formData!: FormData;
    private formModal: FormData = this.formData;
    private isVisible: boolean = this.visible;
    private formData4: PositionReinstatedRecordData = { id: '', effectiveDate: '2018-09-12', reason: '', employeeId: '', selectOption: [] };
    private formData3: PositionDismissedRecordData = { id: '', effectiveDate: '2018-09-12', reason: '', employeeId: '', selectOption: [] };
    private formData1: PositionTransferRecordData = {id: '', effectiveDate: '2018-09-12', employeeId: '', selectOption: []};
    private cascderOption: CascderOption[] = [];
    private form1: any;
    private form2: any;
    private form3: any;
    private form4: any;
    private form5: any;
    private $form: any;
    private dateForm: string = 'YYYY/MM/DD';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 4}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    @Watch('formData')
    private formDataChange(value: FormData) {
        switch (this.type) {
            case 1:
                this.formData1 = _.assign(this.formData1, value);
                getEmployeePositionTransferRecord(this.formData1.employeeId, this.formData1.id).then((res) => {
                    this.formData1.selectOption = this.transformPositionDataSelectData(res.data);
                });
                break;
            case 3: // 撤职
                this.formData3 = _.assign(this.formData3, value);
                getEmployeePositionDismissedRecord(this.formData3.employeeId, this.formData3.id).then((res) => {
                    this.formData3.selectOption =  this.transformPositionDataSelectData(res.data);
                });
                break;
            case 4: // 复职
                this.formData4 = _.assign(this.formData4, value);
                getEmployeePositionReinstatedRecord(this.formData4.employeeId, this.formData4.id).then((res) => {
                    this.formData4.selectOption = this.transformPositionDataSelectData(res.data);
                });
                break;
            default:
                break;
        }
        this.formModal.name = value.name;
        this.formModal.num = value.num;
    }
    @Watch('type')
    private typeChange(value: number) {
        this.type = value;
    }
    private transformPositionDataSelectData(data: any) {
        return _.map(data, (item: any) => {
            return {
                key: item.id,
                label: item.positionFullPath,
            };
        });
    }
    private save() {
        switch (this.type) {
            case 4:
                this.form4.validateFields((err: any, values: EmployeePositionReinstatedData) => {
                    if (!err) {
                        values.effectiveDate = moment(values.effectiveDate).format(this.dateForm);
                        updateEmployeePositionReinstatedRecord(this.formData4.employeeId, this.formData4.id, {
                            reinstatedPositionId: values.reinstatedPositionId,
                            effectiveDate: values.effectiveDate,
                            reason: values.reason,
                        }).then(() => {
                            this.isVisible = false;
                            this.$emit('loadTableData');
                        });
                    }
                });
                break;
            default:
                break;
        }
    }
    private momentDate(date: string) {
        return moment(date, this.dateForm);
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
    }
    private created() {
        this.form1 = this.$form.createForm(this);
        this.form2 = this.$form.createForm(this);
        this.form3 = this.$form.createForm(this);
        this.form4 = this.$form.createForm(this);
        this.form5 = this.$form.createForm(this);
        getOrginzationData().then((res: any) => {
            const Options: CascderOption[] = [];
            const TopParentNode: CascderOption = {
                value: res.id,
                label: res.name,
                companyId: res.id,
                description: 'company',
                children: [],
            };
            if (res.subCompanies) {
                this.traverseStepNodechilden(res.subCompanies, TopParentNode, 'company');
            }
            if (res.departments) {
                this.traverseStepNodechilden(res.departments, TopParentNode, 'department');
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

}
</script>

