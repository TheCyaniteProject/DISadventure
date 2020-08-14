const Manager = require('./Manager.js');


class Game {
    static GetZone(zone) {
        switch(zone) { // Check command against known commands
            case 'stone':
                return 'You\'re in a small stone room. There\'s barely enough room to move and fight.';
            case 'stonesafe':
                return 'You find yourself in a well lit stone room. You find food, water, and other miscellaneous items.\nA teleporter rests in the corner, letting you know you can \`-leave\` if you wish.';
            case 'stoneboss':
                return 'You\'re in a _massive_ stone room! A large throne rests far against the back wall. Skattered skeletons and bones let you know that you\'re not the first to make it this far.';
            default:
                console.error(`GetZone error | unknown zone; ${zone}`);
        }
    }
    static GetEvent(event) {
        switch(event) { // Check command against known commands
            case 'skeletonboss':
                return 'A **Lich** blocks your path!';
            case 'skeleton':
                return 'A single **Skeleton** blocks your path!';
            case 'skeletongroup':
                return 'A group of **Skeletons** block your path!';
            case 'healingspring':
                return 'You come across a beautiful **Healing Spring**. You feel revitalized.\n[Health filled]';
            case 'spiketrap':
                return 'You step on a **Spike Trap**! [:heart: -5]';
            case 'loot':
                return 'You found loot!\n[Loot aquired]';
            case 'nothing':
                return '';
            case 'undefined':
                return '';
            default:
                console.error(`GetEvent error | unknown event; ${event}`);
        }
    }

    // debugging
    static Count(message) { // Count's the amount of times a user runs this command. The number is saved to the local machine, and returned to the user
        Manager.get(message.member, 'count').then(value => {
            if (value <= 0 || value == null) {
                message.channel.send('1');
                Manager.set(message.member, 'count', 1);
            } else {
                message.channel.send(value+1);
                Manager.set(message.member, 'count', (value+1));
            }
        });
    }

    // Game Actions

    //Attack
    //Use
    //Move - leave/enter/forward // pick options
    //Rest - random events/ambushes/
    //Dual / pvp

    //enemy spawner

    // Data
    static SetData(message, data, value) {
        Manager.set(message.member, data, value);
    }
    static GetData(message, data) {
        return Manager.get(message.member, data).then(value => {
            if (value == null) {
                return '<404>';
            } else {
                return value;
            }
        });
    }
}

module.exports = Game;



// get player data

// parse data

// save data

// return data