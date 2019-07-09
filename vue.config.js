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