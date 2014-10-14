
/**
 * include widgets/form/ToloComparisonComboBox.js
 * 
 * include data/WPSUniqueValuesReader.js
 * include data/WPSUniqueValuesProxy.js
 * include data/WPSUniqueValuesStore.js
 * include widgets/form/WPSUniqueValuesCombo.js
 * requires GeoExt/data/AttributeStore.js
 */

Ext.ns('TolomeoExt.widgets.form');

/** api: constructor
 *  .. class:: ToloFilterField(config)
 *   
 *      A form field representing a comparison filter.
 */
Ext.define('TolomeoExt.widgets.form.ToloFilterField', {
	
	//extend: 'Ext.form.CompositeField',
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
    
    valid: null,
    
    pageSize: 5,
    
//    addValidation: function(config) {
//        //Add VTYPE validation according to validators config
//        var feature = this.attributes.baseParams.TYPENAME.split(":")[1];
//        var fieldName = this.filter.property;
//        if(this.validators && this.validators[feature] && this.validators[feature][fieldName]) {
//            var validator = this.validators[feature][fieldName];
//            // currently we support only regex based validation
//            if(validator.type === 'regex') {
//                var valueTest = new RegExp(validator.value);
//                
//                Ext.apply(config,{
//                    validator: function(value) {
//                        return valueTest.test(value) ? true : validator.invalidText;
//                    }
//                });
//            }
//        }
//        return config;
//    },
    
    /*addAutocompleteStore: function(config) {
        var uniqueValuesStore = new gxp.data.WPSUniqueValuesStore({
            pageSize: this.autoCompleteCfg.pageSize || this.pageSize
        });
        
        this.initUniqueValuesStore(uniqueValuesStore, this.autoCompleteCfg.url || this.attributes.url, this.attributes.baseParams.TYPENAME, this.attributes.format.namespaces, this.filter.property);
        
        return Ext.apply(Ext.apply({}, config), {store: uniqueValuesStore});
    },*/
    
    createValueWidget: function(type) {
        if(this.autoComplete && this.fieldType === 'java.lang.String') {
            //return Ext.apply({}, this.addAutocompleteStore(this.autoCompleteDefault[type]));
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
//                this.valueWidgets.add(this.addValidation(this.createValueWidget('lower')));
//                this.valueWidgets.add(this.addValidation(this.createValueWidget('upper')));
                this.valueWidgets.add(this.createValueWidget('lower'));
                this.valueWidgets.add(this.createValueWidget('upper'));
            } else {
//                this.valueWidgets.add(this.addValidation(this.createValueWidget('single')));
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
                //value: this.filter.value,
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
                //value: this.filter.lowerBoundary,
                //tooltip: this.lowerBoundaryTip,
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
        
        /*this.autoCompleteDefault = {
        
            'single': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
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
                    },
                    scope: this
                },
                width: 80,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['single']),
            'lower': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
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
                    },
                    scope: this
                },
                width: 50,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['lower']),
            'upper': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
                    },
                    blur: function(combo) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                },
                width: 50,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['upper'])        
         
        };*/        
        
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
        
        // TODO THIS ??? ////////////////////////////////
        // Maintain compatibility with QueryPanel, which relies on "remote"
        // mode and the filterBy filter applied in it's attributeStore's load
        // listener *after* the initial combo filtering.
        //TODO Assume that the AttributeStore is already loaded and always
        // create a new one without geometry fields.
        //var mode = "remote", attributes = new GeoExt.data.AttributeStore();
        //if (this.attributes) {
        //    if (this.attributes.getCount() != 0) {
        //        mode = "local";
        //        this.attributes.each(function(r) {
        //            var match = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/.exec(r.get("type"));
        //            match || attributes.add([r]);
        //        });
        //    } else {
        //        attributes = this.attributes;
        //    }
        //}

        var mode = "local";
        var attributes = this.attributes;
        
        this.createDefaultConfigs();
        
        var defAttributesComboConfig = {
            xtype: "combo",
            store: attributes,
            editable: mode == "local",
            typeAhead: true,
            forceSelection: true,
            mode: mode,
            triggerAction: "all",
            ref: "property",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "name",
            value: this.filter.property,
            listeners: {
                select: function(combo, records) {
                	var record = records;
                	if(records instanceof Array){
                		record = records[0];
                	}
                	
                    this.filter.property = record.get("name");
                    this.fieldType = record.get("type");//.split(":")[1];
                    this.fieldRegEx = record.get("regex");
                    
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
                    var index = combo.store.findExact("name", combo.getValue());
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
//                expand: function(combo) {
//                    var store = combo.getStore();
//                    store.clearFilter();
//                    if(this.fieldType === "date" || this.fieldType === "dateTime" || this.fieldType === "time" || this.fieldType === "int" || this.fieldType === "double" || this.fieldType === "decimal" || this.fieldType === "integer" || this.fieldType === "long" || this.fieldType === "float" || this.fieldType === "short"){
//                        store.filter([
//                          {
//                            fn   : function(record) {
//                                return (record.get('text') === "=") || (record.get('text') === "<>") || (record.get('text') === "<") || (record.get('text') === ">") || (record.get('text') === "<=") || (record.get('text') === ">=") || (record.get('text') === "between");
//                            },
//                            scope: this
//                          }                      
//                        ]);
//                    }else if(this.fieldType === "boolean"){
//                        store.filter([
//                          {
//                            fn   : function(record) {
//                                return (record.get('name') === "=");
//                            },
//                            scope: this
//                          }                      
//                        ]);
//                    }else if(this.fieldType === "string"){
//                        store.filter([
//                          {
//                            fn   : function(record) {
//                            	return (record.get('text') === "=") || (record.get('text') === "<>") || (record.get('text') === "<") || (record.get('text') === ">") || (record.get('text') === "<=") || (record.get('text') === ">=") || (record.get('text') === "like") || (record.get('text') === "ilike");
//                            },
//                            scope: this
//                          }                      
//                        ]);
//                    }  
//                },
                expand: function(combo) {
                    var store = combo.getStore();
                    store.clearFilter();
                    if(this.fieldType === "date" || this.fieldType === "dateTime" || this.fieldType === "time" || this.fieldType === "int" || this.fieldType === "double" || this.fieldType === "decimal" || this.fieldType === "integer" || this.fieldType === "long" || this.fieldType === "float" || this.fieldType === "short"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('text') != "like") || (record.get('text') != "ilike");
                            },
                            scope: this
                          }                      
                        ]);
                    }else if(this.fieldType === "boolean"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('name') == "=");
                            },
                            scope: this
                          }                      
                        ]);
                    }else if(this.fieldType === "string"){
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

//        TolomeoExt.widgets.form.ToloFilterField.superclass.initComponent.call(this);
        this.callParent();
    },

    /**
     * Method: validateValue
     * Performs validation checks on the filter field.
     *
     * Returns:
     * {Boolean} True if value is valid. 
     */
    validateValue: function(value, preventMark) {
        if (this.filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            return (this.filter.property !== null && this.filter.upperBoundary !== null &&
                this.filter.lowerBoundary !== null);
        } else {
            return (this.filter.property !== null &&
                this.filter.value !== null && this.filter.type !== null);
        }
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
    
    /*initUniqueValuesStore: function(store, url, layerName, namespaces, fieldName) {
        var wpsUrl = url;
        if (url.indexOf('wfs?', url.length - 'wfs?'.length) !== -1) {
            wpsUrl = url.substring(0, url.length-'wfs?'.length)+"wps";
        }
            
        var prefix = "";
        var featureTypeName = layerName;
        var featureNS;
        if(layerName.indexOf(':') !== -1) {
            prefix = layerName.split(':')[0];
            featureNS = namespaces[prefix] || '';
        }
            
        var params = {
            url: wpsUrl,
            outputs: [{
                identifier: "result",
                mimeType: "application/json"
            }],               
            inputs: {
                featureTypeName: featureTypeName,
                featureNS: featureNS,
                fieldName: fieldName
            },
            start: 0,
            limit: this.autoCompleteCfg.pageSize || this.pageSize
        };
        store.setWPSParams(params);
    },*/
    
    setFilterType: function(type) {
        this.filter.type = type;
        
        // Ilike (ignore case)
        if(this.filter.type == "ilike"){
            this.filter.type = OpenLayers.Filter.Comparison.LIKE;
            this.filter.matchCase = false;
        }else{
            // default matches case. See OpenLayers.Filter.Comparison#matchCase
            this.filter.matchCase = true;
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

