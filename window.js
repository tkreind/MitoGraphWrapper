const { ipcRenderer } = require('electron');

var form=document.getElementById("arguments");
form.addEventListener("submit",submit,false);

function submit() {
	ipcRenderer.send('submitForm', "test");
}
