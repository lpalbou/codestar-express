var express = require('express');
var app = express();

var config = require('./config');
var utils = require('./utils');

var sparqlModels = require('./queries/sparql-models');


var request = require('request');
var options = {
  uri: url,
  method: 'POST',
  headers: {
      'Content-Type': 'application/sparql-results+json',
      'Accept': 'application/json',
  }
};




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

  let opts = options;
  opts.uri = config.rdfStore + sparqlModels.ModelList();

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(JSON.parse(body).results.bindings);
    }
  });
});

app.get('models/last/:nb', function(req, res) {
    res.send(
      utils.GetJSON(config.rdfStore + sparqlModels.LastModels(req.params.nb))
    );  
});



// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
