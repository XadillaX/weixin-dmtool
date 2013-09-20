var wechaxServer = require("node-wechax").newServer("kacakacaANDkacakaca", 3001);

wechaxServer.on("text", function(sender, from, to, time, text, msgid) {
    var str = "你现在还发什么“" + text + "”啊！也不看看现在都已经" + new Date(Date.now()).getHours() + "点" + new Date(Date.now()).getMinutes() + "了！还不赶紧睡觉去！";
    sender.sendText(to, from, str);
});

wechaxServer.start();
