
/**
 * 
 */
Ext.define('TolomeoExt.ToloFeatureManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_featuremanager",
	
	TOLOMEOServer: null,
	
	TOLOMEOContext: null,

	featureStore: null,
	
	maxFeatures: 10,
	
	startIndex: 0,
	
	proxy: null,
	
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
			"layerchange",
			"loadfeaturesfailure",
			"loadfeatures",
			"beforeloadfeatures"
		);	
	},
	
	getSchema: function(fparams){
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        
        var schema = this.schemaCache[fparams.codTPN];
        if(schema){
			this.fireEvent("layerchange", schema);
        }else{
        	var submitOpt = {
        		url: this.TOLOMEOServer + this.TOLOMEOContext + '/FilterBuilderMetadataServlet',
        		method: 'POST',
        		params: fparams,
        		waitMsg: 'Ricerca in corso...',
        		success: function(results, store){
        			var schema = results;
        			this.schemaCache[fparams.codTPN] = schema;
        			this.fireEvent("layerchange", results/*, store*/);
        		},
        		failure: this.doAjaxFailure,
        		scope: this
        	};
        	
    		new TolomeoExt.ToloCrossAjax().request(submitOpt);
        }        
	},
	
    /**
     * Method: doOnQueryAjaxFailure
     * Funzione di gestione errore avvenuto nella chiamata Ajax per il popolamento dello store dello schema
     *
     * Parameters:
     * store - {} store
     */
	doAjaxFailure: function (store) {
		this.fireEvent("loadfeaturesfailure", store);
    },
    
    loadFeatures: function(fparams){       	
    	//
    	// Prepare the proxy params
    	//
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
    	
    	this.featureStore.load({
    	    params:{
    	        start: this.startIndex,
    	        limit: this.maxFeatures
    	    }
    	});
    },
    
    setProxy: function(){
		this.proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet');
		var reader = this.proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
    },
    
    getProxy: function(){
    	return this.proxy;
    }
	
});