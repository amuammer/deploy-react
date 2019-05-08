#!/usr/bin/env node

const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');


var port = process.env.PORT || 3000 ; // default port

var entryName = "index.html"; // default entry name
var sub ; // default sub directory is assigned at 4th if 



var currentDirecotry = process.cwd();

const args = process.argv; //  passed args to cli 
const indexPort = args.indexOf("-p");
const indexEntryName = args.indexOf("-e");
const indexSub = args.indexOf("-d");

if(indexPort!=-1){
	port = args[indexPort+1];
}

if(indexEntryName!=-1){
	entryName = args[indexEntryName+1];
}

if(indexSub!=-1){
	sub = args[indexSub+1];
}

if(args.indexOf(".")!=-1 || indexSub ==-1 ){ // if "." node or if there is no dir passed ,, trim current direcroy,, because it duplicated with sub !
	var trimmed = currentDirecotry.split(path.sep);
	sub = trimmed.pop(); // assigned 
	currentDirecotry = trimmed.join(path.sep);
}


const absolutePath= path.join(currentDirecotry, sub, entryName);
const relativePath = path.join(sub,entryName);

// check entry file exists !

fs.stat(absolutePath, function(err,stat){
			
   if (stat) { // if there is state(properties) for this file ,,,, i use it as indicator to see the file exists or not
    console.log(relativePath+" exists");
		startServer();
   }else{  
		  console.log(relativePath+" not exists or cant read it");   
   }
});


var count = 0; 

function startServer(){
		count++; // starts from 1
		console.log(`trial ${count} port ${port}`);
app.listen(port,()=>{
		console.log("serve is running at port:"+port);
}).on("error",(err)=>{
		console.log("port "+port+" in use");
		port = Math.floor(Math.random()*6000)+3000; // listen to random port from 3000 to 9000 
		if(count!=100) startServer(); // max trials to run 100
});
}


app.use(express.static(path.join(currentDirecotry, sub))); // use all the sub folder 

app.get('*', function(req, res) {
  res.sendFile(absolutePath);
});
