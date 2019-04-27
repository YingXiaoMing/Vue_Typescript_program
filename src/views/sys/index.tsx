import { Component , Vue } from 'vue-property-decorator';

@Component({
    name: 'sys',
})

export default class Sys extends Vue {
    private $store: any;
    public render() {
        const { keepList } = this.$store.state.app;
        return (
            <keep-alive include={keepList}>
                <router-view/>
            </keep-alive>
        );
    }
}
