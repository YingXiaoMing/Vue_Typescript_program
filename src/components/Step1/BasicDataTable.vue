<template>
    <div>
        <a-row :gutter="24">
            <a-divider class='diliver_item'>基本资料</a-divider>
            <a-spin :spinning="tloading">
            <a-form :form="form">
                <a-col :xl="20" :lg="24" :md="24" :sm="24" :xs="24" class="basicData">
                    <a-row :gutter="24">
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工工号">
                                <a-input v-decorator="['num', { initialValue: basicData.id }]" disabled></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item v-bind="formItemLayout" label="员工(姓)">
                                <a-input v-decorator="['last_name', {initialValue: basicData.last_name, rules: [{ required: true, message: ' ' }] }]"></a-input>
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
                                    <a-select-option v-for="item in workpalceOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="工作性质" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employeeType', {rules: [{ required: true, message: ' ' }], initialValue: basicData.employeeType}]">
                                    <a-select-option v-for="item in employeeTypeOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="民族" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['ethnicGroupId', {rules: [{ required: true, message: ' ' }], initialValue: basicData.ethnicGroupId}]">
                                    <a-select-option v-for="item in ethnicGroupOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="12" :sm="24">
                            <a-form-item label="员工状态" v-bind="formItemLayout">
                                <a-select labelInValue v-decorator="['employmentStateId', {rules: [{ required: true, message: ' ' }], initialValue: basicData.employeeStatus}]">
                                    <a-select-option v-for="item in employeeStatusOption" :value="item.key">{{item.label}}</a-select-option>
                                </a-select>
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
                    listType="picture-card" class="avatar-uploader" action=''
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
    private canUploadImg: boolean = false;
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
    private employeeStatusOption: SelectValues[] = this.options.employeeStatusOption;
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
        this.canUploadImg = this.isPic(file) && this.limitSize(file) ? true : false;
        return false;
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
        const { employeeStatus } = this.$store.state.step;
        switch (employeeStatus) {
            case 1:
                this.getBase64(info.file, (imageUrl: any) => {
                    this.imageUrl = imageUrl;
                    this.isuploadImg = true;
                });
                break;
            default:
                if (this.canUploadImg) {
                    const formData = new FormData();
                    formData.append('files[]', info.file);
                    uploadAvatar(this.employeeId, formData).then((res) => {
                        this.getBase64(info.file, (imageUrl: any) => {
                            this.imageUrl = imageUrl;
                            this.isuploadImg = true;
                        });
                    });
                }
                break;
        }
    }
    private getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    private newBasicEmployeeData() {
        this.form.validateFields((err: any, values: BasicForm) => {
            if (moment(values.birthOfDate).isAfter(moment().format(this.dateFormat))) {
                message.error('请检查出生日期，出生日期不能大于当前日期');
                return;
            }
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
                        this.$store.dispatch('ChangeNewEmployeeId', id);
                        this.$store.dispatch('changeEmployeeStatus', 2);
                        this.$store.dispatch('changeNewEmployeeStatus', 2);
                        this.$emit('nextStep');
                    });
                }
            } else {
                const errList = _.keys(err);
                const validateData = {
                    birthOfDate: '出生日期',
                    employeeDate: '入职日期',
                    first_name: '员工(姓)',
                    last_name: '员工(名)',
                };
                const newList = _.map(errList, (o: any) => {
                    return _.get(validateData, o);
                });
                const errMsg = _.join(newList, ',');
                message.error('基本资料不完整，请检查:' + errMsg);
            }
        });
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
    private created() {
        this.form = this.$form.createForm(this);
    }
    private convertFormData(values: BasicForm, legalTable: LegalTableItem[], ContactAddressTable: ContactAddressItem[], PhoneNumTable: PhoneNumItem[], EmergencyContactTable: EmergencyContactItem[], PositionTable: PositionItem[]): FormBasicData {
        const legalIds: LegalIdForm[] = _.map(legalTable, (item: LegalTableItem) => {
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
            employmentStateId: values.employmentStateId.key,
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
            legal_Ids: legalIds,
        };
        return formData;
    }

    private saveEditData() {
        this.form.validateFields((err: any, values: any) => {
            if (moment(values.birthOfDate).isAfter(moment().format(this.dateFormat))) {
                message.error('请检查出生日期，出生日期不能大于当前日期');
                return;
            }
            values.birthOfDate = this.momentDate(values.birthOfDate);
            values.employeeDate = this.momentDate(values.employeeDate);
            const diff = this.compareNewValueAndOldValue(values, this.basicDatas);
            putEmployeeBasicData(this.employeeId, diff, {
                'If-Match': this.ETag,
            }).then((res) => {
                message.success('更新成功');
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
        const compareValues: any =  {
            firstName: value.first_name,
            lastName: value.last_name,
            nickName: value.nick_name,
            dateOfBirth: value.birthOfDate ? moment(value.birthOfDate).format(this.dateFormat) : null,
            marriageStateValue: value.isMarried,
            genderValue: value.gender,
            employmentStateId: value.employmentStateId.key,
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
        if (value.dueDate.check) {
            compareValues.employmentProbrationInfo = {
                probrationEndedDate: value.dueDate.date,
            };
        }
        return compareValues;
    }
    private momentDate(date: any) {
        if (!date) { return null; }
        return moment(date, this.dateFormat);
    }

    @Watch('options')
    private optionChange(value: BasicDataOption) {
        this.highEducationOption = value.highEducationOption;
        this.employeeTypeOption = value.employeeTypeOption;
        this.employeeOriginOption = value.employeeOriginOption;
        this.workpalceOption = value.workpalceOption;
        this.ethnicGroupOption = value.ethnicGroupOption;
        this.employeeStatusOption = value.employeeStatusOption;
    }
    @Watch('basicDatas')
    private basicDataChange(values: NewBasicForm) {
        this.basicData = values;
        this.form.setFieldsValue({
            num: values.id,
            first_name: values.first_name,
            last_name: values.last_name,
            nick_name: values.nick_name,
            birthOfDate: values.birthOfDate ? moment(values.birthOfDate, this.dateFormat) : null,
            isMarried: values.isMarried,
            highEducation: values.highEducation,
            gender: values.gender,
            employeeDate: values.employeeDate ? moment(values.employeeDate, this.dateFormat) : null,
            employeeOrigin: values.employeeOrigin,
            employeeIntroducer: values.employeeIntroducer,
            workplace: values.workplace,
            employeeType: values.employeeType,
            ethnicGroupId: values.ethnicGroupId,
            personalAbilityDescription: values.personalAbilityDescription,
            dueDate: values.dueDate,
            employmentStateId: values.employmentStateId,
        });
        console.log('one for family');
        console.log(values.employmentStateId);
        this.imageUrl = values.imageUrl;
    }
}
</script>

