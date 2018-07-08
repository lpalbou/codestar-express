var express = require('express');
var app = express();

var config = require('config');
var utils = require('utils');

var sparqlModels = require('queries/sparql-models');

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});




app.get('/models', function(req, res) {
  let url = config.rdfStore + sparqlModels.ModelList();
  res.send(
    utils.GetJSON(url)
  );
});




// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
