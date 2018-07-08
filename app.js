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

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});




app.get('/models', function(req, res) {
  let nb = req.query.nb;
  if(nb) {
    res.send(
      utils.GetJSON(config.rdfStore + sparqlModels.LastModels(nb))
    );  
  } else {
    res.send(
      utils.GetJSON(config.rdfStore + sparqlModels.ModelList())
    );      
  }
});




// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
