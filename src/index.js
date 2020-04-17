const express = require('express');
const axios = require('axios');
var fs = require('fs');

const app = express();

//Necessário para usar na requisições post o recurso JSON
app.use(express.json());
app.use(express.urlencoded());

const file = './src/vendas.json';
const moodleURl = 'http://nascidodenovo.org/moodle30/webservice/rest/server.php?wstoken=ee542db42f9ef8002f44eb04d5ac2e26&moodlewsrestformat=json';

app.post('/venda', async (request, response) => {
  const { email, name, first_name, last_name, purchase_date} = request.body;

  //verificar se o email não existe no moodle
  const wsFunction = '&wsfunction=core_user_get_users';
  const key = '&criteria[0][key]=email';
  const value ='&criteria[0][value]=' + email;

  var moodleResponse = {};

  console.log('Verificando se usuário existe no moodle.')
  await axios
  .post(moodleURl + wsFunction + key + value)
  .then(res => {
    moodleResponse = res.data.users;
  })
  .catch(error => {
    console.error(error)
  });

  //verificar se usuario ja existe
  if(moodleResponse.length){
    console.log('Usário ja existe na base do moodle.');
    return response.json({message: 'Usário ja existe na base do moodle.'});
  }
  else //Caso nao exista adicionar no moddle
  {
    console.log('Criando usuário no moodle.')
    const wsFunction = '&wsfunction=core_user_create_users';
    var username = removeAcento(first_name.toLowerCase() + '.' + last_name.toLowerCase());
    var users = {
        'users[0][username]': username,
        'users[0][createpassword]': 1,
        'users[0][firstname]': first_name,
        'users[0][lastname]': last_name,
        'users[0][email]': email
      };

    const formUrlEncoded = function (x) {
      return Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
    }; 

    axios.post(moodleURl+wsFunction, formUrlEncoded(users), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(res => {
      console.log('Usuário criado no moodle!');
      moodleResponse = res.data
      console.log(res.data);

      //Increver usuário no curso
      console.log('Vinculando o usuario ao curso...');
      var subscribe = {
        'enrolments[0][roleid]':1,
        'enrolments[0][userid]': moodleResponse[0].id,
        'enrolments[0][courseid]':2
      };

      const wsFunction2 = '&wsfunction=enrol_manual_enrol_users';
      axios.post(moodleURl+wsFunction2, formUrlEncoded(subscribe), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(res => {
        if (res.data === null)
        {
          console.log('Usuário vinculado ao curso.');
        }

        //Salvar no arquivo vendas.json
        saveInFile(purchase_date, email, name);
      })
      .catch(error => {
        console.error(error)
      });
    })
    .catch(error => {
      console.error(error)
    });    
  }

  return response.json({resposta : moodleResponse});
});

app.get('/listar-vendas', (request, response) => {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw err;
    return response.json(JSON.parse(data));
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Back-end started!');
});

function saveInFile(purchase_date, email, name) {
  var obj = [];
  
  var rawdata = fs.readFileSync(file);
  var obj = JSON.parse(rawdata);

  obj.push({
    date: new Date(purchase_date),
    email,
    name,
  });

  console.log('Lista de vendas', obj);

  fs.writeFile(file, JSON.stringify(obj) , {enconding:'utf-8',flag: 'w'}, function(err) {
    if (err) throw err;
    return true;
  });  
}

function removeAcento (text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}