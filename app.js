var express = require('express');
var app = express();
var request = require('request');

var config = require('./config');

var sparqlModels = require('./queries/sparql-models');


// COMMODITY FUNCTIONS

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

transform = function(data) {
  var transformed = { };
  Object.keys(data).forEach(key => {
    transformed[key] = data[key].value;
  });
	return transformed;
}

transformArray = function(data) {
  return data.map(elt => {
    return transform(elt);
  });
}





// RESOURCES & METHODS

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
        res.json(transformArray(JSON.parse(body).results.bindings));
    }
  });
});

app.get('/models/:id', function(req, res) {
  let opts = prepare(config.rdfStore + sparqlModels.Model(req.params.id));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(transform(JSON.parse(body).results.bindings));
    }
  });
});

app.get('models/last/:nb', function(req, res) {
  let opts = prepare(config.rdfStore + sparqlModels.LastModels(req.params.nb));
  console.log("asked /models/last" + req.params.nb, opts);


  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(transformArray(JSON.parse(body).results.bindings));
    }
  });
});



// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
