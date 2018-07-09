var express = require('express');
var app = express();
var request = require('request');

var config = require('./config');

var sparqlModels = require('./queries/sparql-models');



prepare = function(url) {
  var options = {
    uri: url,
    method: 'POST',
    headers: {
        'Content-Type': 'application/sparql-results+json',
        'Accept': 'application/json',
    }
  };
  return options;
}


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
  let opts = prepare(config.rdfStore + sparqlModels.ModelList());

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(JSON.parse(body).results.bindings);
    }
  });
});

app.get('/models/:id', function(req, res) {
  let opts = prepare(config.rdfStore + sparqlModels.Model(req.params.id));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(JSON.parse(body).results.bindings);
    }
  });
});

app.get('models/last/:nb', function(req, res) {
  let opts = prepare(config.rdfStore + sparqlModels.LastModels(req.params.nb));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(JSON.parse(body).results.bindings);
    }
  });
});



// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
