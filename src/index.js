const express = require('express');
var fs = require('fs');

const app = express();

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());

app.get('/venda', (request, response) => {
  const { query } = request;
  fs.writeFile("./src/vendas.txt", `${JSON.stringify(query)},` ,{enconding:'utf-8',flag: 'a+'}, function(erro) {
      
    if(erro) {
          throw erro;
      }

      return response.json({message: "Venda regristada com suscesso!"})
  });  
});

app.get('/listar-vendas', (request, response) => {
  fs.readFile('./src/vendas.txt', 'utf8', function(err, data) {
    if (err) throw err;
    return response.json(data);
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Back-end started!');
});