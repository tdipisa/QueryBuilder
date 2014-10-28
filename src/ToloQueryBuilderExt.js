
/**
 * Strumento di ricerca alfanumerica libera 
 * (Query Tool) general purpose (in grado cioè di 
 * lavorare su qualunque layer vettoriale configurato 
 * nel sistema) per Tolomeo.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloQueryBuilderExt', {

	extend: 'Ext.Panel',

	/**
	 * @cfg {Object} paramsJS
	 * Configurazioni specifiche del file di preset.
	 */
	paramsJS: null,

	/**
	 * @cfg {String} TOLOMEOServer
	 * URL di base del contesto di Tolomeo.
	 */
	TOLOMEOServer: null,

	/**
	 * @cfg {String} TOLOMEOContext
	 * Contesto di Tolomeo.
	 */
	TOLOMEOContext: null,
	
	/**
	 * @cfg {String} filterFormat
	 * Formato dei filtro. Possibili valori: "OGC", "CQL".
	 */
	filterFormat: "OGC",
	
	/**
	 * @cfg {String} ogcFilterVersion
	 * Se filterFormat="OGC" indica il numero di versione del filtro.
	 */
	ogcFilterVersion: "1.1.0",

	/**
	 * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Indica se i valori degli attributi nel filtro devono essere case sensitive o meno.
	 */
	caseInsensitiveMatch: false,
	
	config: {
		/**
		 * @cfg {TolomeoExt.ToloFeatureManager} qbFeatureManager (required)
		 * Gestore di richieste e operazioni che coinvolgono le features.
		 */
		qbFeatureManager: null,
		
		/**
		 * @cfg {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager (required)
		 * Gestore di eventi per il query builder.
		 */
		qbEventManager: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloLayerSelector} layerSelector
		 * 
		 */
		layerSelector: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloSpatialSelector} spatialSelector
		 * 
		 */
		spatialSelector: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloAttributeFilter} qbEventManager
		 * 
		 */
		queryfilter: null
	}, 
	
	/**
	 * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Contiene la configurazione per il servizio di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
	 */
	autoCompleteCfg: {},
	
	/**
	 * @cfg {Boolean} [autoComplete="fase"]
	 * Abilita la funzionalità di autocomplete .
	 */
	autoComplete: false,
	
	/**
	 * @cfg {String} noFilterSelectedMsgTitle
	 * 
	 */
    noFilterSelectedMsgTitle: "Nessun Filtro Selezionato",
    
	/**
	 * @cfg {String} noFilterSelectedMsgText
	 * 
	 */
    noFilterSelectedMsgText: "Si deve selezionare almento un filtro.",
    
	/**
	 * @cfg {String} invalidRegexFieldMsgTitle
	 * 
	 */
    invalidRegexFieldMsgTitle: "Campi Invalidi",
    
	/**
	 * @cfg {String} invalidRegexFieldMsgText
	 * 
	 */
    invalidRegexFieldMsgText: "Uno o più campi della form non sono corretti!",
    
	/**
	 * @cfg {String} notEnabledFieldMsgTitle
	 * 
	 */
    notEnabledFieldMsgTitle: "Campi Non Abilitati",
    
    /**
	 * @cfg {Boolean} notEnabledFieldMsgText
	 * 
	 */
    notEnabledFieldMsgText: "Non è possibile inviare la richiesta finchè il layer non è stato selezionato.",

	/**
     * Inizializza un nuovo TolomeoExt.ToloQueryBuilderExt.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		TolomeoExt.Vars.ApplyIfDefaults(this);

		this.autoScroll = true;
		this.collapsed = false;
    	
		if(!this.qbEventManager){
			this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		}
		
		if(!this.qbFeatureManager){
			this.qbFeatureManager = Ext.create('TolomeoExt.ToloFeatureManager', {
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext
			});
		}
		
		this.qbFeatureManager.on({
			scope: this,
			layerchange: function(results/*, store*/){
				this.waitMask.hide();
				this.queryfilter.addFilterBuilder(results/*, store*/);
			},
			loadfeatures: function(results, store){
				this.waitMask.hide();
			},
			beforeloadfeatures: function(){
				this.waitMask.show();
			},
			beforelayerchange: function(){
				this.waitMask.show();
			},
			loadfeaturesfailure: function(){
				this.waitMask.hide();
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
					this.filterView.enable();
					this.enableAttributeFilter(records[0]);
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
			disabled: true,
			caseInsensitiveMatch: this.caseInsensitiveMatch,
			autoCompleteCfg: this.autoCompleteCfg,
			autoComplete: this.autoComplete,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext
		});
		
		this.filterView = Ext.create('TolomeoExt.widgets.ToloFilterView', {
			scroll: true,
			disabled: true,
			listeners:{
				scope: this,
				typeselected: function(records){
					var filter = this.getFilter();
					if(filter){
						var record = records;
						
						if(records instanceof Array){
							record = records[0];
						}
						
						var serialized_filter = this.getFilterString(filter, record.get("name"));
						this.filterView.setFilter(serialized_filter);
					}
				}
			}
		});
			
		this.bbar = ["->", {
            text: "Cancella",
            iconCls: "querybuilder-icon-cancel",
            scope: this,
            handler: function() {
            	// Spatial Selector Reset
            	this.spatialSelector.reset();
            	var spatialMethodCombo = this.spatialSelector.getSelectionMethodCombo();
            	spatialMethodCombo.reset();
            	
            	// Attribute Form Reset
            	if(this.queryfilter.filterBuilder){
            		this.queryfilter.filterBuilder.removeAllConditions();
            	}
            	
            	// Attribute Filter Reset
            	this.filterView.resetView();
            	
            	// Feature Grid Reset
            	this.qbFeatureManager.fireEvent("resetquery");
            }
        }, {
            text: "Cerca",
            iconCls: "querybuilder-icon-find",
            handler: function() {
            	var filter = this.getFilter();
            	
            	if(filter){
            		var serialized_filter = this.getFilterString(filter, null);

                    var fparams = {
        				codTPN: this.codTPN,
        				SRID: this.paramsJS.mappe.SRID,
        				filter: serialized_filter,
        				ogcFilterVersion: this.ogcFilterVersion,
        				format: "ext"
        			}; 
            		
                    this.qbFeatureManager.loadFeatures(fparams);
            	}
            },
            scope: this
        }];
		
		this.callParent();
	
		this.add([this.layerSelector, this.spatialSelector, this.queryfilter, this.filterView]);
		
		this.spatialSelector.reset();
		
		// ////////////////////////////////////////////////////////
		// Disable the tool if any layer is configured to use it
		// ////////////////////////////////////////////////////////
		if(layers.length < 1){
			this.disabled = true;
		}
		
		this.on("afterrender", function(){
			this.waitMask = new Ext.LoadMask(this.id, {msg: "Ricerca in corso...."});
		}, this);
		
	},
	
	/**
     * Abilita il filtro degli attributi.
     * @param {Ext.Data.Record} record corrispondente al layer selezionato. 
     *
     */
	enableAttributeFilter: function(record){
		// Adding a Filter Builder passing the feature type name
		this.codTPN = record.get('codTPN');
		
		var fparams = {
			codTPN: this.codTPN
		}; 
		
    	// Submit ajax della form
    	this.qbFeatureManager.getSchema(fparams);
	},
	
	/**
     * Recupera il filtro selezionato in formato stringa.
     * @param {OpenLayers.Filter} filter Il filtro selezionato. 
	 * @param {String} type Tipo del filtro.
     * @return {String} il filtro in formato stringa.
     */
	getFilterString: function(filter, type){
        var format = this.filterFormat;        
        if(type){
        	format = type;
        }
        
        var serialized_filter = "";
        if(format == "OGC" ){
            var node = new OpenLayers.Format.Filter({version: this.ogcFilterVersion}).write(filter);
            serialized_filter = new OpenLayers.Format.XML().write(node);
        }else{
        	serialized_filter = filter.toString();
        }
        
        return serialized_filter;
	},
	
    /**
     * Recupera il filtro selezionato.
     * @return {OpenLayers.Filter} il filtro selezionato.
     */
	getFilter: function(){
		var filter = null;
		
    	if(!this.queryfilter.disabled && !this.spatialSelector.disabled){
    		
    		// ////////////////////////////////////////////////
            // Check if there are some invalid field according 
    		// to validators regex config
            // ////////////////////////////////////////////////
    		var invalidItems = 0;
    		if(!this.queryfilter.attributeFieldSet.collapsed){
        		var filterFieldItem = this.query('tolomeo_tolofilterfield');            

                for(var x = 0; x<filterFieldItem.length; x++){
                	if(filterFieldItem[x].valueWidgets){
                    	var valueWidgets = filterFieldItem[x].valueWidgets.items.items;
                    	for(var y=0; y<valueWidgets.length; y++){
                    		var validateItem = valueWidgets[y];
                            if(!validateItem.isValid(true)){
                                invalidItems++;
                            }
                    	}
                	}
                }  
    		}
            
            if(invalidItems == 0){                    	
            	var filters = [];
            	
            	// ///////////////////////
            	// Compose the Filter
            	// ///////////////////////
            	if(!this.queryfilter.attributeFieldSet.collapsed){
                	var attributeFilter = this.queryfilter.filterBuilder.getFilter();
                	if(attributeFilter){
                		filters.push(attributeFilter);	
                	}
            	}

            	// /////////////////////////////////////////////
            	// If the spatial field set is collapdes then 
            	// use the current map extent. 
            	// /////////////////////////////////////////////
            	var currentMapExtent = this.spatialSelector.spatialFieldSet.collapsed;
                var spatialFilter = this.spatialSelector.getQueryFilter(currentMapExtent);   
                if (spatialFilter) {
                	filters.push(spatialFilter);
                }
					
                if(filters.length > 0){
    				var filter = filters.length > 1 ?
                        new OpenLayers.Filter.Logical({
                            type: OpenLayers.Filter.Logical.AND,
                            filters: filters
                        }) :
                        filters[0];   
                        
                    return filter;
                    
                }else{
                    Ext.Msg.show({
                        title: this.noFilterSelectedMsgTitle,
                        msg: this.noFilterSelectedMsgText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    }); 
                }
            }else{
                Ext.Msg.show({
                    title: this.invalidRegexFieldMsgTitle,
                    msg: this.invalidRegexFieldMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
            
    	}else {
            Ext.Msg.show({
                title: this.notEnabledFieldMsgTitle,
                msg: this.notEnabledFieldMsgText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
    	}
    	
    	return filter;
	}
    
});
