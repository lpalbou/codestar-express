var request = require("request");

module.exports = {


    /* Generic Method to transform and send the transformed version of the SPARL Query (url) */
    GetJSON(url) {
        var options = {
            uri: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-results+json',
                'Accept': 'application/json',
            }
        };

         request(options, function (error, response, body) {
            if (error || response.statusCode != 200) {
                return error;
            } else {
                return JSON.parse(body).results.bindings;
            }
        });
    }

}