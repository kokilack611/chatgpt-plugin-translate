//Author: Anoop, http://github.com/etherlegend

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser, {json} from 'body-parser';
import {translate} from '@vitalets/google-translate-api';

const app = express();

app.use(cors({
    origin: 'https://chat.openai.com'
}));
app.use(json());
app.use(bodyParser.json()); // for parsing application/json

// @ts-ignore
let shell;

// API endpoint hello world
app.get('/hello-world', async (req, res) => {
    try {
        const {text} = await translate('Привет, мир! Как дела?', {to: 'en'});
        console.log(text)
        res.status(200).send(text);
    } catch (error) {
        console.error(`Error: ${error}`);
        // @ts-ignore
        res.status(500).send(`Error : ${error.message}`);
    }
});

// API endpoint to translate
app.post('/translate', async (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const input = req.body.input;
    try {
        const {text} = await translate(input, {from: from, to: to});
        console.log(text)
        res.status(200).send(text);
    } catch (error) {
        console.error(`Error: ${error}`);
        // @ts-ignore
        res.status(500).send(`Error : ${error.message}`);
    }
});

app.get('/.well-known/ai-plugin.json', async (_, res) => {
    fs.readFile('./.well-known/ai-plugin.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
    });
});

app.get('/openapi.yaml', async (_, res) => {
    fs.readFile('openapi.yaml', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error');
            return;
        }
        res.setHeader('Content-Type', 'text/yaml');
        res.status(200).send(data);
    });
});

const main = () => {
    app.listen(5003, '0.0.0.0', () => {
        console.log('Server running on http://0.0.0.0:5003');
    });
};

main();
