import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form, Row, Col, Select, DatePicker, Button, Input, message } from 'ant-design-vue';
import { BasicData, SelectValue } from '@/interface';
import { getEmployeeEndJonType } from '@/api/basic';
import { employeeLeavePosition } from '@/api/operation';
import _ from 'lodash';
import moment from 'moment';
@Component({
    components: {
        'a-form-item': Form.Item,
        'a-select': Select,
        'a-option': Select.Option,
        'a-date': DatePicker,
        'a-row': Row,
        'a-col': Col,
        'a-button': Button,
        'a-textarea': Input.TextArea,
    },
    props: {
        Form,
    },
})
class Tab2 extends Vue {
    @Prop({default: ''}) private employeeId!: string;
    private dateFormat: string = 'YYYY-MM-DD';
    private basicItemLayout = {
        lg: {span: 24},
        md: {span: 24},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 18 },
    };
    private fromItemLayout2 = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private Form: any;
    private endJobTypeOption: SelectValue[] = [];
    private created() {
        getEmployeeEndJonType().then((res: any) => {
            this.endJobTypeOption = this.transformSelectData(res);
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
    private leaveClick() {
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                employeeLeavePosition(this.employeeId, {
                    employeePositionChangeTypeId: values.endJobType.key,
                    employmentEndedDate: moment(values.issueDate).format(this.dateFormat),
                    reason: values.reason,
                }).then((res) => {
                    this.Form.resetFields();
                    message.success('离职操作成功');
                    this.$emit('clearEmployeeData');
                }).catch(() => {
                    message.error('离职操作失败，请重新操作');
                });
            }
        });
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='离职类型' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('endJobType', {
                                    initialValue: this.endJobTypeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                {this.endJobTypeOption.map((item: any, index: number) => <a-option
                                        value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='生效日期' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date></a-date>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='离职原因' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('reason')(<a-textarea rows={4}></a-textarea>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-row>
                <a-row class='bottom_button'>
                    <a-button type='primary' on-click={this.leaveClick}>保存</a-button>
                </a-row>
            </div>
        );
    }

}
export default Form.create({
    props: {
        employeeId: String,
    },
})(Tab2);
