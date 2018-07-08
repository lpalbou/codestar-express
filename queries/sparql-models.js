var separator = require("../config").listSeparator;

module.exports = {

    /* Get the Last GO-CAMs */
    LastModels(number) {
        var encoded = encodeURIComponent(`
        PREFIX metago: <http://model.geneontology.org/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
        
        SELECT  ?id ?date ?title    (GROUP_CONCAT(?orcid;separator="` + separator + `") AS ?orcids) 
                                    (GROUP_CONCAT(?name;separator="` + separator + `") AS ?names)
        WHERE 
        {
          	GRAPH ?cam {      
	            ?cam metago:graphType metago:noctuaCam .
        	    ?cam dc:title ?title ;
    	             dc:date ?date ;
        	         dc:contributor ?orcid .
            
	            BIND( IRI(?orcid) AS ?orcidIRI ).
          
    	      	optional { ?cam <http://www.geneontology.org/formats/oboInOwl#id> ?id }
        	
              	# Baby Proofing the query since oboInOwl#id is not always there
	  			BIND(IF(bound(?id), ?id, concat("gomodel:", substr(str(?cam), 31))) as ?id) .
            }
          
            optional { ?orcidIRI rdfs:label ?name }
	  	    BIND(IF(bound(?name), ?name, ?orcid) as ?name) .
        }   
        GROUP BY ?id ?date ?title ?cam
        ORDER BY DESC(?date)
        LIMIT ` + number + `
        `);
        return "?query=" + encoded;
    },

    ModelList() {
        var encoded = encodeURIComponent(`
        PREFIX metago: <http://model.geneontology.org/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    	PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
        PREFIX providedBy: <http://purl.org/pav/providedBy>
  
        SELECT  ?gocam ?date ?title (GROUP_CONCAT(?orcid;separator="` + separator + `") AS ?orcids) 
                                    (GROUP_CONCAT(?name;separator="` + separator + `") AS ?names)
							        (GROUP_CONCAT(distinct ?providedBy;separator="` + separator + `") AS ?groupIDs) 
							        (GROUP_CONCAT(distinct ?providedByLabel;separator="` + separator + `") AS ?groupNames) 
        
        WHERE 
        {
  	    	{
              	GRAPH ?gocam {            
	                ?gocam metago:graphType metago:noctuaCam .
              
            	    ?gocam dc:title ?title ;
        	             dc:date ?date ;
            	         dc:contributor ?orcid ;
    		    		 providedBy: ?providedBy .
    
    	            BIND( IRI(?orcid) AS ?orcidIRI ).
	                BIND( IRI(?providedBy) AS ?providedByIRI ).
                }
         
          		optional {
        		  	?providedByIRI rdfs:label ?providedByLabel .
  		        }
  
                optional { ?orcidIRI rdfs:label ?name }
        	  	BIND(IF(bound(?name), ?name, ?orcid) as ?name) .
            }   
  
        }
        GROUP BY ?gocam ?date ?title 
        ORDER BY DESC(?date)
        `);
        return "?query=" + encoded;
    }

}