import { Component , Vue } from 'vue-property-decorator';

@Component({
    name: 'Staff',
})

export default class Staff extends Vue {
    render() {
        return (
            <router-view/>
        )
    }
} 