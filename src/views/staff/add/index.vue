<template>
    <div>
        <a-card :bordered="false" class="container_content">
            <a-stepComponent :currentTabs="currentTab"/>
            <Step1 v-if="currentTab === 0" @nextStep='nextStep'></Step1>
            <Step2 v-if="currentTab === 1" @nextStep='nextStep' @preStep='preStep'></Step2>
            <Step3 v-if="currentTab === 2"></Step3>
        </a-card>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Card } from 'ant-design-vue';
import StepComponent from './stepComponent';
import { Step1, Step2, Step3 } from './step';
import './index.less';
@Component({
    components: {
        'a-card': Card,
        'a-stepComponent': StepComponent,
        Step1,
        Step2,
        Step3,
    },
})
export default class Add extends Vue {
    private currentTab: number = 0;
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
}
</script>

