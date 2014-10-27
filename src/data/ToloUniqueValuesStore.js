
Ext.ns('TolomeoExt.data');

/**
 * Un data store da usare come tool di autocompletamento paginato.
 * Non sono richiesti parametri di configurazione per il costruttore, il proxy
 * si appoggia alle canoniche funzionalità di TolomeoExt
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.data.ToloUniqueValuesStore', {
	
	extend: 'Ext.data.Store',
	
	alias: 'widget.tolomeo_uniquestore',

	/**
     * Crea un nuovo TolomeoExt.data.ToloUniqueValuesStore.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
        config.baseParams = Ext.apply(config.baseParams || {}, {});

        this.TOLOMEOServer =  config.TOLOMEOServer;
        this.TOLOMEOContext = config.TOLOMEOContext;
        
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/UniqueValueServlet');
		var reader = proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
		
        TolomeoExt.data.ToloUniqueValuesStore.superclass.constructor.call(this,
            Ext.applyIf(config, {
//                sortInfo: {
//                    field: 'value',
//                    direction: 'ASC'
//                },
                proxy: proxy
            })
        );
    },
	 
	/**
     * Imposta i parametri da passare al proxy per il caricamento dei dati.
     * @param {Object} params Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    setParams: function(params) {
        this.baseParams = Ext.apply(this.baseParams, params);
    },
    
    /**
     * Carica i dati nello store.
     * @param {Object} options Oggetto contenente le opzioni di caricamento dei dati.
     */
    load: function(options) {
    	var params = options.params;
        if (!params.inputs) {
            return;
        }
        
        var filter;
        if(params.query) {
            var queryValue = params.query;
            if(queryValue.indexOf('*') === -1) {
                queryValue = '*' + queryValue + '*';
            }
            
            filter = new OpenLayers.Filter.Comparison({ 
                type: OpenLayers.Filter.Comparison.LIKE, 
                property: params.inputs.fieldName, 
                value: queryValue,
                matchCase: false                
            });
            
            var node = new OpenLayers.Format.Filter({version: "1.1.0"}).write(filter);
            filter = new OpenLayers.Format.XML().write(node);
        }
        
		var fparams = {
			filter: filter,
			codTPN: params.inputs.featureTypeName,
			format: "ext",
			ogcFilterVersion: "1.1.0",
			attributeName: params.inputs.fieldName
		};
		
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
		
        if (options) {
            this.baseParams = Ext.apply(this.baseParams, options.params);
        }
        
        this.superclass.load.call(this, options);
    } 
    
});
