<template>
    <div class="conatiner">
        <a-card :bordered="false" class="container_content" id="container_content">
            <a-stepComponent :currentTabs="currentTab" v-if="isNew"/>
            <template v-else>
                <a-editComponent @handleClick="changeValue" :curTab="currentTab"/>
            </template>
            <Step1 v-if="currentTab === 0" @nextStep='nextStep' :employeePropId="Id"></Step1>
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
import { Emit, Watch, Inject, Provide } from 'vue-property-decorator';
import { Card, message } from 'ant-design-vue';
import StepComponent from '../add/stepComponent';
import { getEmployeeID } from '@/utils/cookie';
import EditComponent from '../add/editComponent';
import { Step1, Step2, Step3, Step4, Step5, Step6, Step7 } from '../add/step';
import '../add/index.less';
import _ from 'lodash';
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
    name: 'staffedit',
})
export default class Add extends Vue {
    private currentTab: number = 0;
    private isNew: boolean = false;
    private $store: any;
    private Id: string = '';
    @Provide('isLoading')
    private isLoading: boolean = true;
    private activated() {
        const employeeId = getEmployeeID();
        this.currentTab = 0;
        if (employeeId) {
            this.Id = employeeId;
        }
        // if (!_.isEqual(this.Id, employeeId) && employeeId) {
        //     this.currentTab = 0;
        //     this.Id = employeeId;
        // }
    }
    private created() {
        const employeeId = getEmployeeID();
        this.isLoading = true;
        if (employeeId) {
            this.Id = employeeId;
            this.$store.dispatch('ChangeEditEmployeeId', employeeId);
            this.$store.dispatch('changeEmployeeStatus', 3);
        }
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

