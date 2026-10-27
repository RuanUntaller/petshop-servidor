const cors = require('cors');
const bcrypt = require('bcrypt');


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
let colecaoUsuarios;

async function conectarBanco() {
    await client.connect();
    const banco = client.db ('petshop');
    colecaoPets = banco.collection('pets');
    colecaoAgendamentos = banco.collection('agendamentos');
    colecaoUsuarios = banco.collection('usuarios');
    console.log ("Conectando a coleção de pets!");
}
conectarBanco();

app.get('/pets', async function(req, res) {
    const pets  = await colecaoPets.find({}).toArray();
    const agendamentos = await colecaoAgendamentos.find({}).toArray();
    const contagemPorPet = new Map();

    for (const agendamento of agendamentos) {
        const petId = agendamento.pet_id;
        contagemPorPet.set(petId, (contagemPorPet.get(petId) || 0) + 1);
    }

    for (const pet of pets) {
        pet.agendamentos_count = contagemPorPet.get(pet._id.toString()) || 0;
    }

    res.json(pets);
});

app.get('/agendamentos', async function(req, res) {
    const filtro = {};

    if (req.query.data) {
        filtro.data = req.query.data;
    }

    const agendamentos = await colecaoAgendamentos.find(filtro).sort({ data: 1, hora: 1}).toArray();
    const pets = await colecaoPets.find({}).toArray();
    
    for (let i = 0; i < agendamentos.length; i++ ) {
        agendamentos[i].nome_pet = 'Pet não encontrado';

        for (let j = 0; j < pets.length; j++) {
            if (pets[j]._id.toString() === agendamentos[i].pet_id) {
                agendamentos[i].nome_pet = pets[j].nome_pet;
            }
        }
    }

    res.json(agendamentos);
});


app.get('/agendamentos/:id', async function(req, res) {
    const id = req.params.id;
    const agendamento = await colecaoAgendamentos.findOne({ _id: new ObjectId(id) });

    if (agendamento === null) {
        return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    res.json(agendamento);
});


app.put('/agendamentos/:id', async function(req, res) {
    const id = req.params.id;
    const dadosNovos = req.body;

    if (!dadosNovos.pet_id || !dadosNovos.servico || !dadosNovos.data || !dadosNovos.hora) {
        return res.status(400).json({ mensagem: 'Pet, serviço, data e hora são obrigatórios.' });
    }

    const resultado = await colecaoAgendamentos.updateOne(
        { _id: new ObjectId(id) },
        { $set: dadosNovos }
    );

    if (resultado.matchedCount === 0) {
        return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    res.json({ mensagem: 'Agendamento atualizado!' });
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

app.post('/usuarios', async function(req, res) {
    const { email, senha } = req.body || {};

    if (typeof email !== 'string' || email.trim() === '' || typeof senha !== 'string' || senha.length === 0) {
        return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    if (senha.length < 8) {
        return res.status(400).json({ mensagem: 'A senha deve conter no mínimo 8 caracteres.' });
    }

    const emailNormalizado = email.trim();
    const usuarioExistente = await colecaoUsuarios.findOne({ email: emailNormalizado });
    if (usuarioExistente !== null) {
        return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const resultado = await colecaoUsuarios.insertOne({ email: emailNormalizado, senha_hash });

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: resultado.insertedId });
});

app.delete('/pets/:id', async function (req, res) {
    const id = req.params.id;
    const agendamento = await colecaoAgendamentos.findOne({ pet_id: id });
    if (agendamento !== null) {
        return res.status(400).json({ mensagem: 'Não é possível excluir este pet porque há agendamentos vinculados.' });
    }

    const  resultado = await colecaoPets.deleteOne({_id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
        return res.status(404).json({ mensagem: 'Pet não encontrado.'});
    }
    res.json({ mensagem: 'Pet excluído!', apagados: resultado.deletedCount});
});

app.delete('/agendamentos/:id', async function (req, res){
    const id = req.params.id;
    const resultado = await colecaoAgendamentos.deleteOne({_id: new ObjectId(id)});

    if (resultado.deletedCount === 0) {
        return res.status(404).json({mensagem: 'Agendamento não encontrado.'});
    }

    res.json({ mensagem: 'Agendamento excluído!'});
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
