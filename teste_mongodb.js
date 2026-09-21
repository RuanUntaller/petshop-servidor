const { MongoClient } = require('mongodb');

const connectionString = "mongodb+srv://RuanUntaller:Ruan112321@petshopcluster.pgz0tav.mongodb.net/?appName=PetShopCluster";
const client = new MongoClient(connectionString);

async function testarConexao() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB Atlas com sucesso!");
    } catch (erro) {
        console.log("Erro ao conectar:", erro);
    } finally {
        await client.close();
    }
}

testarConexao();
