var express = require('express');
var app = express();
var request = require('request');

var utils = require('./utils');

var sparqlModels = require('./queries/sparql-models');







// RESOURCES & METHODS

app.get('/', function(req, res) {
  res.send({
    "message": "Welcome to api.geneontology.cloud"
  });
});


keysArrayModels = ["orcids", "names", "groupids", "groupnames"];
app.get('/models', function(req, res) {
  let opts = utils.prepare(sparqlModels.ModelList());

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayModels));
    }
  });
});

app.get('/models/:id', function(req, res) {
  let opts = utils.prepare(sparqlModels.Model(req.params.id));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(JSON.parse(body).results.bindings);
    }
  });
});

app.get('/models/last/:nb', function(req, res) {
  let opts = utils.prepare(sparqlModels.LastModels(req.params.nb));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayModels));
    }
  });
});




// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
