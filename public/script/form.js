function notifica(messaggio, successo) {
  //notifica di errore
  const notif = document.createElement("div");
  notif.classList.add("notifica");
  if (successo == true) {
    notif.classList.add("notif_success");
  } else {
    notif.classList.add("notif_error");
  }
  notif.innerHTML = messaggio;
  document.getElementById("notifiche").appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

const form = document.getElementById("appalto-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const contractData = {};
  formData.forEach((value, key) => {
    contractData[key] = value;
  });
  const response = await fetch("/aggiuntaAppalto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contractData),
  });
  if (!response.ok) {
    const messaggio=await response.text();
    notifica("Errore nell'aggiunta dell'appalto, errore nei seguenti campi:" + "<br>"+ messaggio, false);
  } else {
    notifica("Appalto aggiunto", true);
    form.reset();
  }
});
