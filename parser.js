const Discord = require('discord.js');
const fs = require('fs');

const DebugCommands = require('./commands/debugCommands.js');
const GameCommands = require('./commands/gameCommands.js');

class ParserLib {
    static Parse (message, args, client) {
        const command = args.shift().toLowerCase(); //cut the command from the rest of the input
        console.log(`[${message.id}]${message.author.username}: -${command} ${args}`);
        switch(command) { // Check command against known commands
            case 'help':
                DebugCommands.Help(message);
                break;
            case 'info':
                DebugCommands.Info(message);
                break;
            case 'bot':
                DebugCommands.Bot(message);
                break;
            case 'ping':
                DebugCommands.Ping(message);
                break;
            case 'test':
                DebugCommands.Test(message, client);
                break;
            case 'gif':
                DebugCommands.Gif(message, args);
                break;
            case 'an':
                DebugCommands.AnimeGif(message, args);
                break;
            case 'meme':
                DebugCommands.MemeGif(message, args);
                break;
            case 'flavor':
                DebugCommands.Flavor(message);
                break;
            case 'count':
                GameCommands.Count(message);
                break;
            case 'createnew':
                GameCommands.CreateCharacter(message);
                break;
            case 'stats':
                GameCommands.GetCharacter(message);
                break;
            case 'level':
                GameCommands.GetLevel(message);
                break;
            case 'location':
                GameCommands.GetLocation(message);
                break;
            case 'local':
                GameCommands.GetLocation(message);
                break;
            case 'enter':
                GameCommands.Enter(message, args);
                break;
            case 'leave':
                GameCommands.Leave(message, args);
                break;
            case 'forward':
                GameCommands.Forward(message);
                break;
            case 'search':
                GameCommands.Search(message);
                break;
            case 'attack':
                GameCommands.Attack(message);
                break;
            case 'fight':
                GameCommands.Fight(message);
                break;
            case 'heal':
                GameCommands.Heal(message);
                break;
            case 'use':
                GameCommands.Use(message, args);
                break;
            case 'upgrade':
                GameCommands.Upgrade(message, args);
                break;
            default:
                const embed = new Discord.MessageEmbed()
                    .setColor('#fc0303')
                    .setDescription(`\`-${command}\` is not a valid command.`)
                    .setTimestamp()
                    .setFooter('DISbot/DISAdventure by Kieee');
                message.channel.send(embed);
        }
    }
}

module.exports = ParserLib;