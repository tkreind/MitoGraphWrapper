const { app, BrowserWindow, ipcMain } = require('electron');
const exec = require('child_process').exec;
const downloadRelease = require('download-github-release');
const fs = require('fs');
const applescript = require('applescript');

let downloadDir;

let win;

// downloads the latest version of MitoGraph
function downloadMitoGraph() {
	downloadDir = process.env.TMPDIR;

	// Define a function to filter releases.
	const filterRelease = function (release) {
		// Filter out prereleases.
		return release.prerelease === false;
	}

	// Define a function to filter assets.
	const filterAsset = function (asset) {
		// Select assets that contain the string 'OSX'.
		return asset.name.indexOf('OSX') >= 0;
	}

	if (!fs.existsSync(downloadDir + "/downloads")) {
		fs.mkdirSync(downloadDir + "/downloads");
	}

	downloadRelease('vianamp', 'MitoGraph', downloadDir + "/downloads", filterRelease, filterAsset, false)
		.then(function () {
			console.log('All done!');
		})
		.catch(function (err) {
			console.error(err.message);
		});
}

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.loadURL(`file://${__dirname}/index.html`);

	downloadMitoGraph();
}

var child_process;

ipcMain.on('submitForm', function (event, data) {

	// kill process if it exists
	if (child_process) {
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
	const mitoScript = downloadDir + "/downloads/MitoGraph " + arguments.join(' ');
	const script = 'tell app "Terminal" to do script "' + mitoScript + '" & activate';

	applescript.execString(script, (err, rtn) => {
		if (err) {
			// Something went wrong!
		}
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
	if (child_process) {
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