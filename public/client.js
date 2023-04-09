// client-side js
// run by the browser each time your view template referencing it is loaded

const idMaps = [];

// define variables that reference elements on our page
const idMapsForm = document.forms[0];
const myIdInput = idMapsForm.elements["myId"];
const yourIdInput = idMapsForm.elements["yourId"];
const idMapsList = document.getElementById("ids");

// request the idMaps from our app's sqlite database
fetch("/ids", {})
  .then((res) => res.json())
  .then((response) => {
    response.forEach((row) => {
      appendNewidMap(row.myId, row.yourId);
    });
  });

// a helper function that creates a list item for a given idMap
const appendNewidMap = (myId, yourId) => {
  const newListItem = document.createElement("li");
  newListItem.innerText = myId + "➡" + yourId;
  idMapsList.appendChild(newListItem);
};

// listen for the form to be submitted and add a new idMap when it is
idMapsForm.onsubmit = (event) => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { myId: myIdInput.value, yourId: yourIdInput.value };

  fetch("/id", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(JSON.stringify(response));
    });

  // get idMap value and add it to the list
  appendNewidMap(myIdInput.value, yourIdInput.value);

  // reset form
  myIdInput.value = "";
  yourIdInput.value = "";
  myIdInput.focus();
};
