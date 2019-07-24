const { ipcRenderer } = require('electron');

var form = document.getElementById("arguments");
form.addEventListener("submit",submit,false);

function submit() {
	var form = document.getElementById("arguments");
	var data = {
		program: form["-program"].value,
		path: form["-path"].value,
		xy: form["-xy"].value,
		z: form["-z"].value,
		scales: {
			a: form["-scales-a"].value,
			b: form["-scales-b"].value,
			c: form["-scales-c"].value
		},
		threshold: form["-threshold"].value,
		adaptive: form["-adaptive"].value,
		binary: form["-binary"].value,
		vtk: form["-vtk"].value,
		labels_off: form["-labels_off"].value,
		analyze: form["-analyze"].value,

	}
	ipcRenderer.send('submitForm', data);
}
