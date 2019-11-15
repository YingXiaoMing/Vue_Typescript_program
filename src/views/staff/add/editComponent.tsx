import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Radio, Row, Col } from 'ant-design-vue';
@Component({
    components: {
        'a-radio-group': Radio.Group,
        'a-radio-button': Radio.Button,
        'a-row': Row,
        'a-col': Col,
    },
})
export default class EditStep extends Vue {
    @Prop({default: 0}) private curTab!: number;
    private stepList = [{
        value: 0,
        label: '基本资料',
    }, {
        value: 1,
        label: '教育与工作',
    }, {
        value: 2,
        label: '证件资料',
    }, {
        value: 3,
        label: '个人合同',
    }, {
        value: 4,
        label: '银行账号',
    }, {
        value: 5,
        label: '电脑账号',
    }, {
        value: 6,
        label: '关联文档',
    }];
    private stepValue  = 0;
    private basicItemLayout = {
        lg: {span: 3},
        md: {span: 24},
        sm: {span: 24},
    };
    private created() {
        this.stepValue = this.curTab;
    }
    private handleChange(e: any) {
        const newValue = e.target.value;
        this.stepValue = newValue;
        this.$emit('handleClick', newValue);
    }
    @Watch('curTab')
    private currentTabChange(value: number) {
        this.stepValue = value;
    }
    private render() {
        return (
            <div>
                <a-radio-group style='width: 100%' value={this.stepValue} on-change={this.handleChange}>
                    <a-row type='flex' justify='center'>
                        {this.stepList.map((item) => {
                            return (
                                <a-col {...{props: this.basicItemLayout}}>
                                    <a-radio-button value={item.value}>{item.label}</a-radio-button>
                                </a-col>
                            );
                        })}
                    </a-row>
                </a-radio-group>
            </div>
        );
    }
}
