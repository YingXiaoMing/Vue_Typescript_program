import { Component, Vue, Emit } from 'vue-property-decorator';
import { Row, Divider, Col, Form, Input, Select, DatePicker, Button } from 'ant-design-vue';
import EducationTable from '@/components/Step2/EducationTable.vue';
import moment from 'moment';
import WorkExperience from './workExperience';
interface ValueData {
    major: string;
    schoolName: string;
    startedDate: string;
    endDate: string;
    educationLevel: {
        value: string;
        label: string;
    };
}
@Component({
    components: {
        'a-row': Row,
        'a-divider': Divider,
        'a-col': Col,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-select': Select,
        'a-option': Select.Option,
        'a-date': DatePicker,
        'a-button': Button,
        'a-education-table': EducationTable,
    },
    props: {
        Form,
    },
})
class Step2 extends Vue {
    private dateFormat = 'YYYY-MM-DD';
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    }
    private fromItemLayout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
    };
    private educationLevelOption = [{
        value: '1',
        label: '博士',
    }, {
        value: '2',
        label: '硕士',
    }, {
        value: '3',
        label: '本科',
    }, {
        value: '4',
        label: '专科',
    }, {
        value: '5',
        label: '无',
    }];
    private Form: any;
    @Emit()
    private EducationTableAdd(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: ValueData) => {
            if (!err) {
                values.startedDate = moment(values.startedDate).format(this.dateFormat);
                values.endDate = moment(values.endDate).format(this.dateFormat);
                this.$refs.educationTable.addEducationRow(values);
            }
        });
        // this.$refs.educationTable.addEducationRow();
    }
    @Emit()
    private nextStep() {
        this.$emit('nextStep');
    }
    @Emit()
    private preStep() {
        this.$emit('preStep');
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24} class='basicData'>
                    <a-divider class='diliver_item'>教育经历</a-divider>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='学校/受教育机构名称'>
                                {getFieldDecorator('schoolName', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='专业/受教育学科'>
                                {getFieldDecorator('major', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='最高学历'>
                                {getFieldDecorator('educationLevel', {
                                    initialValue: this.educationLevelOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue >
                                    {this.educationLevelOption.map((item: any, index: number) => <a-option
                                    key={index} value={item.value}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='开始日期'>
                                {getFieldDecorator('startedDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date></a-date>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='结束日期'>
                                {getFieldDecorator('endDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date></a-date>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item class='rightBtn'>
                                <a-button type='primary' on-click={this.EducationTableAdd}>新增</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style='marginTop:18px;marginBottom:30px'>
                        <a-education-table ref='educationTable'></a-education-table>
                    </a-row>
                    <a-divider class='diliver_item'>工作经历</a-divider>
                    <WorkExperience/>
                </a-row>
                <a-row>
                    <a-col {...{props: this.botttomLayout}}>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.preStep}>上一步</a-button>
                        </a-col>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.nextStep}>下一步</a-button>
                        </a-col>
                    </a-col>
                </a-row>
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(Step2);