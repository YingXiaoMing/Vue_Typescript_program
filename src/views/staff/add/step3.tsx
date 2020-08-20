import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Row, Divider, Col, Input, DatePicker,
    Radio, Upload, Button, Icon, Select, message } from 'ant-design-vue';
import { SelectValues, BasicData } from '@/interface';
import { getCredentialTypeOption } from '@/api/basic';
import { newEmployeeCredential, newEmployeeCredentialAttachment, getEmployeeCredentialData } from '@/api/staff';
import _ from 'lodash';
import moment from 'moment';
import CredentialTable from '@/components/Step3/CredentialTable.vue';
interface NewValueForm {
    credentialType: {
        key: string;
        value: string;
    };
    credentialName: string;
    issueDate: any;
    expireDate: number;
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
        'a-credentialTable': CredentialTable,
    },
    props: {
        Form,
    },
})
class Step3 extends Vue {
    private employeeId: string = '';
    private dateFormat: string = 'YYYY-MM-DD';
    private credentialLoading: boolean = false;
    private expireDate: string | null = null;
    private fileList: any = [];
    private endedDateShow: boolean = true;
    private Form: any;
    private $store: any;
    private credentialTypeOption: SelectValues[] = [];
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
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
    private fromItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    @Emit()
    private nextStep() {
        this.$emit('nextStep');
    }
    @Emit()
    private preStep() {
        this.$emit('preStep');
    }
    private created() {
        const { employeeId }  = this.$store.state.step;
        this.employeeId = employeeId;
        this.fetchCredentialTypeData();
    }
    private fetchCredentialTypeData() {
        getCredentialTypeOption().then((res) => {
            const data = res.data;
            this.credentialTypeOption = this.transformSelectData(data);
            this.loadCredentialData();
        });
    }
    private loadCredentialData() {
        this.credentialLoading = true;
        getEmployeeCredentialData(this.employeeId).then((res) => {
            const data = res.data;
            const newData = _.map(data, (item) => {
                return {
                    key: item.id,
                    name: item.name,
                    credentialType: _.find(this.credentialTypeOption, {key: item.typeId}),
                    issueDate: moment(item.issueDate).format(this.dateFormat),
                    editable: false,
                    expireDate: moment(item.expireDate).format(this.dateFormat),
                    employeeCredentialAttachments: item.employeeCredentialAttachments,
                };
            });
            this.$store.dispatch('ReplaceCredentialList', newData);
            this.credentialLoading = false;
        }).catch((err) => {
            this.credentialLoading = false;
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
    @Emit()
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
    private credntialDataAdd(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: NewValueForm) => {
            if (!err) {
                const param = this.transformValueData(values);
                if (param.expireDate && moment(param.issueDate).isAfter(param.expireDate)) {
                    message.error('有效日期不能早于颁发日期');
                    return;
                }
                newEmployeeCredential(this.employeeId, param).then((res: any) => {
                    const data = res.data;
                    const id = data.id;
                    if (this.fileList.length > 0) {
                        const formData = new FormData();
                        this.fileList.forEach((file: any) => {
                            formData.append('files[]', file);
                        });
                        newEmployeeCredentialAttachment(this.employeeId, id, formData).then(() => {
                            this.Form.resetFields();
                            this.fileList = [];
                            this.loadCredentialData();
                        }).catch(() => {
                            message.error('新增失败');
                        });
                    } else {
                        this.loadCredentialData();
                    }
                });
            }
        });
    }
    private transformValueData(data: NewValueForm) {
        return {
            typeId: data.credentialType.key,
            name: data.credentialName,
            issueDate:  moment(data.issueDate).format(this.dateFormat),
            expireDate: data.expireDate ? this.expireDate : '9999-12-31',
        };
    }
    private onDateChange(value: any, dateString: string) {
        this.expireDate = dateString;
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const { credentialList, employeeStatus } = this.$store.state.step;
        return(
            <div>
                <a-row gutter={24} class='basicData'>
                    <a-divider class='diliver_item'>证件资料</a-divider>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='证件/证书类型'>
                                {getFieldDecorator('credentialType', {
                                    initialValue: this.credentialTypeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                {this.credentialTypeOption.map((item: any, index: number) => <a-option
                                    value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='证件/证书名称'>
                                {getFieldDecorator('credentialName', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='颁发日期'>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date-picker></a-date-picker>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='有效日期'>
                                {getFieldDecorator('expireDate', {
                                    initialValue: 0,
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-radio-group onChange={(e: any) => this.onRadioChange(e)}>
                                    <a-col {...{props: {lg: {span: 4}}}}><a-radio value={0}>永久</a-radio></a-col>
                                    <a-col {...{props: {lg: {span: 20}}}}>
                                        <a-radio value={1} style='width:68px'>
                                            <a-date-picker format={this.dateFormat} disabled={this.endedDateShow}
                                            onChange={this.onDateChange}></a-date-picker>
                                        </a-radio>
                                    </a-col>
                                </a-radio-group>)}
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
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item class='rightBtn'>
                                <a-button type='primary' on-click={this.credntialDataAdd}>新增</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style='marginTop:18px;marginBottom:30px;'>
                        <a-credentialTable credentialOption={this.credentialTypeOption}
                        loading={this.credentialLoading} tabList={credentialList}
                        employeeId={this.employeeId}></a-credentialTable>
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
})(Step3);
