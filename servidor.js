const express = require('express');
const app = express();
const PORTA = 3000;


let pets = [
    { id: 1, nome: "Rex", especie: "Cachorro" },
    { id: 2, nome: "Mimi", especie: "Gato" }
];
app.get('/pets', function(req, res) {
    res.json(pets);
});

app.get('/', function(req, res) {
    res.send('Meu servidor PetShop está funcionando!');
});

app.listen(PORTA, function() {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});