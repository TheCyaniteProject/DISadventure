const Discord = require('discord.js');
const Tenor = require('tenorjs').client({
    "Key": "NKUZ44OLOC2C", // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

class DebugCommands { // Default commands for testing

    static Ping(message) {
        message.channel.send('Pong!');
    }

    static Test(message, client) {
        message.channel.send(`${message.author}`);
    }
    
    static Flavor(message) { // Formatting test
        message.channel.send('> _You see a shadow to the side of you. You quickly look over, but nothing is there. Suddenly- behind you- you hear a dark voice say; **This is some flavor text..**_');
    }

    static Gif(message, args) { // Formatting test
        var items = Tenor.Search.Query(`${args}`, "6").then(Results => {
            var item = Results[Math.floor(Math.random() * Results.length)];
            message.channel.send(`${message.author.username} ${args}\n${item.url}`);
            console.log(`${message.author.username} ${args}: ${item.url}`);
        }).catch(console.error);
    }
    static AnimeGif(message, args) { // Formatting test
        var items = Tenor.Search.Query(`anime ${args}`, "6").then(Results => {
            var item = Results[Math.floor(Math.random() * Results.length)];
            message.channel.send(`${message.author.username} ${args} [anime]\n${item.url}`);
            console.log(`[anime] ${message.author.username} ${args}: ${item.url}`);
        }).catch(console.error);
    }
    static MemeGif(message, args) { // Formatting test
        var items = Tenor.Search.Query(`meme ${args}`, "6").then(Results => {
            var item = Results[Math.floor(Math.random() * Results.length)];
            message.channel.send(`${message.author.username} ${args} [Meme]\n${item.url}`);
            console.log(`[meme] ${message.author.username} ${args}: ${item.url}`);
        }).catch(console.error);
    }
    /*static MemeGif(message, args) { // Formatting test
        var items = Tenor.Search.Query(`meme ${args}`, "6").then(Results => {
            var item = Results[Math.floor(Math.random() * Results.length)];
            const playerStats = new Discord.MessageEmbed()
                .setColor('#8803fc')
                .setAuthor('[Meme]')
                .setTitle(`${message.author.username} ${args}`)
                .setImage(`https://tenor.com/view/ight-take-me-to-jail-imma-head-out-sponge-bob-meme-sobriety-test-gif-15112733`)
                .setTimestamp()
                .setFooter('DISbot by Kieee');
            message.channel.send(playerStats);
            console.log(`[meme] ${message.author} ${args}: ${item.url}`);
        }).catch(console.error);
    }*/

    static Info(message) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setAuthor('DISadventure by Kieee')
            .setTitle('DISadventure Info')
            .setDescription('DISadventure is a DIScord bot that sets you on an adventure!\n(see what I did there? hehe)'
            + '\nFor a list of available commands try \`-help\`'
            + '\n\n>Game description and lore goes here<')
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
    }
    static Help(message) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setAuthor('DISadventure by Kieee')
            .setTitle('DISadventure Help')
            .setDescription(
                '\`-info\` - Info on this bot, and what it does.'
                + '\n\`-createnew\` - Create a character, if you don\'t already have one.'
                + '\n\`-enter <location>\` - Enter a location. Use by itself for a list of available locations.'
                + '\n\`-leave\` - Leave your current location, if possible.'
                + '\n\`-location\` - Where you are in the world.'
                + '\n\`-stats\` - All of your information.'
                + '\n\`-fight\` - Auto-fight an enemy, resulting in either a win or a loss.'
                + '\n\`-attack\` - Attack an enemy. The enemy will attack after your turn.'
                + '\n\`-flee\` - Run away from a fight! (has a chance to fail)'
                + '\n\`-level\` - Your current Level, EXP, and StatPoints.'
                + '\n\`-upgrade <stat>\` - Upgrade a stat using StatPoints.'
                + '\n\`-search\` - Search your location for goodies!'
                + '\n\`-heal\` - Heal your wounds. Only available in **Safe Rooms**.'
                + '\n\`-use <item>\` - Use an item. \`-items\` for a list of use-able items.'
                + '\n\`-items\` - A list of all the items you posess.'
                + '\n\`-item <item>\` - Get information on an item.'
                + '\n\`-inspect\` - Inspect what\'s infront of you. (Event details, enemy health, etc)'
            )
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
    }
    static Bot(message) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setAuthor('DISbot by Kieee')
            .setTitle('DISbot Help')
            .setDescription(
                '\`-gif\` - Get a random Tenor gif from a tag'
                + '\n\`-an\` - Get a random anime gif from Tenor using a tag'
                + '\n\`-meme\` - Get a random meme gif from Tenor using a tag')
            .setTimestamp()
            .setFooter('DISbot by Kieee');
        message.channel.send(playerStats);
    }
}

module.exports = DebugCommands;