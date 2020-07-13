export const testContent = () => {
  return Deno.readTextFile('./testcontent.json').then(data => JSON.parse(data));
}