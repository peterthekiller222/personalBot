// const activitySchema = require('@models/server-activity-schema');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const { MessageAttachment } = require('discord.js');

const width = 1200;
const height = 800;

const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.defaultFontFamily = 'Lato';
    ChartJS.defaults.global.defaultFontColor = 'white';
    ChartJS.defaults.global.defaultFontSize = 18;
    ChartJS.plugins.register({
        beforeDraw: (chartInstance) => {
            const { chart } = chartInstance;
            const { ctx } = chart;
            ctx.fillStyle = '#36393E';
            ctx.fillRect(0, 0, chart.width, chart.height);
        }
    })
}

module.exports = {
    showBarChart: async (message, users, activities, title, xAxis) => {
        return
        //creates a graph on activity
        const canvas = new ChartJSNodeCanvas({ width, height, chartCallback })

        const configuration = {
            type: 'horizontalBar',
            data: {
                labels: users,
                datasets: [
                    {
                        data: activities,
                        backgroundColor: [
                            '#f3d9dc',
                            '#fe7f2d',
                            '#fcca46',
                            '#a1c181',
                            '#619b8a',
                            '#7cea9c',
                            '#55d6be',
                            '#84dcc6',
                            '#a5ffd6',
                            '#bcf4de'
                        ],
                    }
                ],
            },
            options: {
                title: {
                    display: true,
                    text: title,
                    fontSize: 34,
                    padding: 30,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false,
                        },
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: xAxis
                        },
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false,
                        },
                    }]
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 50,
                        top: 0,
                        bottom: 50
                    }
                },
                legend: {
                    display: false,
                },
            }
        }

        const image = await canvas.renderToBuffer(configuration);
        const attachment = new MessageAttachment(image);
        message.channel.send(attachment)
    },

    showPieChart: async (message, users, activities) => {
        //creates a graph on activity
        const canvas = new ChartJSNodeCanvas({ width, height, chartCallback })

        const configuration = {
            type: 'pie',
            data: {
                labels: users,
                datasets: [
                    {
                        data: activities,
                        backgroundColor: [
                            '#f3d9dc',
                            '#fe7f2d',
                            '#fcca46',
                            '#a1c181',
                            '#619b8a',
                            '#7cea9c',
                            '#55d6be'
                        ],
                        borderWidth: 0
                    }
                ],
            },
            options: {
                title: {
                    display: true,
                    text: `Messages of ${message.guild.name}`,
                    fontSize: 34,
                    padding: 30,
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 50,
                        top: 0,
                        bottom: 50
                    }
                },
                legend: {
                    position: 'left'
                },
            }
        }

        const image = await canvas.renderToBuffer(configuration);
        const attachment = new MessageAttachment(image);
        message.channel.send(attachment)
    }
}