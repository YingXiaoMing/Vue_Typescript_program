<template>
    <div>
        <a-row :gutter="24">
            <a-divider class='diliver_item'>基本资料</a-divider>
            <a-spin :spinning="tloading">
            <a-form :form="form">
                <a-col :xl="20" :lg="24" :md="24" :sm="24" :xs="24" class="basicData">
                    <a-row>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工工号">
                                <a-input v-decorator="['num', { initialValue: basicData.id }]" disabled></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工(姓)">
                                <a-input v-decorator="['last_name', {rules: [{ required: true, message: ' ' }],initialValue: basicData.last_name }]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工(名)">
                                <a-input v-decorator="['first_name', {rules: [{ required: true, message: ' ' }], initialValue: basicData.first_name}]"></a-input>
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
                                {rules: [{ required: true, message: ' ' }], initialValue: basicData.birthOfDate ? momentFromDate(basicData.birthOfDate) : basicData.birthOfDate}]"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="婚否" v-bind="formItemLayout">
                                <a-select v-decorator="['isMarried', {rules: [{ required: true, message: ' ' }], initialValue: basicData.isMarried}]">
                                    <a-select-option v-for="item in marryStateOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="最高学历" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['highEducation', {rules: [{ required: true, message: ' ' }], initialValue: basicData.highEducation }]">
                                    <a-select-option v-for="item in highEducationOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="性别" v-bind="formItemLayout">
                                <a-radio-group size="small" v-decorator="['gender', {rules: [{ required: true, message: ' ' }], initialValue: basicData.gender}]">
                                    <a-radio v-for="item in genderOption" :value="item.key">{{item.label}}</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="入职日期" v-bind="formItemLayout">
                                <a-date-picker v-decorator="['employeeDate',
                                {rules: [{ required: true, message: ' ' }], initialValue: basicData.employeeDate ? momentFromDate(basicData.employeeDate) : basicData.employeeDate}]" :format="dateFormat"></a-date-picker>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="入职来源" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employeeOrigin', {rules: [{ required: true, message: ' ' }], initialValue: basicData.employeeOrigin}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="介绍人" v-bind="formItemLayout">
                                <a-input v-decorator="['employeeIntroducer', { initialValue: basicData.employeeIntroducer }]"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="试用期" v-bind="formItemLayout">
                                <a-probation-form v-decorator="['dueDate', {initialValue: basicData.dueDate}]"></a-probation-form>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="工作地点" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['workplace', {rules: [{ required: true, message: ' ' }], initialValue: basicData.workplace}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="工作性质" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employeeType', {rules: [{ required: true, message: ' ' }], initialValue: basicData.employeeType}]">
                                    <a-select-option v-for="item in employeeOriginOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="民族" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['ethnicGroupId', {rules: [{ required: true, message: ' ' }], initialValue: basicData.ethnicGroupId}]">
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
                                <a-textarea :rows="6" v-decorator="['personalAbilityDescription', { initialValue: basicData.personalAbilityDescription }]"></a-textarea>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :xl="4" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-upload name="avatar" :showUploadList="false" 
                    listType="picture-card" class="avatar-uploader"
                    :beforeUpload="beforeUpload" @change="handleUploadChange">
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
            </a-spin>
            <a-col :span="24" class='edit_save_btn' v-if="!isNew">
                <a-button type="primary" @click="saveEditData">保存</a-button>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import {  SelectValues, NewBasicForm, BasicDataOption, BasicForm,
 LegalTableItem, ContactAddressItem, PhoneNumItem, EmergencyContactItem, PositionItem,
  FormBasicData, LegalIdForm, ContactAddressForm, PhoneNumberForm  } from '@/interface';
import moment from 'moment';
import ProbationForm from '@/components/ProbationForm/index.vue';
import { message } from 'ant-design-vue';
import { newEmployeeBasicData, putEmployeeBasicData } from '@/api/staff';
import { uploadAvatar } from '@/api/upload';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';

@Component({
    components: {
        'a-probation-form': ProbationForm,
    },
})
export default class BasicDataTable extends Vue {
    @Prop() private options!: BasicDataOption;
    @Prop() private basicDatas!: NewBasicForm;
    @Prop({default : true}) private isNew!: boolean;
    @Prop({default: ''}) private ETag!: string;
    @Prop({default: ''}) private employeeId!: string;
    @Prop({default : false}) private tloading!: boolean;
    private fileList: any[] = [];
    private $store: any;
    private form: any;
    private $form: any;
    private dateFormat = 'YYYY-MM-DD';
    private isuploadImg: boolean = false;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 8}},
        wrapperCol: { xs: {span: 24}, sm: {span: 16}},
    };
    private formTextareaItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 2}},
        wrapperCol: { xs: {span: 24}, sm: {span: 22}},
    };
    private imageUrl: string = this.basicDatas.imageUrl;
    private marryStateOption = [{
        key: 1,
        label: '未婚',
    }, {
        key: 2,
        label: '已婚',
    }];
    private highEducationOption: SelectValues[] = this.options.highEducationOption;
    private employeeOriginOption: SelectValues[] = this.options.employeeOriginOption;
    private workpalceOption: SelectValues[] = this.options.workpalceOption;
    private employeeTypeOption: SelectValues[] = this.options.employeeTypeOption;
    private ethnicGroupOption: SelectValues[] = this.options.ethnicGroupOption;
    // tslint:disable-next-line:member-ordering
    private genderOption = [{
        key: 1,
        label: '男',
    }, {
        key: 2,
        label: '女',
    }];
    private basicData: NewBasicForm = this.basicDatas;
    private momentFromDate(date: string) {
        return moment(date, this.dateFormat);
    }
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return this.isPic(file) && this.limitSize(file);
    }
    private isPic(file: any): boolean {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isPic: boolean = isJPG || isPNG || isBMP;
        if (!isPic) {
            message.error('只能上传JPG/PNG/BMP文件！');
        }
        return isPic;
    }
    private limitSize(file: any): boolean {
        const isLimit3M: boolean = file.size / 1024 / 1024 < 3;
        if (!isLimit3M) {
            message.error('上传图片大小不能超过3M');
        }
        return isLimit3M;
    }
    private handleUploadChange(info: any) {
        this.getBase64(info.file.originFileObj, (imageUrl: any) => {
            this.imageUrl = imageUrl;
            this.isuploadImg = true;
        });
    }
    private getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    private newBasicEmployeeData() {
        this.form.validateFields((err: any, values: BasicForm) => {
            if (!err) {
                const { LegalList, phoneNumberList, contactAddressList,
                emergencyContactsList, positionList, employeeStatus} = this.$store.state.step;
                const validated = this.validateStepList();
                if (validated) {
                    const basicData: FormBasicData = this.convertFormData(values, LegalList, contactAddressList, phoneNumberList, emergencyContactsList, positionList);
                    newEmployeeBasicData(basicData).then((res: any) => {
                        const data = res.data;
                        const id = res.data.id;
                        if (this.fileList.length > 0) {
                            const formData = new FormData();
                            formData.append('files[]', this.fileList[0]);
                            uploadAvatar(id, formData);
                        }
                    });
                }
            }
        });
    }
    private transateEmployeeStatus(id: string) {
        this.basicData.id = id;
        this.$store.dispatch('ChangeEmployeeId', id);
        this.$store.dispatch('changeEmployeeStatus', 2);
        this.$emit('jump');
    }
    private validateStepList(): boolean {
        const { LegalList, phoneNumberList, contactAddressList,
            emergencyContactsList, positionList } = this.$store.state.step;
        if (LegalList.length === 0) {
            message.error('身份证件不能为空');
            return false;
        } else if (phoneNumberList.length === 0) {
            message.error('联系电话信息不能为空');
            return false;
        } else if (contactAddressList.length === 0) {
            message.error('联系地址信息不能为空');
            return false;
        } else if (emergencyContactsList.length === 0) {
            message.error('紧急联系人资料不能为空');
            return false;
        } else if (positionList.length === 0) {
            message.error('职位信息不能为空');
            return false;
        } else {
            return true;
        }
    }

    private convertFormData(values: BasicForm, legalTable: LegalTableItem[], ContactAddressTable: ContactAddressItem[], PhoneNumTable: PhoneNumItem[], EmergencyContactTable: EmergencyContactItem[], PositionTable: PositionItem[]): FormBasicData {
        const legal_Ids: LegalIdForm[] = _.map(legalTable, (item) => {
            return {
                typeId: item.legalType.key,
                idNumber: item.legalNum,
                issueDate: item.issueDate,
                expireDate: item.expireDate,
            };
        });
        const contactAddress: ContactAddressForm[] = _.map(ContactAddressTable, (item) => {
            return {
                typeId: item.addressType.key,
                address: {
                    provinceOrState: item.province,
                    city: item.city,
                    districtOrTown: item.area,
                    street: item.address,
                },
            };
        });
        const phoneNumbers: PhoneNumberForm[] = _.map(PhoneNumTable, (item) => {
            return {
                isDefault: JSON.parse(item.isRequired),
                typeId: item.phoneType.key,
                phoneNumber: {
                    number: item.phoneNum,
                },
            };
        });
        const emergencyContacts = _.map(EmergencyContactTable, (item) => {
            return {
                name: item.name,
                phoneNumber1: item.tel1,
                phoneNumber2: item.tel2,
                note: item.remark,
                relationshipId: item.relationship.key,
            };
        });
        let principalPositionId = '';
        const positionIds: string[] = _.map(PositionTable, (item) => {
            if (_.isEqual(item.mainPosition, true)) {
                principalPositionId = item.positionId;
            }
            return item.positionId;
        });
        const formData: FormBasicData = {
            firstName: values.first_name,
            lastName: values.last_name,
            nickName: values.nick_name,
            dateOfBirth: values.birthOfDate ? moment(values.birthOfDate).format(this.dateFormat) : null,
            marriageStateValue: values.isMarried,
            genderValue: values.gender,
            ethnicGroupId: values.ethnicGroupId.key,
            personalAbilityDescription: values.personalAbilityDescription,
            workingLocationId: values.workplace.key,
            employmentStartedInfo: {
                employmentStartedDate: values.employeeDate ? moment(values.employeeDate).format(this.dateFormat) : null,
                employmentSourceId: values.employeeOrigin.key,
                referencePerson: values.employeeIntroducer,
                employmentTypeId: values.employeeType.key,
            },
            highestEducationId: values.highEducation.key,
            employmentProbrationInfo: {
                probrationEndedDate: values.dueDate.check ? moment(values.dueDate.date).format(this.dateFormat) : null,
            },
            principalPositionId,
            contactAddress,
            phoneNumbers,
            emergencyContacts,
            positionIds,
            legal_Ids,
        };
        return formData;
    }


    private saveEditData() {
        this.form.validateFields((err: any, values: NewBasicForm) => {
            const diff = this.compareNewValueAndOldValue(values, this.basicDatas);
            putEmployeeBasicData(this.employeeId, diff, {
                'If-Match': this.ETag,
            }).then((res) => {
                if (this.isuploadImg) {
                    const formData = new FormData();
                    formData.append('files[]', this.fileList[0]);
                    uploadAvatar(this.employeeId, formData);
                }
                this.$emit('loadData');
            });
        });
    }

    private compareNewValueAndOldValue(newValue: NewBasicForm, oldValue: NewBasicForm) {
        const oldValues = this.transferComputedData(oldValue);
        const newValues = this.transferComputedData(newValue);
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }

    private transferComputedData(value: NewBasicForm) {
        return {
            firstName: value.first_name,
            lastName: value.last_name,
            nickName: value.nick_name,
            employmentProbrationInfo: {
                probrationEndedDate: value.dueDate.date ? moment(value.dueDate.date).format(this.dateFormat) : null,
            },
            dateOfBirth: value.birthOfDate ? moment(value.birthOfDate).format(this.dateFormat) : null,
            marriageStateValue: value.isMarried,
            genderValue: value.gender,
            ethnicGroupId: value.ethnicGroupId.key,
            personalAbilityDescription: value.personalAbilityDescription,
            workingLocationId: value.workplace.key,
            highestEducationId: value.highEducation.key,
            employmentStartedInfo: {
                employmentStartedDate: value.employeeDate ? moment(value.employeeDate).format(this.dateFormat) : null,
                employmentSourceId: value.employeeOrigin.key,
                referencePerson: value.employeeIntroducer,
                employmentTypeId: value.employeeType.key,
            },
        };
    }

    @Watch('options')
    private optionChange(value: BasicDataOption) {
        this.highEducationOption = value.highEducationOption;
        this.employeeTypeOption = value.employeeTypeOption;
        this.employeeOriginOption = value.employeeOriginOption;
        this.workpalceOption = value.workpalceOption;
        this.ethnicGroupOption = value.ethnicGroupOption;
    }
    @Watch('basicDatas')
    private basicDataChange(values: NewBasicForm) {
        this.basicData = values;
        this.imageUrl = values.imageUrl;
    }
    private created() {
        this.form = this.$form.createForm(this);
    }
}
</script>

