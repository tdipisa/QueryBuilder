
Ext.ns('TolomeoExt.widgets.form');

/**
 * Un campo Form che rappresenta un filtro di comparazione
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloFilterField', {
	
	extend: 'Ext.form.FieldContainer',
	
	alias: 'widget.tolomeo_tolofilterfield',
	    
	/**
     * @cfg {String} lowerBoundaryTip
     * Tooltip per il campo inferiore di valorizzazione.
     *
     */
    lowerBoundaryTip: "Valore inferiore",
     
	/**
     * @cfg {String} upperBoundaryTip
     * Tooltip per il campo superiore di valorizzazione.
     *
     */
    upperBoundaryTip: "Valore superiore",
    
	/**
     * @cfg {String} invalidRegExText
     * Testo mostrato in caso di valore campo non valido.
     *
     */
    invalidRegExText: "Valore del campo non corretto",
     
	/**
     * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Il filtro di comparazione per i campi di tipo stringa deve essere case insensitive ?
     */
    caseInsensitiveMatch: false,

	/**
     * @property {OpenLayers.Filter} filter
	 * Filtro non logico opzionale messo a disposizione nella configurazione iniziale. Per 
	 * recuperare il filtro usare il metodo ''getFilter'' invece di accedere direttamente questa 
	 * proprietà.
     */
    filter: null,
    
	/**
     * @property {Ext.DataStore} attributes
	 * Rappresenta lo store configurato degli attributi del layer 
	 * da usare all'interno della combo box di filtraggio delle proprietà.
     */
    attributes: null,

	/**
     * @property {Object} comparisonComboConfig
	 * Oggetto di configurazione per la combo box di comparazione.
     */

	/**
     * @property {Object} attributesComboConfig
	 * Oggetto di configurazione per la combo box degli attributi.
     */
    attributesComboConfig: null,
    
	/**
     * @cfg {Boolean} autoComplete [autoComplete="false"]
	 * Abilita la funzionalità di autocompletamento per i campi stringa.
     */
    autoComplete: false,
    
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
     * @cfg {Integer} pageSize [autoComplete="5"]
	 * Configura il numero massimo predefinito di elementi per pagina per la 
	 * combo box di autocompletamento.
     */
    pageSize: 5,
    
	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloFilterField.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
        var me = this;
        
        this.combineErrors = false;
        
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }        
        if(!this.filter) {
            this.filter = this.createDefaultFilter();
        }
        
        var mode = "local";
        var attributes = this.attributes;
        
        this.createDefaultConfigs();
        
        var defAttributesComboConfig = {
            xtype: "combo",
            store: attributes,
            editable: false,
            typeAhead: true,
            forceSelection: true,
            queryMode: mode,
            triggerAction: "all",
            ref: "property",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "dbname",
            value: this.filter.property,
            listeners: {
                select: function(combo, records) {
                	var record = records;
                	if(records instanceof Array){
                		record = records[0];
                	}
                	
                    this.filter.property = record.get("dbname");
                    this.fieldType = record.get("type");
                    this.fieldRegEx = record.get("regex");
                    this.layerCodeTPN = record.get("codTPN");
                    
                    // ////////////////////////////////////////////////////////////////
                    // Check if the autocomplete must be disabled for the single field
                    // ////////////////////////////////////////////////////////////////
                    var autocomplete = record.get("autocomplete");
                    this.autoCompleteFieldCheck = autocomplete.active != undefined ? 
                    		autocomplete.active && this.autoComplete : this.autoComplete;
                    
                    if(this.autoCompleteFieldCheck){
                    	var mode = autocomplete.mode || "remote";
                    	Ext.copyTo(this.autoCompleteCfg, {
                    		 autoCompleteMode: mode,
                    		 minChars: mode == "remote" ? autocomplete.minChars || 1 : 1
                    	}, ["autoCompleteMode", "minChars"]);
                    	
                        //
                        // Update the this.autoCompleteDefault config with minChars retrieved by the server
                        //
                        this.autoCompleteDefault["single"].minChars = this.autoCompleteCfg.minChars;
                        this.autoCompleteDefault["lower"].minChars = this.autoCompleteCfg.minChars;
                        this.autoCompleteDefault["upper"].minChars = this.autoCompleteCfg.minChars;
                        
                        this.autoCompleteDefault["single"].pageSize = mode == "remote" ? 
                        		this.autoCompleteCfg.pageSize || this.pageSize : 0;
                        this.autoCompleteDefault["lower"].pageSize = mode == "remote" ? 
                        		this.autoCompleteCfg.pageSize || this.pageSize : 0; 
                        this.autoCompleteDefault["upper"].pageSize = mode == "remote" ? 
                        		this.autoCompleteCfg.pageSize || this.pageSize : 0;
                    }
                    
                    if(!this.comparisonCombo) {
                        this.comparisonCombo = this.items.get(1);
                    }
                    
                    this.comparisonCombo.enable();
                    this.comparisonCombo.reset();
                    
                    if(!this.valueWidgets) {
                        this.valueWidgets = this.items.get(2);
                    }
                    this.valueWidgets.removeAll();
                    
                    this.setFilterType(null);
        
                    this.doLayout();
                    this.fireEvent("change", this.filter, this);
                },
                // workaround for select event not being fired when tab is hit
                // after field was autocompleted with forceSelection
                "blur": function(combo) {
                    var index = combo.store.findExact("dbname", combo.getValue());
                    if (index != -1) {
                        combo.fireEvent("select", combo, combo.store.getAt(index));
                    } else if (combo.startValue != null) {
                        combo.setValue(combo.startValue);
                    }
                },
                scope: this
            },
            width: 140
        };
        
        var defComparisonComboConfig = {
            xtype: "tolomeo_comparisoncombo",
            ref: "type",
            disabled: true,
            editable: false,
            allowBlank: this.allowBlank,
            value: this.filter.type,
            listeners: {
                select: function(combo, records) {        
                	var record = records;
                	if(records instanceof Array){
                		record = records[0];
                	}
                    this.createValueWidgets(record.get("value"));
                },
                expand: function(combo) {
                    var store = combo.getStore();
                    store.clearFilter();
                    if(this.fieldType === "java.util.Date" || 
                    		this.fieldType === "java.util.Calendar" || 
                    		this.fieldType === "'java.math.BigInteger" || 
                    		this.fieldType === "java.lang.Double" || 
                    		this.fieldType === "java.math.BigDecimal" || 
                    		this.fieldType === "java.lang.Integer" || 
                    		this.fieldType === "java.lang.Long" || 
                    		this.fieldType === "java.lang.Float" || 
                    		this.fieldType === "java.lang.Short"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('text') != "like") || (record.get('text') != "ilike");
                            },
                            scope: this
                          }                      
                        ]);
                    }else if(this.fieldType === "java.lang.Boolean"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('name') == "=");
                            },
                            scope: this
                          }                      
                        ]);
                    }else if(this.fieldType === "java.lang.String"){
                        store.filter([
                          {
                            fn   : function(record) {
                            	return (record.get('text') != "between");
                            },
                            scope: this
                          }                      
                        ]);
                    }  
                },
                scope: this
            }
        };
        
        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);
        
        this.comparisonComboConfig = this.comparisonComboConfig || {};        
        Ext.applyIf(this.comparisonComboConfig, defComparisonComboConfig);

        this.items = [this.attributesComboConfig, this.comparisonComboConfig, {
            xtype: 'container',
            isFormField: true,
            isValid: function() { return true; },
            reset: function() {
                 this.eachItem(function(a) {
                    a.reset()
                });
            },
            eachItem: function(b, a) {
                if (this.items && this.items.each) {
                    this.items.each(b, a || this)
                }
            },
            layout  : 'hbox',            
            defaultMargins: '0 3 0 0',
            width: 160
        }];
        
        this.addEvents(
			/**
			 * @event 
			 * Lanciato a seguito di un cambiamento del valore del componente.
			 */
            "change"
        ); 

        this.callParent();
    },
    
	/**
     * Crea e aggiunge alla form una combo box di auto completamento.
     * @param {Object} config Un opzionale oggetto di configurazione per il componente ExtJs.
     * @return {Object} Ritorna l'oggetto relativo alla combobox di auto completamento.
     */
    addAutocompleteStore: function(config) {
        var uniqueValuesStore = new TolomeoExt.data.ToloUniqueValuesStore({
            pageSize: this.autoCompleteCfg.autoCompleteMode == "remote" ? this.autoCompleteCfg.pageSize || this.pageSize : 0,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext
        });
        
        this.initUniqueValuesStore(uniqueValuesStore, this.layerCodeTPN, this.filter.property);
        
        return Ext.apply(Ext.apply({}, config), {store: uniqueValuesStore});
    },
    
	/**
     * Se lo store degli attributi contiene anche una RegEx di validazione, applica 
     * il validatore al componente Ext che rappresenta il valore.
     * 
     * @param {String} type Tipo dell'attributo relativo per configurare il componente.
     * @return {Object} Ritorna la configurazione relativa alla campo valore della proprietà.
     */
    createValueWidget: function(type) {
        if(this.autoComplete && this.autoCompleteFieldCheck && this.fieldType === 'java.lang.String') {
            return Ext.apply({}, this.addAutocompleteStore(this.autoCompleteDefault[type]));
        } else {
        	var config = {};
        	if(this.fieldRegEx){
        		var me = this;
        		var valueTest = new RegExp(this.fieldRegEx);
        		config = Ext.apply(config, {
                    validator: function(value) {
                        return valueTest.test(value) ? true : me.invalidRegExText;
                    }
        		});
        	}
        	
            return Ext.apply(config, this.fieldDefault[type][this.fieldType]);
        }
    },
    
	/**
     * Crea il componente Ext destinato a contenere il valore delle proprietà.
     * @param {String} type Tipo dell'attributo relativo per configurare il componente.
     * 
     */
    createValueWidgets: function(type) {
        if(type !== this.filter.type) {
            this.setFilterType(type);
            
            if(!this.valueWidgets) {
                this.valueWidgets = this.items.get(2);
            }
            this.valueWidgets.removeAll();
            if (type === OpenLayers.Filter.Comparison.BETWEEN) {
                this.valueWidgets.add(this.createValueWidget('lower'));
                this.valueWidgets.add(this.createValueWidget('upper'));
            } else {
                this.valueWidgets.add(this.createValueWidget('single'));
            }
            
            this.doLayout();
            
            this.fireEvent("change", this.filter, this);
        }
    },
    
	/**
     * Imposta la configurazione predefinita per la gestione dinamica dei componenti.
     * 
     */
    createDefaultConfigs: function() {
        this.defaultItemsProp = {
            'single': {
                validateOnBlur: false,
                ref: "value",
                //grow: true,
                //growMin: 80,
                width: 80,
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.value = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "blur": function(field){
                    
                    },
                    scope: this
                }   
            },
           'lower': {
                //grow: true,
                //growMin: 80,
                width: 80,
                ref: "lowerBoundary",
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.lowerBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "autosize": function(field, width) {
                        field.setWidth(width);
                        field.ownerCt.doLayout();
                    },
                    scope: this
                }
            },
            'upper': {
                //grow: true,
                //growMin: 80,
                width: 80,
                ref: "upperBoundary",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.upperBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    scope: this
                }
            }
        };
        
        this.fieldDefault = {};
        
        for(key in this.defaultItemsProp) {
            this.fieldDefault[key] = {
                'java.lang.String': Ext.applyIf({
                    xtype: "textfield"
                }, this.defaultItemsProp[key]),
                'java.lang.Double': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.lang.Float': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.math.BigDecimal': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.math.BigInteger': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.lang.Integer': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.lang.Long': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.lang.Short': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false,
                    width: 70
                },this.defaultItemsProp[key]),
                'java.util.Date': Ext.applyIf({
                    xtype: "datefield",
                    width: 80,
                    allowBlank: false,
                    format: this.dateFormat
                },this.defaultItemsProp[key]),
                'java.util.Calendar': Ext.applyIf({
                    xtype: "datefield",
                    width: 80,
                    allowBlank: false,
                    format: this.dateFormat
                },this.defaultItemsProp[key])
            };
        }
        
        this.autoCompleteDefault = {        
            'single': Ext.applyIf({
                xtype: "tolomeo_uniquevaluescb",
                queryMode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
//                pageSize: this.autoCompleteCfg.autoCompleteMode == "remote" ? this.autoCompleteCfg.pageSize || this.pageSize : 0,
                typeAhead: true,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                matchFieldWidth: false,
                listConfig:{
                	width: 250
                },
                minChars: this.autoCompleteCfg.minChars || 1,
//                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.value = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    blur: function(combo) {
                        this.filter.value = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
//                        evt.combo.store.baseParams.query = evt.combo.getValue();
                        evt.combo.store.baseParams.query = this.autoCompleteCfg.autoCompleteMode == "remote" ? evt.combo.getValue() : "*";
                    },
                    scope: this
                },
                matchFieldWidth: false,
                width: 80,
                anchor: "100%"
            },this.defaultItemsProp['single']),
            'lower': Ext.applyIf({
                xtype: "tolomeo_uniquevaluescb",
                queryMode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
//              pageSize: this.autoCompleteCfg.autoCompleteMode == "remote" ? this.autoCompleteCfg.pageSize || this.pageSize : 0,
                typeAhead: true,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: this.autoCompleteCfg.minChars || 1,
//                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.lowerBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    blur: function(combo) {
                        this.filter.lowerBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
//                        evt.combo.store.baseParams.query =  evt.combo.getValue();
                        evt.combo.store.baseParams.query = this.autoCompleteCfg.autoCompleteMode == "remote" ? evt.combo.getValue() : "*";
                    },
                    scope: this
                },
                matchFieldWidth: false,
                width: 50,
                anchor: "100%"
            },this.defaultItemsProp['lower']),
            'upper': Ext.applyIf({
                xtype: "tolomeo_uniquevaluescb",
                queryMode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
//              pageSize: this.autoCompleteCfg.autoCompleteMode == "remote" ? this.autoCompleteCfg.pageSize || this.pageSize : 0,
                typeAhead: true,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: this.autoCompleteCfg.minChars || 1,
//                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    blur: function(combo) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
//                        evt.combo.store.baseParams.query =  evt.combo.getValue();
                        evt.combo.store.baseParams.query = this.autoCompleteCfg.autoCompleteMode == "remote" ? evt.combo.getValue() : "*";
                    },
                    scope: this
                },
                matchFieldWidth: false,
                width: 50,
                anchor: "100%"
            },this.defaultItemsProp['upper'])        
        };      
    },
    
	/**
     * Crea il filtro predefinito di comparazione. Questo metodo può essere sovrascritto per cambiare 
     * il filtro predefinito.
     * @return {OpenLayers.Filter} Di default ritorna un filtro di comparazione.
     * 
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({matchCase: !this.caseInsensitiveMatch});
    },
    
	/**
     * Crea il componente Ext destinato a contenere il valore delle proprietà.
     * @param {TolomeoExt.data.ToloUniqueValuesStore} store Store della combo box di auto completamento.
     * @param {String} layerName codTPN da usare com eparametro della richiesta.
     * @param {String} fieldName Nome della proprietà di cui ritornare i suggerimenti.
     * 
     */
    initUniqueValuesStore: function(store, layerName, fieldName) {
        var params = {
            url: this.autoCompleteCfg.url,
            inputs: {
            	featureTypeName: layerName,
                fieldName: fieldName
            }
        };
        
        if(this.autoCompleteCfg.autoCompleteMode == "remote"){
        	Ext.applyIf(params, {
        		start: 0,
                limit: this.autoCompleteCfg.pageSize || this.pageSize
        	});
        }
        
        store.setParams(params);
    },
    
	/**
     * Imposta il tipo di filtro che si desidera.
     * @param {String} type Tipo del filtro da impostare.
     * 
     */
    setFilterType: function(type) {
        this.filter.type = type;
        
        // Ilike (ignore case)
        if(this.filter.type == "ilike"){
            this.filter.type = OpenLayers.Filter.Comparison.LIKE;
            this.filter.matchCase = false;
        }else{
            // default matches case. See OpenLayers.Filter.Comparison#matchCase
            this.filter.matchCase = !this.caseInsensitiveMatch; //true;
        }
    },

	/**
     * Cambia l'oggetto del filtro con uno nuovo che si desidera utilizzare.
     * @param {OpenLayers.Filter} filter Il filtro da impostare
     * 
     */
    setFilter: function(filter) {
        var previousType = this.filter.type;
        this.filter = filter;
        if (previousType !== filter.type) {
            this.setFilterType(filter.type);
        }
        this['property'].setValue(filter.property);
        this['type'].setValue(filter.type);
        if (filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            this['lowerBoundary'].setValue(filter.lowerBoundary);
            this['upperBoundary'].setValue(filter.upperBoundary);
        } else {
            this['value'].setValue(filter.value);
        }
        this.fireEvent("change", this.filter, this);
    }

});

