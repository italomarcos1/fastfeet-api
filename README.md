<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="./fastfeet.png" width="300px" />
</h1>

---

FastFeet, uma API REST em Node.js (usando o framework Express).

---
### Libs utilizadas:

- [Node.js](https://github.com/nodejs)
- [Express](https://github.com/expressjs/express)
- [Sequelize](https://github.com/sequelize/sequelize) - ORM para manipular o banco usando **migrations**. Uma das maiores vantagens é evitar o uso de SQL e manipular o banco com Javascript. Também fornece mais flexibilidade e tratar os dados (usando *hooks*) antes de repassar ao banco.
- [Yup](https://github.com/jquense/yup) - valida os dados recebidos pelo front-end, como um campo não preenchido, aplica confirmação de senha, entre outras funcionalidades.
- [JWT](https://www.npmjs.com/package/jsonwebtoken) - autentica o administrador e bloqueia o acesso de outros usuários em rotas específicas usando um*middleware do **Express**.
- [Bcryptjs](https://www.npmjs.com/package/bcrypt) - criptografia de senhas. O banco armazena apenas o hash, não a senha em si.
- [Nodemailer](https://github.com/nodemailer/nodemailer) - serviço de envio de e-mails do node.
- [Handlebars](https://handlebarsjs.com/) - template engine para criar os templates de email, usando HTML.
- [Bee-Queue](https://github.com/bee-queue/bee-queue) - guarda os serviços pesados em uma fila de processamento executada em segundo-plano (*background job*), tirando o trabalho do servidor.
- [Date-fns](https://github.com/date-fns/date-fns) - lidando com datas e timezone no Javascript.
- [Sentry](https://sentry.io/) - tratamento de exceções em runtime.

### Banco de Dados:

All of the following databases were used on top of a docker container.

- [Postgres](https://github.com/postgres/postgres) - banco relacional usado para armazenar os usuários e dados gerais que envolvem relacionamentos.
- [MongoDB](https://www.mongodb.com/) - banco NoSQL usado para armazenar as notificações. O modelo **schema-free** do Mongo permite mais flexibilidade pois não é estruturado e ganha mais performances pois não efetua *queries* nos relacionamentos.
- [Redis](https://redis.io/) - banco chave-valor usado para armazenar os background jobs. São estruturas simples contendo um identificador (chave) e os dados (valor), e não necessitam de relacionamentos. O Redis cai bem pois é simples e altamente performático.

---

## Instale e execute:
```
$ git clone https://github.com/italomarcos1/fastfeet-api.git
```
```
$ cd fastfeet
```
```
$ yarn
```
```
$ inicialize os bancos de dados (essa fase está em desenvolvimento, em breve trago instruções)	
```
```
$ yarn dev	
```
Após isso, recomendo utilizar o [Insomnia](https://insomnia.rest/download/) para enviar as requisições, visto que o front-end ainda não está pronto.

By [Italo Marcos](https://www.linkedin.com/in/italo-m-b181b1117/)

---
## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/flaviohugo14/fastfeet/blob/master/LICENSE) para mais detalhes.

---