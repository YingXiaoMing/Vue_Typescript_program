import { Component, Vue, Emit } from 'vue-property-decorator';
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'ant-design-vue';
import WorkExperienceTable from '@/components/Step2/WorkExperienceTable.vue';
import moment from 'moment';
interface ValueData {
    companyName: string;
    position: string;
    startedDate: string;
    endDate: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
    endedJobReason: string;
}
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-button': Button,
        'a-work-table': WorkExperienceTable,
    },
    props: {
        Form,
    },
})

class WorkExperience extends Vue {
    private dateFormat = 'YYYY-MM-DD';
    private basicItemLayout = {
        lg: {span: 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    private Form: any;
    @Emit()
    private workExperienceAdd(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: ValueData) => {
            if (!err) {
                values.startedDate = moment(values.startedDate).format(this.dateFormat);
                values.endDate = moment(values.endDate).format(this.dateFormat);
                this.$refs.workExperienceTable.addWorkExperienceRow(values);
            }
        });
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='公司名称'>
                            {getFieldDecorator('companyName', {
                                rules: [{
                                    required: true,
                                    message: ' ',
                                }],
                            })(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='职位'>
                            {getFieldDecorator('position', {
                                rules: [{
                                    required: true,
                                    message: ' ',
                                }],
                            })(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='入职日期'>
                            {getFieldDecorator('startedDate', {
                                rules: [{
                                    required: true,
                                    message: ' ',
                                }],
                            })(<a-date-picker></a-date-picker>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='离职日期'>
                            {getFieldDecorator('endDate', {
                                rules: [{
                                    required: true,
                                    message: ' ',
                                }],
                            })(<a-date-picker></a-date-picker>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='工资'>
                            {getFieldDecorator('salary')(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='证明人'>
                            {getFieldDecorator('reference')(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='证明人电话'>
                            {getFieldDecorator('referencePhoneNumber')(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col {...{props: this.basicItemLayout}}>
                        <a-form-item {...{props: this.fromItemLayout}} label='离职原因'>
                            {getFieldDecorator('endedJobReason')(<a-input></a-input>)}
                        </a-form-item>
                    </a-col>
                    <a-col span='24'>
                        <a-button type='primary' class='rightBtn' on-click={this.workExperienceAdd}>新增</a-button>
                    </a-col>
                </a-row>
                <a-row style='marginTop:18px;marginBottom:30px'>
                    <a-work-table ref='workExperienceTable'></a-work-table>
                </a-row>
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(WorkExperience);
