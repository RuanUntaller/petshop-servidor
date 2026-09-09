const express = require('express');
const app = express();
const PORTA = 3000;

app.get('/', function(req, res) {
    res.send('Meu servidor PetShop está funcionando!');
});

app.listen(PORTA, function() {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});