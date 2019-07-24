const { app, BrowserWindow, ipcMain } = require('electron');
const spawn = require('child_process').spawn;

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.loadURL(`file://${__dirname}/index.html`);


}

let child_processes = [];

ipcMain.on('submitForm', function (event, data) {

	let arguments = [
		"-xy",
		data.xy,
		"-z",
		data.z,
		"-path",
		data.path,
	];

	if (data.adaptive.trim().length != 0) {
		arguments.push("-adaptive " + data.adaptive.trim())
	}
	if (data.threshold.trim().length != 0) {
		arguments.push("-threshold " + data.threshold.trim())
	}
	if (data.scales.a.trim().length != 0) {
		arguments.push("-scales " + data.scales.a.trim() + " " + data.scales.b.trim() + " " + data.scales.c.trim())
	}

	if (data.binary) {
		arguments.push("-binary")
	}
	if (data.vtk) {
		arguments.push("-vtk")
	}
	if (data.labels_off) {
		arguments.push("-labels_off")
	}
	if (data.analyze) {
		arguments.push("-analyze")
	}

	// create the child process that will run the cli program
	child_processes.push(spawn(data.program.trim(), arguments, { stdio: 'inherit' }));

});

// default create function
app.on('ready', createWindow);

// quit application when all windows closed
app.on('window-close-all', () => {
	app.quit();
});

// on quit kill all child processes
app.on('quit', () => {
	child_processes.forEach(function(child) {
		child.kill();
	});
});

