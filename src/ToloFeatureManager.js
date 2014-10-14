
/**
 * 
 */
Ext.define('TolomeoExt.ToloFeatureManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_featuremanager",
	
	TOLOMEOServer: null,
	
	TOLOMEOContext: null,
	
	schema: null,
	
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
			"layerchange"
		);	
	},
	
	getSchema: function(fparams){
//    	var fparams = this.formPanelSearch.getForm().getValues();
//    	fparams.format = "ext";
    	
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxQueryBuilderServlet',
    		method: 'POST',
    		params: fparams,
    		waitMsg: 'Ricerca in corso...',
    		success: this.doAjaxCallback,
    		failure: this.doAjaxFailure,
    		scope: this
    	};
    	
    	// Submit ajax della form
//    	this.waitMask = new Ext.LoadMask(this.id, {msg:"Ricerca in corso...."});
//    	this.waitMask.show();
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
	},
	
	doAjaxCallback: function(results, store){
		this.schema = results;
		this.fireEvent("layerchange", results, store);
	},
	
    /**
     * Method: doOnQueryAjaxFailure
     * Funzione di gestione errore avvenuto nella chiamata Ajax per il popolamento dello store dello schema
     *
     * Parameters:
     * store - {} store
     */
	doAjaxFailure: function (store) {
    	this.waitMask.hide();
    }
	
});