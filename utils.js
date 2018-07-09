var request = require("request");

var config = require("./config");

module.exports = {

    /**
     * Generic Method to transform and send the transformed version of the SPARL Query (url)
     */
    GetJSON(url) {
        var options = {
            uri: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-results+json',
                'Accept': 'application/json',
            }
        };

        return request(options, function (error, response, body) {
            if (error || response.statusCode != 200) {
                return error;
            } else {
                return JSON.parse(body).results.bindings;
            }
        });
    },




    /**
     * @param {string}   url         a string URL to populate the options field of request
     */
    prepare(url) {
        console.log("config: ", config);
        var options = {
            uri: config.rdfStore + url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-results+json',
                'Accept': 'application/json',
            }
        };
        return options;
    },

    /**
     * @param {json}   data         json retrieved from triples
     * @param {Array}  keysArray    the keys that must be taken as [string] and not string
     */
    transform(data, keysArray) {
        var transformed = {};
        Object.keys(data).forEach(key => {
            if (keysArray && keysArray.includes(key)) {
                transformed[key] = data[key].value.split(config.separator);
            } else {
                transformed[key] = data[key].value;
            }
        });
        return transformed;
    },

    /**
     * @param {json}   data         json retrieved from triples
     * @param {Array}  keysArray    the keys that must be taken as [string] and not string
     */
    transformArray(data, keysArray) {
        return data.map(elt => {
            return this.transform(elt, keysArray);
        });
    }


}