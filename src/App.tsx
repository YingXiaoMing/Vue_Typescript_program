import { Component, Vue } from 'vue-property-decorator';
import { LocaleProvider } from 'ant-design-vue';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import AppMain from '@/components/Layout/AppMain';
@Component({
    components: {
        'a-locale-provider': LocaleProvider,
    },
})
export default class App extends Vue {
    private globalClick: any;
    private render() {
        return (
            <div id='app' class='fillcontain'>
                <a-locale-provider locale={zh_CN}>
                    <AppMain/>
                </a-locale-provider>
            </div>
        );
    }
}
