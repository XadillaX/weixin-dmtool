var _token = "kacakacaANDkacakaca";
var wxv = require("wxverify");

exports.index = function(req, res) {
    var result = wxv.verifyExpress(req, _token);
    if(false === result) {
        res.write("Invalid params.");
        res.end();
        return;
    }

    if(typeof result === "string") {
        res.write(result);
        res.end();
        return;
    }
};

exports.post = function(req, res) {
    var buf = "";
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        buf += chunk;
    });

    req.on('end', function() {
        var xml2json = require("node-xml2json");
        var json = xml2json.parser(buf);
        json = json["xml"];

        if(json["content"] === "福利") {
            var str = "<xml>";
            str += "    <ToUserName><![CDATA[" + json["fromusername"] + "]]></ToUserName>";
            str += "    <FromUserName><![CDATA[" + json["tousername"] + "]]></FromUserName>";
            str += "    <CreateTime>" + Date.parse(new Date()) + "</CreateTime>";
            str += "    <MsgType><![CDATA[news]]></MsgType>";
            str += "    <ArticleCount>1</ArticleCount>";
            str += "    <Articles>";
            str += "        <item>";
            str += "            <Title><![CDATA[(〃ノ∇ノ) 快递喵]]></Title>";
            str += "            <Description><![CDATA[喵一下就能偷窥快递的站子！喜欢我就“喵”一下～ ~(=^･ω･^)ﾉ☆]]></Description>";
            str += "            <PicUrl><![CDATA[http://kacaka.ca:3000/images/moe.jpg]]></PicUrl>";
            str += "            <Url><![CDATA[http://kacaka.ca:3000/]]></Url>";
            str += "        </item>";
            str += "    </Articles>";
            str += "</xml>";

            res.write(str);
            res.end();
        } else if(/喵[\s\S]*/g.exec(json["content"])) {
            res.write(wxv.genMsg(json["fromusername"], json["tousername"], "你个白痴！让你喵你还真喵啊！"));
            res.end();
        } else {
            res.write(wxv.genMsg(json["fromusername"], json["tousername"], "艹你妹啊！还不睡觉，现在都" + (new Date()).getHours() + "点" + (new Date()).getMinutes() + "啦！想看福利的话倒是可以输入\"福利\"。"));
            res.end();
        }
    });
}
