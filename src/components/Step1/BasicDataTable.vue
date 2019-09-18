<template>
    <div>
        <a-row :gutter="24">
            <a-divider class='diliver_item'>基本资料</a-divider>
            <a-form :form="form">
                <a-col :xl="20" :lg="24" :md="24" :sm="24" :xs="24" class="basicData">
                    <a-row>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工工号">
                                <a-input v-decorator="['num', { initialValue: basicData.id }]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工(姓)">
                                <a-input v-decorator="['last_name', {rules: [{ required: true, message: ' ' }],initialValue: basicData.last_name }]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工(名)">
                                <a-input v-decorator="['first_name', {rules: [{ required: true, message: ' ' }, initialValue: basicData.first_name]}]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="英文名">
                                <a-input v-decorator="['nick_name', {initialValue: basicData.nick_name}]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="出生日期">
                                <a-date-picker :format="dateFormat" v-decorator="['birthOfDate',
                                {rules: [{ required: true, message: ' ' }],initialValue: basicData.birthOfDate ? momentFromDate(basicData.birthOfDate) : basicData.birthOfDate}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="婚否" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['isMarriedState', {rules: [{ required: true, message: ' ' }],initialValue: basicData. isMarried}]">
                                    <a-select-option v-for="item in marryStateOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="最高学历" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['highEducation', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-select-option v-for="item in highEducationOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="性别" v-bind="formItemLayout">
                                <a-radio-group size="small" v-decorator="['gender', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-radio v-for="item in genderOption" :value="item.key">{{item.label}}</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="入职日期" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['startedDate',
                                {rules: [{ required: true, message: ' ' }]}]" :format="dateFormat"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="入职来源" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employeeOrigin', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="介绍人" v-bind="formItemLayout">
                                <a-input v-decorator="['employeeIntroducer']"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="试用期" v-bind="formItemLayout">
                                <a-probation-form v-decorator="['dueDate', {initialValue: basicData.dueDate}]"></a-probation-form>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="工作地点" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['workplace', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="工作性质" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employeeType', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="民族" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['ethnicGroupId', {rules: [{ required: true, message: ' ' }]}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="员工状态" v-bind="formItemLayout">
                                <a-tag color="#2db7f5">正式员工</a-tag>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="能力&特长" v-bind="formTextareaItemLayout">
                                <a-textarea :rows="6"></a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :xl="4" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-upload name="avatar" :showUploadList="false" listType="picture-card" class="avatar-uploader">
                        <div class='Avatar'>
                            <div class='container'>
                                <img :src="imageUrl"/>
                            </div>
                            <span>点击图片更换</span>
                            <span>提示：上传的图片不能超过3M</span>
                        </div>
                    </a-upload>
                </a-col>
            </a-form>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import {  SelectValues, NewBasicForm, BasicDataOption } from '@/interface';
import moment from 'moment';
import ProbationForm from '@/components/ProbationForm/index.vue';
@Component({
    components: {
        'a-probation-form': ProbationForm,
    },
})
export default class BasicDataTable extends Vue {
    @Prop() private options!: BasicDataOption;
    @Prop() private basicDatas!: NewBasicForm;
    private form: any;
    private $form: any;
    private dateFormat = 'YYYY-MM-DD';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 8}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formTextareaItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 2}},
        wrapperCol: { xs: {span: 24}, sm: {span: 22}},
    };
    private imageUrl: string = 'https://pictrue-1256199976.cos.ap-guangzhou.myqcloud.com/u929.jpg';
    private marryStateOption: SelectValues[] = [{
        key: '1',
        label: '未婚',
    }, {
        key: '2',
        label: '已婚',
    }];
    private highEducationOption: SelectValues[] = this.options.highEducationOption;
    private employeeOriginOption: SelectValues[] = this.options.employeeOriginOption;
    private workpalceOption: SelectValues[] = this.options.workpalceOption;
    private employeeTypeOption: SelectValues[] = this.options.employeeTypeOption;
    private ethnicGroupOption: SelectValues[] = this.options.ethnicGroupOption;
    // tslint:disable-next-line:member-ordering
    private genderOption: SelectValues[] = [{
        key: '1',
        label: '男',
    }, {
        key: '2',
        label: '女',
    }];
    private basicData: NewBasicForm = this.basicDatas;
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Watch('options')
    private optionChange(value: BasicDataOption) {
        this.highEducationOption = value.highEducationOption;
        this.employeeTypeOption = value.employeeTypeOption;
        this.employeeOriginOption = value.employeeOriginOption;
        this.workpalceOption = value.workpalceOption;
        this.ethnicGroupOption = value.ethnicGroupOption;
    }
    @Watch('basicData')
    private basicDataChange(values: NewBasicForm) {
        this.basicData = values;
    }
    private created() {
        this.form = this.$form.createForm(this);
    }
}
</script>

