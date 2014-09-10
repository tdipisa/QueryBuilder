/**
 * Set of local Ext stores to use for test purpose 
 */

// //////////////////////////////////////////////////////////////////// //
// General Schema for selected data (FeatureGrid, AttriburteFilter ...) //
// //////////////////////////////////////////////////////////////////// //
var schema = [
	   {name: "name", type: "xsd:string", restriction: undefined},
	   {name: "code", type: "xsd:double", restriction: undefined},
	   {name: "date", type: "xsd:date"  , restriction: undefined}
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
		