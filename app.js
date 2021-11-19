const express = require('express');

const app = express();

const index = (_request, response) => {
    response.status(200).send({ message: 'Server template By Iamnonso'});
}

app.get('/', index);
module.exports = app;