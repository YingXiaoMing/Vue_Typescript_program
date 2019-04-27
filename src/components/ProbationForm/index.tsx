import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Checkbox, DatePicker, Row, Col, Form } from 'ant-design-vue';
import moment from 'moment';
interface Values {
    check: boolean;
    date: string | null;
}
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-checkbox': Checkbox,
        'a-date': DatePicker,
        'a-form-item': Form.Item,
    },
    props: {
        Form,
    },
})
class ProbationForm extends Vue {
    @Prop() private value: Values | undefined;
    private dateFormat = 'YYYY-MM-DD';
    private fromItemLayout = {
        wrapperCol: { span: 24 },
    };
    private Form: any;
    private checked: boolean = this.value ? this.value.check : true;
    private date: string| null = this.value ? this.value.date : null;
    @Watch('value')
    private valueChange(newValue: Values) {
        if (newValue) {
            this.date = newValue.date;
            this.checked = newValue.check;
        }
    }
    private handleChange(e: any) {
        this.checked = e.target.checked;
        const check = e.target.checked;
        const date = this.date;
        this.triggerChange({check, date});
    }
    private handleDateChange(dates: string, dateString: string) {
        this.date = dateString;
        const date = dateString;
        const check = this.checked;
        this.triggerChange({check, date});
    }
    private triggerChange(changedValue: any) {
        this.$emit('change', Object.assign({}, this.$data, changedValue));
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-col span={3}>
                        <a-checkbox checked={this.checked} onChange={(e: any) => this.handleChange(e)}></a-checkbox>
                    </a-col>
                    <a-col span={21}>
                        <a-form-item {...{props: this.fromItemLayout}}>
                            {getFieldDecorator('dueDate', {
                                initialValue: this.date ? moment(this.date, this.dateFormat) : null,
                            })(<a-date style='width:100%' disabled={!this.checked} onChange={this.handleDateChange}></a-date>)}
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
        );
    }
}

export default Form.create({
    props: {
        value: Object,
    },
})(ProbationForm);
