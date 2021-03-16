/* eslint-disable */

class simpleMarkdown {
    constructor(src){
        this.rules = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
            fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
            hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
            heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( {0,3})(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: `^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))` /* optional indentation*/ /* (1)*/ /* (2)*/ /* (3)*/ /* (4)*/ /* (5)*/ /* (6)*/ /* (7) open tag*/ /* (7) closing tag*/,
                nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
                table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/,
                paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
                text: /^[^\n]+/,
                bullet: /(?:[*+-]|\d{1,9}\.)/
        }

        this.inline_rules = {
            escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
            autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
            url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
            link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
            strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
            em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
            code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
            br: /^( {2,}|\\)\n(?!\s*$)/,
            // del: /^~+(?=\S)([\s\S]*?\S)~+/,
            text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
        }

        src = src
                .replace(/\r\n|\r/g, '\n')
                .replace(/\t/g, '    ')
                .replace(/\u00a0/g, ' ')
                .replace(/\u2424/g, '\n');
        this.tokens = [];
        this.token(src,true);
        this.html = this.tokensToHtml(this.tokens);
    }

    rules_ref(){
        this.rules.list = this.edit(this.rules.list).replace(/bull/g, /(?:[*+-]|\d{1,9}\.)/).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').getRegex();
    }

    token(src,top){

        this.rules_ref()
        
        src = src.replace(/^ +$/gm, '');
        var cap, 
            bull, 
            item,        
            isordered;
    
    
        while (src) {
            // newline 新行筛选
            if(cap = this.rules.newline.exec(src)){
                src = src.substring(cap[0].length);
                if (cap[0].length > 1){
                    this.tokens.push('');
                }
            }
    
            // code 
            if (cap = this.rules.code.exec(src)) {
                var lastToken = this.tokens[this.tokens.length - 1];
                src = src.substring(cap[0].length);
                // An indented code block cannot interrupt a paragraph.
                // 缩进不应该中断段落
                if (lastToken && lastToken.type === 'paragraph') {
                    lastToken.text += '\n' + cap[0].trimRight();
                } else {
                    cap = cap[0].replace(/^ {4}/gm, '');
                    this.tokens.push('<pre><code>' +cap +'</code></pre>'
                        );
                }
                continue;
            }
    
            // fences 代码块内容
            if (cap = this.rules.fences.exec(src)) {
                src = src.substring(cap[0].length);
                // console.log(cap)
                let lang = cap[2] ? cap[2].trim() : cap[2];
                this.tokens.push('<pre><code class ="'+lang+'">'+ cap[3] +'</code></pre>\n');
                continue;
            }
    
            // heading 标题内容
            if (cap = this.rules.heading.exec(src)){
                src = src.substring(cap[0].length);
                this.tokens.push('<h' + cap[1].length + '>' + cap[2] + '</h' + cap[1].length + '>' + '\n');
                continue;
            }
    
            // hr 分割行类型
            if (cap = this.rules.hr.exec(src)){
                src = src.substring(cap[0].length);
                this.tokens.push('<hr/>');
                continue;
            }
            
            // blockquote 块状引用
            if (cap = this.rules.blockquote.exec(src)){
                src = src.substring(cap[0].length);
                this.tokens.push('<blockquote style="background: #ccc">');
                cap = cap[0].replace(/^ *> ?/gm, '');
                this.token(cap, top);
                this.tokens.push('</blockquote>');
                continue;
            }
    
        // list
        if (cap = this.rules.list.exec(src)) {
            src = src.substring(cap[0].length);
            bull = cap[2];
            isordered = bull.length > 1;

            // console.log(cap);
            let itemList = cap[0].split('\n').map(item => item.slice(2,item.length).trim());
            itemList.pop();
            // console.log(itemList)

            let begin = isordered? '<ol>\n':'<ul>\n'
            let end = isordered? '</ol>\n':'</ul>\n'

            this.tokens.push(begin);

            for (let i=0;i<itemList.length-1;i++){
                this.tokens.push('<li>'+itemList[i]+'</li>\n');
            }


                
            this.tokens.push(end);

            continue;
        }
    
            // table 表格项目
            if (cap = this.rules.table.exec(src)) {
                item = {
                    header: this.splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                };
    

                if (item.header.length === item.align.length) {
                    src = src.substring(cap[0].length);
    
                    for (let i = 0; i < item.align.length; i++) {
                        if (/^ *-+: *$/.test(item.align[i])) {
                            item.align[i] = 'right';
                        } else if (/^ *:-+: *$/.test(item.align[i])) {
                            item.align[i] = 'center';
                        } else if (/^ *:-+ *$/.test(item.align[i])) {
                            item.align[i] = 'left';
                        } else {
                            item.align[i] = null;
                        }
                    }
    
                    for (let i = 0; i < item.cells.length; i++) {
                        item.cells[i] = this.splitCells(
                            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
                            item.header.length);
                    }
    
                    // 渲染处理 table
                    let header = '', body = '', row,cell,j;
                                // header
                    cell = '';
                    for (let i = 0; i < item.header.length; i++) {
                        cell += this.rendererTablecell(
                        this.paserInline(item.header[i]),
                        {header: true, align: item.align[i]}
                        );
                        }
                    header += this.rendererTablerow(cell);

                    for (let i = 0; i < item.cells.length; i++) {
                        row = item.cells[i];

                        cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.rendererTablecell(
                        this.paserInline(row[j]),
                        {header: false, align: item.align[j]}
                            );
                    }

                    body += this.rendererTablerow(cell);
                    }
                    let result = this.rendererTable(header, body);
                    this.tokens.push(result);
                    
                    continue;
                }
            }
    
            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
                src = src.substring(cap[0].length);
                let text = cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
                this.tokens.push(
                    this.paserInline(text)
                );
                continue;
            }
    
            // 文本 
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push(cap[0]);
                continue;
            }
    
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }    
        }

    }
    splitCells(tableRow, count) {
        // ensure that every cell-delimiting pipe has a space
        // before it to distinguish it from an escaped pipe
        var row = tableRow.replace(/\|/g, function (match, offset, str) {
                var escaped = false,
                    curr = offset;
                while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
                if (escaped) {
                    // odd number of slashes means | is escaped
                    // so we leave it alone
                    return '|';
                } else {
                    // add space before unescaped |
                    return ' |';
                }
            }),
            cells = row.split(/ \|/),
            i = 0;
    
        if (cells.length > count) {
            cells.splice(count);
        } else {
            while (cells.length < count) cells.push('');
        }
    
        for (; i < cells.length; i++) {
            // leading or trailing whitespace is ignored per the gfm spec
            cells[i] = cells[i].trim().replace(/\\\|/g, '|');
        }
        return cells;
    }

    edit(regex, opt) {
        regex = regex.source || regex;
        opt = opt || '';
        return {
            replace: function (name, val) {
                val = val.source || val;
                val = val.replace(/(^|[^\[])\^/g, '$1');
                regex = regex.replace(name, val);
                return this;
            },
            getRegex: function () {
                return new RegExp(regex, opt);
            }
        };
    }

    paserInline(src){
        var out = '',
            link,
            href,
            title,
            cap;

    
        while (src) {
    
            // link
            if (cap = this.inline_rules.link.exec(src)) {
                var lastParenIndex = findClosingBracket(cap[2], '()');
                if (lastParenIndex > -1) {
                    var linkLen = 4 + cap[1].length + lastParenIndex;
                    cap[2] = cap[2].substring(0, lastParenIndex);
                    cap[0] = cap[0].substring(0, linkLen).trim();
                    cap[3] = '';
                }
                src = src.substring(cap[0].length);
                this.inLink = true;
                href = cap[2];
                title = cap[3] ? cap[3].slice(1, -1) : '';
                href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
                out += this.outputLink(cap, {
                    href: InlineLexer.escapes(href),
                    title: InlineLexer.escapes(title)
                });
                this.inLink = false;
                continue;
            }
    
    
            // strong
            if (cap = this.inline_rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += '<strong>' + this.paserInline(cap[4] || cap[3] || cap[2] || cap[1])+ '</strong>';
                continue;
            }
    
            // em
            if (cap = this.inline_rules.em.exec(src)) {
                src = src.substring(cap[0].length);
                out += '<em>'+ this.paserInline(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1])+'</em>';
                continue;
            }
    
            // code
            if (cap = this.inline_rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                out += '<code>'+(escape(cap[2].trim(), true)) + '</code>';
                continue;
            }
    
            // br
            if (cap = this.inline_rules.br.exec(src)) {
                src = src.substring(cap[0].length);
                out += '<br>';
                continue;
            }
        
            // text
            if (cap = this.inline_rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                    out += cap[0]
                }
                continue;
            }
    
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }

            return out;
        }

        // outputLink(cap,link){
        //     var href = link.href,
        //     title = link.title ? this.escape(link.title) : null;
    
        // return cap[0].charAt(0) !== '!'
        //     ? this.renderer.link(href, title, this.output(cap[1]))
        //     : this.renderer.image(href, title, this.escape(cap[1]));
        // }

        rendererTablerow (content){
            return '<tr>\n' + content + '</tr>\n';
        }
        rendererTablecell(content, flags) {
            var type = flags.header ? 'th' : 'td';
            var tag = flags.align
                ? '<' + type + ' align="' + flags.align + '">'
                : '<' + type + '>';
            return tag + content + '</' + type + '>\n';
        }

        rendererTable (header, body) {
                if (body) body = '<tbody>' + body + '</tbody>';
            
                return '<table>\n'
                    + '<thead>\n'
                    + header
                    + '</thead>\n'
                    + body
                    + '</table>\n';
            }

        tokensToHtml(tokens){
            // console.log('链接')
            return tokens.join('')
        }

        escape(html, encode) {
            if (encode) {
                if (escape.escapeTest.test(html)) {
                    return html.replace(escape.escapeReplace, function (ch) {
                        return escape.replacements[ch];
                    });
                }
            } else {
                if (escape.escapeTestNoEncode.test(html)) {
                    return html.replace(escape.escapeReplaceNoEncode, function (ch) {
                        return escape.replacements[ch];
                    });
                }
            }
        
            return html;
        }
    }


export default simpleMarkdown;



