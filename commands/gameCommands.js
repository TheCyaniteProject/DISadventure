const Game = require('../data/game.js');
const Discord = require('discord.js');

// Default Data
const defaultHealth = 20;
const defaultAttack = 5;
const defaultDefence = 0;
const defaultExp = 100;

const enemyBaseAttack = 3;
const enemyBaseHealth = 5;

const EntryActions = [
    'You slowly make your way into the next room.',
    'You slowly make your way into the next room.',
    'You slowly make your way into the next room.',
    'You rush into the next room.',
    'You make your way into the next room.',
    'You make your way into the next room.',
    'You make your way into the next room.',
    'You make your way into the next room.',
    'You find yourself already in the next room.'
];

const Zones = ['stone'];

const DarkEvents = ['skeletonboss'];//, 'goblin', 'goblins', 'slime', 'slimes', 'spiketrap', 'darttrap', 'healingspring', 'healingspring', 'trapspring', 'junk', 'loot'];
const BoonEvents = ['healingspring', 'loot', 'nothing'];//, 'goblin', 'goblins', 'slime', 'slimes', 'spiketrap', 'darttrap', 'healingspring', 'healingspring', 'trapspring', 'junk', 'loot'];
const Events = ['healingspring', 'nothing', 'skeleton', 'skeleton', 'skeletongroup', 'spiketrap'];//, 'goblin', 'goblins', 'slime', 'slimes', 'spiketrap', 'darttrap', 'healingspring', 'healingspring', 'trapspring', 'junk', 'loot'];

// async functions - used to parse 'PromiseType' objects/data
async function getCharacter(message) {
    // Health, level, attack, def, inventory
    var health = await Game.GetData(message, 'health');
    var maxhealth = await Game.GetData(message, 'maxhealth');
    var level = await Game.GetData(message, 'level');
    var exp = await Game.GetData(message, 'exp');
    var expcap = await Game.GetData(message, 'expcap');
    var attack = await Game.GetData(message, 'attack');
    var defence = await Game.GetData(message, 'defence');
    var inventory = await Game.GetData(message, 'inventory');
    if (maxhealth == '<404>') {
        errorCharacter(message)
        console.log(`${message.author}${message.author.username}: User has no character.`);
        return;
    }
    console.log(`${message.author}${message.author.username}: Hel:${health}/${maxhealth} - lvl:${level}(exp:${exp}/${expcap}) - Atk:${attack} - Def:${defence}`);
    const playerStats = new Discord.MessageEmbed()
        .setColor('#8803fc')
        .setAuthor(`DISadventure by Kieee`)
        .setTitle(`Stats for ${message.author.username}`)
        .setDescription(`:hearts: Health --- ${health}/${maxhealth}\n:star2: Level ----- ${level} (exp ${exp}/${expcap})\n:crossed_swords: Attack --- ${attack}\n:shield: Defence - ${defence}`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
}

async function createCharacter(message) {
    // Health, level, attack, def, inventory
    var maxhealth = await Game.GetData(message, 'maxhealth');
    if (maxhealth != '<404>') {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You already have a character.\n\nSilly :3`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        return;
    }
    Game.SetData(message, 'health', defaultHealth);
    Game.SetData(message, 'maxhealth', defaultHealth);
    Game.SetData(message, 'level', 1);
    Game.SetData(message, 'exp', 0);
    Game.SetData(message, 'expcap', defaultExp);
    Game.SetData(message, 'attack', defaultAttack);
    Game.SetData(message, 'maxattack', defaultAttack);
    Game.SetData(message, 'defence', defaultDefence);
    Game.SetData(message, 'maxdefence', defaultDefence);
    Game.SetData(message, 'loot', 0);
    Game.SetData(message, 'statpoints', 0);
    Game.SetData(message, 'inventory', ['health', 'health']);
    var level = await Game.GetData(message, 'level'); // not used, but leave anyways (causes a glitch when removed..)
    var exp = await Game.GetData(message, 'exp');
    var expcap = await Game.GetData(message, 'expcap');
    const playerStats = new Discord.MessageEmbed()
        .setColor('#03fc80')
        .setAuthor(`DISadventure by Kieee`)
        .setTitle(':map: Welcome to the world of DISadventure!')
        .setDescription(`${message.author.username} | :star2: Level - 1 (exp ${exp}/${expcap})`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
    console.log(`${message.author}${message.author.username} created a character.`);
}

async function getLevel(message) {
    // Health, level, attack, def, inventory
    var level = await Game.GetData(message, 'level');
    if (level == '<404>') {
        errorCharacter(message)
        return;
    }
    var exp = await Game.GetData(message, 'exp');
    var expcap = await Game.GetData(message, 'expcap');
    var statpoints = await Game.GetData(message, 'statpoints');
    const playerStats = new Discord.MessageEmbed()
        .setColor('#8803fc')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`${message.author.username} - :star2: ${level} (exp ${exp}/${expcap})\nYou have ${statpoints} StatPoints available.`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
    console.log(`${message.author}${message.author.username} level request; ${level} (exp ${exp}/${expcap}) ${statpoints}sp`);
}
async function getLocation(message) {
    var level = await Game.GetData(message, 'level');
    if (level == '<404>') {
        errorCharacter(message)
        return;
    }
    var local = await Game.GetData(message, 'local');
    var room = await Game.GetData(message, 'room');
    var zone = await Game.GetData(message, 'zone');
    var event = await Game.GetData(message, 'event');
    if (local == '<404>' || local <= 0) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You are outside the Dungeon.\nYou can enter the Dungeon with \`-enter dungeon\``)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} requested location; Outside of Dungeon.`);
        return;
    }
    var eventout = '';
    if (!(event == 'nothing' || event == '<404>')) {
        eventout = Game.GetEvent(event);
    }
    if (event == 'healingspring') {
        var maxhealth = await Game.GetData(message, 'maxhealth');
        Game.SetData(message, 'health', maxhealth);
        console.log(`${message.author}${message.author.username} found a Healing Spring! Health set to ${maxhealth}!`)
    }
    const playerStats = new Discord.MessageEmbed()
        .setColor('#8803fc')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`:european_castle: Floor ${local} - room ${room}\n\n${Game.GetZone(zone)}\n${eventout}`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
    console.log(`${message.author}${message.author.username} requested location; Floor ${local} - Room ${room}`);
}

async function forward(message) {
    var level = await Game.GetData(message, 'level');
    if (level == '<404>') {
        errorCharacter(message)
        return;
    }
    var health = await Game.GetData(message, 'health');
    var maxhealth = await Game.GetData(message, 'maxhealth');
    var defence = await Game.GetData(message, 'defence');
    var event = await Game.GetData(message, 'event');
    if (!(event == '<404>' || event == 'nothing' || event == 'healingspring' || event == 'loot' || event == 'undefined')) {
        errorEvent(message, event)
        return;
    }
    
    var local = await Game.GetData(message, 'local');
    var room = await Game.GetData(message, 'room');
    if (local == '<404>') {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You have not entered the Dungeon.\nYou can enter the Dungeon with \`-enter dungeon\``)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} tried to walk forward into nothing!`);
        return;
    }
    // move forward
    if (local < 1) {
        local = 1;
    }
    if (room+1 > 10) {
        room = 0;
        local = local+1;
    } else {
        room = room+1;
    }
    Game.SetData(message, 'room', room);
    Game.SetData(message, 'local', local);

    // Event stuff
    Game.SetData(message, 'roomloot', '<404>');
    var action = EntryActions[Math.floor(Math.random() * EntryActions.length)];
    var zone = Zones[Math.floor(Math.random() * Zones.length)];
    var event = Events[Math.floor(Math.random() * Events.length)];
    if (room == 10 && !zone.includes('boss')) {
        zone = zone+'boss';
        event = DarkEvents[Math.floor(Math.random() * DarkEvents.length)];
    } else if (room == 0 && !zone.includes('safe')) {
        zone = zone+'safe';
        event = 'nothing';
    }
    if (event == 'healingspring') {
        Game.SetData(message, 'health', maxhealth);
        console.log(`${message.author}${message.author.username} found a Healing Spring! Health set to ${maxhealth}!`)
    }
    if (event == 'loot') {
        // loot
        Game.SetData(message, 'event', '<404>');
    }
    Game.SetData(message, 'event', event);
    var encounter = Game.GetEvent(event);
    Game.SetData(message, 'zone', zone);
    var zoneInfo = Game.GetZone(zone);
    var forward;
    var damage = 5;
    damage = damage-defence;
    if ((event == '<404>' || event == 'nothing' || event == 'healingspring' || event == 'loot' || event == 'undefined')) {
        forward = '\n\`-forward\` to proceed.';
    } else if ((event == 'spiketrap' || event == 'darttrap')) {
        //reduce health
        if (health-damage > 1) {
            Game.SetData(message, 'health', (health-damage));
        } else {
            // you died
            KillPlayer(message);
        }
        Game.SetData(message, 'event', '<404>');
        forward = '\n\`-forward\` to proceed.';
    } else if (event == 'healingspring') {
        Game.SetData(message, 'health', maxhealth);
    } else {
        forward = '\nYou cannot move forward!';
    }
    const playerStats = new Discord.MessageEmbed()
        .setColor('#8803fc')
        .setAuthor(`Floor ${local} - Room ${room}`)
        .setDescription(`${action} ${zoneInfo}\n${encounter}${forward}`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
    console.log(`${message.author}${message.author.username} moved forward; Floor ${local} - Room ${room} - Zone ${zone} - Event ${event}`);
}

async function enterDungeon(message) {
    var level = await Game.GetData(message, 'level');
    if (level == '<404>') {
        errorCharacter(message)
        return;
    }
    var local = await Game.GetData(message, 'local');
    if (local == '<404>') {
        Game.SetData(message, 'local', 0);
        Game.SetData(message, 'room', 0);
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setAuthor(`Dungeon Master:`)
            .setDescription(`Welcome to the Dungeon.\nGood luck. You're going to need it.\n\n\`-forward\` to proceed.`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} entered the Dungeon! Good luck to em'!`);
        return;
    } else {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You are already inside of the Dungeon! Use \n\n\`-forward\` to proceed.`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} tried to re-enter the Dungeon! lol`);
        return;
    }
}

async function leaveDungeon(message) {
    var level = await Game.GetData(message, 'level');
    if (level == '<404>') {
        errorCharacter(message)
        return;
    }
    var local = await Game.GetData(message, 'local');
    var room = await Game.GetData(message, 'room');
    if (local == '<404>') {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setDescription(`You are already outside of the dungeon.\nYou can enter the Dungeon with \`-enter dungeon\``)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} tried to leave the dungoen. Again.`);
        return;
    } else if (room > 0) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#8803fc')
            .setDescription(`You cannot leave the dungeon while exploring. The only way out is \`-forward\``)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} tried to cower out while exploring!`);
        return;
    } else {
        Game.SetData(message, 'local', '<404>');
        Game.SetData(message, 'room', 0);
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You have left the Dungeon. You can re-enter at any time with \`-enter dungeon\``)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        console.log(`${message.author}${message.author.username} left the dungeon. The coward!`);
        Game.SetData(message, 'roomloot', 'looted');
        return;
    }
}

async function statCalculator(message, baseStat) { // psudo-randomly increases difficulty
    baseStat = baseStat * (Math.random() * (0.80 - 1.20 + 1.00) + 0.80).toFixed(2);
    var local = await Game.GetData(message, 'local');
    for (var i = 0; i < (local - 1); i++) {
        baseStat = baseStat * 1.15;
    }
    return baseStat;
}

async function fight(message) {
    var enemyHealthCounter = 0;
    var healthCounter = 0;
    // Exp & Enemy Health
    var enemyHealth = await statCalculator(message, enemyBaseHealth);
    var expdrop = Math.floor(enemyHealth*2.5);
    var exp = await Game.GetData(message, 'exp');
    var event = await Game.GetData(message, 'event');
    var health = await Game.GetData(message, 'health');
    var defence = await Game.GetData(message, 'defence');
    if ((event == '<404>' || event == 'nothing' || event == 'healingspring' || event == 'loot' || event == 'undefined')) {
        ErrorAction(message);
        return;
    }
    if (event.includes('boss')) {
        enemyHealth = await statCalculator(message, enemyBaseHealth*2);
        expdrop = enemyHealth*2;
    }
    var curEnemyHealth = await Game.GetData(message, 'enemyHealth');
    if (curEnemyHealth == '<404>') {
        Game.SetData(message, 'enemyHealth', enemyHealth);
    } else {
        enemyHealth = curEnemyHealth;
    }
    var attack = await Game.GetData(message, 'attack');
    var loot = 0;
    // attack
    //damageCalculator(health, defence, damage)
    //console.log(health);
    var damage = 0;
    while (true) {
        damage = damageCalculator(0, attack);
        damage = Math.floor(damage * 100) / 100;
        enemyHealthCounter = enemyHealthCounter + damage;
        enemyHealth = enemyHealth - damage;
        console.log(`${message.author}${message.author.username} attacked enemy ${event} dealing ${damage}! ${enemyHealth} health remaining.`);
        if (enemyHealth < 1) {
            Game.SetData(message, 'enemyHealth', '<404>');
            Game.SetData(message, 'event', '<404>');
            const playerStats = new Discord.MessageEmbed()
                .setColor('#8803fc')
                .setAuthor(`Victory!`)
                .setDescription(`You lost ${Math.floor(healthCounter * 100) / 100} Health and delt ${Math.floor(enemyHealthCounter * 100) / 100} Dammage!\nYou gained ${expdrop} EXP and ${loot} Loot!\n\n\`-forward\` to proceed.`)
                .setTimestamp()
                .setFooter('DISadventure by Kieee');
            message.channel.send(playerStats);
            ExpAdd(message, expdrop);
            console.log(`${message.author}${message.author.username} won the fight! They have ${health} health remaining, and gained ${expdrop} EXP and ${loot} Loot!`);
            break;
        }
        damage = damageCalculator(defence, enemyBaseAttack);
        damage = Math.floor(damage * 100) / 100;
        healthCounter = healthCounter + damage;
        health = health - damage;
        console.log(`${message.author}${message.author.username} was attacked by ${event} dealing ${damage}! ${health} health remaining.`);
        Game.SetData(message, 'health', Math.floor(health * 100) / 100);
        if (health < 1) {
            console.log(`${message.author}${message.author.username} lost the fight! They lost ${exp} EXP and ${loot} Loot!`);
            KillPlayer(message);
            break;
        }
    }
    
}

async function attack(message) {
    var expdrop = 70;
    var event = await Game.GetData(message, 'event');
    if (event.includes('boss')) {
        expdrop = 130;
    }
    const playerStats = new Discord.MessageEmbed()
        .setColor('#fc0303')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`You kill everything because you're awesome. [Debug Event End]`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
    Game.SetData(message, 'event', '<404>');
    var level = await Game.GetData(message, 'level');
    var exp = await Game.GetData(message, 'exp');
    var expcap = await Game.GetData(message, 'expcap');
    ExpAdd(message, expdrop);
    // recieve attack
    // recieve damage
}

async function search(message) {
    var roomloot = await Game.GetData(message, 'roomloot');
    if (roomloot == 'looted') {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`Nothing is left.`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        return;
    }
    
    var event = await Game.GetData(message, 'event');
    if (!(event == '<404>' || event == 'nothing' || event == 'healingspring' || event == 'loot' || event == 'undefined')) {
        ErrorAction(message)
        return;
    }
    // Search thingy
    Game.SetData(message, 'roomloot', 'looted');
    if (Math.floor(Math.random() * 101) < 50) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You found **Nothing**. Awesome. I hope you're proud of yourself, I know I am.`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
    } else if (Math.floor(Math.random() * 101) < 75) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You found a **Common Treasure**!`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        ExpAdd(message, 5);
    } else if (Math.floor(Math.random() * 101) < 85) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You found an **Uncommon Treasure**!`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
        ExpAdd(message, 6);
    } else if (Math.floor(Math.random() * 101) < 96) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You found a **Rare Treasure**!`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
            ExpAdd(message, 8);
        message.channel.send(playerStats);
    } else if (Math.floor(Math.random() * 101) > 95) {
        const playerStats = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setAuthor(`DISadventure by Kieee`)
            .setDescription(`You found an **Epic Treasure**!`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
            ExpAdd(message, 15);
        message.channel.send(playerStats);
    } else {

    }
    // recieve attack
    // recieve damage
}

async function ExpAdd(message, expdrop) {
    var level = await Game.GetData(message, 'level');
    var exp = await Game.GetData(message, 'exp');
    var expcap = await Game.GetData(message, 'expcap');
    var statpoints = await Game.GetData(message, 'statpoints');
    var maxhealth = await Game.GetData(message, 'maxhealth');
    if (!(expcap == Math.floor(expcap))) {
        expcap = Math.floor(expcap);
        Game.SetData(message, 'expcap', expcap);
    }
        
    if (exp+expdrop >= expcap) {
        exp = ((exp+expdrop) -expcap);
        Game.SetData(message, 'exp', Math.floor(exp * 100) / 100);
        level = level+1;
        Game.SetData(message, 'level', level);
        expcap = (expcap+Math.floor(expcap*0.06));
        Game.SetData(message, 'expcap', expcap);
        Game.SetData(message, 'statpoints', statpoints+1);
        Game.SetData(message, 'health', maxhealth+1);
        Game.SetData(message, 'maxhealth', maxhealth+1);
        const playerStats = new Discord.MessageEmbed()
            .setColor('#03fc84')
            .setAuthor(`Level Up!`)
            .setDescription(`${message.author.username} - :star2: ${level} (exp ${exp}/${expcap})\nYou have ${statpoints+1} StatPoints available!`)
            .setTimestamp()
            .setFooter('DISadventure by Kieee');
        message.channel.send(playerStats);
    } else {
        Game.SetData(message, 'exp', (exp+expdrop));
    }
}

async function KillPlayer(message) {
    var exp = await Game.GetData(message, 'exp');
    var loot = await Game.GetData(message, 'loot');
    var maxhealth = await Game.GetData(message, 'maxhealth');
    Game.SetData(message, 'exp', 0);
    Game.SetData(message, 'event', '<404>');
    Game.SetData(message, 'loot', 0);
    Game.SetData(message, 'local', '<404>');
    Game.SetData(message, 'room', 0);
    Game.SetData(message, 'health', maxhealth);
    const playerStats = new Discord.MessageEmbed()
        .setColor('#03fc84')
        .setAuthor(`You Died.`)
        .setDescription(`You lost ${loot} Loot, and ${exp} exp.\n\nYou have revived in the town.`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
}

function damageCalculator(defence, damage) {
    damage = damage * (Math.random() * (0.80 - 1.20 + 1.00) + 0.80).toFixed(2);
    damage = damage - defence;

    return damage;
}

async function errorCharacter(message) {
    const playerStats = new Discord.MessageEmbed()
        .setColor('#fc0303')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`You do not have a character.\n`
        + `\nYou can create a new character by running \`-createnew\``
        + `\nYou can find the full list of actions using \`-help\``
        + `\nYou can also use \`-info\` to get more information.`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
}

async function errorCharacter(message) {
    const playerStats = new Discord.MessageEmbed()
        .setColor('#fc0303')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`You do not have a character.\n`
        + `\nYou can create a new character by running \`-createnew\``
        + `\nYou can find the full list of actions using \`-help\``
        + `\nYou can also use \`-info\` to get more information.`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
}

async function errorEvent(message, event) {
    const playerStats = new Discord.MessageEmbed()
        .setColor('#fc0303')
        .setAuthor(`DISadventure by Kieee`)
        .setDescription(`You cannot leave! ${Game.GetEvent(event)}`)
        .setTimestamp()
        .setFooter('DISadventure by Kieee');
    message.channel.send(playerStats);
}

async function ErrorAction(message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#fc0303')
        .setDescription(`You cannot do that right now.`)
        .setTimestamp()
        .setFooter('DISAdventure by Kieee');
    message.channel.send(embed);
}

async function heal(message) {
    var zone = await Game.GetData(message, 'zone');
    var health = await Game.GetData(message, 'health');
    var maxhealth = await Game.GetData(message, 'maxhealth');
    if (!zone.includes('safe')) {
        const embed = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You can only use healing magc in a **Safe Room**.`)
            .setTimestamp()
            .setFooter('DISAdventure by Kieee');
        message.channel.send(embed);
    } else if (health == maxhealth) {
        const embed = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You already have full health!`)
            .setTimestamp()
            .setFooter('DISAdventure by Kieee');
        message.channel.send(embed);
    } else {
        Game.SetData(message, 'health', maxhealth);
        const embed = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You have fully healed yourself!`)
            .setTimestamp()
            .setFooter('DISAdventure by Kieee');
        message.channel.send(embed);
    }
    
}

async function upgrade(message, args) {
    var statpoints = await Game.GetData(message, 'statpoints');
    if (statpoints < 1) {
        const embedd = new Discord.MessageEmbed()
            .setColor('#fc0303')
            .setDescription(`You do not have any **StatPoints** available.\nYou can check your StatPoints with \`-level\``)
            .setTimestamp()
            .setFooter('DISAdventure by Kieee');
        message.channel.send(embedd);
        return;
    }
    switch(args[0]) { // Check command against known commands
        case 'attack':
            var attack = await Game.GetData(message, 'attack');
            var maxattack = await Game.GetData(message, 'maxattack');
            Game.SetData(message, 'attack', attack+1);
            Game.SetData(message, 'maxattack', maxattack+1);
            const attackembed = new Discord.MessageEmbed()
                .setColor('#fc0303')
                .setDescription(`You feel invigorated! [Attack +1]\nAttack ${attack+1}`)
                .setTimestamp()
                .setFooter('DISAdventure by Kieee');
            message.channel.send(attackembed);
            break;
        case 'defence':
            var defence = await Game.GetData(message, 'defence');
            var maxdefence = await Game.GetData(message, 'maxdefence');
            Game.SetData(message, 'defence', defence+1);
            Game.SetData(message, 'maxdefence', maxdefence+1);
            const defenceembed = new Discord.MessageEmbed()
                .setColor('#fc0303')
                .setDescription(`You feel reinforced! [Defence +1]\nDefence ${defence+1}`)
                .setTimestamp()
                .setFooter('DISAdventure by Kieee');
            message.channel.send(defenceembed);
            break;
        default:
            const defaultembed = new Discord.MessageEmbed()
                .setColor('#fc0303')
                .setDescription(`You need to enter a valid stat to increase.\nUsage: \`-upgrade <stat>\` available stats: \`attack\` \`defence\``)
                .setTimestamp()
                .setFooter('DISAdventure by Kieee');
            message.channel.send(defaultembed);
            return;
    }
    Game.SetData(message, 'statpoints', statpoints-1);
}

class GameCommands { // Commands that control the game

    static Count(message) {
        Game.Count(message); // This might seem redundant, but that's only because it's a simple test command
    }

    static CreateCharacter(message) {
        // Health, attack, def, inventory
        createCharacter(message);
        return;
    }

    static GetCharacter(message) {
        getCharacter(message);
        return;
    }

    static GetLevel(message) {
        getLevel(message);
        return;
    }

    static GetLocation(message) {
        getLocation(message);
        return;
    }

    static Forward(message) {
        forward(message);
        return;
    }

    static Fight(message) {
        fight(message);
        return;
    }

    static Attack(message) {
        attack(message);
        return;
    }

    static Heal(message) {
        heal(message);
        return;
    }

    static Search(message) {
        search(message);
        return;
    }
    
    static Upgrade(message, args) {
        upgrade(message, args);
    }

    static Enter(message, args) {

        switch(args[0]) { // Check command against known commands
            case 'dungeon':
                enterDungeon(message);
                break;
            default:
                ErrorAction(message);
        }
    }
    static Leave(message) {
        leaveDungeon(message);
    }
}

module.exports = GameCommands;