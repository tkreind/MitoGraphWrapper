const { app, BrowserWindow } = require('electron');
const exec = require('child_process').exec;

let win;

function createWindow() {
    win = new BrowserWindow({ 
		width: 800, 
		height: 600 
	});
	win.loadURL(`file://${__dirname}/index.html`);
	
	// create the child process that will run the cli program
	var child = exec("ping -c 5 127.0.0.1");

	// use event hooks to provide a callback to execute when data are available: 
	child.stdout.on('data', function(data) {
		console.log(data.toString()); 
	});
}

app.on('ready', createWindow);



