<template>
    <a-layout class="layout">
      <a-layout-sider></a-layout-sider>
      <a-layout-header></a-layout-header>
      <a-layout-content></a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
export default class GlobalLayout extends Vue {

}
</script>
<style lang="less">
    .layout {
        min-height: 100vh !important;
        overflow: hidden;
    }
</style>


