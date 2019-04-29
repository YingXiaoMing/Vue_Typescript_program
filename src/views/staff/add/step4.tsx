import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Row, Divider, Col, Input, DatePicker,
    Radio, Upload, Button, Icon, Select, message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import { getContractTypeOption } from '@/api/basic';
import ContractTable from '@/components/Step4/ContractTable.vue';
import { addEmployeeContactData, newEmployeeContactAttachment, getEmployeeContactData } from '@/api/staff';
import _ from 'lodash';
import moment from 'moment';
interface NewValueForm {
    contractType: {
        key: string;
        value: string;
    };
    contractName: string;
    contractNum: string;
    issueDate: any;
    expireDate: number;
    note: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-divider': Divider,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-radio': Radio,
        'a-radio-group': Radio.Group,
        'a-upload': Upload,
        'a-button': Button,
        'a-icon': Icon,
        'a-select': Select,
        'a-option': Select.Option,
        'contract-table': ContractTable,
    },
    props: {
        Form,
    },
})
class Step4 extends Vue {
    private employeeId: string = '';
    private contractTypeOption: SelectValue[] = [];
    private dateFormat: string = 'YYYY-MM-DD';
    private contractLoading: boolean = false;
    private endedDateShow: boolean = true;
    private expireDate: string | null = null;
    private fileList: any = [];
    private Form: any;
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 16},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private $store: any;
    @Emit()
    private nextStep() {
        this.$emit('nextStep');
    }
    @Emit()
    private preStep() {
        this.$emit('preStep');
    }
    private created() {
        const { employeeId } = this.$store.state.step;
        this.employeeId = employeeId;
        this.fetchContractTypeData();
    }
    private fetchContractTypeData() {
        getContractTypeOption().then((res) => {
            this.contractTypeOption = this.transformSelectData(res);
            this.loadContractData();
        });
    }
    private onRadioChange(e: any) {
        switch (e.target.value) {
            case 0:
                this.endedDateShow = true;
                this.expireDate = null;
                break;
            default:
                this.endedDateShow = false;
                break;
        }
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private handleRemove(file: any) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }
    private onDateChange(value: any, dateString: string) {
        this.expireDate = dateString;
    }
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return false;
    }
    private loadContractData() {
        this.contractLoading = true;
        getEmployeeContactData(this.employeeId).then((res) => {
            const newData = _.map(res, (item) => {
                return {
                    key: item.id,
                    contractType: _.find(this.contractTypeOption, {key: item.typeId}),
                    name: item.name,
                    contractNum: item.no,
                    note: item.note,
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    expireDate: moment(item.expireDate).format(this.dateFormat),
                    editable: false,
                };
            });
            this.$store.dispatch('ReplaceContractList', newData);
            this.contractLoading = false;
        }).catch(() => {
            this.contractLoading = false;
            message.error('加载数据失败，请联系管理员');
        });
    }
    private addData(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                const param = this.transformValueData(values);
                if (param.expireDate && moment(param.issueDate).isAfter(param.expireDate)) {
                    message.error('有效日期不能早于生效日期');
                    return;
                }
                addEmployeeContactData(this.employeeId, param).then((res: any) => {
                    const id = res.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeContactAttachment(this.employeeId, id, formData).then(() => {
                            this.Form.resetFields();
                            this.fileList = [];
                            this.loadContractData();
                        }).catch(() => {
                            message.error('新增失败');
                        });
                    } else {
                        this.loadContractData();
                    }
                });
            }
        });
    }
    private transformValueData(data: NewValueForm) {
        return {
            typeId: data.contractType.key,
            no: data.contractNum,
            name: data.contractName,
            note: data.note,
            issueDate:  moment(data.issueDate).format(this.dateFormat),
            expireDate: data.expireDate ? this.expireDate : '9999-12-31',
        };
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const { contractList, employeeStatus } = this.$store.state.step;
        return (
            <div>
                <a-row class='basicData'>
                    <a-divider class='diliver_item'>个人合同</a-divider>
                    < a-row span={24}>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='合同类型'>
                                {getFieldDecorator('contractType', {
                                    initialValue: this.contractTypeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                    {this.contractTypeOption.map((item: any, index: number) => <a-option
                                    value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='合同名称'>
                                {getFieldDecorator('contractName', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='合同编号'>
                                {getFieldDecorator('contractNum', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='生效日期'>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date-picker></a-date-picker>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='合同有效期至'>
                                {getFieldDecorator('expireDate', {
                                    initialValue: 0,
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-radio-group onChange={(e: any) => this.onRadioChange(e)}>
                                    <a-radio value={0}>永久</a-radio>
                                    <a-radio value={1} style='width:138px'>
                                        <a-date-picker format={this.dateFormat} disabled={this.endedDateShow}
                                        onChange={this.onDateChange}></a-date-picker>
                                    </a-radio>
                                </a-radio-group>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='备注'>
                                {getFieldDecorator('note')(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='证件上传'>
                                <a-upload fileList={this.fileList} beforeUpload={(file: any) => this.beforeUpload(file)}
                                remove={(file: any) => this.handleRemove(file)}>
                                    <a-button>
                                        <a-icon type='upload'/>点击上传
                                    </a-button>
                                </a-upload>
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item  class='rightBtn'>
                                <a-button type='primary' on-click={this.addData}>新增</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style='marginTop:18px;marginBottom:30px;'>
                        <contract-table loading={this.contractLoading}
                        contractOption={this.contractTypeOption}
                        employeeId={this.employeeId} tabList={contractList}/>
                    </a-row>
                    {employeeStatus === 3 ? null : <a-row>
                    <a-col {...{props: this.botttomLayout}}>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.preStep}>上一步</a-button>
                        </a-col>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.nextStep}>下一步</a-button>
                        </a-col>
                    </a-col>
                </a-row>}
                </a-row>
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(Step4);
