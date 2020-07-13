import { Application } from "https://deno.land/x/abc@v1/mod.ts"
import { HttpMethod } from 'https://deno.land/x/abc@v1/constants.ts'
import { CORSConfig, cors } from 'https://deno.land/x/abc@v1/middleware/cors.ts'
import { testContent } from './components/apiHandler.ts'
import Config from './config.ts'


const config: CORSConfig = {
  allowOrigins: ['*'],
  allowMethods: [HttpMethod.Get]
};


const app = new Application();

const port: number = Config.port;
console.log(Config.key)

app
  .get('/api', c => testContent())
  .file('/', 'dist/index.html')
  .static('/static', '/dist/static')
  .start({ port: port });

app.use(cors(config))

console.log(`Running on localhost:${port}`)
