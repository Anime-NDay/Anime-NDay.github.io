// Config file, basically a JS version of the config.txt we have on the desktop version of nday-main by Catiania

const CONFIG = {
    // default links, ids can be customised in the UI
    links: {
        'Production': 'page=nukes/view=production',
        'Incoming': 'page=faction/fid=1/view=incoming',
        'Target': 'page=faction/fid=0/view=nations/start=0',
        'Launch': 'page=nukes/view=targets',
        'Join': 'page=faction/fid=0?consider_join_faction=1&join_faction=1'
    },
    
    //Default values, user can customise them in the UI
    factionIds: {
        enemyFactionId: 0,        // Target faction (enemy)
        incomingFactionId: 1,      // Faction to defend (incoming)
        myFactionId: 0             // My faction (join)
    },
    
    // API settings
    api: {
        rateLimit: 700, //we put 700 for safety, since 600 is the limit
        userAgent: 'Anime_NDay_Puppet_Suite/1.0'
    },
    
    //default table settings
    table: {
        defaultWidth: 80,
        defaultPadding: 12,
        defaultBorderWidth: 2,
        defaultBorderRadius: 0,
        defaultFontSize: 14,
        defaultHeaderFontSize: 18
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
