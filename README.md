# tech-training-camp-frontend


构建的一个所见及所得的 Markdown 编辑器。构建了一个 simpleMarkdown 对文档内容进行解析，并实现对文档内容进行渲染。服务端文档储存功能与协同编辑功能暂时未有实现。

## 特性

- [x] 基本界面设计
- [x] 工具栏编辑引入
- [x] 编辑区基本功能
- [x] 编辑区解析与实时预览
- [ ] 用户注册登录与数据库储存
- [ ] 多人协作


### 界面设计与工具栏

-  工具栏实现功能包括加粗、倾斜、插入表格与列表、代码块、导入md文件、预览等
-  滚动轴设计是根据鼠标位置确定主动框、在根据窗口比例即时调节被动框位置
-  编辑区引入codeMirror工具构建

### 编辑区解析

-   编辑区解析借助正则表达式识别，截取出识别出的段落类型，根据行内元素与块元素的不同情况进行解析分析
-   主要的解析语段包括了基本标准 Markdown 要求，包括标题、字态（加粗倾斜等）、引用、列表、链接（图片与网站）、表格等
-   代码块可以进行解析，不过在解析html 内容时，会对其按照 html 规则解析，这一点需要改进
-   对于一些如删除线“~ ~”的语法、未完成列表等没有进行体现


### 关于工程化
-   项目用的时vue-cli3，对于项目打包配置上暂时可能有些问题，需要进一步学习与调整，考虑如何改进调整


## 技术栈
-  Vue 框架
-  iconfont 图标库
-  CodeMirror 支持编辑区编辑



-----
项目借助 Vue 框架构建，构建过程如下所示。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
