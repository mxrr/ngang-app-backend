import { Application } from "https://deno.land/x/abc@v1/mod.ts"

const app = new Application();

const port: number = 8080;

app
  .get('/api', c => {
	return 'api';
  })
  .file('/', 'dist/index.html')
  .static('/static', '/dist/static')
  .start({ port: port });


console.log(`Running on localhost:${port}`)
