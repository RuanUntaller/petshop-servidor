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
const { MongoClient, ObjectId } = require('mongodb'); 
const client = new MongoClient(connectionString);

let colecaoPets;
let colecaoAgendamentos;

async function conectarBanco() {
    await client.connect();
    const banco = client.db ('petshop');
    colecaoPets = banco.collection('pets');
    colecaoAgendamentos = banco.collection('agendamentos');
    console.log ("Conectando a coleção de pets!");
}
conectarBanco();

app.get('/pets', async function(req, res) {
    const pets  = await colecaoPets.find({}).toArray();
    res.json(pets);
});

app.get('/agendamentos', async function(req, res) {
    const agendamentos = await colecaoAgendamentos.find({}).toArray();
    res.json(agendamentos);
});


app.get('/versao', function(req, res) {
    res.json({ versao: '1.0' });
});


app.post('/pets', async function (req, res) {
    const novoPet = req.body;
    if (!novoPet.nome_pet || novoPet.nome_pet.trim() === ''){ 
        return res.status(400).json({ mensagem: 'O nome do pet é obrigatório.'});    
    }
    const resultado = await colecaoPets.insertOne(novoPet);
    res.status(201).json({mensagem:'Pet adicionado com sucesso!', id: resultado.insertedId});
});

app.post('/agendamentos', async function(req, res) {
    const novo = req.body;

    if (!novo.pet_id || !novo.servico || !novo.data || !novo.hora) {
        return res.status(400).json({ mensagem: 'Pet, serviço, data e hora são obrigatórios.' });
    }

    const resultado = await colecaoAgendamentos.insertOne(novo);
    res.status(201).json({ mensagem: 'Agendamento criado!', id: resultado.insertedId });
});

app.delete('/pets/:id', async function (req, res) {
    const id = req.params.id;
    const  resultado = await colecaoPets.deleteOne({_id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
        return res.status(404).json({ mensagem: 'Pet não encontrado.'});
    }
    res.json({ mensagem: 'Pet excluído!', apagados: resultado.deletedCount});
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

app.get('/pets/:id', async function(req,res){
    const id = req.params.id;
    const pet = await colecaoPets.findOne({_id: new ObjectId(id) });
    if (pet === null) {
        return res.status(404).json({ mensagem: 'Pet não encontrado.'});
    }
    res.json(pet);
})

app.put('/pets/:id', async function (req, res) {
    const id = req.params.id;
    const dadosNovos = req.body; 
    
    const resultado = await colecaoPets.updateOne(
        {_id: new ObjectId(id) },
        {$set: dadosNovos}
    );
    if (resultado.matchedCount === 0) {
        return res.status(404).json({ mensagem: 'Pet não encontrado.'});
    }
    res.json ({mensagem: 'Pet atualizado!', alterados: resultado.modifiedCount });
});

app.listen(PORTA, function() {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

