const express = require('express');

const app = express();

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());

const projects =[];

app.get('/venda', (request, response) => {
  return response.json({message: "Teste executado!"})
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Back-end started!');
});