import { Component, Vue } from 'vue-property-decorator';
import { Checkbox, DatePicker, Row, Col, Form } from 'ant-design-vue';
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
    private fromItemLayout = {
        wrapperCol: { span: 24 },
    };
    public render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-col span={3}>
                        <a-checkbox></a-checkbox>
                    </a-col>
                    <a-col span={21}>
                        <a-form-item {...{props: this.fromItemLayout}}>
                            {getFieldDecorator('dueDate')(<a-date style='width:100%'></a-date>)}
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
        );
    }
}

export default Form.create()(ProbationForm);
