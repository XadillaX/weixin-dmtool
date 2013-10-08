var spider = require("nodegrassex");
var querystring = require("querystring");
var xml2js = require("xml2js");
var nextProcessor = require("./chatter");
var path = require("path");

String.prototype.trim = function() {
    var str = this,
        whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0,len = str.length; i < len; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

function rand(max) {
    return new Number(Math.random() * max).toFixed(0);
};

function getArray(html) {
    var resoStr = '<span class="reso">';
    var urlStr = '<a href="http://wallbase.cc/wallpaper/';
    var picStr = 'data-original="';

    var array = [];
    var pos = html.indexOf(resoStr);
    while(pos !== -1) {
        //... blahblah ...
        var item = {};

        var npos = html.indexOf("</span>", pos);
        item.description = html.substring(pos + resoStr.length, npos);

        pos = html.indexOf(urlStr, npos);
        npos = html.indexOf('" target=', pos);
        item.url = html.substring(pos + urlStr.length, npos);

        pos = html.indexOf(picStr, npos);
        npos = html.indexOf('" class=', pos);
        item.pic = html.substring(pos + picStr.length, npos);

        item.vis = false;
        array.push(item);

        pos = html.indexOf(resoStr, npos);
    }

    return array;
}

exports.process = function(sender, msg) {
    var content = msg.content.trim();

    if(content.indexOf("壁纸") === 0) {
        content = content.substr(2).trim();
        var url = "http://wallbase.cc/search?q=" + content;
        spider.get(url, function(data, status, respheader) {
            var array = getArray(data);

            var narr = [];
            if(array.length <= 3) {
                narr = array;
                for(var i = 0; i < narr.length; i++) narr[i].title = i;
            } else {
                var cur = 0;
                while(cur < 3) {
                    var index = rand(arr.length - 1);
                    while(array[index].vis) index = rand(arr.length - 1);

                    array[index].vis = true;
                    cur++;
                    narr.push(array[index]);
                }
            }

            if(narr.length === 0) nextProcessor.process(sender, msg);
            else sender.sendRichContentBack(narr);
        }, "utf8").on("error", function(e) {
            nextProcessor.process(sender, msg);
            return;
        });

        return true;
    } else return false;
};
