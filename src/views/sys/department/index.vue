<template>
    <div class='wrapper'>
        <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :span="24">
                    <vue2-org-tree :data="data"
                    :render-content="renderContent"></vue2-org-tree>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Card, Row, Col } from 'ant-design-vue';
import Vue2OrgTree from 'vue2-org-tree';
@Component({
    components: {
        'a-card': Card,
        'a-row': Row,
        'a-col': Col,
        'vue2-org-tree': Vue2OrgTree,
    },
})
export default class Department extends Vue {
    private data = {
        id: '0',
        label: '新感觉有限公司',
        children: [{
            id: '1',
            label: '均安分公司',
        }, {
            id: '2',
            label: '乐从分公司',
        }],
    };
    private renderContent(h: any, data: any) {
        return data.label;
    }

}
</script>

