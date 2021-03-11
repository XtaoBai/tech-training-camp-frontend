<template lang="html">
    <div :class="`markdown ${fullscreen ? 'fullscreen': ''} ${bordered? 'border': ''}`" ref='markdown' :style="{width:width +'px', height: height + 'px'}">
        <!--头部工具栏-->
        <ul class="markdown-toolbars" v-show="!preview">
            <li>
                <slot name="title"/>
            </li>
            <li v-if="tools.undo" name="撤销">
                <span class="iconfont icon-undo" @click="editor.undo()"></span>
            </li>
            <li v-if="tools.redo" name="重做" >
                <span class="iconfont icon-redo" @click="redo"></span>
            </li>
            <li v-if="tools.strong" name="粗体">
                <span class="iconfont icon-bold" @click="insertStrong"></span>
            </li>

            <li v-if="tools.italic" name="斜体">
                <span class="iconfont icon-italic" @click="insertItalic"></span>
            </li>
            <li v-if="tools.overline" name="删除线" >
                <span class="iconfont icon-strikethrough" @click="insertOverline"></span>
            </li>
            <li v-if="tools.underline" name="下划线">
                <span class="iconfont icon-Underline" @click="insertUnderline"></span>
            </li>
            <li v-if="tools.h1" name="标题1">
                <span class="iconfont icon-h1" @click="insertTitle(1)"></span>
            </li>
            <li v-if="tools.h2" name="标题2">
                <span class="iconfont icon-h2" @click="insertTitle(2)"></span>
            </li>
            <li v-if="tools.h3" name="标题3">
                <span class="iconfont icon-h3" @click="insertTitle(3)"></span>
            </li>
            <li v-if="tools.h4" name="标题4">
                <span class="iconfont icon-h4" @click="insertTitle(4)"></span>
            </li>
            <li v-if="tools.h5" name="标题5">
                <span class="iconfont icon-h5" @click="insertTitle(5)"></span>
            </li>
            <li v-if="tools.h6" name="标题6">
                <span class="iconfont icon-h6" @click="insertTitle(6)"></span>
            </li>
            <li v-if="tools.hr" name="分割线">
                <span class="iconfont icon-hr" @click="insertLine"></span>
            </li>
            <li v-if="tools.quote" name="引用" >
                <span class="iconfont icon-quote" @click="insertQuote"></span>
            </li>
            <li v-if="tools.ul" name="无序列表">
                <span class="iconfont icon-unorderedList" @click="insertUl"></span>
            </li>
            <li v-if="tools.ol" name="有序列表">
                <span class="iconfont icon-orderedList" @click="insertOl"></span>
            </li>
            <li v-if="tools.code" name="代码块">
                <span  class="iconfont icon-code" @click="insertCode"></span>
            </li>
            <li v-if="tools.notchecked" name="未完成列表" >
                <span class="iconfont icon-iconfontcheckboxunchecked" @click="insertNotFinished"></span>
            </li>
            <li v-if="tools.checked" name="已完成列表" >
                <span class="iconfont icon-iconfontcheckboxchecked" @click="insertFinished"></span>
            </li>
            <li v-if="tools.link" name="链接">
                <span class="iconfont icon-link" @click="insertLink"></span>
            </li>
            <li v-if="tools.image" name="图片" >
                <span class="iconfont icon-image" @click="insertImage"></span>
            </li>
            <li v-if="tools.uploadImage" name="本地图片">
                <span class="iconfont icon-icons01" @click="chooseImage"></span>
            </li>
            <li v-if="tools.table" name="表格">
                <span class="iconfont icon-table" @click="insertTable"></span>
            </li>
            <li v-if="tools.theme" class="shift-theme" name="代码块主题" >
                <div>
                <span class="iconfont icon-split-screen-compare" @click="themeSlideDown = !themeSlideDown"></span>
                    <!-- <ul
                        :class="{ active: themeSlideDown }"
                        @mouseleave="themeSlideDown = false"
                    >
                        <li @click="setThemes('light')">Light</li>
                        <li @click="setThemes('dark')">VS Code</li>
                        <li @click="setThemes('oneDark')">Atom OneDark</li>
                        <li @click="setThemes('gitHub')">GitHub</li>
                    </ul> -->
                </div>
            </li>
            <li class="import-file" name="导入文件" v-show="tools.importmd">
                <span class="iconfont icon-daoru" @click="importFile"></span>
                <input
                    type="file"
                    @change="importFile($event)"
                    accept="text/markdown"
                />
            </li>

            <li name="保存到本地" v-show="tools.exportmd">
                <span class="iconfont icon-xiazai" @click="exportFile"></span>
            </li>
            <li v-if="tools.split && split" name="全屏编辑">
                <span class="iconfont icon-kuozhan1" @click="split = false"></span>
            </li>
            <li v-if="tools.split && !split" name="分屏显示">
                <span class="iconfont icon-fenping-Splitscreen" @click="split = true"></span>
            </li>
            <li v-if="tools.preview" name="预览">
                <span class="iconfont icon-preview" @click="preview = true"></span>
            </li>
            <li v-if="tools.clear" name="清空" >
                <span class="iconfont icon-empty" @click="value = ''"></span>
            </li>
            <li v-if="tools.save" name="保存" >
                <span class="iconfont icon-save" @click="handleSave"></span>
            </li>
            <li :name="scrolling ? '同步滚动:开' : '同步滚动:关'">
                <span
                    class="iconfont icon-iconfonttoggleon"
                    @click="scrolling = !scrolling"
                    v-show="scrolling"
                ></span>
                <span
                    class="iconfont icon-iconfonttoggleoff"
                    @click="scrolling = !scrolling"
                    v-show="!scrolling"
                ></span>
            </li>
            <li class="empty"></li>
            <li v-if="tools.fullscreen && !fullscreen" name="全屏">
                <span
                    class="iconfont icon-fullScreen"
                    @click="fullscreen = !fullscreen"
                ></span>
            </li>
            <li v-if="tools.fullscreen && fullscreen" name="退出全屏">
                <span
                    class="iconfont icon-suoxiao"
                    @click="fullscreen = !fullscreen"
                ></span>
            </li>
            
        </ul>
        
        <!--关闭预览按钮-->
        <div
            class='close-preview'
            v-show="preview && !isPreview"
            @click="preview = false"
        >
            <span class="iconfont icon-shanchu"></span>

        </div>

        <!--编辑器-->
        <div
            class="markdown-content"
            :style="{ background: preview ? '#fff': ''}"
        >
            <div 
                class="codemirror"
                ref="codemirror"
                v-show="!preview"
                @mouseenter="mousescrollSide('left')"
            ></div>
            <div 
                :class="`markdown-preview ${'markdown-theme-' + themeName}`"
                v-show="preview ? preview: split"
                ref="preview"
                @scroll="previewScroll"
                @mouseenter="mousescrollSide('right')"
            >
                <div v-html="html" ref="previewInner"></div>
            </div>
        
        </div>

        <!--预览图片-->
        <div :class="['preview-img', previewImgModal ? 'active': '']">
            <span
                class="close iconfont icon-shanchu"
                @click="previewImgModal = false"
            ></span>
            <img :src="previewImgSrc" :class="[previewImgMode]" alt=""/>
        </div>
    </div>

</template>


<script>
import markdown from "./index";
export default markdown;
</script>
<style scoped lang="less">
@import "../assets/css/light";
@import "../assets/css/index";
@import "../assets/font/iconfont.css";
</style>