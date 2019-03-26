import { Component, Vue } from 'vue-property-decorator';
import './index.less';
@Component({
    components:{}
})
export default class Header extends Vue {
    render() {
        return(
            <div class='header-wrap'>头部</div>
        )
    }
}