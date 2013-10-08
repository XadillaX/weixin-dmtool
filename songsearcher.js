var spider = require("nodegrassex");
var querystring = require("querystring");
var xml2js = require("xml2js");
var nextProcessor = require("./wallpapersearcher");
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
}

function sendMusic(sender, msg, title, json) {
    var urlObject = json.url[rand(json.count[0] - 1)];

    /**
     * {
     *     encode   : [ "url" ],
     *     decode   : [ "name" ],
     *     type     : [ ]
     *     lrcid    : [ ]
     *     flag     : [ ]
     * }
     */
    try {
        var url = urlObject.encode[0];
        var decode = urlObject.decode[0];
        url = path.dirname(url);
        url += "/" + decode;

        sender.sendMusicBack(title, "这就是你要的歌啦~喵~", url, url);
        return;
    } catch(e) {
        nextProcessor.process(sender, msg);
    }
};

exports.process = function(sender, msg) {
    var content = msg.content.trim();

    if(content.indexOf("搜歌") === 0 || content.indexOf("找歌") === 0 ||
        content.indexOf("听歌") === 0 || content.indexOf("我要听") === 0) {
        if(content.indexOf("我要听") === 0) content = content.substr(3);
        else content = content.substr(2);
        content = content.trim();

        /**
         * The API url of BAIDU.
         * @type {string}
         */
        var url = "http://box.zhangmen.baidu.com/x?op=12&count=1&mtype=1&";
        var param = [
            { "title" : content + "$$$$$$" },
            { "title" : "$$$$" + content + "$$" }
        ];
        var paramstring = [
            querystring.stringify(param[0]),
            querystring.stringify(param[1])
        ];

        /**
         * Fetch song information from baidu. (via song name)
         */
        content = content.trim();
        spider.get(url + paramstring[0], function(data, status, respheader) {
            xml2js.parseString(data, function(err, json) {
                if(err) {
                    nextProcessor.process(sender, msg);
                    return true;
                }

                if(typeof json["result"] !== "object" || json["result"].count[0] < 0) {
                    nextProcessor.process(sender, msg);
                    return true;
                }
                json = json["result"];
                if(json.count[0] != 0) {
                    sendMusic(sender, msg, content, json);
                    return true;
                } else {
                    spider.get(url + paramstring[1], function(data, status, respheader) {
                        xml2js.parseString(data, function(err, json) {
                            if(err) {
                                nextProcessor.process(sender, msg);
                                return true;
                            }

                            if(typeof json["result"] !== "object" || json["result"].count[0] < 0) {
                                nextProcessor.process(sender, msg);
                                return true;
                            }
                            json = json["result"];
                            if(json.count[0] != 0) {
                                sendMusic(sender, msg, content, json);
                            }
                            else nextProcessor.process(sender, msg);
                        });
                    });
                }
            });
        });

        return true;
    } else return false;
};
