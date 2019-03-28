import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'staffsearch',
    components: {}
})
export default class Search extends Vue {
    render() {
        return (
            <div>查询员工资料</div>
        )
    }
}