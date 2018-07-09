var express = require('express');
var app = express();

var config = require('./config');
var utils = require('./utils');

var sparqlModels = require('./queries/sparql-models');

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.get('/toto', function(req, res) {
  res.json({
    "Output": "Hello Toto!"
  });
});

app.get('/models', function(req, res) {
  res.send(
    utils.GetJSON(config.rdfStore + sparqlModels.ModelList())
  );      
});

app.get('models/last/:nb', function(req, res) {
    res.send(
      utils.GetJSON(config.rdfStore + sparqlModels.LastModels(req.params.nb))
    );  
});



// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
