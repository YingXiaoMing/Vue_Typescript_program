import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Row, Divider, Col, Input, Upload, Button, Icon, message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import { getBankNameOption } from '@/api/basic';
import DocumentTable from '@/components/Step7/DocumentTable.vue';
import { addEmployeeRelatedDocumentData, newEmployeeRelatedDocumentAttachment, getEmployeeRelatedDocument } from '@/api/staff';
import _ from 'lodash';
interface NewValueForm {
    name: string;
    description: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-divider': Divider,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-upload': Upload,
        'a-button': Button,
        'a-icon': Icon,
        'document-table': DocumentTable,
    },
    props: {
        Form,
    },
})
class Step7 extends Vue {
    private employeeId: string = '';
    private bankNameTypeOption: SelectValue[] = [];
    private dateFormat: string = 'YYYY-MM-DD';
    private relateLoading: boolean = false;
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
        this.loadDocumentData();
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
    private loadDocumentData() {
        this.relateLoading = true;
        getEmployeeRelatedDocument(this.employeeId).then((res) => {
            const newData = _.map(res, (item) => {
                return {
                    key: item.id,
                    name: item.name,
                    description: item.description,
                    editable: false,
                };
            });
            this.$store.dispatch('ReplaceRelatedDocumentList', newData);
            this.relateLoading = false;
        }).catch(() => {
            this.relateLoading = false;
            message.error('加载数据失败，请联系管理员');
        });
    }
    private addData(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                if (this.fileList.length > 0) {
                    const param = this.transformValueData(values);
                    addEmployeeRelatedDocumentData(this.employeeId, param).then((res: any) => {
                        const id = res.id;
                        if (this.fileList.length > 0) {
                            const formData = new FormData();
                            this.fileList.forEach((file: any) => {
                                formData.append('files[]', file);
                            });
                            newEmployeeRelatedDocumentAttachment(this.employeeId, id, formData).then(() => {
                                this.Form.resetFields();
                                this.fileList = [];
                                this.loadDocumentData();
                            }).catch(() => {
                                message.error('新增失败');
                            });
                        } else {
                            this.loadDocumentData();
                        }
                    });
                } else {
                    message.error('上传的附件不能为空');
                }
            }
        });
    }
    private transformValueData(data: NewValueForm) {
        return {
            name: data.name,
            description: data.description,
        };
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const { relatedDocumentList, employeeStatus } = this.$store.state.step;
        return (
            <div>
                <a-row class='basicData'>
                    <a-divider class='diliver_item'>关联文档</a-divider>
                    < a-row span={24}>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='文档名称'>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='文档描述'>
                                {getFieldDecorator('description')(<a-input></a-input>)}
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
                        <document-table loading={this.relateLoading}
                        employeeId={this.employeeId} tabList={relatedDocumentList}/>
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
})(Step7);
