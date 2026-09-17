const express = require('express');
const fs = require('fs');
const { json } = require('stream/consumers');
const app = express();
app.use(express.json());
const PORTA = 3000;

app.get('/pets', function(req, res) {
    let textoLido = fs.readFileSync('dados.json', 'utf-8'); 
    let pets = JSON.parse(textoLido);
    res.json(pets);
});

function gerarNovoId (listaDePets){
    let maiorId = 0;
    for (let i = 0; i < listaDePets.length; i++ ){
        if(listaDePets[i].id > maiorId){
            maiorId = listaDePets[i].id;
        }
    }
    return maiorId+1;
}

app.post('/pets', function(req, res){
    let textoLido= fs.readFileSync('dados.json', 'utf-8')
    let pets = JSON.parse(textoLido);
    let novoId = gerarNovoId(pets);
    let novoPet = {
    id: novoId,
    nome: req.body.nome,
    especie: req.body.especie
}; 
    pets.push(novoPet);
    fs.writeFileSync('dados.json', JSON.stringify(pets));
    res.json({mensagem: 'Pet foi adicionado com sucesso!', pet: novoPet});
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