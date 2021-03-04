<template>
    <div ref="preview">
        <div 
            :class="`markdown-preview ${'markdown-theme-' + theme}`"
            v-html = "html"
        ></div>
        <!-- 图片预览 -->
        <div :class="['preview-img', previewImgModal? 'active': '']">
            <span
                class ="close iconfont icon-shanchu"
                @click ="previewImgModal = false"
            ></span>
            <img src="previewImgSrc" :class="[previewImgMode]" alt="" />
        </div>
    </div>    
</template>

<script>
export default {
    name: 'markdown-preview',
    props: {
        initialValue:{
            // 初始化内容
            type: String,
            default: ''
        },
        Options:{
            type:Object,
            default: () => ({})
        },
        theme:{
            type: String,
            default: 'light'
        },
        copyCode: {// 复制代码
                type: Boolean,
                default: true
        },
        copyBtnText: {// 复制代码按钮文字
            type: String,
            default: '复制代码'
        }
    },
    data(){
        return {
            html:'<div>未来会进行修改</div>',
            previewImgModal:false,
            previewImgSrc: '',
            previewImgMode:''
        }
    },
    mounted(){
        this.translateMarkdown();
    },
    methods:{

        translateMarkdown(){
            // 之后修改
            let html =''
            
            this.html = html;
            this.addCopyListener();
            this.addImageClickListener();
        },
        addCopyListener() {// 监听复制操作
            setTimeout(() => {
                const btns = document.querySelectorAll(
                    '.code-block .copy-code'
                );
                this.btns = btns;
                for (let i = 0, len = btns.length; i < len; i++) {
                    btns[i].onclick = () => {
                        const code = btns[i].parentNode.querySelectorAll(
                            'pre'
                        )[0].innerText;
                        const aux = document.createElement('input');
                        aux.setAttribute('value', code);
                        document.body.appendChild(aux);
                        aux.select();
                        document.execCommand('copy');
                        document.body.removeChild(aux);
                        this.$emit('on-copy', code);
                    };
                }
            }, 600);
        },
        addImageClickListener() {// 监听查看大图
            const {imgs = []} = this;
            if (imgs.length > 0) {
                for (let i = 0, len = imgs.length; i < len; i++) {
                    imgs[i].onclick = null;
                }
            }
            setTimeout(() => {
                this.imgs = this.$refs.preview.querySelectorAll('img');
                for (let i = 0, len = this.imgs.length; i < len; i++) {
                    this.imgs[i].onclick = () => {
                        const src = this.imgs[i].getAttribute('src');
                        this.previewImage(src);
                    };
                }
            }, 600);
        },
        previewImage(src) {// 预览图片
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                if (height / width > 1.4) {
                    this.previewImgMode = 'horizontal';
                } else {
                    this.previewImgMode = 'vertical';
                }
                this.previewImgSrc = src;
                this.previewImgModal = true;
            };
        }
        
    },
    watch: {
        initialValue() {
            this.translateMarkdown();
        }
    }


}
</script>

<style lang="less" scoped>
    @import '../assets/font/iconfont.css';


</style>
