import { Component , Vue } from 'vue-property-decorator';

@Component({
    name: 'staff',
})

export default class Staff extends Vue {
    render() {
        const { keepList } = this.$store.state.app;
        return (
            <keep-alive include={keepList}>
                <router-view/>
            </keep-alive>
        )
    }
} 