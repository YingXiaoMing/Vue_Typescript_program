## 新建项目
使用Vue-cli3 创建项目，配置如下:
！[vue-cli-options](screenshot/clipboard.png)

## Tsx热加载
### 所需依赖
```bash
    npm i vue-jsx-hot-loader -D
```
### vue.config.js
```js
    chainWebpack: (config) => {
        'use strict';
        config.module 
            .rule("tsx")
            .test(/\.tsx$/)
            .use("vue-jsx-hot-loader")
            .before("babel-loader")
            .loader("vue-jsx-hot-loader");
    },
```
由于ant-design-vue使用样式是less文件，所以需要less提前编译，配置如下
### vue.config.js
```js
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
```

## ant-design-vue 按需加载
### 所需依赖
```bash
    npm i babel-plugin-import babel-plugin-jsx-v-model babel-plugin-vue-jsx-sync -D
```
### babel.config.js
```js
    plugins: [
        [
        'import', 
        {libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true}
        ]
    ]
```

