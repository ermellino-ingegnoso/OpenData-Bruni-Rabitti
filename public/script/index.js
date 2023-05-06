var listAppalti;

async function loadAppalti(){
    listAppalti=await (await fetch("..\data\appalti.json")).json()
}

function generateTable(list)
{
    document.getElementById("dati").innerHTML=`
        <table>
        <thead>
            ${Object.keys(list[0]).reduce((tot,v)=>tot+="<th>"+"<div><div class='table_arrow'><span>boh</span></div>"+"<div>"+v+"<div/></div>"+"</th>","")}
        </thead>
        <tbody>
            ${list.reduce(function(tot,v){
                tot+="<tr>"+Object.keys(v).reduce((final,el)=>final+="<td>"+v[el]+"</td>","")+"</tr>"
                return tot;
            },"")}
        </tbody>
        </table>
    `
}

window.addEventListener("load",async function(){
    await loadAppalti();
    generateTable(listAppalti);
})

