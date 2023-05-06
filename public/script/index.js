var listAppalti;

async function loadAppalti(){
    listAppalti=await (await fetch("/appalti")).json()
}

/*function generateTable(list)
{

}*/

window.addEventListener("load",async function(){
    await loadAppalti();
    //generateTable(listAppalti);
})

