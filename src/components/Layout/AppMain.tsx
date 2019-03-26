
import { Component, Vue } from 'vue-property-decorator';
import Header from './Header';
import Sidebar from './Sidebar';
@Component({
    components: {}
})
export default class AppMain extends Vue {
    render() {
        return (
            <div class='app-main'>
            <Header/>
            <Sidebar/>
            底面
            <div class='page-wrap'>
                {/* <router-view></router-view> */}
            </div>
            </div>
        )
    }
}