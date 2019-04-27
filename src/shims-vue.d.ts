declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    Form: any,
    $store: any,
    $form: any,
  }
}