
Ext.ns('TolomeoExt.widgets.form');

/** api: constructor
 *  .. class:: ToloFilterField(config)
 *   
 *      A form field representing a comparison filter.
 */
Ext.define('TolomeoExt.widgets.form.ToloFilterField', {
	
	extend: 'Ext.form.FieldContainer',
	
	alias: 'widget.tolomeo_tolofilterfield',
	    
    /** api:config[lowerBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    lowerBoundaryTip: "lower boundary",
     
    /** api:config[upperBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    upperBoundaryTip: "upper boundary",
    
    /**
     * 
     */
    invalidRegExText: "Valore del campo non corretto",
     
    /** api: config[caseInsensitiveMatch]
     *  ``Boolean``
     *  Should Comparison Filters for Strings do case insensitive matching?  Default is ``"false"``.
     */
    caseInsensitiveMatch: false,

    /**
     * Property: filter
     * {OpenLayers.Filter} Optional non-logical filter provided in the initial
     *     configuration.  To retreive the filter, use <getFilter> instead
     *     of accessing this property directly.
     */
    filter: null,
    
    /**
     * Property: attributes
     * {GeoExt.data.AttributeStore} A configured attributes store for use in
     *     the filter property combo.
     */
    attributes: null,

    /** api:config[comparisonComboConfig]
     *  ``Object`` Config object for comparison combobox.
     */

    /** api:config[attributesComboConfig]
     *  ``Object`` Config object for attributes combobox.
     */
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,
    
    /** api:config[autoComplete]
     *  ``Boolean`` autocomplete enabled on text fields.
     */
    autoComplete: false,
    
    /** api:config[autoCompleteCfg]
     *  ``Object`` autocomplete configuration object.
     */
    autoCompleteCfg: {},
    
    /**
     * 
     */ 
    uniqueValuesStore : null,
    
    pageSize: 5,
    
    addAutocompleteStore: function(config) {
        var uniqueValuesStore = new TolomeoExt.data.ToloUniqueValuesStore({
            pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext
        });
        
        this.initUniqueValuesStore(uniqueValuesStore, this.autoCompleteCfg.url, this.layerCodeTPN, this.filter.property);
        
        return Ext.apply(Ext.apply({}, config), {store: uniqueValuesStore});
    },
    
    createValueWidget: function(type) {
        if(this.autoComplete && this.fieldType === 'java.lang.String') {
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
    
    createDefaultConfigs: function() {
        this.defaultItemsProp = {
            'single': {
                validateOnBlur: false,
                ref: "value",
                grow: true,
                growMin: 80,
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
                grow: true,
                growMin: 80,
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
                grow: true,
                growMin: 80,
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
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
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
                        evt.combo.store.baseParams.query =  evt.combo.getValue();
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
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
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
                        evt.combo.store.baseParams.query =  evt.combo.getValue();
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
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
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
                        evt.combo.store.baseParams.query =  evt.combo.getValue();
                    },
                    scope: this
                },
                matchFieldWidth: false,
                width: 50,
                anchor: "100%"
            },this.defaultItemsProp['upper'])        
        };      
    },
    
    initComponent: function() {
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
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * filter - {OpenLayers.Filter} This filter.
             * this - {gxp.form.ToloFilterField} (TODO change sequence of event parameters)
             */
            "change"
        ); 

        this.callParent();
    },
    
    /**
     * Method: createDefaultFilter
     * May be overridden to change the default filter.
     *
     * Returns:
     * {OpenLayers.Filter} By default, returns a comparison filter.
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({matchCase: !this.caseInsensitiveMatch});
    },
    
    initUniqueValuesStore: function(store, url, layerName, /*namespaces,*/ fieldName) {
        var params = {
            url: url,
            inputs: {
            	featureTypeName: layerName,
                fieldName: fieldName
            },
            start: 0,
            limit: this.autoCompleteCfg.pageSize || this.pageSize
        };
        
        store.setParams(params);
    },
    
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

    /** api: method[setFilter]
     *  :arg filter: ``OpenLayers.Filter``` Change the filter object to be
     *  used.
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

