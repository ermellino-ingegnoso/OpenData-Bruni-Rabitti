var listLavoro;
var listLavoroSort;
const currentSort=["asc","desc"]

function show_loading_screen()
{
    document.getElementById("loading_screen").classList.toggle("hidden")
}

async function loadAppalti(){
    listLavoro=await (await fetch("https://api-tep-cultura.vercel.app/api/lavoro")).json()
}

function generateTable(list)
{
    document.getElementById("dati").innerHTML=`
        <table>
        <thead>
            ${Object.keys(list[0]).reduce((tot,v)=>tot+="<th>"+"<div><div class='table_arrow'><span data-sort='"+v+"' data-currentsort=''></span></div>"+"<div>"+v+"<div/></div>"+"</th>","")}
        </thead>
        <tbody>
            ${list.reduce(function(tot,v){
                tot+="<tr>"+Object.keys(v).reduce((final,el)=>final+="<td>"+v[el]+"</td>","")+"</tr>"
                return tot;
            },"")}
        </tbody>
        </table>
    `
    document.querySelectorAll(".table_arrow span").forEach(el=>el.addEventListener("click",function(ev){
        if(ev.target.dataset.currentsort==""){ev.target.dataset.currentsort="asc"}
        else{
            ev.target.dataset.currentsort=currentSort.filter(el=>el!==ev.target.dataset.currentsort)[0]
        }
        //document.querySelectorAll(".table_arrow span").forEach(el=>el.setAttribute("data-currentsort","")); //se si volesse resettare
        sortTable(ev.target)
    }))
}

function refreshTable(list)
{
    document.getElementsByTagName("tbody")[0].innerHTML=`
    ${list.reduce(function(tot,v){
        tot+="<tr>"+Object.keys(v).reduce((final,el)=>final+="<td>"+v[el]+"</td>","")+"</tr>"
        return tot;
    },"")}
    `
}

function sortTable(el) {
    let col = el.dataset.sort;
    let mod = el.dataset.currentsort;
    let isNumeric = !isNaN(listLavoro[0][col]);
    if (mod == "asc") {
      listLavoroSort.sort(function(a, b) {
        if (isNumeric) {
          return a[col] - b[col];
        } else {
          return a[col].localeCompare(b[col]);
        }
      });
    } else {
      listLavoroSort.sort(function(a, b) {
        if (isNumeric) {
          return b[col] - a[col];
        } else {
          return b[col].localeCompare(a[col]);
        }
      });
    }
    refreshTable(listLavoroSort);
  }



window.addEventListener("load",async function(){
    show_loading_screen();
    await loadAppalti();
    listLavoroSort=[...listLavoro];
    generateTable(listLavoro);
    show_loading_screen();
})

