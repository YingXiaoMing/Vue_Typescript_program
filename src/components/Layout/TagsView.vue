<template>
    <div class="scroll-container">
        <router-link ref="tag" class="tags-view-item"
        v-for="tag in Array.from(visitedView)"
        :to="tag" :key="tag.path" :class="isActive(tag) ? 'active': ''">
            {{ tag.meta.title }}
            <a-icon v-if="visitedView.length > 1" type="close-circle" @click.prevent.stop="closeSelectedTag(tag)"/>
        </router-link>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import './TagsView.less';
@Component({
})
export default class TagsView extends Vue {
    private $store: any;
    private $route: any;
    get visitedView() {
        return this.$store.state.app.tabList;
    }
    private isActive(route: any): boolean {
        return route.meta.key === this.$route.meta.key;
    }
    private closeSelectedTag(route: any) {
        this.$store.dispatch('RemoveTab', route.meta.key);
    }
}
</script>
