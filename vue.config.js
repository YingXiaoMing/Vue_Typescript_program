module.exports = {
    lintOnSave: false,
    chainWebpack: (config) => {
        'use strict';
        config.module 
            .rule("tsx")
            .test(/\.tsx$/)
            .use("vue-jsx-hot-loader")
            .before("babel-loader")
            .loader("vue-jsx-hot-loader");
    },
    devServer: {
        https: false,  // 暂时设置为false
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars : {
                    // 'primary-color': '#1DA57A',
                    // 'link-color': '#1DA57A',
                    // 'border-radius-base': '2px',
                }
            }
        }
    }
}