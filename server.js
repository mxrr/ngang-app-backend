import dotenv from 'dotenv'
import monk from 'monk'
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { get } from 'http'
import crypto from 'crypto'
import multer from 'multer'
const __dirname = path.resolve();
dotenv.config();

const db = monk(process.env.DB_URL);
const content = db.get('content');
const users = db.get('users');


const port = process.env.PORT;
const secret = process.env.SECRET;

const app = express();


//Multer conf
const UPLOAD_FOLDER = './content/'
const FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
  'video/mp4',
  'video/webm',
  'audio/mpeg'
]

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const uploadFilter = async function(req, file, cb) {
  if (FORMATS.includes(file.mimetype)) {
    cb(null, true);
  }
  else {
    cb('File is invalid type', false);
  }
}

const upload = multer({ storage: storage, fileFilter: uploadFilter });

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
  content.find(contentType).then((data) => {
    res.send(data);
  });
});

app.post('/api/content', upload.single('file'), (req, res, next) => {
  const type = () => {
    switch(req.file.mimetype){
      case 'image/jpeg':
      case 'image/png':
      case 'image/jpg':
        return 'img'
      case 'image/gif':
        return 'gif'
      case 'video/mp4':
      case 'video/webm':
        return 'mp4'
      case 'audio/mpeg':
        return 'mp3'
    }
  }
  const insert = {
    type: type(),
    desc: req.body.desc,
    filename: req.file.filename
  }

  content.insert(insert);
  res.status(201);
  res.send(req.name);
});

app.post('/api/login', (req, res) => {
  const loginInfo = req.body;
  try {
    if (loginInfo.token === undefined || loginInfo.token === '') {
      users.find({user: loginInfo.user}).then((data) => {
        const hash = crypto.createHmac('sha256', secret).update(loginInfo.pwd).digest('hex');
    
        if(data[0].pwd == hash) {
          const seed = (Math.random() * Math.random() / Math.random()).toString();
          const token = crypto.createHmac('sha256', secret).update(seed).digest('hex');
    
          users.findOneAndUpdate(data[0]._id, { $set: { activeToken: token } }).then((data => {
            res.status(200);
            res.send({user: loginInfo.user, token: data.activeToken});
          }));
        }
        else {
          res.status(403);
          res.send('Wrong user or password');
        }
      });
    }
    else {
      users.findOne({user: loginInfo.user}).then((data) => {
        if(data.activeToken == loginInfo.token) {
          res.status(200);
          res.send({ user: loginInfo.user, token: data.activeToken});
        }
        else {
          res.status(403);
          res.send('Invalid or expired token');
        }
      })
    }
  } catch (error) {
    console.log(req)
  }
  
});

app.listen(port, () => console.log(`Listening on port ${port}`));