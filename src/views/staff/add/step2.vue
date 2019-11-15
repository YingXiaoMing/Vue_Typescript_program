<template>
    <div>
        <a-row :gutter="24" class='basicData'>
            <a-divider class='diliver_item'>教育经历</a-divider>
            <a-education></a-education>
            <a-divider class='diliver_item'>工作经历</a-divider>
            <a-workExperience></a-workExperience>
        </a-row>
        <a-row v-if="employeeStatus !== 3">
          <a-col v-bind="botttomLayout" style="marginTop: 20px">
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="preStep">上一步</a-button>
              </a-col>
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="nextStep">下一步</a-button>
              </a-col>
          </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Education from '@/components/Step2/Education.vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import WorkExperience from '@/components/Step2/WorkExperience.vue';
import { Row, Divider } from 'ant-design-vue';
import { getEducationLevelOption } from '@/api/basic';
@Component({
    components: {
        'a-education': Education,
        'a-row': Row,
        'a-divider': Divider,
        'a-workExperience': WorkExperience,
    },
})
export default class Step2 extends Vue {
    private employeeStatus: number = 1;
    private $store: any;
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private created() {
        const { employeeStatus } = this.$store.state.step;
        this.employeeStatus = employeeStatus;
    }
    private nextStep() {
        this.$emit('nextStep');
    }
    private preStep() {
        this.$emit('preStep');
        this.$store.dispatch('changeEmployeeStatus', 2);
    }
}
</script>




