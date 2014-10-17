
Ext.ns('TolomeoExt.widgets');

/** api: constructor
 *  .. class:: ToloFilterBuilder(config)
 *   
 *      Create a panel for assembling a filter.
 */
Ext.define('TolomeoExt.widgets.ToloFilterBuilder', {
	
	extend: 'Ext.Container',

	alias: 'widget.tolomeo_tolofilterbuilder',
	
    /** api: config[builderTypeNames]
     *  ``Array``
     *  A list of labels that correspond to builder type constants.
     *  These will be the option names available in the builder type combo.
     *  Default is ``["any", "all", "none", "not all"]``.
     */
    builderTypeNames: ["any", "all", "none", "not all"],
    
    /** api: config[allowedBuilderTypes]
     *  ``Array``
     *  List of builder type constants.  Default is
     *  ``[ANY_OF, ALL_OF, NONE_OF]``.
     */
    allowedBuilderTypes: null,
    
    /** api: config[allowBlank]
     *  ``Boolean`` Do we allow blank FilterFields? It is safe to say true
     *  here, but for compatibility reasons with old applications, the default
     *  is false.
     */
    allowBlank: false,
    
    /** api: config[caseInsensitiveMatch]
     *  ``Boolean``
     *  Should Comparison Filters for Strings do case insensitive matching?  Default is ``"false"``.
     */
    caseInsensitiveMatch: false,

    /** api: config[preComboText]
     *  ``String``
     *  String to display before filter type combo.  Default is ``"Match"``.
     */
    preComboText: "Confronta",

    /** api: config[postComboText]
     *  ``String``
     *  String to display after filter type combo.  Default is
     *  ``"of the following:"``.
     */
    postComboText: "dei seguenti:",

    /** api: config[cls]
     *  ``String``
     *  The CSS class to be added to this panel's element (defaults to
     *  ``"gxp-ToloFilterBuilder"``).
     */
    cls: "tolomeo-tolofilterbuilder",
    
    /** api: config[filter]
     *  ``OpenLayers.Filter``
     *  Filter to initialize the component with
     */

    /** private: property[builderType]
     */
    builderType: null,

    /** private: property[childFilterContainer]
     */
    childFilterContainer: null,
    
    /** private: property[customizeFilterOnInit]
     */
    customizeFilterOnInit: true,
    
    /** i18n */
    addConditionText: "add condition",
    addGroupText: "add group",
    removeConditionText: "remove condition",

    /** api: config[allowGroups]
     *  ``Boolean``
     *  Allow groups of conditions to be added.  Default is ``true``.
     *  If ``false``, only individual conditions (non-logical filters) can
     *  be added.
     */
    allowGroups: true,
    
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

    initComponent: function() {
        var defConfig = {
            defaultBuilderType: TolomeoExt.widgets.ToloFilterBuilder.ANY_OF
        };
        Ext.applyIf(this, defConfig);
        
        if(this.customizeFilterOnInit) {
            this.filter = this.customizeFilter(this.filter);
        }
        
        this.builderType = this.getBuilderType();
        
        this.items = [{
            xtype: "container",
            layout: "form",
            ref: "form",
            defaults: {anchor: "100%"},
            hideLabels: true,
            items: [
                {
	                //xtype: "compositefield",
	                xtype: "fieldcontainer",
	                style: "padding-left: 2px",
	                items: [{
	                    xtype: "label",
	                    style: "padding-top: 0.3em",
	                    text: this.preComboText
	                }, this.createBuilderTypeCombo(), 
	                {
	                    xtype: "label",
	                    style: "padding-top: 0.3em",
	                    text: this.postComboText
	                }]
	            }, 
	            this.createChildFiltersPanel(), 
	            {
	                xtype: "toolbar",
	                items: this.createToolBar()
	            }
		    ]        
        }];
        
        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * builder - {gxp.ToloFilterBuilder} This filter builder.  Call
             *     ``getFilter`` to get the updated filter.
             */
            "change"
        ); 

//        TolomeoExt.widgets.ToloFilterBuilder.superclass.initComponent.call(this);
        this.callParent();
        
        this.on("added", function(scope){
        	scope.form = scope.query('container[ref=form]')[0];
        	scope.builderTypeCombo = scope.query('combo[ref=builderTypeCombo]')[0];
        });
    },

    /** private: method[createToolBar]
     */
    createToolBar: function() {
        var bar = [{
            text: this.addConditionText,
            iconCls: "add",
            handler: function() {
                this.addCondition();
            },
            scope: this
        }];
        if(this.allowGroups) {
            bar.push({
                text: this.addGroupText,
                iconCls: "add",
                handler: function() {
                    this.addCondition(true);
                },
                scope: this
            });
        }
        return bar;
    },
    
    /** api: method[getFilter]
     *  :return: ``OpenLayers.Filter``
     *  
     *  Returns a filter that fits the model in the Filter Encoding
     *  specification.  Use this method instead of directly accessing
     *  the ``filter`` property.  Return will be ``false`` if any child
     *  filter does not have a type, property, or value.
     */
    getFilter: function() {
        var filter;
        if(this.filter) {
            filter = this.filter.clone();
            if(filter instanceof OpenLayers.Filter.Logical) {
                filter = this.cleanFilter(filter);
            }
        }
        return filter;
    },
    
    /** private: method[cleanFilter]
     *  :arg filter: ``OpenLayers.Filter.Logical``
     *  :return: ``OpenLayers.Filter`` An equivalent filter to the input, where
     *      all binary logical filters have more than one child filter.  Returns
     *      false if a filter doesn't have non-null type, property, or value.
     *  
     *  Ensures that binary logical filters have more than one child.
     */
    cleanFilter: function(filter) {
        if(filter instanceof OpenLayers.Filter.Logical) {
            if(filter.type !== OpenLayers.Filter.Logical.NOT &&
               filter.filters.length === 1) {
                filter = this.cleanFilter(filter.filters[0]);
            } else {
                var child;
                for(var i=0, len=filter.filters.length; i<len; ++i) {
                    child = filter.filters[i];
                    if(child instanceof OpenLayers.Filter.Logical) {
                        child = this.cleanFilter(child);
                        if(child) {
                            filter.filters[i] = child;
                        } else {
                            filter = child;
                            break;
                        }
                    //} else if(!child || child.type === null || child.property === null || child[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "lowerBoundary" : "value"] === null || child[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "upperBoundary" : "value"] === null) {
                    } else if(!child || child.type === null || child[child.property] === null || child[child.type === OpenLayers.Filter.Comparison.BETWEEN ? "lowerBoundary" : "value"] === null || child[child.type === OpenLayers.Filter.Comparison.BETWEEN ? "upperBoundary" : "value"] === null ) {
                        filter = false;
                        break;
                    }
                }
            }
        } else {
            if(!filter || filter.type === null || filter.property === null || filter[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "lowerBoundary" : "value"] === null || filter[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "upperBoundary" : "value"] === null) {
                filter = false;
            }
        }
        return filter;
    },
    
    /** private: method[customizeFilter]
     *  :arg filter: ``OpenLayers.Filter``  This filter will not
     *      be modified.  Register for events to receive an updated filter, or
     *      call ``getFilter``.
     *  :return: ``OpenLayers.Filter``  A filter that fits the model used by
     *      this builder.
     *  
     *  Create a filter that fits the model for this filter builder.  This filter
     *  will not necessarily meet the Filter Encoding specification.  In
     *  particular, filters representing binary logical operators may not
     *  have two child filters.  Use the <getFilter> method to return a
     *  filter that meets the encoding spec.
     */
    customizeFilter: function(filter) {
        if(!filter) {
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            filter = this.cleanFilter(filter);
            var child, i, len;
            switch(filter.type) {
                case OpenLayers.Filter.Logical.AND:
                case OpenLayers.Filter.Logical.OR:
                    if(!filter.filters || filter.filters.length === 0) {
                        // give the filter children if it has none
                        filter.filters = [this.createDefaultFilter()];
                    } else {
                        for(i=0, len=filter.filters.length; i<len; ++i) {
                            child = filter.filters[i];
                            if(child instanceof OpenLayers.Filter.Logical) {
                                filter.filters[i] = this.customizeFilter(child);
                            }
                        }
                    }
                    // wrap in a logical OR
                    filter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.OR,
                        filters: [filter]
                    });
                    break;
                case OpenLayers.Filter.Logical.NOT:
                    if(!filter.filters || filter.filters.length === 0) {
                        filter.filters = [
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.OR,
                                filters: [this.createDefaultFilter()]
                            })
                        ];
                    } else {
                        // NOT filters should have one child only
                        child = filter.filters[0];
                        if(child instanceof OpenLayers.Filter.Logical) {
                            if(child.type !== OpenLayers.Filter.Logical.NOT) {
                                // check children of AND and OR
                                var grandchild;
                                for(i=0, len=child.filters.length; i<len; ++i) {
                                    grandchild = child.filters[i];
                                    if(grandchild instanceof OpenLayers.Filter.Logical) {
                                        child.filters[i] = this.customizeFilter(grandchild);
                                    }
                                }
                            } else {
                                // silly double negative
                                if(child.filters && child.filters.length > 0) {
                                    filter = this.customizeFilter(child.filters[0]);
                                } else {
                                    filter = this.wrapFilter(this.createDefaultFilter());
                                }
                            }
                        } else {
                            // non-logical child of NOT should be wrapped
                            var type;
                            if(this.defaultBuilderType === TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF) {
                                type = OpenLayers.Filter.Logical.AND;
                            } else {
                                type = OpenLayers.Filter.Logical.OR;
                            }
                            filter.filters = [
                                new OpenLayers.Filter.Logical({
                                    type: type,
                                    filters: [child]
                                })
                            ];
                        }
                    }
                    break;
                default:
                    // non-logical filters get wrapped
                    filter = this.wrapFilter(filter);
                    break;
            }
        }
        return filter;
    },

    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({
                            matchCase: !this.caseInsensitiveMatch});
    },
    
    /** private: method[wrapFilter]
     *  :arg filter: ``OpenLayers.Filter`` A non-logical filter.
     *  :return: ``OpenLayers.Filter`` A wrapped version of the input filter.
     *  
     *  Given a non-logical filter, this creates parent filters depending on
     *  the ``defaultBuilderType``.
     */
    wrapFilter: function(filter) {
        var type;
        if(this.defaultBuilderType === TolomeoExt.widgets.ToloFilterBuilder.ALL_OF) {
            type = OpenLayers.Filter.Logical.AND;
        } else {
            type = OpenLayers.Filter.Logical.OR;
        }
        return new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.OR,
            filters: [
                new OpenLayers.Filter.Logical({
                    type: type, filters: [filter]
                })
            ]
        });
    },
    
    /** private: method[addCondition]
     *  Add a new condition or group of conditions to the builder.  This
     *  modifies the filter and adds a panel representing the new condition
     *  or group of conditions.
     */
    addCondition: function(group) {
        var filter, type;
        if(group) {
            type = "tolomeo_tolofilterbuilder";
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            type = "tolomeo_tolofilterfield";
            filter = this.createDefaultFilter();
        }
        var newChild = this.newRow({
            xtype: type,
            filter: filter,
            columnWidth: 1,
            attributes: this.attributes,
//            validators: this.validators,
            autoComplete: this.autoComplete,
            autoCompleteCfg: this.autoCompleteCfg,
            allowBlank: group ? undefined : this.allowBlank,
            customizeFilterOnInit: group && false,
            caseInsensitiveMatch: this.caseInsensitiveMatch,
            listeners: {
                change: function() {
                    this.fireEvent("change", this);
                },
                scope: this
            }
        });
        this.childFilterContainer.add(newChild);
        this.filter.filters[0].filters.push(filter);
        this.childFilterContainer.doLayout();
    },
    
    /** private: method[removeCondition]
     *  Remove a condition or group of conditions from the builder.  This
     *  modifies the filter and removes the panel representing the condition
     *  or group of conditions.
     */
    removeCondition: function(item, filter) {
		var parent = this.filter.filters[0].filters;
		if(parent.length > 1) {
			//parent.remove(filter);
			var a = parent.indexOf(filter);
			if(a!=-1){
				parent.splice(a,1)
			}
			
			this.childFilterContainer.remove(item, true);
		}else{
//			var items = item.findByType("tolomeo_filterfield");
			var items = item.query("tolomeo_tolofilterfield");
			
			var i = 0;
			while(items[i]){
				//items[i].reset();
				for(var k = 0; k<items.length; k++){
					items[k].items.each(function(f) {
					    if (Ext.isFunction(f.reset)) {
					        f.reset();
					    }
					});
				}
				
                for(var c = 1;c<items[i].items.items.length;c++){
                    //items[i].items.get(c).disable();  
                	var cmp = items[i].items.get(c);
                	if(cmp.xtype == "container"){
                		cmp.removeAll();
                	}else{
                		cmp.disable();
                	}
                }

				filter.value = null;
                filter.lowerBoundary = null;
                filter.upperBoundary = null;
				i++;
			}
		}
		
		this.fireEvent("change", this);
    },
    
    removeAllConditions: function(){
    	var containers = this.query("container[name=filtercondition_container]");
    	for(var i=0; i<containers.length; i++){
    		var container = containers[i];
    		var filter = container.items.items[1].filter;
    		this.removeCondition(container, filter);
    	}    	
    },
    
    createBuilderTypeCombo: function() {
        var types = this.allowedBuilderTypes || [
            TolomeoExt.widgets.ToloFilterBuilder.ANY_OF, 
            TolomeoExt.widgets.ToloFilterBuilder.ALL_OF,
            TolomeoExt.widgets.ToloFilterBuilder.NONE_OF
        ];
        var numTypes = types.length;
        var data = new Array(numTypes);
        var type;
        for(var i=0; i<numTypes; ++i) {
            type = types[i];
            data[i] = [type, this.builderTypeNames[type]];
        }
        return {
            xtype: "combo",
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: this.builderType,
            ref: "builderTypeCombo",
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            queryMode: "local",
            listeners: {
                select: function(combo, records) {
                	var record = records;
                	if(records instanceof Array){
                		record = records[0];
                	}
                    this.changeBuilderType(record.get("value"));
                    this.fireEvent("change", this);
                },
                scope: this
            },
            width: 70 // TODO: move to css
        };
    },
    
    /** private: method[changeBuilderType]
     *  :arg type: ``Integer`` One of the filter type constants.
     *  
     *  Alter the filter types when the filter type combo changes.
     */
    changeBuilderType: function(type) {
        if(type !== this.builderType) {
            this.builderType = type;
            var child = this.filter.filters[0];
            switch(type) {
                case TolomeoExt.widgets.ToloFilterBuilder.ANY_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.NONE_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
            }
        }
    },

    /** private: method[createChildFiltersPanel]
     *  :return: ``Ext.Container``
     *  
     *  Create the panel that holds all conditions and condition groups.  Since
     *  this is called after this filter has been customized, we always
     *  have a logical filter with one child filter - that child is also
     *  a logical filter.
     */
    createChildFiltersPanel: function() {
        this.childFilterContainer = new Ext.Container();
        var grandchildren = this.filter.filters[0].filters;
        var grandchild;
        for(var i=0, len=grandchildren.length; i<len; ++i) {
            grandchild = grandchildren[i];
            var fieldCfg = {
                xtype: "tolomeo_tolofilterfield",
                allowBlank: this.allowBlank,
                columnWidth: 1,
                filter: grandchild,
                attributes: this.attributes,
//                validators: this.validators,
                autoComplete: this.autoComplete,
                autoCompleteCfg: this.autoCompleteCfg,
                caseInsensitiveMatch: this.caseInsensitiveMatch,
                listeners: {
                    change: function() {
                        this.fireEvent("change", this);
                    },
                    scope: this
                }
            };
            var containerCfg = Ext.applyIf(
                grandchild instanceof OpenLayers.Filter.Logical ?
                    {
                        xtype: "tolomeo_tolofilterbuilder"
                    } : {
                        xtype: "container",
                        layout: "form",
                        hideLabels: true,
                        items: fieldCfg
                    }, fieldCfg
            );
                
            this.childFilterContainer.add(this.newRow(containerCfg));
        }
        
        return this.childFilterContainer;
    },

    /** private: method[newRow]
     *  :return: ``Ext.Container`` A container that serves as a row in a child
     *  filters panel.
     *  
     *  Generate a "row" for the child filters panel.  This couples another
     *  filter panel or filter builder with a component that allows for
     *  condition removal.
     */
    newRow: function(filterContainer) {
        var ct = Ext.create('Ext.Container', {
            layout: "column",
            name: "filtercondition_container",
            items: [
                {
	                xtype: "container",
	                width: 28,
	                height: 26,
	                style: "padding-left: 2px",
	                items: [{
	                    xtype: "button",
	                    style: {
	                    	marginTop: '3px'
	                    },
	                    tooltip: this.removeConditionText,
	                    iconCls: "delete",
	                    handler: function(btn){
	                        this.removeCondition(ct, filterContainer.filter);
	                    },
	                    scope: this
	                }]
	            }, filterContainer
            ]
        });
        return ct;
    },

    /** private: method[getBuilderType]
     *
     *  :return: ``Integer``  One of the builder type constants.
     *  Determine the builder type based on this filter.
     */
    getBuilderType: function() {
        var type = this.defaultBuilderType;
        if(this.filter) {
            var child = this.filter.filters[0];
            if(this.filter.type === OpenLayers.Filter.Logical.NOT) {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = TolomeoExt.widgets.ToloFilterBuilder.NONE_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF;
                        break;
                }
            } else {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = TolomeoExt.widgets.ToloFilterBuilder.ANY_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = TolomeoExt.widgets.ToloFilterBuilder.ALL_OF;
                        break;
                }
            }
        }
        
        return type;
    },

    /** api: method[setFilter]
     *
     *  :param filter: ``OpenLayers.Filter``
     *
     *  Change the filter associated with this instance.
     */
    setFilter: function(filter) {
        this.filter = this.customizeFilter(filter);
        this.changeBuilderType(this.getBuilderType());
        this.builderTypeCombo.setValue(this.builderType);
        this.form.remove(this.childFilterContainer);
        this.form.insert(1, this.createChildFiltersPanel());
        this.form.doLayout();
        this.fireEvent("change", this);
    }

});

/**
 * Builder Types
 */
TolomeoExt.widgets.ToloFilterBuilder.ANY_OF = 0;
TolomeoExt.widgets.ToloFilterBuilder.ALL_OF = 1;
TolomeoExt.widgets.ToloFilterBuilder.NONE_OF = 2;
TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF = 3;

/** api: xtype = tolomeo_ToloFilterBuilder */
//Ext.preg('tolomeo_ToloFilterBuilder', TolomeoExt.ToloFilterBuilder); 
