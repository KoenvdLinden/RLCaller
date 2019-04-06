import * as Discord from "discord.js";
import {Message, VoiceConnection} from "discord.js";
import * as ConfigFile from "./config";
import {createReadStream} from "fs";

const client: Discord.Client = new Discord.Client();

let commandDefinitions = {
    ah: './sound/ah.mp3',
    bitconnect: './sound/bitconnect.mp3',
    credits: './sound/credits.mp3',
    disgustang: './sound/disgustang.mp3',
    epicusaveuu: './sound/epicu-saveuu.mp3',
    estate: './sound/estate.mp3',
    gay: './sound/gay.mp3',
    goat: './sound/goat.mp3',
    godsplan: './sound/godsplan.mp3',
    illuminati: './sound/illuminati.mp3',
    iloveyou: './sound/iloveyou.mp3',
    jstn: './sound/jstn.mp3',
    jurassicpark: './sound/jurassicpark.mp3',
    KRAKAKA: './sound/KRAKAKA.mp3',
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
};

const runCommand = (command: string, args: string[], voiceConnection: VoiceConnection, msg: Message) => {
    if (commandDefinitions[command]) {
        const volume = args[0] ? parseInt(args[0]) : 100;

        const stream = createReadStream(commandDefinitions[command]);

        stream.once('open', () => {
            const dispatcher = msg.guild.voiceConnection.playStream(stream, {
                volume: volume / 100
            });
            dispatcher.on('end', () => {
                stream.close();
                msg.member.voiceChannel.leave();
            });
        });
        
        return;
    }

    if (command === 'help') {
        let commandListMessage = Object.keys(commandDefinitions).join(', ');
        msg.reply(commandListMessage);
    }

    if (command === 'contribute') {
        msg.reply('https://github.com/KoenvdLinden/RLCaller');
    }

    voiceConnection.disconnect();
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