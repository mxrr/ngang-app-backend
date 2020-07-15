import { Application } from "https://deno.land/x/abc@v1/mod.ts"
import { HttpMethod } from 'https://deno.land/x/abc@v1/constants.ts'
import { CORSConfig, cors } from 'https://deno.land/x/abc@v1/middleware/cors.ts'
import { testContent } from './components/apiHandler.ts'
import { Database } from 'https://deno.land/x/denodb/mod.ts';

import Config from './config.ts'
import User from './components/db/user.ts'


const db = new Database('mongo', {
  host: Config.dbAddress,
  username: Config.dbUser,
  password: Config.dbPwd,
  database: Config.dbName
});

db.link([User]);

await db.sync();
await User.create({name: 'test' });
await User.all();

const config: CORSConfig = {
  allowOrigins: ['*'],
  allowMethods: [HttpMethod.Get]
};


const app = new Application();

const port: number = Config.port;

app
  .get('/api', c => testContent())
  .file('/', 'dist/index.html')
  .static('/static', '/dist/static')
  .start({ port: port });

app.use(cors(config))

console.log(`Running on localhost:${port}`)
