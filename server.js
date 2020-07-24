import dotenv from 'dotenv'
import monk from 'monk'
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
const __dirname = path.resolve();
dotenv.config();

const db = monk(process.env.DB_URL);
const content = db.get('content');

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static('./dist/static'));
app.use('/files', express.static('./content'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html', { root: __dirname });
});

app.get('/api/content', (req, res) => {
  const contentType = req.query.type === '' || req.query.type === undefined ? {} : {type: req.query.type};
  content.find(contentType, '-bigdata').then((data) => {
    res.send(data);
  });
});

app.post('/api/content', (req, res) => {
  content.insert(req.body);
  res.status(201);
  res.send(`Added ${req.body.desc} with path ${req.body.filename}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));