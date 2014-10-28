
Ext.ns('TolomeoExt.widgets');

/**
 * Crea il pannello contenitore per il filtro degli attributi.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloAttributeFilter', {

	extend: 'Ext.Panel',
	
	/**
     * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Il filtro di comparazione per i campi di tipo stringa deve essere case insensitive ?
     */
	caseInsensitiveMatch: false,
    
	/**
     * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Stabilisce la configurazione da usare per la funzionalità di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
     */
	autoCompleteCfg: {},
	
	/**
     * @cfg {Boolean} autoComplete [autoComplete="false"]
	 * Abilita la funzionalità di autocompletamento per i campi stringa.
     */
	autoComplete: false,

	/**
     * Inizializza un nuovo TolomeoExt.widgets.ToloAttributeFilter.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){				
		this.border = 0;
		
		this.attributeFieldSet = Ext.create('Ext.form.FieldSet', {
			title: 'Filtro Per Attributo',
			//anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			collapsed : true,
			checkboxToggle: true
		});
		
		this.items = [this.attributeFieldSet];
        
		this.callParent();
    },
    
	/**
     * Aggiunge alla form un nuovo nuovo costruttore per il filtro.
     * @param {Array} records corrispondenti allo schema della FeatureType da gestire.
     */
    addFilterBuilder: function(results){
    	var schema = results;
    	
		this.filterBuilder = new TolomeoExt.widgets.ToloFilterBuilder({
			 caseInsensitiveMatch: this.caseInsensitiveMatch,
			 autoCompleteCfg: this.autoCompleteCfg,
			 autoComplete: this.autoComplete,
			 TOLOMEOServer: this.TOLOMEOServer,
			 TOLOMEOContext: this.TOLOMEOContext,
			 attributes: Ext.create('Ext.data.Store', {
	   		    fields: [{
	   		    	name: 'name',
	   		    	mapping: 'name'
	   		    },{
	   		    	name: 'type', 
	   		    	mapping: 'type'
	   		    },{
	   		    	name: 'restriction', 
	   		    	mapping: 'restriction'
	   		    },{
	   		    	name: 'regex', 
	   		    	mapping: 'regex'
	   		    },{
	   		    	name: 'dbname', 
	   		    	mapping: 'dbname'
	   		    },{
	   		    	name: 'codTPN', 
	   		    	mapping: 'codTPN'
	   		    }],
	   		    data: schema
	   		}),
            allowBlank: true,
            allowGroups: false
        });
		
		this.attributeFieldSet.add(this.filterBuilder);
		
		this.enable();
    }
    
});
