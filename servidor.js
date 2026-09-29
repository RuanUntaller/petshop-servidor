const cors = require('cors');


require('dotenv').config();

const express = require('express');
const fs = require('fs');
const { json } = require('stream/consumers');
const app = express();
app.use(express.json());
const PORTA = 3000;

app.use(cors());

const connectionString = process.env.MONGODB_URI;
const { MongoClient } = require('mongodb'); 
const client = new MongoClient(connectionString);

let colecaoPets;

async function conectarBanco() {
    await client.connect();
    const banco = client.db ('petshop');
    colecaoPets = banco.collection('pets');
    console.log ("Conectando a coleção de pets!");
}
conectarBanco();

app.get('/pets', async function(req, res) {
    const pets  = await colecaoPets.find({}).toArray();
    res.json(pets);
});

app.post('/pets', async function (req, res) {
    const novoPet = req.body;
    const resultado = await colecaoPets.insertOne(novoPet);
    res.json({mensagem:'Pet adicionado com sucesso!', id: resultado.insertedId});
});

app.get('/', function(req, res) {
    res.send('Meu servidor PetShop está funcionando!');
});


app.get('/sobre', function(req, res) { 
    res.json({ projeto: "PetShop Patas &amp; Pelos", 
    modulo: "Módulo 7 - Backend com Node.js e Express"

    });
});

app.get('/pets/total', function (req, res) {
    let lerTexto = fs.readFileSync('dados.json')
    let pets = JSON.parse(lerTexto);
    res.json({total: pets.length})
    
})



app.listen(PORTA, function() {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

