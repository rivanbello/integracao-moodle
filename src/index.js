const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

//Qualquer front terá acesso esse back end
app.use(cors());

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());

const projects =[];

app.get('/testar', (request, response) => {
  return response.json({message: "Teste executado!"})
});

app.get('/notificarVenda', (request, response) => {
  console.log(request);
});

app.listen(3333, () => {
  console.log('Back-end started!');
});