import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Input, Row, Divider, Col, DatePicker, Select, Radio, Tag, Upload, Button, message, Spin } from 'ant-design-vue';
import './step1.less';
import { FormItem, BasicData, SelectValue, FormBasicData, LegalTableItem,
    ContactAddressItem, PhoneNumItem, EmergencyContactItem, PositionItem,
    ContactAddressForm, PhoneNumberForm, LegalIdForm, NewBasicForm,
    LegalTableData, AddressTableData, EmergencyContractTableData, PhoneNumTableData,
    RemoteLegalTableData, RemotePhoneNumTableData, RemoteAddressTableData, RemoteEmergencyContractTableData, RemotePositionsTableData,
    PositionsTableData, RemoteBasicData } from '@/interface';
import ProbationForm from '@/components/ProbationForm';
import LegalTable from '@/components/Step1/LegalTable.vue';
import PhoneTable from '@/components/Step1/PhoneTable.vue';
import AddressTable from '@/components/Step1/AddressTable.vue';
import ContactTable from '@/components/Step1/ContactTable.vue';
import PositionTable from '@/components/Step1/PositionTable.vue';
import { getWorkLocation, getEmploymentSource, getEmploymentTypeOption,
    getEducationLevelOption, getethnicGroupOption, getLegalIdentiticationTypeOption,
    getPhoneTypeOption, getAddressTypeOption, getRelationship, getBasicInfoAllOption } from '@/api/basic';
import { uploadAvatar } from '@/api/upload';
import { newEmployeeBasicData, getEmployeeBasicData, putEmployeeBasicData } from '@/api/staff';
import _ from 'lodash';
import moment from 'moment';
import jsonpatch from 'fast-json-patch';
import config from '@/utils/config';

interface BasicForm {
    num: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    birthOfDate: string | null;
    isMarried: number;
    highEducation: {
        key: string;
        label: string;
    };
    gender: number;
    employeeDate: string | null;
    employeeOrigin: {
        key: string;
        label: string;
    };
    employeeIntroducer: string;
    workplace: {
        key: string;
        label: string;
    };
    workNature: {
        key: string;
        label: string;
    };
    ethnicGroupId: {
        key: string;
        label: string;
    };
    employeeStatus: string;
    personalAbilityDescription: string;
    dueDate: {
        check: boolean;
        date: any;
    };
}
@Component({
    components: {
        'a-from': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-row': Row,
        'a-col': Col,
        'a-divider': Divider,
        'a-date': DatePicker,
        'a-select': Select,
        'a-option': Select.Option,
        'a-raido-group': Radio.Group,
        'a-radio': Radio,
        'a-tag': Tag,
        'a-textarea': Input.TextArea,
        'a-upload': Upload,
        'a-button': Button,
        'a-legal-table' : LegalTable,
        'a-phone-table': PhoneTable,
        'a-address-table': AddressTable,
        'a-contact-table' : ContactTable,
        'a-position-table': PositionTable,
        'a-spin': Spin,
    },
    props: {
        Form,
    },
})
class Step1 extends Vue {
    private fileList: any[] = [];
    private dateFormat = 'YYYY-MM-DD';
    private loading: boolean = false;
    private isuploadImg: boolean = false;
    private LeagalTableLoading: boolean = false;
    private phoneTableLoading: boolean = false;
    private addressTableLoading: boolean = false;
    private contractTableLoading: boolean = false;
    private positionTableLoading: boolean = false;
    private portraitImageLoading: boolean = false;
    private imageUrl: string = 'https://pictrue-1256199976.cos.ap-guangzhou.myqcloud.com/u929.jpg';
    private basicItemLayout = {
        lg: {span: 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private basicData: NewBasicForm = {
        id: '',
        first_name: '',
        last_name: '',
        nick_name: '',
        birthOfDate: null,
        isMarried: 1,
        highEducation: {
            key: '',
            label: '',
        },
        gender: 1,
        employeeDate: null,
        employeeOrigin: {
            key: '',
            label: '',
        },
        employeeIntroducer: '',
        workplace: {
            key: '',
            label: '',
        },
        workNature: {
            key: '',
            label: '',
        },
        ethnicGroupId: {
            key: '',
            label: '',
        },
        personalAbilityDescription: '',
        dueDate: {
            check: true,
            date: moment().add({ month: 3 }).format(this.dateFormat),
        },
    };
    private fromItemLayout = {
        labelCol:  { span: 8},
        wrapperCol: { span: 16 },
    };
    private marryStateOption = [{
        key: 1,
        label: '已婚',
    }, {
        key: 2,
        label: '未婚',
    }];
    private genderOption = [{
        key: 1,
        label: '男',
    }, {
        key: 2,
        label: '女',
    }];
    private Form: any;
    private workpalceOption: SelectValue[] = [];
    private highEducationOption: SelectValue[] = [];
    private employeeOriginOption: SelectValue[] = [];
    private employeeTypeOption: SelectValue[] = [];
    private ethnicGroupOption: SelectValue[] = [];
    private LegalTypeOption: SelectValue[] = [];
    private phoneTypeOption: SelectValue[] = [];
    private AddressTypeOption: SelectValue[] = [];
    private relationshipTypeOption: SelectValue[] = [];
    private LegalIdTableData: LegalTableData[] = [];
    private phoneNumTableData: PhoneNumTableData[] = [];
    private addressTableData: AddressTableData[] = [];
    private contractTableData: EmergencyContractTableData[] = [];
    private positionTableData: PositionsTableData[] = [];
    private basicFormItem: FormItem[] = [{
        type: 'input',
        label: '员工工号',
        key: 'num',
    }, {
        type: 'input',
        label: '员工(姓)',
        key: 'first_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }, {
        type: 'input',
        label: '员工(名)',
        key: 'last_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }, {
        type: 'input',
        label: '英文名',
        key: 'nick_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }];
    private $store: any;
    private employeeId: string = '';
    private isNew: boolean = true;
    @Emit()
    private created() {
        const { employeeId, employeeStatus } = this.$store.state.step;
        this.employeeId = employeeId;
        switch (employeeStatus) {
            case 1:
                this.isNew = true;
                this.fetchData(() => {
                    // 处理身份证件资料
                    this.LegalIdTableData = [{
                        legalType: this.LegalTypeOption[0],
                        legalNum: '440681199502165623',
                        issueDate: '1995-02-13',
                        expireDate: '2019-04-01',
                        editable: true,
                        isNew: true,
                        key: '1',
                    }];
                    // 处理证件资料
                    this.phoneNumTableData = [{
                        phoneType: this.phoneTypeOption[0],
                        phoneNum: '13129218652',
                        isRequired: 'true',
                        editable: true,
                        key: '1',
                        isNew: true,
                    }];
                    // 处理地址资料
                    this.addressTableData = [{
                        addressType: this.AddressTypeOption[0],
                        province: '广东省',
                        area: '顺德区',
                        city: '佛山市',
                        address: '北滘',
                        key: '1',
                        editable: true,
                        isNew: true,
                    }];
                    // 处理紧急联系人资料
                    this.contractTableData = [{
                        name: '小茗',
                        tel1: '15915211411',
                        tel2: '13129256852',
                        remark: '家庭电话',
                        key: '1',
                        editable: true,
                        relationship: this.relationshipTypeOption[0],
                        isNew: true,
                    }];
                    // 职位信息
                    this.positionTableData = [{
                        position: '',
                        mainPosition: true,
                        editable: true,
                        key: '1',
                        isNew: true,
                        selectOption: [],
                        positionId: '',
                    }];
                });
                break;
            default:
                this.isNew = false;
                this.loading = true;
                this.LeagalTableLoading = true;
                this.phoneTableLoading = true;
                this.positionTableLoading = true;
                this.addressTableLoading = true;
                this.contractTableLoading = true;
                this.fetchData(() => {
                    this.remoteEmployeeBasicData();
                });
                break;
        }
    }
    private remoteEmployeeBasicData() {
        getEmployeeBasicData(this.employeeId).then((response: any) => {
            const res: RemoteBasicData = response;
            // 员工基本资料
            const targetEmployeeOrigin = _.find(this.employeeOriginOption, {key:  res.employmentStartedInfo.employmentSourceId});
            const targetEmployeeWorkplace = _.find(this.workpalceOption, {key:  res.workingLocationId});
            const targetWorkNature = _.find(this.employeeTypeOption, { key: res.employmentStartedInfo.employmentTypeId});
            const targetEthnicGroupId = _.find(this.ethnicGroupOption, { key: res.ethnicGroupId});
            const targetHightEducationId = _.find(this.highEducationOption, { key: res.highestEducationId});
            const basicData: NewBasicForm = {
                id: res.employeeStringID ? res.employeeStringID : '',
                first_name: res.firstName,
                last_name: res.lastName,
                nick_name: res.nickName,
                birthOfDate: moment(res.dateOfBirth).format(this.dateFormat),
                isMarried: res.marriageStateValue,
                highEducation: targetHightEducationId ? targetHightEducationId : {key: '', label: ''},
                gender: res.genderValue,
                employeeDate: moment(res.employmentStartedInfo.employmentStartedDate).format(this.dateFormat),
                employeeOrigin: targetEmployeeOrigin ? targetEmployeeOrigin : {key: '', label: ''},
                employeeIntroducer: res.employmentStartedInfo.referencePerson,
                workplace: targetEmployeeWorkplace ? targetEmployeeWorkplace : {key: '', label: ''},
                workNature: targetWorkNature ? targetWorkNature : {key: '', label: ''},
                ethnicGroupId: targetEthnicGroupId ? targetEthnicGroupId : {key: '', label : ''},
                personalAbilityDescription: res.personalAbilityDescription,
                dueDate: {
                    check: res.employmentProbrationInfo.probrationEndedDate ? true : false,
                    date : res.employmentProbrationInfo.probrationEndedDate ? moment(res.employmentProbrationInfo.probrationEndedDate).format(this.dateFormat) : null,
                },
            };
            this.basicData = basicData;
            this.loading = false;
            const newLegalData: RemoteLegalTableData[] = res.legal_Ids;
            this.LegalIdTableData = _.map((newLegalData), (item) => {
                const targetLegalType = _.find(this.LegalTypeOption, { key: item.typeId});
                return {
                    legalType: targetLegalType ? targetLegalType : {key: '', label: ''},
                    legalNum: item.idNumber,
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    expireDate: moment(item.expireDate).format(this.dateFormat),
                    editable: false,
                    isNew: false,
                    key: item.id,
                };
            });
            this.LegalIdTableData.push({
                legalType: this.LegalTypeOption[0],
                legalNum: '',
                issueDate: null,
                expireDate: null,
                editable: true,
                isNew: true,
                key: '1',
            });
            this.LeagalTableLoading = false;
            const newPhoneData: RemotePhoneNumTableData[] = res.phoneNumbers;
            this.phoneNumTableData = _.map((newPhoneData), (item) => {
                const targetLegalType = _.find(this.phoneTypeOption, { key: item.typeId});
                return {
                    phoneType: targetLegalType ? targetLegalType : {key: '', label: ''},
                    phoneNum: item.phoneNumber.number,
                    isRequired: item.isDefault ? 'true' : 'false',
                    editable: false,
                    key: item.id,
                    isNew: false,
                };
            });
            this.phoneNumTableData.push({
                phoneType: this.phoneTypeOption[0],
                phoneNum: '',
                isRequired: 'false',
                editable: true,
                key: '1',
                isNew: true,
            });
            this.phoneTableLoading = false;
            const newAddressData: RemoteAddressTableData[] = res.contactAddress;
            this.addressTableData = _.map((newAddressData), (item) => {
                const targetLegalType = _.find(this.AddressTypeOption, { key: item.typeId});
                return {
                    addressType: targetLegalType ? targetLegalType : {key: '', label: ''},
                    province: item.address.provinceOrState,
                    area: item.address.districtOrTown,
                    city: item.address.city,
                    address: item.address.street,
                    key: item.id,
                    editable: false,
                    isNew: false,
                };
            });
            this.addressTableData.push({
                addressType: this.AddressTypeOption[0],
                province: '',
                area: '',
                city: '',
                address: '',
                key: '1',
                editable: true,
                isNew: true,
            });
            this.addressTableLoading = false;
            const newEmergencyContractTableData: RemoteEmergencyContractTableData[] = res.emergencyContacts;
            this.contractTableData = _.map((newEmergencyContractTableData), (item) => {
                const targetLegalType = _.find(this.relationshipTypeOption, { key: item.relationshipId});
                return {
                    name: item.name,
                    tel1: item.phoneNumber1,
                    tel2: item.phoneNumber2,
                    remark: item.note,
                    key: item.id,
                    editable: false,
                    relationship: targetLegalType ? targetLegalType : {key: '', label: ''},
                    isNew: false,
                };
            });
            this.contractTableData.push({
                name: '',
                tel1: '',
                tel2: '',
                remark: '',
                key: '1',
                editable: true,
                relationship: this.relationshipTypeOption[0],
                isNew: true,
            });
            this.contractTableLoading = false;
            const newPositionTableData: RemotePositionsTableData[] = res.positions;
            const mainPositionId = res.principalPositionId;
            this.positionTableData = _.map((newPositionTableData), (item) => {
                return {
                    position: item.positionFullPath,
                    mainPosition: _.isEqual(item.id, mainPositionId),
                    editable: false,
                    key: item.id,
                    isNew: false,
                    selectOption: item.positionFullPathIds,
                    positionId: item.id,
                };
            });
            this.positionTableData.push({
                position: '',
                mainPosition: false,
                editable: true,
                key: '1',
                isNew: true,
                selectOption: [],
                positionId: '',
            });
            this.positionTableLoading = false;
            // 判断是否存在图片
            if (res.isHasPortrait) {
                this.imageUrl = config.baseUrl + '/employee/' + this.employeeId + '/PortraitImage';
            }
        });
    }
// tslint:disable-next-line: ban-types
    private fetchData(callback: any) {
        const p1 = new Promise((resolve, reject) => {
            getBasicInfoAllOption().then((response: any) => {
                this.highEducationOption = this.transformSelectData(response.educationLevels);
                this.workpalceOption = this.transformSelectData(response.workingLocations);
                this.employeeOriginOption = this.transformSelectData(response.employmentSources);
                this.employeeTypeOption = this.transformSelectData(response.employmentTypes);
                this.ethnicGroupOption = this.transformSelectData(response.ethnicGroups);
                this.LegalTypeOption = this.transformSelectData(response.legalIdentiticationTypes);
                this.phoneTypeOption = this.transformSelectData(response.employeePhoneTypes);
                this.AddressTypeOption = this.transformSelectData(response.addressTypes);
                this.relationshipTypeOption = this.transformSelectData(response.relationships);
                resolve();
            });
        });
        Promise.all([p1]).then((res) => {
            const { employeeStatus, basicData } = this.$store.state.step;
            switch (employeeStatus) {
                case 1:
                    this.basicData.workplace = this.workpalceOption[0];
                    this.basicData.employeeOrigin = this.employeeOriginOption[0];
                    this.basicData.workNature = this.employeeTypeOption[0];
                    this.basicData.highEducation = this.highEducationOption[0];
                    this.basicData.ethnicGroupId = this.ethnicGroupOption[0];
                    break;
                case 2:
                    this.basicData  = basicData;
                    break;
                default:
                    break;
            }
            callback();
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
    @Emit()
    private nextStep() {
        const { LegalList, phoneNumberList, contactAddressList,
            emergencyContactsList, positionList } = this.$store.state.step;
        this.Form.validateFields((err: any, values: BasicForm) => {
            if (!err) {
                const basicData: FormBasicData = this.convertFormData(values, LegalList, contactAddressList, phoneNumberList, emergencyContactsList, positionList);
                this.fillBasicData(values);
                const validated =  this.validateStepList();
                if (validated) {
                    newEmployeeBasicData(basicData).then((res: any) => {
                        const id = res.id;
                        this.basicData.id = res.id;
                        // 图片限制（如果有图片的话就上传）
                        if (this.fileList.length > 0) {
                            const formData = new FormData();
                            formData.append('files[]', this.fileList[0]);
                            uploadAvatar(id, formData);
                        }
                        this.$store.dispatch('ChangeEmployeeId', id);
                        this.$store.dispatch('GetBasicData', this.basicData);
                        this.$store.dispatch('changeEmployeeStatus', 2);
                        this.$emit('nextStep');
                    }).catch(() => {
                        message.error('新增失败');
                    });
                }
            }
        });
    }
    private validateStepList(): boolean {
        const { LegalList, phoneNumberList, contactAddressList,
            emergencyContactsList, positionList } = this.$store.state.step;
        if (LegalList.length === 0) {
            message.error('身份证件信息不能为空');
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
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        this.isPic(file);
        this.limitSize(file);
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
            this.portraitImageLoading = false;
            this.isuploadImg = true;
        });
    }
    // callback: (value: any) => void
    private getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    private fillBasicData(values: BasicForm) {
        this.basicData = {
            first_name: values.first_name,
            last_name: values.last_name,
            nick_name: values.nick_name,
            birthOfDate: values.birthOfDate === null ? null : moment(values.birthOfDate).format(this.dateFormat),
            isMarried: values.isMarried,
            highEducation: values.highEducation,
            gender: values.gender,
            employeeDate: values.employeeDate === null ? null : moment(values.employeeDate).format(this.dateFormat),
            employeeOrigin: values.employeeOrigin,
            employeeIntroducer: values.employeeIntroducer,
            workplace: values.workplace,
            workNature: values.workNature,
            ethnicGroupId: values.ethnicGroupId,
            personalAbilityDescription: values.personalAbilityDescription,
            id: values.num,
            dueDate: {
                check: values.dueDate.check,
                date: values.dueDate.date,
            },
        };
    }
// tslint:disable-next-line: no-shadowed-variable
    private convertFormData(values: BasicForm, legalTable: LegalTableItem[], ContactAddressTable: ContactAddressItem[], PhoneNumTable: PhoneNumItem[], EmergencyContactTable: EmergencyContactItem[], PositionTable: PositionItem[]): FormBasicData {
// tslint:disable-next-line: variable-name
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
                employmentTypeId: values.workNature.key,
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
    private saveData() {
        this.Form.validateFields((err: any, values: BasicForm) => {
            const diff = this.compareNewValueAndOldValue(values, this.basicData);
            putEmployeeBasicData(this.employeeId, diff).then((res) => {
                message.success('保存成功');
            }).catch(() => {
                message.error('保存失败');
            });
            if (this.isuploadImg) {
                const formData = new FormData();
                formData.append('files[]', this.fileList[0]);
                uploadAvatar(this.employeeId, formData);
            }
        });
    }
    private compareNewValueAndOldValue(newValue: NewBasicForm, oldValue: NewBasicForm) {
        const newValues = {
            firstName: newValue.first_name,
            lastName: newValue.last_name,
            nickName: newValue.nick_name,
            employmentProbrationInfo: {
                probrationEndedDate: newValue.dueDate.date ? moment(newValue.dueDate.date).format(this.dateFormat) : null,
            },
            dateOfBirth: newValue.birthOfDate ? moment(newValue.birthOfDate).format(this.dateFormat) : null,
            marriageStateValue: newValue.isMarried,
            genderValue: newValue.gender,
            ethnicGroupId: newValue.ethnicGroupId.key,
            personalAbilityDescription: newValue.personalAbilityDescription,
            workingLocationId: newValue.workplace.key,
            highestEducationId: newValue.highEducation.key,
            employmentStartedInfo: {
                employmentStartedDate: newValue.employeeDate ? moment(newValue.employeeDate).format(this.dateFormat) : null,
                employmentSourceId: newValue.employeeOrigin.key,
                referencePerson: newValue.employeeIntroducer,
                employmentTypeId: newValue.workNature.key,
            },
        };
        const oldValues = {
            firstName: oldValue.first_name,
            lastName: oldValue.last_name,
            nickName: oldValue.nick_name,
            employmentProbrationInfo: {
                probrationEndedDate: oldValue.dueDate.date ? moment(oldValue.dueDate.date).format(this.dateFormat) : null,
            },
            dateOfBirth: oldValue.birthOfDate ? moment(oldValue.birthOfDate).format(this.dateFormat) : null,
            marriageStateValue: oldValue.isMarried,
            genderValue: oldValue.gender,
            ethnicGroupId: oldValue.ethnicGroupId.key,
            personalAbilityDescription: oldValue.personalAbilityDescription,
            workingLocationId: oldValue.workplace.key,
            highestEducationId: oldValue.highEducation.key,
            employmentStartedInfo: {
                employmentStartedDate: oldValue.employeeDate ? moment(oldValue.employeeDate).format(this.dateFormat) : null,
                employmentSourceId: oldValue.employeeOrigin.key,
                referencePerson: oldValue.employeeIntroducer,
                employmentTypeId: oldValue.workNature.key,
            },
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const thiz = this;
        return (
            <div>
                <a-row gutter={24}>
                    <a-divider class='diliver_item'>基本资料</a-divider>
                    <a-col xl={20} lg={24} md={24} sm={24} xs={24} class='basicData'>
                        <a-spin spinning={this.loading}>
                        <a-row>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工工号'>
                                    {getFieldDecorator('num', {
                                        initialValue: this.basicData.id,
                                    })(<a-input disabled></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工(姓)'>
                                    {getFieldDecorator('last_name', {
                                        initialValue: this.basicData.last_name,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工(名)'>
                                    {getFieldDecorator('first_name', {
                                        initialValue: this.basicData.first_name,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='英文名'>
                                    {getFieldDecorator('nick_name', {
                                        initialValue: this.basicData.nick_name,
                                    })(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='出生日期'>
                                    {getFieldDecorator('birthOfDate', {
                                        initialValue: this.basicData.birthOfDate === null ? null : moment(this.basicData.birthOfDate, this.dateFormat),
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-date></a-date>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='婚否'>
                                    {getFieldDecorator('isMarried', {
                                        initialValue: this.basicData.isMarried,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select>
                                        {this.marryStateOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.key}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='最高学历'>
                                    {getFieldDecorator('highEducation', {
                                        initialValue: this.basicData.highEducation,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.highEducationOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.key}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='性别'>
                                    {getFieldDecorator('gender', {
                                        initialValue: this.basicData.gender,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-raido-group size='small'>{this.genderOption.map((
                                        item: any, index: number) => <a-radio
                                        key={index} value={item.key}>{item.label}</a-radio>)}</a-raido-group>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='入职日期'>
                                    {getFieldDecorator('employeeDate', {
                                        initialValue: this.basicData.employeeDate === null ? null : moment(this.basicData.employeeDate, this.dateFormat),
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-date></a-date>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='入职来源'>
                                    {getFieldDecorator('employeeOrigin', {
                                        initialValue: this.basicData.employeeOrigin,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.employeeOriginOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.key}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='介绍人'>
                                    {getFieldDecorator('employeeIntroducer', {
                                        initialValue: this.basicData.employeeIntroducer,
                                    })(<a-input
                                    placeholder='PG.Liang'></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='试用期'>
                                    {getFieldDecorator('dueDate', {
                                        initialValue: this.basicData.dueDate,
                                    })(<ProbationForm/>)}
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='工作地点'>
                                    {getFieldDecorator('workplace', {
                                        initialValue: this.basicData.workplace,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.workpalceOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.key}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='工作性质'>
                                    {getFieldDecorator('workNature', {
                                        initialValue: this.basicData.workNature,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.employeeTypeOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.key}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='民族'>
                                    {getFieldDecorator('ethnicGroupId', {
                                            initialValue: this.basicData.ethnicGroupId,
                                            rules: [{
                                                required: true,
                                                message: ' ',
                                            }],
                                        })(<a-select labelInValue>
                                            {this.ethnicGroupOption.map((item: any, index: number) => <a-option
                                            key={index} value={item.key}>{item.label}</a-option>)}
                                        </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='员工状态'>
                                    {getFieldDecorator('employeeStatus')(<a-tag color='#2db7f5'>正式员工</a-tag>)}
                                </a-form-item>
                            </a-col>
                            <a-col span={24}>
                                <a-form-item {...{props: {labelCol: {span: 2}, wrapperCol: {span: 22}}}} label='能力&特长'>
                                    {getFieldDecorator('personalAbilityDescription', {
                                        initialValue: this.basicData.personalAbilityDescription,
                                    })(<a-textarea rows={4}/>)}
                                </a-form-item>
                            </a-col>
                            {this.isNew ? null :
                            <a-col span={24} class='edit_save_btn'>
                                <a-form-item>
                                    <a-button type='primary' on-click={this.saveData}>保存</a-button>
                                </a-form-item>
                            </a-col>
                            }
                        </a-row>
                        </a-spin>
                        <a-row>
                            <a-divider class='diliver_item requiredLine'>身份证件信息</a-divider>
                            <a-legal-table options={this.LegalTypeOption} tabList={this.LegalIdTableData}
                            isNew={this.isNew} employeeId={this.employeeId} tloading={this.LeagalTableLoading}></a-legal-table>
                            <a-divider class='diliver_item requiredLine'>联系电话</a-divider>
                            <a-phone-table options={this.phoneTypeOption} tabList={this.phoneNumTableData}
                            isNew={this.isNew} employeeId={this.employeeId} tloading={this.LeagalTableLoading}></a-phone-table>
                            <a-divider class='diliver_item requiredLine'>联系地址</a-divider>
                            <a-address-table options={this.AddressTypeOption} tabList={this.addressTableData}
                            isNew={this.isNew} employeeId={this.employeeId} tloading={this.LeagalTableLoading}></a-address-table>
                            <a-divider class='diliver_item requiredLine'>紧急联系人资料</a-divider>
                            <a-contact-table options={this.relationshipTypeOption} tabList={this.contractTableData}
                            isNew={this.isNew} employeeId={this.employeeId} tloading={this.LeagalTableLoading}></a-contact-table>
                            <a-divider class='diliver_item requiredLine'>职位信息</a-divider>
                            <a-position-table tabList={this.positionTableData} isNew={this.isNew}
                            employeeId={this.employeeId} tloading={this.LeagalTableLoading}></a-position-table>
                        </a-row>
                    </a-col>
                    <a-col xl={4} lg={24} md={24} sm={24} xs={24}>
                        <a-upload name='avatar' showUploadList={false}
                        listType='picture-card' class='avatar-uploader' action=''
                        beforeUpload={this.beforeUpload} onChange={this.handleUploadChange}>
                            <div class='Avatar'>
                                <div class='container'>
                                    <img src={this.imageUrl}></img>
                                </div>
                                <span>点击图片更换</span>
                                <span>提示：上传的图片不能超过3M</span>
                            </div>
                        </a-upload>
                    </a-col>
                </a-row>
                <a-row class='bottom_button'><a-button type='primary' on-click={this.nextStep}>下一步</a-button></a-row>
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(Step1);
