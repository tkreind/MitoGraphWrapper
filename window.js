const { ipcRenderer } = require('electron');
const {dialog} = require('electron').remote;

var form = document.getElementById("arguments");
form.addEventListener("submit",submit,false);

function submit() {
	var form = document.getElementById("arguments");
	var data = {
		path: filePath,
		xy: form["-xy"].value,
		z: form["-z"].value,
		scales: {
			a: form["-scales-a"].value,
			b: form["-scales-b"].value,
			c: form["-scales-c"].value
		},
		threshold: form["-threshold"].value,
		adaptive: form["-adaptive"].value,
		binary: form["-binary"].checked,
		vtk: form["-vtk"].checked,
		labels_off: form["-labels_off"].checked,
		analyze: form["-analyze"].checked,

	}
	ipcRenderer.send('submitForm', data);
}

var filePath;

document.querySelector('#filePath').addEventListener('click', function (event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (directory) {
        if (directory !== undefined) {
			filePath = directory
			document.getElementById("filePath").innerHTML = directory
        }
    });
});