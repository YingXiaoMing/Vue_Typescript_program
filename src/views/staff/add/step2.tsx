import { Component, Vue, Emit } from 'vue-property-decorator';
import { Row, Divider, Col, Form, Input, Select, DatePicker, Button, message } from 'ant-design-vue';
import EducationTable from '@/components/Step2/EducationTable.vue';
import moment from 'moment';
import WorkExperience from './workExperience';
import { getEducationLevelOption } from '@/api/basic';
import { BasicData, SelectValues } from '@/interface';
import { newEmployeeEducationHistory, getEmployeeEducationHistory } from '@/api/staff';
import _ from 'lodash';
interface ValueData {
    major: string;
    schoolName: string;
    startedDate: string;
    endDate: string;
    educationLevel: {
        key: string;
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
    public $store: any;
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
    };
    private fromItemLayout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
    };
    private educationLevelOption: SelectValues[] = [];
    private educationTableLoading: boolean = false;
    private Form: any;
    private employeeId: string = '';
    private created() {
        const { employeeId } = this.$store.state.step;
        this.employeeId = employeeId;
        this.fetchBasicData();
    }
    private fetchBasicData() {
        getEducationLevelOption().then((response) => {
            this.educationLevelOption = this.transformSelectData(response);
            this.loadEducationHistoryData();
        });
    }
    private loadEducationHistoryData() {
        this.educationTableLoading = true;
        getEmployeeEducationHistory(this.employeeId).then((res) => {
            const newData = _.map(res, (item) => {
                return {
                    key: item.id,
                    startedDate: moment(item.startedDate).format(this.dateFormat),
                    endDate: moment(item.endedDate).format(this.dateFormat),
                    major: item.major,
                    schoolName: item.schoolName,
                    educationLevel: _.find(this.educationLevelOption, {key: item.educationLevelId}),
                    editable: false,
                };
            });
            this.$store.dispatch('ReplaceEducationHistoryList', newData);
            this.educationTableLoading = false;
        }).catch((err) => {
            this.educationTableLoading = false;
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
    private EducationTableAdd(e: HTMLFormElement) {
        e.preventDefault();
        this.Form.validateFields((err: any, values: ValueData) => {
            if (!err) {
                newEmployeeEducationHistory(this.employeeId, {
                    educationLevelId: values.educationLevel.key,
                    schoolName: values.schoolName,
                    major: values.major,
                    startedDate: moment(values.startedDate).format(this.dateFormat),
                    endedDate: moment(values.endDate).format(this.dateFormat),
                }).then((res) => {
                    this.Form.resetFields();
                    this.loadEducationHistoryData();

                }).catch((error) => {
                    message.error('新增失败');
                });
            }
        });
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
        const { educationHistoryList, employeeStatus } = this.$store.state.step;
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
                                    value={item.key}>{item.label}</a-option>)}
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
                        <a-education-table ref='educationTable' loading={this.educationTableLoading}
                        tabList={educationHistoryList} employeeId={this.employeeId}
                        educationLevelOption={this.educationLevelOption}></a-education-table>
                    </a-row>
                    <a-divider class='diliver_item'>工作经历</a-divider>
                    <WorkExperience employeeId={this.employeeId}></WorkExperience>
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
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(Step2);
