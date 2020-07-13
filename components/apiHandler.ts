export const testContent = () => {
  return Deno.readTextFile('./assets/testcontent.json').then(data => JSON.parse(data));
}