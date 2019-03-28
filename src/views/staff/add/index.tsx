import { Component, Vue, Emit } from 'vue-property-decorator';
import { Button, Card } from 'ant-design-vue';
@Component({
    name: 'staffadd',
    components: {
        'a-button': Button,
        'a-card': Card,
    }
})



export default class Add extends Vue {
    name : string = '值没有发生变化';
    @Emit()
    changeState() {
        this.name = '该值已经发生变化了';
    }
    render() {
        return (
            <div>
                <a-card bordered={false}>
                    <div>123</div>
                </a-card>
            </div>
        )
    }
}