#!/usr/bin/env node
/**
* MIT License
*
* Copyright (c) 2019 adnan-iug
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

const express = require("express");
const secure = require("express-force-https");
const path = require("path");
const fs = require("fs");

const app = express();


let port = process.env.PORT || 3000; // default port

let entryName = "index.html"; // default entry name
let sub = ""; // default sub directory is assigned at 4th if


let currentDirecotry = process.cwd();

const args = process.argv; //  passed args to cli
const indexPort = args.indexOf("-p");
const indexEntryName = args.indexOf("-e");
const indexSub = args.indexOf("-d");
const indexHttps = args.indexOf("-https");
const indexProxy = args.indexOf("-proxy");


if (indexPort !== -1) {
  port = args[indexPort + 1];
}

if (indexEntryName !== -1) {
  entryName = args[indexEntryName + 1];
}

if (indexSub !== -1) {
  sub = args[indexSub + 1];
}

if (indexHttps !== -1) {
  app.use(secure);
}

if (indexProxy !== -1) {
  // proxy must be in ./src/setupProxy.js
  const absoluteProxyDefaultPath = path.join(currentDirecotry, "src", "setupProxy.js");
  console.log("proxy must be in path:", absoluteProxyDefaultPath);
  const setupProxy = require(absoluteProxyDefaultPath);
  setupProxy(app);
}

if (args.indexOf(".") !== -1 || indexSub === -1) { // if "." node or if there is no dir passed ,, trim current direcroy,, because it duplicated with sub !
  const trimmed = currentDirecotry.split(path.sep);
  sub = trimmed.pop(); // assigned
  currentDirecotry = trimmed.join(path.sep);
}


const absolutePath = path.join(currentDirecotry, sub, entryName);
const relativePath = path.join(sub, entryName);

let count = 0;

function startServer() {
  count += 1; // starts from 1
  console.log(`trial ${count} port ${port}`);
  app.listen(port, () => {
    if (indexHttps !== -1) {
      console.log(`server is running at https port:${port}`);
    } else {
      console.log(`server is running at port:${port}`);
    }
  }).on("error", (err) => {
    console.log(err.message);
    port = Math.floor(Math.random() * 6000) + 3000; // listen to random port from 3000 to 9000
    if (count !== 100) startServer(); // max trials to run 100
  });
}

// check entry file exists !

fs.stat(absolutePath, (err, stat) => {
  if (stat) { // if there is state(properties) for this file ,,,, i use it as indicator to see the file exists or not
    console.log(`${relativePath} exists`);
    startServer();
  } else {
    console.log(`${relativePath} not exists or cant read it`);
  }
});

// special handling for css => in production has problem of mime type
app.get("/static/css/*", (req, res, next) => {
  if (req.url.endsWith(".css")) {
    console.log("endsWith css", req.url);
    res.setHeader("content-type", "text/css");
    res.sendFile(path.join(currentDirecotry, sub, req.url));
  } else next();
});

// use all the sub folder as static files
app.use(express.static(path.join(currentDirecotry, sub))); // use all the sub folder

app.get("*", (req, res) => {
  res.sendFile(absolutePath);
});
