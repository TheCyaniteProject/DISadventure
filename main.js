/* // Dependancies //
    npm install discord.js
    npm install --save keyv
    npm install --save keyv keyv-file
*/

// Requirements
const Discord = require('discord.js');
const fs = require('fs');
const ParserLib = require('./parser.js');

// The key to my heart <3
const clientToken = process.env.BOT_TOKEN;

// Discord setup
const client = new Discord.Client();
const prefix = '-';

// Linku Startu
client.once('ready', () => {
    console.log('DIS is going to be good!');
});


// Basic command parsing
client.on('message', message => {
    client.user.setStatus('available')
    client.user.setActivity('an Adventure!');
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
 
    ParserLib.Parse(message, args, client); // User input is passed to here
});

client.login(clientToken);
