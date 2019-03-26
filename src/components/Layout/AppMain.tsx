
import { Component, Vue } from 'vue-property-decorator';
import Header from './Header';
import Sidebar from './Sidebar';
import './AppMain.less';
@Component({
    components: {}
})
export default class AppMain extends Vue {
    render() {
        return (
            <div class='app-main'>
                <Sidebar/>
                <div class='page-content'>
                    <Header/>
                    <div class='page-wrap'>
                        {/* <router-view></router-view> */}
                    </div>
                </div>
            </div>
        )
    }
}