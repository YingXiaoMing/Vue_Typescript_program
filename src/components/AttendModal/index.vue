<template>
    <a-modal :visible="isVisible" title="加班/请假/出差记录"
     :width="928" @ok="confirmHandle" @cancel="cancelHandle" class="attendModal">
            <template>
                <a-row>
                  <a-col :span="12">
                      <a-form-item label="员工工号" v-bind="formItemLayout">
                          <a-input disabled v-decorator="['num', {initialValue: formData.num}]"></a-input>
                      </a-form-item>
                  </a-col>
                  <a-col :span="12">
                      <a-form-item label="员工姓名" v-bind="formItemLayout">
                          <a-input disabled v-decorator="['name', {initialValue: formData.name}]"></a-input>
                      </a-form-item>
                  </a-col>
                </a-row>
            </template>
            <template v-if="type === 1">
                <a-form :form="form1">
                    <a-row>
                        <a-col :lg="12" :md="12" :sm="24">
                            <a-form-item label="请假类型" v-bind="formItemLayout">
                                <a-select v-decorator="['timeoffOvertimeBusinesstripTypeId', {initialValue: formData.timeoffOvertimeBusinesstripTypeId}]">
                                    <a-select-option v-for="item in leaveType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-divider>请假详情</a-divider>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="开始日期时间" v-bind="formItemLayout">
                                <a-date-picker  v-decorator="['startDateTime', {initialValue: momentDate(formData.startDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="结束日期时间" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['endedDateTime', {initialValue: momentDate(formData.endedDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="是否有薪" v-bind="formItemLayout">
                                <a-checkbox v-decorator="['isWithSalary', { valuePropName: 'checked', initialValue: formData.isWithSalary}]"></a-checkbox>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="可用有薪假" v-bind="formItemLayout">
                                <a-input addonAfter="小时" disabled></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="请假时长" v-bind="formItemLayout">
                                <a-input addonAfter="小时"  v-decorator="['totalHours', {initialValue: formData.totalHours}]"></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="marginTop: 10px">
                        <a-col :span="24">
                            <a-form-item label="备注" v-bind="formItemLayout2">
                                <a-textarea v-decorator="['note', {initialValue: formData.note}]"></a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </template>
            <template v-else-if="type === 2">
                <a-form :form="form2">
                    <a-row>
                        <a-col :lg="12" :md="12" :sm="24">
                            <a-form-item label="出差类型" v-bind="formItemLayout">
                                <a-select v-decorator="['timeoffOvertimeBusinesstripTypeId',  {initialValue: formData.timeoffOvertimeBusinesstripTypeId}]">
                                    <a-select-option v-for="item in businessType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-divider>出差详情</a-divider>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="是否有薪" v-bind="formItemLayout">
                                <a-checkbox v-decorator="['isWithSalary', { valuePropName: 'checked', initialValue: formData.isWithSalary}]"></a-checkbox>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="开始日期时间" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['startDateTime', {initialValue: momentDate(formData.startDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="结束日期时间" v-bind="formItemLayout">
                            <a-date-picker v-decorator="['endedDateTime', {initialValue: momentDate(formData.endedDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                    <a-col :span="12">
                        <a-form-item label="出差时长" v-bind="formItemLayout">
                            <a-input addonAfter="小时" v-decorator="['totalHours', {initialValue: formData.totalHours}]"></a-input>
                        </a-form-item>
                    </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="出差地点" v-bind="formItemLayout">
                                <a-input v-decorator="['businesstripLocaltion', {initialValue: formData.businesstripLocaltion}]"></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="marginTop: 6px">
                    <a-col :span="24">
                        <a-form-item label="出差事由" v-bind="formItemLayout2">
                            <a-textarea v-decorator="['reason', {initialValue: formData.reason}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                    </a-row>
                    <a-row style="marginTop: 6px">
                    <a-col :span="24">
                        <a-form-item label="备注" v-bind="formItemLayout2">
                            <a-textarea v-decorator="['note', {initialValue: formData.note}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                    </a-row>
                </a-form>
            </template>
            <template v-else-if="type === 3">
                <a-form :form="form3">
                    <a-row>
                        <a-col :lg="12" :md="12" :sm="24">
                            <a-form-item label="加班类型" v-bind="formItemLayout">
                                <a-select v-decorator="['timeoffOvertimeBusinesstripTypeId', {initialValue: formData.timeoffOvertimeBusinesstripTypeId}]">
                                    <a-select-option v-for="item in overtimeType" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-divider>加班详情</a-divider>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="是否有薪" v-bind="formItemLayout">
                                <a-checkbox v-decorator="['isWithSalary', { valuePropName: 'checked', initialValue: formData.isWithSalary}]"></a-checkbox>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label="开始日期时间" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['startDateTime', {initialValue: momentDate(formData.startDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="结束日期时间" v-bind="formItemLayout">
                            <a-date-picker v-decorator="['endedDateTime', {initialValue: momentDate(formData.endedDateTime)}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                    <a-col :span="12">
                        <a-form-item label="加班时长" v-bind="formItemLayout">
                            <a-input addonAfter="小时" v-decorator="['totalHours', {initialValue: formData.totalHours}]"></a-input>
                        </a-form-item>
                    </a-col>
                    </a-row>
                    <a-row style="marginTop: 6px">
                    <a-col :span="24">
                        <a-form-item label="加班事由" v-bind="formItemLayout2">
                            <a-textarea v-decorator="['reason', {initialValue: formData.reason}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                    </a-row>
                    <a-row style="marginTop: 6px">
                    <a-col :span="24">
                        <a-form-item label="备注" v-bind="formItemLayout2">
                            <a-textarea v-decorator="['note', {initialValue: formData.note}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                    </a-row>
                </a-form>
            </template>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Modal, Form, Select, Col, Row, Divider, DatePicker, Checkbox, Input } from 'ant-design-vue';
import { getOvertimeOptions, getLeaveOptions, getBusinessOptions } from '@/api/basic';
import { SelectValue, BasicData } from '@/interface';
import './index.less';
import _ from 'lodash';
import moment from 'moment';
import jsonpatch from 'fast-json-patch';
import { operateBusinessRecord } from '@/api/operation';
interface FormData {
    timeoffOvertimeBusinesstripTypeId: string;
    startDateTime: string;
    endedDateTime: string;
    isWithSalary: boolean;
    totalHours: string;
    businesstripLocaltion?: string;
    id?: string;
    employeeId?: string;
    reason?: string;
    note: string;
    name: string;
    num: string;
}
@Component({
    components: {
        'a-modal': Modal,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-col': Col,
        'a-row': Row,
        'a-divider': Divider,
        'a-date-picker': DatePicker,
        'a-checkbox': Checkbox,
        'a-input': Input,
        'a-textarea': Input.TextArea,
    },
})
export default class AttendModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    @Prop({ default: 1}) private type!: number;
    @Prop({ default: () => ({timeoffOvertimeBusinesstripTypeId: '', startDateTime: '', endedDateTime: '',
     isWithSalary: false, totalHours: '', id: '', employeeId: '', note: '', name: '', num: '' })}) private formData!: FormData;
    private isVisible: boolean = this.visible;
    private overtimeType: SelectValue[] = [];
    private businessType: SelectValue[] = [];
    private leaveType: SelectValue[] = [];
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 3}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private form1: any;
    private form2: any;
    private form3: any;
    private $form: any;
    private dateForm: string = 'YYYY/MM/DD';
    private confirmHandle() {
        this.isVisible = false;
        switch (this.type) {
            case 1:
                this.handleLeaveValues();
                break;
            case 2:
                this.handleBusinessValues();
                break;
            case 3:
                this.handleOvertimeValues();
                break;
            default:
                break;
        }
        this.resetFormModal();
    }
    private handleOvertimeValues() {
        this.form3.validateFields((err: any, values: FormData) => {
            if (!err) {
                const employeeId = this.formData.employeeId;
                const id = this.formData.id;
                this.formData.startDateTime = moment(this.formData.startDateTime).format(this.dateForm);
                this.formData.endedDateTime = moment(this.formData.endedDateTime).format(this.dateForm);
                values.startDateTime = moment(values.startDateTime).format(this.dateForm);
                values.endedDateTime = moment(values.endedDateTime).format(this.dateForm);
                const compareTarget = _.omit(this.formData, ['id', 'employeeId', 'businesstripLocaltion']);
                const puma = this.compareNewAndOldValue(values, compareTarget);
                if (employeeId && id) {
                    operateBusinessRecord(employeeId, id, puma).then((res) => {
                        this.$emit('refreshTableData');
                    });
                }
            }
        })
    }
    private handleBusinessValues() {
        this.form2.validateFields((err: any, values: FormData) => {
             if (!err) {
                 const employeeId = this.formData.employeeId;
                 const id = this.formData.id;
                 this.formData.startDateTime = moment(this.formData.startDateTime).format(this.dateForm);
                 this.formData.endedDateTime = moment(this.formData.endedDateTime).format(this.dateForm);
                 values.startDateTime = moment(values.startDateTime).format(this.dateForm);
                 values.endedDateTime = moment(values.endedDateTime).format(this.dateForm);
                 const compareTarget = _.omit(this.formData, ['id', 'employeeId']);
                 const puma = this.compareNewAndOldValue(values, compareTarget);
                 if (employeeId && id) {
                        operateBusinessRecord(employeeId, id, puma).then((res) => {
                            this.$emit('refreshTableData');
                        });
                 }
             }
        });
    }
    private handleLeaveValues() {
        this.form1.validateFields((err: any, values: FormData) => {
            if (!err) {
                const employeeId = this.formData.employeeId;
                const id = this.formData.id;
                this.formData.startDateTime = moment(this.formData.startDateTime).format(this.dateForm);
                this.formData.endedDateTime = moment(this.formData.endedDateTime).format(this.dateForm);
                values.startDateTime = moment(values.startDateTime).format(this.dateForm);
                values.endedDateTime = moment(values.endedDateTime).format(this.dateForm);
                const compareTarget = _.omit(this.formData, ['id', 'employeeId', 'reason', 'businesstripLocaltion']);
                const puma = this.compareNewAndOldValue(values, compareTarget);
                if (employeeId && id) {
                    operateBusinessRecord(employeeId, id, puma).then((res) => {
                        this.$emit('refreshTableData');
                    });
                }
            }
        });
    }
    private compareNewAndOldValue(newValue: FormData, oldValue: FormData) {
        const diff = jsonpatch.compare(oldValue, newValue);
        return diff;
    }
    private momentDate(date: string) {
        return moment(date, this.dateForm);
    }
    private cancelHandle() {
        this.isVisible = false;
        this.$emit('cancel');
        this.resetFormModal();
    }
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    @Watch('formData')
    private formDataChange(value: FormData) {
        this.formData = value;
    }
    @Watch('type')
    private typeChange(value: number) {
        this.type = value;
    }
    private resetFormModal() {
        this.form1.resetFields();
        this.form2.resetFields();
        this.form3.resetFields();
    }
    private created() {
        this.form1 = this.$form.createForm(this);
        this.form2 = this.$form.createForm(this);
        this.form3 = this.$form.createForm(this);
        getOvertimeOptions().then((res: any) => {
            this.overtimeType = this.transformSelectData(res);
        });
        getLeaveOptions().then((res: any) => {
            this.leaveType = this.transformSelectData(res);
        });
        getBusinessOptions().then((res: any) => {
            this.businessType = this.transformSelectData(res);
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
