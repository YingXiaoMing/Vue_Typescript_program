<template>
    <div class="wrapper">
        <div class="staff-head">

        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
    components: {},
    name: 'salaryRecord',
})
export default class SalaryRecord extends Vue {
    private form: any;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
        
    }
}
</script>

