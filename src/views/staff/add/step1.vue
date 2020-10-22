<template>
    <div>
        <a-row :gutter="24">
          <a-basic-table :options="baiscDataTypeOption" :basicDatas="basicData" ref="basciTable" 
          @jump="linkToStep2" :isNew="isNew" @loadData="remoteEmployeeBasicData" @nextStep="nextStep"
          :employeeId="employeeId" :tloading="basicTableLoading" :ETag="basicETag"></a-basic-table>   
          <a-divider class='diliver_item requiredLine'>身份证件信息</a-divider>
          <a-legal-table :options="LegalTypeOption" :tabList="LegalIdTableData"
            :isNew="isNew" :employeeId="employeeId" :tloading="LeagalTableLoading"
            :ETag="legalIdETag" @loadData="remoteEmployeeLegalData"></a-legal-table>
          <a-divider class='diliver_item requiredLine'>联系电话</a-divider>
          <a-phone-table :options="phoneTypeOption" :tabList="phoneTableData"
            :isNew="isNew" :employeeId="employeeId" :tloading="PhoneTableLoading"
            :ETag="phoneETag" @loadData="remoteEmployeePhoneData"></a-phone-table>
          <a-divider class='diliver_item requiredLine'>联系地址</a-divider>
          <a-address-table :options="AddressTypeOption" :tabList="addressTableData" @loadData="remoteEmployeeAddressData"
          :isNew="isNew" :employeeId="employeeId" :tloading="addressTableLoading" :ETag="addressETag"></a-address-table>
          <a-divider class='diliver_item requiredLine'>紧急联系人资料</a-divider>
          <a-contact-table :options="relationTypeOption" :tabList="EmergyContactTableData" @loadData="remoteEmployeeEmergyContractData"
          :isNew="isNew" :employeeId="employeeId" :tloading="EmergyContactLoading" :ETag="contactETag"></a-contact-table>
          <a-divider class='diliver_item requiredLine'>职位信息</a-divider>
          <a-position-table :tabList="positionTableData" @loadData="remoteEmployeePositionData"
          :isNew="isNew" :employeeId="employeeId" :tloading="PositionTableLoading" :ETag="positionETag"></a-position-table>
          <a-row class="bottom_button" v-if="employeeStatus !== 3">
            <a-button type="primary" @click="newEmployeeData">下一步</a-button>
          </a-row>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import BasicDataTable from '@/components/Step1/BasicDataTable.vue';
import LegalTable from '@/components/Step1/LegalTable.vue';
import AddressTable from '@/components/Step1/AddressTable.vue';
import ContactTable from '@/components/Step1/ContactTable.vue';
import PhoneTable from '@/components/Step1/PhoneTable.vue';
import PositionTable from '@/components/Step1/PositionTable.vue';
import { SelectValue, LegalTableData, BasicData, AddressTableData, EmergencyContractTableData, PhoneNumTableData, PositionsTableData, BasicDataOption, NewBasicForm } from '@/interface';
import { getEmployeeLegalData, getEmployeeContactAddressData, getEmployeeContractData, getEmployeePhoneData, getEmployeePositionData, getEmployeeBasicData } from '@/api/staff';
import { getBasicInfoAllOption } from '@/api/basic';
import moment from 'moment';
import _ from 'lodash';
import config from '@/utils/config';
import './step1.less';

@Component({
    components: {
        'a-legal-table': LegalTable,
        'a-address-table': AddressTable,
        'a-contact-table': ContactTable,
        'a-phone-table': PhoneTable,
        'a-position-table': PositionTable,
        'a-basic-table': BasicDataTable,
    },
})
export default class Step1 extends Vue {
    public $refs!: {
        basciTable: HTMLFormElement,
    };
    @Prop({default: ''}) private employeePropId!: string;
    private LegalTypeOption: SelectValue[] = [];
    private AddressTypeOption: SelectValue[] = [];
    private relationTypeOption: SelectValue[] = [];
    private employeeStatusOption: SelectValue[] = [];
    private phoneTypeOption: SelectValue[] = [];
    private baiscDataTypeOption: BasicDataOption = {
        highEducationOption: [],
        employeeOriginOption: [],
        workpalceOption: [],
        employeeTypeOption: [],
        ethnicGroupOption: [],
        employeeStatusOption: [],
    };
    private dateFormat = 'YYYY-MM-DD';
    private orginImageUrl: string = require('../../../assets/user.png');
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
        employmentStateId: {
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
        employeeType: {
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
        imageUrl: this.orginImageUrl,
    };
    private LegalIdTableData: LegalTableData[] = [];
    private addressTableData: AddressTableData[] = [];
    private phoneTableData: PhoneNumTableData[] = [];
    private EmergyContactTableData: EmergencyContractTableData[] = [];
    private positionTableData: PositionsTableData[] = [];
    private basicTableLoading: boolean = false;
    private LeagalTableLoading: boolean = false;
    private addressTableLoading: boolean = false;
    private EmergyContactLoading: boolean = false;
    private PhoneTableLoading: boolean = false;
    private PositionTableLoading: boolean = false;
    private employeeId: string = '';
    private employeeStatus: number = 1;
    private legalIdETag: string = '';
    private addressETag: string = '';
    private contactETag: string = '';
    private phoneETag: string = '';
    private $route: any;
    private positionETag: string = '';
    private basicETag: string = '';
    private isNew: boolean = true;
    private $store: any;
    private created() {
        const { employeeStatus, newEmployeeId } = this.$store.state.step;
        this.employeeStatus = employeeStatus;
        switch (employeeStatus) {
            case 1:
                this.isNew = true;
                this.fetchData(() => {
                    this.fullEmployeeTableData();
                });
                this.$store.dispatch('clearEmployeeDataList');
                break;
            case 2:
                this.employeeId = newEmployeeId;
                this.isNew = false;
                this.loadRemoteData();
                break;
            default:
                this.isNew = false;
                this.employeeId = this.employeePropId;
                this.loadRemoteData();
                break;
        }
    }
    @Watch('employeePropId')
    private employeeIdChange(value: string) {
        if (!_.isEmpty(value)) {
            this.employeeId = value;
            this.loadRemoteData();
        }
    }
    private activated() {
        if (!this.isNew) {
            this.loadRemoteData();
        }
    }
    private loadRemoteData() {
        this.fetchData(() => {
            this.remoteEmployeeBasicData();
            this.remoteEmployeeLegalData();
            this.remoteEmployeeAddressData();
            this.remoteEmployeeEmergyContractData();
            this.remoteEmployeePhoneData();
            this.remoteEmployeePositionData();
        });
    }
    // 新建员工
    private newEmployeeData() {
        if (_.isEqual(this.employeeStatus, 1)) {
            this.$refs.basciTable.newBasicEmployeeData();
        } else {
            this.nextStep();
        }
    }
    // 跳转到下一步
    private nextStep() {
        this.$store.dispatch('changeEmployeeStatus', 2);
        this.$emit('nextStep');
    }
    // 填入员工Table的数据
    private fullEmployeeTableData() {
        this.positionTableData = [{ position: '', mainPosition: true, editable: true, key: '1', isNew: true,  selectOption: [], positionId: ''}];
        this.phoneTableData = [{ phoneType: this.phoneTypeOption[0], phoneNum: '', isRequired: 'true', editable: true, key: '1', isNew: true }];
        this.addressTableData = [{addressType: this.AddressTypeOption[0], province: '', area: '', city: '', address: '', key: '1', editable: true, isNew: true}];
        this.EmergyContactTableData = [{name: '', tel1: '', tel2: '', remark: '', key: '1', editable: true, relationship: this.relationTypeOption[0], isNew: true }];
        this.LegalIdTableData = [{legalType: this.LegalTypeOption[0], legalNum: '', issueDate: '', expireDate: '', editable: true, isNew: true, disable: false, key: '1'}];
    }

    // 获取员工的基本资料
    private remoteEmployeeBasicData() {
        this.basicTableLoading = true;
        getEmployeeBasicData(this.employeeId).then((response: any) => {
            this.basicTableLoading = false;
            this.basicETag = response.headers.etag;
            const data = response.data;
            const targetEmployeeState = _.find(this.baiscDataTypeOption.employeeStatusOption, { key: data.employmentStateId });
            const targetEmployeeOrigin = _.find(this.baiscDataTypeOption.employeeOriginOption, { key: data.employmentStartedInfo.employmentSourceId });
            const targetEmployeeWorkplace = _.find(this.baiscDataTypeOption.workpalceOption, { key: data.workingLocationId });
            const targetEmployeeType = _.find(this.baiscDataTypeOption.employeeTypeOption, { key: data.employmentStartedInfo.employmentTypeId});
            const targetEthnicGroupId = _.find(this.baiscDataTypeOption.ethnicGroupOption, { key: data.ethnicGroupId });
            const targetHightEducationId = _.find(this.baiscDataTypeOption.highEducationOption, { key: data.highestEducationId });
            this.basicData = Object.assign({}, this.basicData, {
                id: data.employeeStringID ? data.employeeStringID : '',
                first_name: data.firstName,
                last_name: data.lastName,
                nick_name: data.nickName,
                birthOfDate: moment(data.dateOfBirth).format(this.dateFormat),
                isMarried: data.marriageStateValue,
                highEducation: targetHightEducationId,
                employmentStateId: targetEmployeeState,
                gender: data.genderValue,
                employeeDate: moment(data.employmentStartedInfo.employmentStartedDate).format(this.dateFormat),
                employeeOrigin: targetEmployeeOrigin,
                employeeIntroducer: data.employmentStartedInfo.referencePerson,
                workplace: targetEmployeeWorkplace,
                employeeType: targetEmployeeType,
                ethnicGroupId: targetEthnicGroupId,
                personalAbilityDescription: data.personalAbilityDescription,
                dueDate: {
                    check: data.employmentProbrationInfo.probrationEndedDate ? true : false,
                    date: data.employmentProbrationInfo.probrationEndedDate ? moment(data.employmentProbrationInfo.probrationEndedDate).format(this.dateFormat) : null,
                },
                imageUrl: data.isHasPortrait ? data.imageUrl : this.orginImageUrl,
            });
        });
    }

    private fetchData(callback: any) {
        const p1 = new Promise((resolve, reject) => {
            getBasicInfoAllOption().then((datas: any) => {
                const response = datas.data;
                this.employeeStatusOption = this.transformSelectData(response.employmentStates);
                this.AddressTypeOption = this.transformSelectData(response.addressTypes);
                this.LegalTypeOption = this.transformSelectData(response.legalIdentiticationTypes);
                this.relationTypeOption = this.transformSelectData(response.relationships);
                this.phoneTypeOption = this.transformSelectData(response.employeePhoneTypes);
                this.baiscDataTypeOption = Object.assign({}, this.baiscDataTypeOption, {
                    highEducationOption: this.transformSelectData(response.educationLevels),
                    workpalceOption: this.transformSelectData(response.workingLocations),
                    employeeOriginOption: this.transformSelectData(response.employmentSources),
                    employeeTypeOption: this.transformSelectData(response.employmentTypes),
                    ethnicGroupOption: this.transformSelectData(response.ethnicGroups),
                    employeeStatusOption: this.transformSelectData(response.employmentStates),
                });
                if (this.isNew) {
                    this.baiscDataTypeOption.employeeStatusOption = [{key: '0FAGJ-XR8UN-Z5V2L-EWND7', label: '在职'}];
                };
                console.log(this.baiscDataTypeOption);
                resolve();
            });
        });
        Promise.all([p1]).then((res) => {
            const { employeeStatus, basicData } = this.$store.state.step;
            switch (employeeStatus) {
                case 1:
                    this.basicData = Object.assign({}, this.basicData, {
                        workplace: this.baiscDataTypeOption.workpalceOption[0],
                        employeeOrigin: this.baiscDataTypeOption.employeeOriginOption[0],
                        employeeType: this.baiscDataTypeOption.employeeTypeOption[0],
                        highEducation: this.baiscDataTypeOption.highEducationOption[0],
                        ethnicGroupId: this.baiscDataTypeOption.ethnicGroupOption[0],
                        employmentStateId: this.baiscDataTypeOption.employeeStatusOption[0],
                        isMarried: 1,
                    });
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
    private linkToStep2() {
        this.$emit('nextStep');
    }
    // 获取员工职位数据
    private remoteEmployeePositionData() {
        this.PositionTableLoading = true;
        getEmployeePositionData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.positionETag = res.headers.etag;
            const principalPositionId = data.principalPositionId;
            const newData = _.map(data.positions, (item) => {
                return {
                    position: item.positionFullPath,
                    mainPosition: _.isEqual(item.id, principalPositionId),
                    editable: false,
                    key: item.id,
                    isNew: false,
                    disable: false,
                    selectOption: item.positionFullPathIds,
                    positionId: item.id,
                };
            });
            this.positionTableData = [...newData, ...[{ position: '', mainPosition: false, editable: true, key: '1', isNew: true,  selectOption: [], positionId: '', disable: false}]]
            this.PositionTableLoading = false;
        });
    }


    // 获取员工电话数据
    private remoteEmployeePhoneData() {
        this.PhoneTableLoading = true;
        getEmployeePhoneData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.phoneETag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetPhoneType = _.find(this.phoneTypeOption, { key: item.typeId });
                return {
                    phoneType: targetPhoneType ? targetPhoneType : {key: '', label: ''},
                    phoneNum: item.phoneNumber.number,
                    isRequired: item.isDefault ? 'true' : 'false',
                    editable: false,
                    disable: false,
                    key: item.id,
                    isNew: false,
                };
            });
            this.phoneTableData = [...newData, ...[{ phoneType: this.phoneTypeOption[0], phoneNum: '', isRequired: 'false', editable: true, key: '1', isNew: true, disable: false }]]
            this.PhoneTableLoading = false;
        });
    }

    // 获取员工地址数据
    private remoteEmployeeAddressData() {
        this.addressTableLoading = true;
        getEmployeeContactAddressData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.addressETag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetAddressType = _.find(this.AddressTypeOption, { key: item.typeId });
                return {
                    addressType: targetAddressType ? targetAddressType : { key: '', label: '' },
                    province: item.address.provinceOrState,
                    area: item.address.districtOrTown,
                    city: item.address.city,
                    address: item.address.street,
                    key: item.id,
                    disable: false,
                    editable: false,
                    isNew: false,
                };
            });
            this.addressTableData = [...newData, ...[{addressType: this.AddressTypeOption[0], province: '', area: '', city: '', address: '', key: '1', editable: true, isNew: true, disable: false}]];
            this.addressTableLoading = false;
        });
    }

    // 获取员工紧急联系人数据
    private remoteEmployeeEmergyContractData() {
        this.EmergyContactLoading = true;
        getEmployeeContractData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.contactETag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetRelationType = _.find(this.relationTypeOption, { key: item.relationshipId });
                return {
                    relationship: targetRelationType ? targetRelationType : { key: '', label: '' },
                    name: item.name,
                    tel1: item.phoneNumber1,
                    tel2: item.phoneNumber2,
                    remark: item.note,
                    key: item.id,
                    disable: false,
                    editable: false,
                    isNew: false,
                };
            });
            this.EmergyContactTableData = [...newData, ...[{name: '', tel1: '', tel2: '', remark: '', key: '1', editable: true, relationship: this.relationTypeOption[0], isNew: true, disable: false }]];
            this.EmergyContactLoading = false;
        });
    }


    // 获取员工身份证件数据
    private remoteEmployeeLegalData() {
        this.LeagalTableLoading = true;
        getEmployeeLegalData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.legalIdETag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetLegalType = _.find(this.LegalTypeOption, { key: item.typeId });
                return {
                    legalType: targetLegalType ? targetLegalType : { key: '', label: '' },
                    legalNum: item.idNumber,
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    expireDate: moment(item.expireDate).format(this.dateFormat),
                    editable: false,
                    disable: false,
                    isNew: false,
                    key: item.id,
                };
            });
            this.LegalIdTableData = [...newData , ...[{legalType: this.LegalTypeOption[0], legalNum: '', issueDate: '', expireDate: '', editable: true, isNew: true, disable: false, key: '1'}]];
            this.LeagalTableLoading = false;
        });
    }
}
</script>

