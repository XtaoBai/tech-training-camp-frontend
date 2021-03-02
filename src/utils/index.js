/** 
 * 保存文档到本地
 * 
 * 
*/

export function saveFile(fileData, name){
    var pom = document.createElement('a');
    pom.setAttribute('href','data:text/plain;charset=UTF-8' + encodeURIComponent(fileData));
    pom.setAttribute('download',name);
    pom.style.display = 'none';
    // 兼容性设计
    if (document.createElement){
        const event = document.createEvent('MouseEvents');
        event.initEvent('click',true,true)
        pom.dispatchEvent(event)
    } else {
        pom.click()
    }
}