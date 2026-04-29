let express = require('express');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');
let methodOvirride = require('method-override');
let cors = require('cors');

let app = express();
//Vincule middlewares
app.use(cors());

// Permite que você use verbos HTTP
app.use(methodOvirride('X-HTTP-Method'));
app.use(methodOvirride('X-HTTP-Method-Override'));
app.use(methodOvirride('X-Method-Override'));
app.use(methodOvirride('_method'));



app.use((req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// caminho do mongoo
let url = "mongodb://localhost:27017/DSM_2026";

mongoose.connect(url)
  .then(
    () => { console.log('Conectado ao Mongoodb') }
  ).catch(
    (e) => { console.log(e) }
  );

// fazer a estrutura coleção, documento(agregado)
const Us = mongoose.model('Usuario',
  mongoose.Schema({ name: String })
)
// get
app.get('/', async (req, res) => {
  // fazer mongoo exibir do documentos(registro)
  const documentos = await Us.find({});
  res.json(documentos);
})

// post
app.post('/add', async (req, res) => {
  let nome = req.body.name;
  const rec = await new Us({ name: nome });
  rec.save();
  res.json({ "status": "Adicionado" });

})

// put
app.put('/:id', (req, res) => {
  let i = req.params.id;
  res.send(`Got a ID request ${i}`)
})

//delete
app.delete('/:id', async (req, res) => {
  let i = req.params.id;
  await Us.deleteOne({ _id: i });
  res.json({ "msg" :"delete "});
  // // comando do mongoo
  // await Us.deleteOne({ _id: { $eq: i } })
  // res.send(`delete a ID request ${i}`)
})

// Iniciar o Servidor
app.listen(3000, () => {
  console.log('Executando o Servidor')
});