
async function buscarL() {
 const arr = [['123'], ['23'], 24]
 await arr.forEach(async ele => {
  console.log(ele[0].length)
 });
}
const caca = async () => {

 try {
  await buscarL()
 } catch (rrrrraaa) {
  console.log(rrrrraaa);
 }
}
caca()
console.log('fin');