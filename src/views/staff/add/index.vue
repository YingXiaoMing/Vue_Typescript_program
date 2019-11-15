<template>
    <div class='container'>
        <a-card :bordered="false" class="container_content" id="container_content">
            <a-stepComponent :currentTabs="currentTab"/>
            <Step1 v-if="currentTab === 0" @nextStep='nextStep'></Step1>
            <Step2 v-if="currentTab === 1" @nextStep='nextStep' @preStep='preStep' :employeePropId="id"></Step2>
            <Step3 v-if="currentTab === 2" @nextStep='nextStep' @preStep='preStep'></Step3>
            <Step4 v-if='currentTab === 3' @nextStep='nextStep' @preStep='preStep'></Step4>
            <Step5 v-if='currentTab === 4' @nextStep='nextStep' @preStep='preStep'></Step5>
            <Step6 v-if='currentTab === 5' @nextStep='nextStep' @preStep='preStep'></Step6>
            <Step7 v-if='currentTab === 6' @nextStep='complete' @preStep='preStep'></Step7>
        </a-card>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Card  } from 'ant-design-vue';
import StepComponent from './stepComponent';
import EditComponent from './editComponent';
import { Step1, Step2, Step3, Step4, Step5, Step6, Step7 } from './step';
import './index.less';
@Component({
    components: {
        'a-card': Card,
        'a-stepComponent': StepComponent,
        'a-editComponent': EditComponent,
        Step1,
        Step2,
        Step3,
        Step4,
        Step5,
        Step6,
        Step7,
    },
    name: 'staffadd',
})
export default class Add extends Vue {
    private currentTab: number = 0;
    private $store: any;
    private isNew: boolean = true;
    private Id: string = '';
    private created() {
        const { newEmployeeStatus } = this.$store.state.step;
        this.$store.dispatch('changeEmployeeStatus', newEmployeeStatus);
    }
    @Emit()
    private nextStep() {
        this.currentTab += 1;
    }
    @Emit()
    private preStep() {
        if (this.currentTab > 0) {
            this.currentTab -= 1;
        }
    }
    private complete() {
        this.currentTab = 0;
        this.$store.dispatch('changeEmployeeStatus', 1);
    }
    private changeValue(value: number) {
        this.currentTab = value;
    }
}
</script>

