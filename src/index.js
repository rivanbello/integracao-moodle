const express = require('express');
var fs = require('fs');

const app = express();

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());
app.use(express.urlencoded());

const file = './src/vendas.json';

app.post('/venda', (request, response) => {
  const { email, name, first_name, last_name, purchase_date} = request.body;

  var obj = [];
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    
    console.log('data', data);
    obj = JSON.parse(data);

    console.log('obj', obj);
  });

  obj.push({
    date: new Date(purchase_date),
    email,
    name,
  });

  console.log(obj);

  fs.writeFile(file, JSON.stringify(obj) , 'utf-8', function(erro) {
      
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