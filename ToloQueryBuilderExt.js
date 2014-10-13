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
		//this.layout = "border";
		this.autoScroll = true;
		this.collapsed = false;
    	
		this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		
		this.qbFeatureManager = Ext.create('TolomeoExt.ToloFeatureManager', {
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext,
			listeners:{
				scope: this,
				layerchange: function(results, store){
					this.queryfilter.addFilterBuilder(results, store);
				}				
			}
			
		});
		
		// /////////////////////
		// Layer Selector
		// /////////////////////
		var layers = [];
		var evetLayerList = this.paramsJS.azioniEventi.eventiLayerList;
		for(var i=0; i<evetLayerList.length; i++){
			var layerEventConfig = evetLayerList[i];
			if(layerEventConfig.queryBuilder === true){
				layers.push({
					name: layerEventConfig.nomeLayer, 
					description: layerEventConfig.descrizioneLayer, 
					codTPN: layerEventConfig.codTPN
				});
			}
		}
		
		this.layerSelector = Ext.create('TolomeoExt.widgets.ToloLayerSelector', {
			layers: layers,
			listeners:{
				scope: this,
				layerselected: function(records){
					// /////////////////////////////////////////////////
					// Enable the sub components after layer selection
					// in order to allow filter composition.
					// /////////////////////////////////////////////////
					this.spatialSelector.enable();
					this.enableAttributeFilter(records[0]);
					
//					this.queryfilter.enable();
				}				
			}
		});
		
		// /////////////////////
		// Spatial Selector
		// /////////////////////
		this.spatialSelector = Ext.create('TolomeoExt.widgets.ToloSpatialSelector', {
			qbEventManager: this.qbEventManager,
			disabled: true
		});
		
		// /////////////////////
		// Attribute Filter
		// /////////////////////
		this.queryfilter = Ext.create('TolomeoExt.widgets.ToloAttributeFilter', {
			scroll: true,
			disabled: true
		});
			
		this.bbar = ["->", {
            text: "Cancella",
            //iconCls: "cancel",
            scope: this,
            handler: function() {
            	this.spatialSelector.reset();
            	var spatialMethodCombo = this.spatialSelector.getSelectionMethodCombo();
            	spatialMethodCombo.reset();
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
                if (spatialFilter) {
                	filters.push(spatialFilter);
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
		
		// ////////////////////////////////////////////////////////
		// Disable the tool if any layer is configured to use it
		// ////////////////////////////////////////////////////////
		if(layers.length < 1){
			this.disabled = true;
		}
	},
	
	enableAttributeFilter: function(record){
		// Adding a Filter Builder passing the feature type name
		
		var fparams = {
				codTPN: record.get('codTPN')
		}; 
		
		this.qbFeatureManager.getSchema(fparams);
//		this.queryfilter.addFilterBuilder(record.getValue());
//		this.queryfilter.enable();
	}
    
});
