const fetch = require('node-fetch');

setInterval(async() => {
    await fetch('https://oogieboogiedashboard.herokuapp.com/');
    // await fetch('https://escchessbot.herokuapp.com/');
    // console.log('kept self alive')
}, 5 * 60 * 1000);
