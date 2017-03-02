var express = require("express");
var fs = require('fs');

/* configuration */
var dir = 'C:\\Users\\u0049648\\olapp\\olapp\\www\\';
var homeClient = dir + 'index.html';
var homeBeamer = dir + 'beamer.html';
var homeMaster = dir + 'quizmaster.html';
var portClient = 5001;
var portBeamer = 5002;
var portMaster = 5003;

/* the client */
{
	/* the client app */
	var appClient = express();

	/* serves main page */
	appClient.get("/", function(req, res) {
		console.log('client static home request : ' + homeClient);
		res.sendFile(homeClient);
	});

	/* serves all the static files */
	appClient.get(/^(.+)$/, function(req, res){ 
		var fileClient = dir + req.params[0];
		if(fs.existsSync(fileClient)) {
			console.log('client static file request : ' + req.params[0]);
			res.sendFile(fileClient);
		} else {
			console.log('client static unknown request : ' + homeClient);
			res.sendFile(homeClient);
		}	  
	});

	/* run the client */
	appClient.listen(portClient, function() {
		console.log("Client listening on " + portClient);
	});
}

/* the beamer */
{
	/* the beamer app */
	var appBeamer = express();

	/* serves main page */
	appBeamer.get("/", function(req, res) {
		console.log('beamer static home request : ' + homeBeamer);
		res.sendFile(homeBeamer);
	});

	/* serves all the static files */
	appBeamer.get(/^(.+)$/, function(req, res){ 
		var fileBeamer = dir + req.params[0];
		if(fs.existsSync(fileBeamer)) {
			console.log('beamer static file request : ' + req.params[0]);
			res.sendFile(fileBeamer);
		} else {
			console.log('beamer static unknown request : ' + homeBeamer);
			res.sendFile(homeBeamer);
		}	  
	});

	/* run the beamer */
	appBeamer.listen(portBeamer, function() {
		console.log("Beamer listening on " + portBeamer);
	});
}

/* the master */
{
	/* the master app */
	var appMaster = express();

	/* serves main page */
	appMaster.get("/", function(req, res) {
		console.log('master static home request : ' + homeMaster);
		res.sendFile(homeMaster);
	});

	/* serves all the static files */
	appMaster.get(/^(.+)$/, function(req, res){ 
		var fileMaster = dir + req.params[0];
		if(fs.existsSync(fileMaster)) {
			console.log('master static file request : ' + req.params[0]);
			res.sendFile(fileMaster);
		} else {
			console.log('master static unknown request : ' + homeMaster);
			res.sendFile(homeMaster);
		}	  
	});

	/* run the master */
	appMaster.listen(portMaster, function() {
		console.log("Master listening on " + portMaster);
	});
}
