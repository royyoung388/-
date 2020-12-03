// ==UserScript==
// @name        慕课自动播放
// @namespace   royyoung388.whu.mooc
// @description 慕课自动播放
// @match       *://mooc1.mooc.whu.edu.cn/*
// @version     1.0
// @grant       none
// ==/UserScript==
window.frameElement.setAttribute("fastforward", "false");
window.frameElement.setAttribute("switchwindow", "false");
var t = {};

// 寻找下一课的链接
function findNext() {
    var h = Array.from(window.parent.parent.document.body.getElementsByTagName('h4'));
    if (h && h.length > 10) {
        h.some(function (l, i) {
            if (l.className.includes('currents')) {
                t.cur = l;
                t.next = h[i + 1];
                t.href = t.next.getElementsByTagName('a')[0].getAttribute('href');
                return true;
            }
        });
    }
}

//自动播放
var i = setInterval(autoPlay, 10);

function autoPlay() {
    var MoocPlayer = document.getElementById("video_html5_api");

    if (MoocPlayer) {
        clearInterval(i);

        findNext();

        //静音下才能自动播放
        MoocPlayer.muted= true;
        MoocPlayer.autoplay = true;

        MoocPlayer.addEventListener("ended", function() {
            console.log('video ended');
            t.cur.className = '';
            t.next.className = 'currents';
            window.parent.parent.eval(t.href);
            i = setInterval(autoPlay, 10);
        }, true);

        MoocPlayer.addEventListener("loadstart", function() {
            console.log('video start');
            MoocPlayer.play();
        }, true);
    } else {
        if (i) {
            clearInterval(i);
        }
        i = setInterval(autoPlay, 10);
    }
}
