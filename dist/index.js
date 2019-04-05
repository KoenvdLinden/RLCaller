"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const ConfigFile = require("./config");
const fs_1 = require("fs");
const client = new Discord.Client();
let commandDefinitions = {
    ah: './sound/ah.mp3',
    bitconnect: './sound/bitconnect.mp3',
    credits: './sound/credits.mp3',
    disgustang: './sound/disgustang.mp3',
    epicusaveuu: './sound/epicu-saveuu.mp3',
    estate: './sound/estate.mp3',
    gay: './sound/gay.mp3',
    goat: './sound/goat.mp3',
    iloveyou: './sound/iloveyou.mp3',
    jstn: './sound/jstn.mp3',
    KRAKAKA: './sound/KRAKAKA.mp3',
    milk: './sound/milk.mp3',
    noice: './sound/noice.mp3',
    ohohoh: './sound/ohohoh.mp3',
    oof: './sound/oof.mp3',
    pewdiepie: './sound/pewdepie.mp3',
    racist: './sound/racist.mp3',
    slap: './sound/slap.mp3',
    tingjong: './sound/tingjong.mp3',
    wednesday: './sound/wednesday.mp3',
    yodeling: './sound/yodeling.mp3',
};
const runCommand = (command, args, voiceConnection, msg) => {
    if (commandDefinitions[command]) {
        const volume = args[0] ? parseInt(args[0]) : 100;
        const stream = fs_1.createReadStream(commandDefinitions[command]);
        stream.once('open', () => {
            const dispatcher = msg.guild.voiceConnection.playStream(stream, {
                volume: volume / 100
            });
            dispatcher.on('end', () => {
                stream.close();
                msg.member.voiceChannel.leave();
            });
        });
    }
    if (command === 'disconnect') {
        voiceConnection.disconnect();
    }
    if (command === 'help') {
        let commandListMessage = '';
        Object.keys(commandDefinitions).forEach(value => {
            commandListMessage += `${value}\n`;
        });
        msg.reply(commandListMessage);
    }
    if (command === 'contribute') {
        msg.reply('https://github.com/KoenvdLinden/RLCaller');
    }
};
client.on("message", msg => {
    if (msg.author.bot) {
        return;
    }
    if (!msg.content.startsWith(ConfigFile.config.prefix)) {
        return;
    }
    if (!msg.member.voiceChannel) {
        msg.reply("You must be in a voice channel to summon me!!");
        return;
    }
    if (msg.guild.voiceConnection) {
        msg.guild.voiceConnection.disconnect();
        return;
    }
    const command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    const args = msg.content.split(" ").slice(1);
    msg.member.voiceChannel.join()
        .then((voiceConnection) => {
        runCommand(command, args, voiceConnection, msg);
    })
        .catch(console.log);
});
client.login(ConfigFile.config.token);
//# sourceMappingURL=index.js.map