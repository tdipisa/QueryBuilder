
/**
 * Plugin per la gestione di richieste e operazioni 
 * che coinvolgono le features.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloFeatureManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_featuremanager",
	
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
	 * @property {Ext.Data.Store} featureStore
	 * Store delle features ritornate dal server a seguito di una richiesta.
	 */
	featureStore: null,
	
	/**
	 * @cfg {Number} maxFeatures [maxFeatures="10"]
	 * Massimo numero di elementi per pagina.
	 */
	maxFeatures: 10,
	
	/**
	 * @cfg {Number} startIndex [startIndex="0"]
	 * Indice di pagina per richieste paginate.
	 */
	startIndex: 0,
	
	/**
	 * @property {Ext.Data.Proxy} proxy
	 * Proxy Ext per le richieste Ajax cross-domain.
	 */
	proxy: null,
	
	/**
     * Crea un nuovo TolomeoExt.ToloFeatureManager.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
	        /**
			 * @event
			 * Lanciato alla selezione di un nuovo layer dalla form.
			 */
			"layerchange",
			
	        /**
			 * @event
			 * Lanciato se il caricamento delle features fallisce.
			 */
			"loadfeaturesfailure",
			
	        /**
			 * @event
			 * Lanciato quando le features sono state caricate.
			 */
			"loadfeatures",
			
	        /**
			 * @event
			 * Lanciato prima di caricare le features da servizio remoto.
			 */
			"beforeloadfeatures",
			
	        /**
			 * @event
			 * Lanciato per reimpostare i parametri della richiesta.
			 */
			"resetquery",
			
	        /**
			 * @event
			 * Lanciato prima che avvenga la selezione di un nuovo layer dalla form del query builder.
			 */
			"beforelayerchange",
			
	        /**
			 * @event
			 * Lanciato al termine delle operazioni di export.
			 */
			"export",
			
	        /**
			 * @event
			 * Lanciato prima dell'avvio di una operazione di export.
			 */
			"beforedataexport"
		);	
		
		this.on("resetquery", this.resetQuery);
		this.on("export", this.exportPage);
	},
	
	/**
     * Esporta i dati in griglia secondo i formati supportati (SHP, CSV, Spatialite).
     * @param {Object} options Oggetto contenente le opzioni per lo scaricamento dei dati. 
     *
     */
	exportPage: function(options){
        this.fireEvent("beforedataexport");
		
		var params = {
			filter: this.proxy.extraParams.filter,
			codTPN: this.proxy.extraParams.codTPN,
			format: options.format,
			startIndex: options.items == "all" ? -1 :  this.startIndex,
			maxFeatures: options.items == "all" ? -1 :  this.maxFeatures,
			ogcFilterVersion: this.proxy.extraParams.ogcFilterVersion
		};
		
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet',
    		method: 'POST',
    		params: params,
    		waitMsg: 'Export in corso...',
    		success: function(results, store){
    			var result = results[0];
    			if(result){
    				location.href = this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet?filename=' + result.data.Descrizione;
    			}
    		},
    		failure: this.doAjaxFailure(),
    		scope: this
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
	},
	
	/**
     * Imposta lo store delle features.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	setFeatureStore: function(store){
		this.featureStore = store
		
		this.featureStore.on("load", function(){
			this.fireEvent("loadfeatures");
		}, this);
	},
	
    /**
     * Recupera lo schema degli attributi.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
	getSchema: function(fparams){
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        
        this.fireEvent("beforelayerchange");
        
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
        			this.fireEvent("layerchange", results);
        		},
        		failure: this.doAjaxFailure,
        		scope: this
        	};
        	
    		new TolomeoExt.ToloCrossAjax().request(submitOpt);
        }        
	},
	
	/**
     * Handler invocato in caso di fallimento della richiesta Ajax.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	doAjaxFailure: function (store) {
		this.fireEvent("loadfeaturesfailure", store);
    },
    
    /**
     * Metodo di caricamento dello store delle features.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadFeatures: function(fparams){       	
    	//
    	// Prepare the proxy params
    	//
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
    	
    	this.fireEvent("beforeloadfeatures");
    	
    	this.featureStore.loadPage(1, {
    	    params:{
    	    	startIndex: this.startIndex,
    	    	maxFeatures: this.maxFeatures
    	    }
    	});
    },
    
	/**
     * Imposta il proxy per le richieste cross-domain. 
     *
     */
    setProxy: function(){
		this.proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet');
		var reader = this.proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
    },
    
    /**
     * Recupera il proxy usato per le richiesta cross-domani. 
     *
     */
    getProxy: function(){
    	return this.proxy;
    },
    
	/**
     * Reimposta i parametri di richiesta per la raccolta delle features risultato della ricerca. 
     *
     */
    resetQuery: function(collapse){
    	if(this.featureStore){
    		this.featureStore.removeAll();
    	}
		
    	this.fireEvent("resetfeaturelayer");
    }
	
});