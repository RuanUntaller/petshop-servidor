# Auditoria de Segurança — Módulo 14


1 -✅ Quantidade: 1 documento na coleção.
- Hash: o campo senha_hash começa com $2b$10$, compatível com bcrypt.
- Campo senha: não aparece no documento.

2-✅ Atendido. Na busca global por JWT_SEGREDO, encontrei apenas o uso de process.env.JWT_SEGREDO nos trechos analisados. Executei git log -p --all -- .env nos dois repositórios e as saídas ficaram vazias. 

3-✅Conferi o código jwt.sign, que define expiresIn: '8h'. Depois, verifiquei no jwt.io que o payload do token contém a propriedade exp.

4-✅ Atendido. Conferi as respostas das rotas de cadastro (POST /usuarios) e login (POST /login). O cadastro retorna apenas mensagem e ID; o login retorna token e e-mail. Também verifiquei as demais chamadas res.json e não encontrei envio de senha ou hash.

5-✅ Conferi o código e encontrei o middleware autenticar nas três rotas de agendamentos: POST /agendamentos, PUT /agendamentos/:id e DELETE /agendamentos/:id. Depois, testei as três sem token no Render; todas retornaram HTTP 401 (Faça login para continuar). As três rotas de agendamento foram testadas sem token; as demais foram conferidas no código.

6-✅ Testei as rotas GET /pets e GET /agendamentos sem token no Render. Ambas retornaram HTTP 200, permitindo a consulta pública.

7-✅ Testei o login com um e-mail inexistente e com um e-mail existente usando senha incorreta. Nos dois casos, o servidor retornou HTTP 401 e a mesma mensagem: Email ou senha inválidos.

8-✅ Testei a rota protegida POST /agendamentos utilizando um token falso (Bearer abc). O servidor retornou HTTP 401 com a mensagem Faça login para continuar, bloqueando a requisição.

9-✅ Verifiquei no Network do navegador quatro operações de escrita: POST /pets, PUT /pets/:id, DELETE /pets/:id e POST /agendamentos. Em todas, confirmei a presença do cabeçalho Authorization: Bearer. As requisições de exclusão e criação de agendamento retornaram, respectivamente, HTTP 200 e HTTP 201.

10-✅ Antes de realizar o logout, executei localStorage.getItem('token') no Console e confirmei que havia um token armazenado. Depois de clicar em Sair, executei o mesmo comando novamente e o resultado foi null.

11- ✅Executei git status no repositório do backend e confirmei que não havia arquivos pendentes. Depois, executei git log --all -- .env, que não retornou nenhum commit.

12-✅ Acessei o painel do Render, abri o serviço petshop-servidor e verifiquei, na seção Environment, que a variável JWT_SEGREDO está configurada.


# 13- Comparação com o Copilot

Depois de fazer os testes, pedi para o Copilot dar uma olhada na segurança do projeto.

Ele concordou com os itens 1 a 8 e o 11. Nos itens 9, 10 e 12, disse que não conseguia confirmar só olhando o código do backend.

Mas eu já tinha testado esses pontos:
Item 9: conferi no Network e vi que as quatro operações enviavam o token.
Item 10: fiz logout e confirmei que o token sumiu do localStorage.
Item 12: entrei no Render e vi que o JWT_SEGREDO estava configurado.

No geral, o Copilot não encontrou nenhum problema. Só não conseguiu verificar algumas coisas que precisei testar diretamente no navegador e no Render.

# 14- Realizei os testes em uma janela anônima, utilizando o pet Mel como registro de teste no Render.

DELETE sem token: HTTP 401 — acesso bloqueado.

DELETE com token falso: HTTP 401 — acesso bloqueado.

Conferência final: o pet Mel continuou cadastrado no banco de dados.

Os testes confirmaram que o backend bloqueia tentativas de exclusão sem autenticação válida.