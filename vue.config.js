module.exports = {
    chainWebpack: (config) => {
        'use strict';
        config.module 
            .rule("tsx")
            .test(/\.tsx$/)
            .use("vue-jsx-hot-loader")
            .before("babel-loader")
            .loader("vue-jsx-hot-loader");
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
}