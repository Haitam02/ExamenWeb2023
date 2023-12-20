//let express = require('express');
import Model from './models/Model.js'
import Examen2023 from './models/Examen2023.js';
import express from 'express';

let app = express();
app.use(express.static('public'));
app.use(express.urlencoded());

app.get('/', async function (request, response) {
    const words = await Examen2023.loadMany();
    const randoNumber = Math.floor(Math.random() * words.length);
    const secretWord = words[randoNumber].mot;
    console.log(secretWord);
    response.render('home.ejs', { sWord: secretWord });
});


app.post('/', async function (request, response) {
    const answer = await Examen2023.load({ mot: request.body.Dword });
    console.log(answer.traduction);
    let essaie = answer.nbEssaie;
    console.log(essaie);
    let juste = answer.nbJuste;
    console.log(juste);
    answer.nbEssaie = (essaie + 1);
    if (request.body.answer === answer.traduction) {
        answer.nbJuste = (juste + 1);
    }
    await answer.save();
    response.redirect('/');
});

app.get('/pageVoc', async function (request, response) {
    const words = await Examen2023.loadMany();
    response.render('voc.ejs', { word: words });
});

app.post('/back', async function (request, response) {
    response.redirect('/');
});

app.post('/ajouter', async function (request, response) {
    const examen2023 = new Examen2023();
    console.log(request.body.word);
    console.log(request.body.translate);
    examen2023.mot = request.body.word;
    examen2023.traduction = request.body.translate;
    await examen2023.save();
    response.redirect('/pageVoc');
});

app.post('/delete', async function (request, response) {
    await Examen2023.delete({ id: request.body.word });
    response.redirect('/pageVoc');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000')
});