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
		binary: form["-binary"].checked,
		vtk: form["-vtk"].checked,
		labels_off: form["-labels_off"].checked,
		analyze: form["-analyze"].checked,

	}
	ipcRenderer.send('submitForm', data);
}

ipcRenderer.on('updateLog', function (event, data) {
	var logText = document.getElementById("logText")
	console.log("test")
});