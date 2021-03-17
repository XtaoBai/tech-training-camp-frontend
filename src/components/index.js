import Codemirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import '../assets/js/codemirror/style/codemirror.css';
import common from '../mixins/common';
// import marked from '../assets/js/marked';
// import micromarkdown from '../assets/js/micromarkdown'
import simpleMarkdown from '../assets/js/simpleMarkdown';

export default {
    name: 'markdown-main',
    mixins: [common],
    
    data(){
        return{
            main: true,
            editor: null, // 编辑器实例
            lastPosition: '' // 光标最后定位位置
        };
    },

    mounted() {
        this.init();
        this.createEditor();
    },
    methods: {
        init() { // 初始化
            this.currentValue = this.value;
            this.themeName = this.theme;
            this.preview = this.isPreview;

            if (this.isPreview){
                return;
            }
            setTimeout(() =>{
                if (this.autoSave){
                    this.timerId = setInterval(()=>{
                        this.handleSave();
                    }, this.interval);
                }
            }, 20);
        },
        createEditor(){ // 初始化编辑器
            this.editor = new Codemirror(this.$refs.codemirror,{
                value: this.currentValue,
                // 这里使用window.onload 加载
                onload: (data) => {
                    // 提取高度值
                    const {doc:{height = 0}} = data;
                    this.editorScrollHeight = height;
                },
                tabSize: 4, //tab 大小为4
                styleActiveLine: true, // 当前行背景高亮
                lineNumbers: true, // matchBrackets 括号匹配
                lineWrapping: false, // HTML 混合模式
                line: true, // 括号匹配
                mode: 'text/x-src', // 模式方法
                theme: 'default', //风格模板
                cursorHeight:0.8, // 光标高度
                lineWiseCopyCut:true // 没有选择的情况下复制/剪切 有光标的整行
            });
            this.addEditorListener();
            this.$emit('on-ready',{
                vm: this,
                insertContent: this.insertContent
            })
        },
        addEditorListener(){ //绑定监听事件
            // 监听数据改变， 窗口滚动，粘贴，键盘输入等事件

            const editor = this.editor;
            // 当编辑器发生数据变化时，启发修改
            editor.on('change', data=>{
                this.lastPosition = editor.getCursor();
                this.currentValue = editor.getValue();
                const { doc:{height} }= data;
                this.editorScrollHeight = height; 
            });
            // 交给 markdownScroll 方法
            editor.on('scroll', this.markdownScroll);
            // 交给粘贴方法
            editor.on('paste',this.handlePaste);
            // 键盘输入内容
            editor.on('keydown',(data, e) => {
                // 处理保存 keyCode === 83 为 ‘s’ 键
                if (e.keyCode === 83){
                    // mac 及 mac
                    if (e.metaKey || e.ctrlKey) {
                        // 处理保存
                        e.preventDefault();
                        this.handleSave();
                }
                } else if (e.keyCode === 13) {
                // 处理回车键
                this.listerenKeyupEnter(e);
                } else if (e.keyCode === 8) {
                // 处理退格键
                this.listenerDelete(data);
                }
            });
            editor.on('focus', () => {
                this.lastPosition = editor.getCursor();
            });
        },
        insertContent(str){ // 插入文本 
            // 作为下面的调用方法
            this.editor.replaceSelection(str);
            this.lastInsert = str.replace(/\n/g, '');

        },
        setCursor(line = 0, ch = 0){ 
            // 设定焦点情况 设定焦点位置并集中
            // 为后面插入符号切换做准备
            const {editor} = this;
            editor.setCursor(line,ch);
            editor.focus();
        },

        insertStrong() { // 设定粗体
            const {editor, lastPosition = {}} = this;
            const {line = 0, ch = 0 } = lastPosition;
            // 获取目前是否选取内容
            const selection = editor.getSelection();
                if(selection) {
                    this.insertContent('**' + selection + '**');
                } else{
                    this.insertContent('****');
                    this.setCursor(line, ch + 2);
                }

        },
        insertItalic() {// 斜体
            const {editor, lastPosition ={}} = this;
            const {line = 0, ch = 0 } = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('*' + selection +'*');
            } else {
                this.insertContent('**');
                this.setCursor(line, ch + 1);
            }
        },
        insertUnderline() {// 下划线
            const {editor, lastPosition = {} } =this;
            const {line =0, ch = 0 } = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('<u>' + selection + '</u>');
            } else {
                this.insertContent('<u></u>');
                this.setCursor(line, ch + 3);
            }

        },
        insertOverline(){ //插入啥出现删除线 
            const {editor, lastPosition = {} } = this;
            const {line = 0, ch = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('~~' + selection + '~~');
            } else {
                this.insertContent('~~~~');
                this.setCursor(line, ch + 2);
            }

        }, 
        insertTitle(level) {
            // 插入标题
            const titles = {
                1: '#  ',
                2: '##  ',
                3: '###  ',
                4: '####  ',
                5: '#####  ',
                6: '######  '
            };
            const {editor, lastPosition = {}} = this;
            const {line} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n' + titles[level] + selection + '\n');
            } else {
                const title = titles[level];
                if (editor.isClean()) {
                    this.insertContent(title);
                    this.setCursor(0, title.length);
                } else {
                    this.insertContent('\n' + title);
                    this.setCursor(line + 1, title.length);
                }
            }

        },
        insertLine() { // 插入分割线
            const {editor} = this;
            if (editor.isClean()){
                this.insertContent('----\n');
            } else {
                this.insertContent('\n\n----\n')
            }
        },
        insertQuote() { // 插入引用
            const {editor, lastPosition = {}} = this;
            const {line = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n>  ' + selection + '\n\n');
            } else {
                if (editor.isClean()) {
                    this.insertContent('>  ');
                    this.setCursor(0, 3);
                } else {
                    this.insertContent('\n>  ');
                    this.setCursor(line + 1, 3);
                }
            }
        },
        insertUl(){ // 无序列表
            const {editor, lastPosition = {}} = this;
            const {line = 0, ch = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n-  ' + selection + '\n\n');
            } else {
                if (editor.isClean() || ch === 0) {
                    this.insertContent('-  ');
                    this.setCursor(line, 3);
                } else {
                    this.insertContent('\n-  ');
                    this.setCursor(line + 1, 3);
                }
            }
        },
        insertOl() {// 有序列表
            const {editor, lastInsert ,lastPosition = {}} = this;
            const {line = 0, ch = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n1.  ' + selection + '\n\n');
            } else {
                if (editor.isClean() || ch === 0) {
                    this.insertContent('1.  ');
                    this.setCursor(line, 4);
                }else if (/^\d+\.$/.test(lastInsert.trim())){
                    this.insertContent(
                        '\n' + (parseInt(lastInsert, 10)+ 1) + '.  '
                    );
                } else {
                    this.insertContent('\n1.  ');
                    this.setCursor(line + 1, 4);
                }
            }
        },
        insertCode() {//插入code
            const {editor, lastPosition = {}} = this;
            const {line} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n```\n' + selection + '\n```\n');
            } else {
                if (editor.isClean()) {
                    this.insertContent('```\n\n```');
                    this.setCursor(1, 0);
                } else {
                    this.insertContent('\n```\n\n```');
                    this.setCursor(line + 2, 0);
                }
            }
        },
        insertFinished() {// 已完成列表
            const {editor, lastPosition = {}} = this;
            const {line = 0, ch = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n- [x] ' + selection + '\n\n');
            } else {
                if (editor.isClean() || ch === 0) {
                    this.insertContent('- [x] ');
                    this.setCursor(line, 6);
                } else {
                    this.insertContent('\n- [x] ');
                    this.setCursor(line + 1, 6);
                }
            }
        },
        insertNotFinished() {// 未完成列表
            const {editor, lastPosition = {}} = this;
            const {line = 0, ch = 0} = lastPosition;
            const selection = editor.getSelection();
            if (selection) {
                this.insertContent('\n- [ ] ' + selection + '\n\n');
            } else {
                if (editor.isClean() || ch === 0) {
                    this.insertContent('- [ ] ');
                    this.setCursor(line, 6);
                } else {
                    this.insertContent('\n- [ ] ');
                    this.setCursor(line + 1, 6);
                }
            }
        },
        listerenKeyupEnter(e){// 回车事件
            const {lastInsert} = this;
            if (lastInsert) {
                const list = ['-', '- [ ]', '- [x]'];
                if (list.includes(lastInsert.trim())){
                    e.preventDefault();
                    this.insertContent('\n' + lastInsert);

                } else if (/^\d+\.$/.test(lastInsert.trim())){
                    e.preventDefault();
                    this.insertContent(
                        '\n' + (parseInt(lastInsert, 10)+ 1) + '.  '
                    );
                }
            }

        },
        listenerDelete() { // 删除如果中间空了值 不能再次插入列表
            setTimeout(() =>{
                const {editor} = this;
                if (!editor.isClean()){
                    const value = editor.getValue();
                    if (value.split('\n').pop()===''){
                        this.lastInsert = '';
                    }
                }
            }, 20);
        },
        onDelete(){ // 删除时，以回车为界分割，若最后一个元素为空，则把最后一个插入数值删除，避免在此插入
            const lines = this.currentValue.split('\n');
            if(lines[lines.length - 1] === ''){
                this.lastInsert = '';
            }
        },
        markdownScroll(data = {}) { // 控制编辑区滚动
            if (this.scrolling && this.scrollSide === 'left') {
                const {doc:{height, scrollTop}} = data;
                const preview = this.$refs.preview;
                const contentHeight = preview.offsetHeight;
                const previewScrollHeight = preview.scrollHeight;
                preview.scrollTop = parseInt(
                    (scrollTop * (previewScrollHeight - contentHeight)) / (height - contentHeight), 10);
            }

        },
        previewScroll() { // 预览区域滚动
            if (this.scrolling && this.scrollSide === 'right') {
                const preview = this.$refs.preview;
                const contentHeight = preview.offsetHeight;
                const previewScrollHeight = preview.scrollHeight;
                const previewScrollTop = preview.scrollTop;
                const scrollTop = parseInt(
                    (previewScrollTop * (this.editorScrollHeight - contentHeight)) / (previewScrollHeight - contentHeight), 10);
                    this.editor.scrollTo(0,scrollTop);
            }
        },
        redo() {
            const {editor} = this;
            editor.redo();
            setTimeout(() => {
                editor.refresh();
            }, 20);
        }
    },
    watch: {
        currentValue() {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                const {currentValue} = this;
                // let html = micromarkdown.parse(currentValue)
                // console.log(html)
                let data = new simpleMarkdown(currentValue)
                let html = data.html;
                //     , {
                //     sanitize: false,
                //     // ...this.markedOptions
                // }
                // if (this.copyCode && html !== '') {
                //     html = html.replace(/<pre>/g, '<div class="code-block"><span class="copy-code">' + this.copyBtnText + '</span><pre>').replace(/<\/pre>/g, '</pre></div>')
                // }
                this.html = html;
                this.addImageClickListener();
                this.addCopyListener();
                this.$emit('input', currentValue);
            }, 30);
        },
        value() {
            const {value, currentValue} = this;
            if (currentValue !== value) {
                // 由于用户输入而造成的value变化，不对editor设置值
                this.currentValue = value;
                this.editor.setOption('value', value);
        }
        }
    }
};
