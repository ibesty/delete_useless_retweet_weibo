// 一键删除无用转发微博（已被删除，不可见）
// github：https://github.com/ibesty/delete_useless_retweet_weibo
// author： bestie

let total = 0;

(async function() {
    'use strict';

    await scrollToBotom();
})();

async function scrollToBotom() {
    // console.log('开始执行', document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight, document.documentElement.scrollHeight, document.querySelector('div[node-type=lazyload]'));
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });
    if ((document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight) && !document.querySelector('div[node-type=lazyload]')) {
        await changePage();
        return;
    }
    setTimeout(async() => { await scrollToBotom() }, 1000);
}

async function changePage(){
    const nextNode = document.querySelector('.page.next');
    const prevNode = document.querySelector('.page.prev');
    if (nextNode || prevNode) {
        let midList = getMid();
        for (let mid of midList){
            await delPost(mid);
        };
        if (!nextNode) {
            console.log('总共删除了' + total + '条无效微博');
            alert('总共删除了' + total + '条无效微博');
            return;
        } else {
            nextNode.click()
        }
        setTimeout(async() => { await scrollToBotom() }, 1000);
    }
}

function getMid(){
    let nodes = document.querySelectorAll('div[minfo]');
    let emptyNodes = [];
    for(let node of nodes) {
        let minfo = node.getAttribute('minfo');
        if (minfo && minfo.indexOf('ru=&') >= 0) {
            emptyNodes.push(node.getAttribute('mid'));
    }
    return emptyNodes;
}

async function delPost(mid) {
    const http = new XMLHttpRequest();
    const deleteApi = window.location.protocol + '//weibo.com/aj/mblog/del?ajwvr=6';
    const params = "mid=" + mid;
    http.open("POST", deleteApi, false);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            Promise.resolve(`${mid} 已被成功删除`);
            total ++;
        }
    }
    http.send(params);
    console.log(`${mid} 已被成功删除, 已经删除${total}条`);
    // setTimeout(() => { Promise.resolve('done') }, 200);
}
