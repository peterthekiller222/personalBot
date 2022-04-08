module.exports = {
    name: 'simp',
    description: 'Finds out how simp you are.',
    expectedArgs: '@user',
    execute(message, args) {
        let user = message.mentions.users.first() || message.author || message.member.user;
        let simp = Math.round(100 * Math.random())

        // if (user.id === '300232634875904000') {
        //     simp = 1;
        //  else if(user.id === '249148390527598592'){
        //     simp = 101;
        // }
        message.channel.send(`<@${user.id}> is ${simp}% simp`);
    },
};