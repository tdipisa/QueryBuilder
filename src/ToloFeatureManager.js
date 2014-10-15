
/**
 * 
 */
Ext.define('TolomeoExt.ToloFeatureManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_featuremanager",
	
	TOLOMEOServer: null,
	
	TOLOMEOContext: null,
	
	schema: null,
	
	maxFeatures: 10,
	
	startIndex: 0,
	
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
			"layerchange",
			"loadfeaturesfailure",
			"loadfeatures"
		);	
	},
	
	getSchema: function(fparams){
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/FilterBuilderMetadataServlet',
    		method: 'POST',
    		params: fparams,
    		waitMsg: 'Ricerca in corso...',
    		success: function(results, store){
    			this.schema = results;
    			this.fireEvent("layerchange", results, store);
    		},
    		failure: this.doAjaxFailure,
    		scope: this
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
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
    	
    	fparams = Ext.apply(fparams, {
    		maxFeatures: this.maxFeatures,
    		startIndex: this.startIndex
    	});
    	
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet',
    		method: 'POST',
    		params: fparams,
    		waitMsg: 'Ricerca in corso...',
    		success: function(results, store){
    			this.schema = results;
    			this.fireEvent("loadfeatures", results, store);
    		},
    		failure: this.doAjaxFailure,
    		scope: this
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
    }
	
});