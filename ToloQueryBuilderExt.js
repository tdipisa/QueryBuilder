/**
 * @overview Query Tool (ricerca alfanumerica libera general purpose).
 *
 * Strumento di ricerca alfanumerica libera (Query Tool) general purpose (in grado cioè di 
 * lavorare su qualunque layer vettoriale configurato nel sistema) per Tolomeo.
 *
 * @name Tolomeo - Interfaccia Query Builder
 * @author Tobia Di Pisa
 */

/**
 * Class: TolomeoExt.ToloQueryBuilderExt
 *
 *
 */
Ext.define('TolomeoExt.ToloQueryBuilderExt', {

	extend: 'Ext.Panel',

	/** 
	 * Property: paramsJS
	 * {JSONObject}
	 */
	paramsJS: null,

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,
	
	config: {
		qbEventManager: null,
		layerSelector: null,
		spatialSelector: null,
		queryfilter: null
	}, 

	/**
	 * initComponent: TolomeoExt.ToloQueryBuilderExt
	 * Crea un nuovo TolomeoExt.ToloQueryBuilderExt
	 *
	 * Returns:
	 * {<TolomeoExt.ToloQueryBuilderExt>} Un nuovo TolomeoExt.ToloQueryBuilderExt
	 */
	initComponent: function(){	
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		//this.layout = "fit";
    	
		this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		
		this.layerSelector = Ext.create('TolomeoExt.widgets.ToloLayerSelector');
		this.spatialSelector = Ext.create('TolomeoExt.widgets.ToloSpatialSelector', {
			qbEventManager: this.qbEventManager
		});
		this.queryfilter = Ext.create('TolomeoExt.widgets.ToloAttributeFilter');
			
		this.bbar = ["->", {
            text: "Cancella",
            //iconCls: "cancel",
            scope: this,
            handler: function() {
            	alert("cancel");
            }
        }, {
            text: "Cerca",
            //iconCls: "gxp-icon-find",
            handler: function() {
            	var filters = [];
            	
            	var attributeFilter = this.queryfilter.filterBuilder.getFilter();
            	if(attributeFilter){
            		filters.push(attributeFilter);	
            	}
            	
                var spatialFilter = this.spatialSelector.getQueryFilter();   
                if (currentFilter) {
                    filters.push(currentFilter);
                }
					
				var filter = filters.length > 1 ?
                    new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: filters
                    }) :
                    filters[0];                
                
            },
            scope: this
        }];
		
		//TolomeoExt.ToloQueryBuilderExt.superclass.initComponent.call(this);
		this.callParent();
		
		this.add([this.layerSelector, this.spatialSelector, this.queryfilter]);
		
		this.spatialSelector.reset();
		this.collapsed = false;
    }   
    
});
