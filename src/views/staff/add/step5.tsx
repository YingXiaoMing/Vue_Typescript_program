import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Row, Divider, Col, Input, DatePicker,
    Radio, Upload, Button, Icon, Select, message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import { getBankNameOption } from '@/api/basic';
import BankTabkle from '@/components/Step5/BankTable.vue';
import { addEmployeeBankData, newEmployeeBankAttachment, getEmployeeBankData } from '@/api/staff';
import _ from 'lodash';
import moment from 'moment';
interface NewValueForm {
    bankType: {
        key: string;
        value: string;
    };
    accountOpenedBranch: string;
    accountHolderName: string;
    bankAccountNumber: string;
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
        'bank-table': BankTabkle,
    },
    props: {
        Form,
    },
})
class Step4 extends Vue {
    private employeeId: string = '';
    private bankNameTypeOption: SelectValue[] = [];
    private dateFormat: string = 'YYYY-MM-DD';
    private bankLoading: boolean = false;
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
        lg: {span: 24},
        md: {span: 24},
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
        getBankNameOption().then((res) => {
            this.bankNameTypeOption = this.transformSelectData(res);
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
    private beforeUpload(file: any): boolean {
        this.fileList = [...this.fileList, file];
        return false;
    }
    private loadContractData() {
        this.bankLoading = true;
        getEmployeeBankData(this.employeeId).then((res) => {
            const newData = _.map(res, (item) => {
                return {
                    key: item.id,
                    bankType: _.find(this.bankNameTypeOption, {key: item.bankNameId}),
                    accountOpenedBranch: item.accountOpenedBranch,
                    accountHolderName: item.accountHolderName,
                    bankAccountNumber: item.bankAccountNumber,
                    note: item.note,
                    editable: false,
                };
            });
            this.$store.dispatch('ReplaceBankList', newData);
            this.bankLoading = false;
        }).catch(() => {
            this.bankLoading = false;
            message.error('加载数据失败，请联系管理员');
        });
    }
    private addData(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                const param = this.transformValueData(values);
                addEmployeeBankData(this.employeeId, param).then((res: any) => {
                    const id = res.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeBankAttachment(this.employeeId, id, formData).then(() => {
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
            bankNameId: data.bankType.key,
            accountOpenedBranch: data.accountOpenedBranch,
            bankAccountNumber: data.bankAccountNumber,
            accountHolderName: data.accountHolderName,
            note:  data.note,
        };
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const { bankList, employeeStatus } = this.$store.state.step;
        return (
            <div>
                <a-row class='basicData'>
                    <a-divider class='diliver_item'>银行账号</a-divider>
                    < a-row span={24}>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='银行名称'>
                                {getFieldDecorator('bankType', {
                                    initialValue: this.bankNameTypeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                    {this.bankNameTypeOption.map((item: any, index: number) => <a-option
                                    value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='开户行'>
                                {getFieldDecorator('accountOpenedBranch', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='账户名'>
                                {getFieldDecorator('accountHolderName', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='账户'>
                                {getFieldDecorator('bankAccountNumber', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='备注'>
                                {getFieldDecorator('note', {
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='附件上传'>
                                <a-upload fileList={this.fileList} beforeUpload={(file: any) => this.beforeUpload(file)}
                                remove={(file: any) => this.handleRemove(file)}>
                                    <a-button>
                                        <a-icon type='upload'/>点击上传
                                    </a-button>
                                </a-upload>
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item class='rightBtn'>
                                <a-button type='primary' on-click={this.addData} style='marginLeft: 30px'>新增</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style='marginTop:18px;marginBottom:30px;'>
                        <bank-table loading={this.bankLoading}
                        bankNameOption={this.bankNameTypeOption}
                        employeeId={this.employeeId} tabList={bankList}/>
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
