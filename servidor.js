const express = require('express');
const app = express();
app.use(express.json());
const PORTA = 3000;

let pets = [
    { id: 1, nome: "Rex", especie: "Cachorro" },
    { id: 2, nome: "Mimi", especie: "Gato" }
];
app.get('/pets', function(req, res) {
    res.json(pets);
});

app.post('/pets', function(req, res){
    let novoPet = req.body;
    pets.push(novoPet);
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

app.listen(PORTA, function() {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});