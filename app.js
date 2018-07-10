var express = require('express'),
    app = express(),
    request = require('request');

var sparqlModels = require('./queries/sparql-models'),
    sparqlGOs = require('./queries/sparql-go'),
    sparqlGroups = require('./queries/sparql-groups'),
    sparqlUsers = require('./queries/sparql-users');

var utils = require('./utils');





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


keysArrayGOs = ["goclasses", "goids", "gonames", "definitions"]
app.get('/models/go', function(req, res) {
  let gocams = req.query.gocams;
  let opts;
  if(gocams) {
    gocams = utils.splitTrim(gocams, ",", "<http://model.geneontology.org/", ">");
    opts = utils.prepare(sparqlModels.ModelsGOs(gocams));
  } else {
    opts = utils.prepare(sparqlModels.AllModelsGOs());
  }

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayGOs));
    }
  });
});

keysArrayGPs = ["gpnames", "gpids"]
app.get('/models/gp', function(req, res) {
  let gocams = req.query.gocams;
  let opts;
  if(gocams) {
    gocams = utils.splitTrim(gocams, ",", "<http://model.geneontology.org/", ">");
    opts = utils.prepare(sparqlModels.ModelsGPs(gocams));
  } else {
    opts = utils.prepare(sparqlModels.AllModelsGPs());
  }
    
  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayGPs));
    }
  });
});

keysArrayPMIDs = ["sources"]
app.get('/models/pmid', function(req, res) {
  let gocams = req.query.gocams;
  let opts;
  if(gocams) {
    gocams = utils.splitTrim(gocams, ",", "<http://model.geneontology.org/", ">");
    opts = utils.prepare(sparqlModels.ModelsPMIDs(gocams));
  } else {
    opts = utils.prepare(sparqlModels.AllModelsPMIDs());
  }

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayPMIDs));
//        res.json(JSON.parse(body).results.bindings);
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



keysArrayUsers = ["organizations", "affiliations"];
app.get('/users', function(req, res) {
  let opts = utils.prepare(sparqlUsers.UserList());

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        utils.addCORS(res);
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayUsers));
    }
  });
});

keysArrayUser = ["organizations", "affiliations", "affiliationsIRI", "gocams", "gocamsDate", "gocamsTitle", "gpnames", "gpids", "bpnames", "bpids"];
app.get('/users/:orcid', function(req, res) {
  let opts = utils.prepare(sparqlUsers.UserMeta(req.params.orcid));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings, keysArrayUser)[0]);
    }
  });
});






app.get('/groups', function(req, res) {
  let opts = utils.prepare(sparqlGroups.GroupList());

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings));
    }
  });
});

app.get('/groups/:name', function(req, res) {
  let opts = utils.prepare(sparqlGroups.GroupMeta(req.params.name));

  request(opts, function (error, response, body) {
    if (error || response.statusCode != 200) {
        res.send(error);
    } else {
        res.json(utils.transformArray(JSON.parse(body).results.bindings));
//        res.json(JSON.parse(body).results.bindings);
    }
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
