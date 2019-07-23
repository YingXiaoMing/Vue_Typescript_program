import { Component , Vue } from 'vue-property-decorator';

@Component({
    name: 'staff',
})

export default class StaffRemote extends Vue {
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
