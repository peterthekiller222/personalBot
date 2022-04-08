const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'invitecheck',
    description: 'Gives info about an invite.',
    expectedArgs: '{invite link}',
    minArgs: 1,

    async execute(message, args) {
        let inviteCode = args[0].split('/').slice(-1)[0]

        let response = await fetch(`https://discord.com/api/v8/invites/${inviteCode}?with_counts=true`);
        let json = await response.json();
        
        if(json.message === 'Unknown Invite') return message.channel.send('Unknown invite!')

        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Invite info for ${inviteCode}`)
            .addFields(
                { name: 'Server name:', value: `${json.guild.name}`},
                { name: 'Server id:', value: `${json.guild.id}`},
                { name: 'Verification level:', value: `${json.guild.verification_level}`},
               // { name: 'Inviter:', value: `${json.inviter.username}${json.inviter.disriminator}`},
                { name: 'Approximate number of members:', value: `${json.approximate_member_count}`},
                { name: 'Approximate online people:', value: `${json.approximate_presence_count}`},
            )
            .setFooter(`requested by ${message.author.tag}`)
        message.channel.send({embeds: [embed]});
    },
};