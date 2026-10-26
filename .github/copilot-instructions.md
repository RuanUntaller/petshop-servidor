# Instruções para o Copilot — petshop-servidor

## Sobre o projeto
Backend do PetShop Patas & Pelos, um projeto de curso. Desenvolvido com Node.js, Express e MongoDB Atlas, usando o driver oficial `mongodb`, em um único arquivo `servidor.js`. Publicado no Render. O frontend é um projeto separado (`petshop-patas-e-pelos`).

## Idioma
Responda, comente e nomeie variáveis em português do Brasil. Não traduza nem altere os nomes dos campos existentes.

## Coleções e campos existentes
Use exatamente estes nomes:

- **`pets`:** `nome_pet`, `especie_pet`, `raca_pet`, `dono_pet`, `telefone_dono`, `cep_dono`, `rua_dono`, `bairro_dono`, `cidade_dono`, `uf_dono`.
- **`agendamentos`:** `pet_id` (texto contendo o `_id` do pet), `servico`, `data` (formato `AAAA-MM-DD`), `hora` (formato `HH:MM`), `observacoes`.

## Padrões do código
- Use rotas com `app.get`, `app.post`, `app.put` e `app.delete`, conforme necessário.
- Use funções `async` e os objetos `req.params`, `req.query` e `req.body` conforme a finalidade da rota.
- Converta o ID para `new ObjectId(id)` ao consultar documentos pelo `_id`.
- Use `.toString()` quando precisar comparar IDs como texto.
- Valide os dados e retorne `res.status(400).json({ mensagem })` quando houver dados inválidos.
- Retorne status `404` quando o registro não for encontrado e `201` ao criar um registro.
- Declare rotas fixas, como `/pets/total`, antes das rotas dinâmicas, como `/pets/:id`.
- Autenticação com bcrypt + jsonwebtoken; token no cabeçalho Authorization: Bearer; 401 para não autenticado.`

## Proibido
- Nunca leia, cite, exiba ou altere o conteúdo do arquivo `.env`.
- Não apague nem reescreva rotas que não fazem parte da tarefa solicitada.
- Não altere a estrutura de pastas do projeto.
- Não adicione bibliotecas sem me perguntar antes.
- Não altere os nomes dos campos existentes no banco de dados sem minha autorização.
- Guardar senhas sem hash bcrypt; colocar segredos (JWT) fora do .env; criar tokens sem expiração; devolver senha ou hash em respostas.

## Como testar
- Execute `node servidor.js` para iniciar o backend localmente.
- Teste as rotas pelo navegador ou pelo Console do Desenvolvedor em `http://localhost:3000`.
- Não afirme que um teste passou se ele não foi executado.