import { Component, Vue, Prop } from 'vue-property-decorator';
import { Steps } from 'ant-design-vue';
@Component({
    components: {
        'a-step': Steps,
        'a-step-item': Steps.Step,
    },
    props: {
        currentTabs: Number,
    },
})
export default class Step extends Vue {
    @Prop({ default: 0 }) private currentTabs!: number;

    render() {
        return (
            <div>
                <a-step current={this.currentTabs}>
                    <a-step-item title='基本资料'></a-step-item>
                    <a-step-item title='教育与工作'></a-step-item>
                    <a-step-item title='证件资料'></a-step-item>
                    <a-step-item title='个人合同'></a-step-item>
                    <a-step-item title='银行账号'></a-step-item>
                    <a-step-item title='电脑账号'></a-step-item>
                    <a-step-item title='关联文档'></a-step-item>
                </a-step>
            </div>
        )
    }
}