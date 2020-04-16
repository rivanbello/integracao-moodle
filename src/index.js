const express = require('express');
var fs = require('fs');

const app = express();

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());
app.use(express.urlencoded());

const file = './src/vendas.txt';

app.post('/venda', (request, response) => {
  const { email, name, first_name, last_name, purchase_date} = request.body;

  var obj;
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
  });

  obj.push({
    date: new Date(purchase_date),
    email,
    name,
  });

  fs.writeFile(file, obj ,{enconding:'utf-8',flag: 'a+'}, function(erro) {
      
    if(erro) {
          throw erro;
      }

      return response.json({message: "Venda regristada com suscesso!"})
  });  
});

app.get('/listar-vendas', (request, response) => {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw err;
    return response.json(data);
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Back-end started!');
});