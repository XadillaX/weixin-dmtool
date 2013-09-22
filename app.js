var wechaxServer = require("node-wechax").newServer("kacakacaANDkacakaca", 3001);

var chatter = require("./chatter");
var songsearcher = require("./songsearcher");

wechaxServer.on("text", function(sender, msg) {
    /**
     * 先搜歌
     */
    if(songsearcher.process(sender, msg)) {
        return;
    }

    chatter.process(sender, msg);
});

wechaxServer.start();
