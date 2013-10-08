var wechaxServer = require("node-wechax").newServer("kacakacaANDkacakaca", 3001);

var chatter = require("./chatter");
var songsearcher = require("./songsearcher");
var wallpapersearcher = require("./wallpapersearcher");

wechaxServer.on("text", function(sender, msg) {
    /**
     * 先搜歌
     */
    if(songsearcher.process(sender, msg)) {
        return;
    }

    /**
     * 再搜壁纸
     */
    if(wallpapersearcher.process(sender, msg)) {
        return;
    }

    chatter.process(sender, msg);
});

wechaxServer.start();
