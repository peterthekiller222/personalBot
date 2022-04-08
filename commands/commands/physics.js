const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'physics',
    description: 'physics',
    cooldown: 10,
    async execute(message, args) {
        let num = Math.floor(Math.random() * 80)

        let response = await fetch(`https://www.exam-mate.com/topicalpastpapers/?cat=7&subject=93&years=&seasons=&chapter=&paper=1&unit=&zone=&level=&order=asc&offset=${num}`)
        let text = await response.text();

        let result = text.split('"').filter((element, index) => {
            return element.includes("preview")
        })

        result.pop()
        result.pop()

        // console.log(result.length / 2)

        let questionNum = Math.floor(Math.random() * 20)
        let question = result[questionNum * 2]
        let questionArgs = question.split("'")
        let questionLink = `https://www.exam-mate.com/${questionArgs[3]}`, qtype = questionArgs[5], topic = questionArgs[7];

        let answer = result[questionNum * 2 + 1]
        let answerArgs = answer.split("'")

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Topic: ${topic}`)
            .addField('Answer:', `||${answerArgs[3]}||`, true)
            .setImage(questionLink)

        message.channel.send({ embeds: [exampleEmbed] });

        // console.log(question)
    },
};
