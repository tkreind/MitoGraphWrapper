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

var child_process;

ipcMain.on('submitForm', function (event, data) {

	// kill process if it exists
	if(child_process) {
		child_process.kill();
	}

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
	child_process = spawn(data.program.trim(), arguments);

	// pipe the stdout of this process to make it useable
	child_process.stdout.on('data', function(data) {
		var test = data.toString();
		console.log(test);
	 });
	 

	child_process.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		child_process = null;
	});

});

// default create function
app.on('ready', createWindow);

// quit application when all windows closed
app.on('window-close-all', () => {
	app.quit();
});

// function to clean up all child processes
function killChildren() {
	if(child_process) {
		child_process.kill();
	}
	child_process = null;
}

// on exit kill all child processes
process.on('exit', () => {
	killChildren()
});

//catches ctrl+c event
process.on('SIGINT', () => { 
	killChildren() 
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => { 
	killChildren() 
});
process.on('SIGUSR2', () => { 
	killChildren() 
});

//catches uncaught exceptions
process.on('uncaughtException', () => { 
	killChildren()
});