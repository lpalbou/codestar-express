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
//        console.log("config: ", config);
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


    sendWithCORS(res, json) {
        addCORS(res);
        res.json(json);
    },

    addCORS(res) {
//        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token");
//        res.setHeader("Access-Control-Allow-Methods", "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT");
        res.setHeader("Access-Control-Allow-Origin", "*");
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
    },



    getOrcid(orcid) {
        var re = /[\d]+[-][\d]+/;

        var modOrcid = orcid;
        if (re.test(orcid)) {
            modOrcid = "http://orcid.org/" + orcid;
        }
        modOrcid = "\"" + modOrcid + "\"^^xsd:string";
        return modOrcid;
    },

    /* Split the string argument, and if defined, add a prefix & suffix to each splitted string */
    splitTrim(string, split, prefix, suffix) {
        if (!prefix)
            prefix = "";
        if (!suffix)
            suffix = "";
        var array = string.split(split);
        for (var i = 0; i < array.length; i++) {
            array[i] = prefix + array[i].trim() + suffix;
        }
        return array;
    },


    concat(a, b) {
        return a + " " + b;
    }

}