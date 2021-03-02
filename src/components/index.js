// import {saveFile} from '../utils'
import defaultTools from '../config/tools'

export default{
    name: 'markdown',
    props: {
        value:{
            type: [String, Number],
            default: ''
        },
        theme:{ // 主题 默认
            type: String,
            default:'light'
        },
        width:{ // 初始化宽度
            type: [Number, String],
            default:'auto'
        },
        height:{ // 初始化高度
            type: Number,
            default: 600
        },
        toolbars:{ // 工具栏
            type: Object,
            default(){
                return {}
            }
        },
        bordered: {//是否有边框
            type: Boolean,
            default: true
        },
        autoSave: {// 是否自动保存
            type: Boolean,
            default: false
        },
        interval:{// 自动保存时间间隔 
            type: Number,
            default: 12000
        },
        exportFileName:{// 默认导出文件名称
            type: String,
            default:'markdown'
        },
        compilerOptions:{// 编译器配置项
            type: Object,
            default(){
                return {}
            }
        },
        copyCode: {// 复制代码
            type: Boolean,
            default: true
        },
        copyBtnText: {// 复制代码按钮文字
            type: String,
            default: '复制代码'
        },
        isPreview: {//是否是预览模式
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            currentValue:'', //输入框内容
            timeoutId:null,
            indexLenth:1,
            html:'', // 预览的html
            preview: false, // 是否有预览模式
            split: true, // 分屏显示
            fullscreen: false, // 是否全屏
            scrollSide: '', // 哪个半栏在滑动
            lastInsert: '', // 最后一次插入的内容
            timerId: null, // 定时器 id
            themeName:'',
            themeSlideDown:false,
            imgSlideDown:false,
            imgs:[],
            scrolling: true, // 同步滚动
            editorScrollHeight:0,
            previewImgModal:false,
            previewImgSrc: '',
            previewImgMode: ''
        };
    },
    computed:{
        tools(){
            const {toolbars = {}} = this;
            return {
                ...defaultTools,
                ...toolbars
            }
        }
    },




}


