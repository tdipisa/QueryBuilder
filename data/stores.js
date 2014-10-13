/**
 * Set of local Ext stores to use for test purpose 
 */

// //////////////////////////////////////////////////////////////////// //
// General Schema for selected data (FeatureGrid, AttriburteFilter ...) //
// //////////////////////////////////////////////////////////////////// //
var schema = [
       {
          name:"NOME STATO_string",
          dbname:"STATE_NAME",
          type:"java.lang.String",
          restriction:"undefined",
          regex:"^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$"
       },
       {
          name:"NOME ABBREVIATO_date",
          dbname:"STATE_ABBR",
          type:"java.util.Date",
          restriction:"undefined",
          regex:"^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$"
       },
       {
           name:"NOME ABBREVIATO_integer",
           dbname:"STATE_ABBR",
           type:"java.lang.Integer",
           restriction:"undefined",
           regex:"^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$"
       },
       {
            name:"NOME ABBREVIATO_double",
            dbname:"STATE_ABBR",
            type:"java.lang.Double",
            restriction:"undefined",
            regex:"^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$"
       }
];

// ///////////// //
// LayerSelector //
// ///////////// //
var layerStore = [
	{name: "topp:states", description: "United States Of America"}
];

// /////////// //
// FeatureGrid //
// /////////// //
var gridStore = {
	'items':[
           {name: "Tobia", code: "19780", date: "1980-07-19"},
           {name: "Laura", code: "15155", date: "1955-01-15"},
           {name: "Cristina", code: "221083", date: "1983-10-22"}
    ]
};
		