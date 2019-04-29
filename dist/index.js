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
    deeznuts: './sound/deeznuts.mp3',
    disgustang: './sound/disgustang.mp3',
    epicusaveuu: './sound/epicu-saveuu.mp3',
    estate: './sound/estate.mp3',
    eternetylater: './sound/eternetylater.mp3',
    gay: './sound/gay.mp3',
    goat: './sound/goat.mp3',
    godsplan: './sound/godsplan.mp3',
    illuminati: './sound/illuminati.mp3',
    iloveyou: './sound/iloveyou.mp3',
    jstn: './sound/jstn.mp3',
    jurassicpark: './sound/jurassicpark.mp3',
    KRAKAKA: './sound/KRAKAKA.mp3',
    legitness: './sound/legitness.mp3',
    milk: './sound/milk.mp3',
    noice: './sound/noice.mp3',
    ohohoh: './sound/ohohoh.mp3',
    oof: './sound/oof.mp3',
    pewdiepie: './sound/pewdepie.mp3',
    racist: './sound/racist.mp3',
    run: './sound/run.mp3',
    slap: './sound/slap.mp3',
    tingjong: './sound/tingjong.mp3',
    wasted: './sound/wasted.mp3',
    wednesday: './sound/wednesday.mp3',
    yeahboyyy: './sound/yeahboyyy.mp3',
    yodeling: './sound/yodeling.mp3',
    consequences: './sound/consequences.mp3',
};
const disconnectTimeoutTime = 120000;
const defaultVolume = 100;
const disconnectTimeout = {};
const dispatcher = {};
const resetTimeout = (voiceChannel) => {
    if (disconnectTimeout[voiceChannel.guild.id] !== null) {
        clearTimeout(disconnectTimeout[voiceChannel.guild.id]);
    }
    disconnectTimeout[voiceChannel.guild.id] = setTimeout(() => {
        voiceChannel.leave();
    }, disconnectTimeoutTime);
};
const randomCommand = () => {
    return Object.keys(commandDefinitions)[Math.floor(Math.random() * Object.keys(commandDefinitions).length)];
};
const runCommand = (command, args, voiceConnection, msg) => {
    resetTimeout(voiceConnection.channel);
    if (commandDefinitions[command]) {
        const volume = args[0] ? parseInt(args[0]) : defaultVolume;
        const stream = fs_1.createReadStream(commandDefinitions[command]);
        stream.once('open', () => {
            if (dispatcher[msg.guild.id]) {
                dispatcher[msg.guild.id].end();
            }
            dispatcher[msg.guild.id] = msg.guild.voiceConnection.playStream(stream, {
                volume: volume / 100
            });
            dispatcher[msg.guild.id].on('end', () => {
                stream.close();
            });
        });
        return;
    }
    if (command === 'disconnect') {
        voiceConnection.channel.leave();
        disconnectTimeout[voiceConnection.channel.guild.id] = null;
    }
    if (command === 'help') {
        let commandListMessage = Object.keys(commandDefinitions).join(', ');
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
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    const args = msg.content.split(" ").slice(1);
    if (command === 'random') {
        command = randomCommand();
    }
    if (msg.guild.voiceConnection) {
        runCommand(command, args, msg.guild.voiceConnection, msg);
        return;
    }
    msg.member.voiceChannel.join()
        .then((voiceConnection) => {
        runCommand(command, args, voiceConnection, msg);
    })
        .catch(console.log);
});
client.login(ConfigFile.config.token);
//# sourceMappingURL=index.js.map