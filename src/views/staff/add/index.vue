<template>
    <div class="conatiner">
        <a-card :bordered="false" class="container_content" id="container_content">
            <a-stepComponent :currentTabs="currentTab" v-if="isNew"/>
            <template v-else>
                <a-editComponent @handleClick="changeValue"/>
            </template>
            <Step1 v-if="currentTab === 0" @nextStep='nextStep'></Step1>
            <Step2 v-if="currentTab === 1" @nextStep='nextStep' @preStep='preStep'></Step2>
            <Step3 v-if="currentTab === 2" @nextStep='nextStep' @preStep='preStep'></Step3>
            <Step4 v-if='currentTab === 3' @nextStep='nextStep' @preStep='preStep'></Step4>
            <Step5 v-if='currentTab === 4' @nextStep='nextStep' @preStep='preStep'></Step5>
            <Step6 v-if='currentTab === 5' @nextStep='nextStep' @preStep='preStep'></Step6>
            <Step7 v-if='currentTab === 6' @nextStep='nextStep' @preStep='preStep'></Step7>
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
})
export default class Add extends Vue {
    private currentTab: number = 0;
    private isNew: boolean = false;
    private $store: any;
    private created() {
        const { employeeStatus } = this.$store.state.step;
        this.isNew = employeeStatus === 1 ? true : false;
    }
    @Emit()
    private nextStep() {
        if (this.currentTab < 2) {
            this.currentTab += 1;
        }
    }
    @Emit()
    private preStep() {
        if (this.currentTab > 0) {
            this.currentTab -= 1;
        }
    }
    private changeValue(value: number) {
        this.currentTab = value;
    }
}
</script>

