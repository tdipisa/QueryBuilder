
Ext.ns('TolomeoExt.widgets');

/**
 * Class: ToloSpatialSelector
 *
 * @overview Spatial Selector.
 * @name Tolomeo - Interfaccia Spatial Selector
 * @author Tobia Di Pisa
 */
Ext.define('TolomeoExt.widgets.ToloSpatialSelector', {

	extend: 'Ext.Panel',
	
    /** api: config[spatialSelectorsConfig]
     * ``Object``
     * Spatial selector widget configurations.
     */
    spatialSelectorsConfig:{
        bbox:{
            xtype : 'widget.tolomeo_spatial_bbox_selector'
        },
        buffer:{
            xtype : 'widget.tolomeo_spatial_buffer_selector'
        },
        circle:{
            xtype : 'widget.tolomeo_spatial_circle_selector',
            zoomToCurrentExtent : true
        },
        polygon:{
            xtype : 'widget.tolomeo_spatial_polygon_selector'
        }
    },
    
    /** api: config[defaultSelectionMethod]
     * ``String``
     * Default selector method to be selected in this.spatialSelectorsConfig.
     */
	defaultSelectionMethod: null,

    /** api: config[filterGeometryName]
     * ``String``
     * Property name to prepate the filter.
     */
	filterGeometryName: null,

	/** i18n **/

	/** api: config[titleText]
	 * ``String``
	 * Title for the output (i18n).
	 */
	titleText: "Spatial Selector",

	/** api: config[title]
	 * ``String``
	 * Text for ROI FieldSet Title (i18n).
	 */
	selectionMethodLabel : "Selection Method",

	/** api: config[comboEmptyText]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	comboEmptyText : "Select a method..",

	/** api: config[comboSelectionMethodLabel]
	 * ``String``
	 * Text for Label Combo Selection Method (i18n).
	 */
	comboSelectionMethodLabel : "Selection",
	
	qbEventManager: null,
    
	/** api: method[constructor]
	 * Init spatialSelectors .
	 */
	constructor : function(config) {
		// default layout configuration
//		this.layoutConfig = {
//    		xtype: "container",
//    		hidden: true
//		};
		
		this.layoutConfig = {
            xtype: 'container',
            defaults:{
                layout: "form"
            }
        };

		// Apply config
		Ext.apply(this, config);

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				//spConfig.target = this.target;
				var plugin = Ext.create(spConfig.xtype, {
					qbEventManager: this.qbEventManager
				});
//				plugin.output.on('geometrySelect', function(geometry){
//					this.qbEventManager.fireEvent("ongeneratesummary");
//				}, this);
				
				this.spatialSelectors[key] = plugin;
				var selectorItem = plugin.getSelectionMethodItem();
				selectorItem.value = key;
				this.spatialSelectorsItems.push(selectorItem);
			}	
		}
		
		//return TolomeoExt.widgets.ToloSpatialSelector.superclass.constructor.call(this, arguments);
		this.callParent(arguments);
	},

	/**
	 * initComponent: TolomeoExt.ToloSpatialSelector
	 * Crea un nuovo TolomeoExt.ToloSpatialSelector
	 *
	 * Returns:
	 * {<TolomeoExt.ToloSpatialSelector>} Un nuovo TolomeoExt.ToloSpatialSelector
	 */
	initComponent: function(){	
		this.border = 0;
		
    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		var selectionMethodCombo = {
			xtype : 'combo',
			// anchor : '100%',
			id : this.id + '_selectionMethod_id',
//			ref : '../outputType',
			fieldLabel : this.comboSelectionMethodLabel,
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : false,
			queryMode : 'local',
			name : 'roiSelectionMethod',
			forceSelection : true,
			emptyText : this.comboEmptyText,
			allowBlank : false,
			//autoLoad : true,
			displayField : 'label',
			valueField : 'value',
			editable : false,
			readOnly : false,
			store : Ext.create('Ext.data.JsonStore', {
				autoLoad : true,
				fields : [{
					name : 'name',
					dataIndex : 'name'
				}, {
					name : 'label',
					dataIndex : 'label'
				}, {
					name : 'value',
					dataIndex : 'value'
				}],
				data : this.spatialSelectorsItems
			}),
			listeners : {
				select : function(c, record, index) {
					this._updating = true;
					this.reset();
					this._updating = false;
					var method = this.spatialSelectors[c.getValue()];//record.json.method;
					method.activate();
					this.activeMethod = method;
                    setTimeout(function(){
                        //TODO: ??? c.refOwner.doLayout();
                    }, 500);
				},
				scope : this
			}
		};

		var selItems = [];
		selItems.push(selectionMethodCombo);
		
		if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		var output = this.spatialSelectors[key];
	    		if(output){
					selItems.push(output);
	    		}
	    	}
	    }
		
	    // initialize layout
		layout.items = [];		
		layout.items.push({
			xtype: 'fieldset',
			collapsed : true,
			checkboxToggle: true,
			title: this.comboSelectionMethodLabel,
			items: selItems
		});

// Not restore this
//    	if(this.spatialSelectors){
//	    	for (var key in this.spatialSelectors){
//	    		var output = this.spatialSelectors[key];
//	    		if(output){
//					layout.items.push(output);
//	    		}
//	    	}
//	    }

	    // reset when portal ready. Needs to be at this time to read the map configuration
	    /*var me = this;
	    this.target.on("ready", function(){
	    	me.reset();
	    });*/

    	this.items = [layout];
    	
    	this.callParent();    	
    	//return layout;
    	
    	//
    	// Update the current map extent
    	//
    	this.qbEventManager.on("mapmoved", function(extent){
    		this.currentMapExtent = extent;
    	}, this);
    },
    
	/** api: method[reset]
	 * Reset the state of the Spatial Selector.
	 */
    reset: function(){
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		this.spatialSelectors[key].deactivate();
	    		this.activeMethod = null;
	    	}
	    	if(!this._updating 
	    		&& this.defaultSelectionMethod
	    		&& this.spatialSelectors[this.defaultSelectionMethod]){
	    		this.spatialSelectors[this.defaultSelectionMethod].activate();
				this.activeMethod = this.spatialSelectors[this.defaultSelectionMethod];
	    	}   	
    	}
    },

	/** api: method[getQueryFilter]
     *  :returns: ``Object`` filter to perform a WFS query
	 * Generate a filter for the selected method
	 */
	getQueryFilter: function(){
		if(this.activeMethod && this.activeMethod.currentGeometry){
			this.activeMethod.filterGeometryName = this.filterGeometryName;
			return this.activeMethod.getQueryFilter();
		}else{
			return new OpenLayers.Filter.Spatial({
				type: OpenLayers.Filter.Spatial.BBOX,
				property: this.filterGeometryName,
				value: this.currentMapExtent //this.target.mapPanel.map.getExtent()
			});
		}
	},

	/** api: method[getGeometry]
     *  :returns: ``Object`` Geometry selected
	 * Obtain selected geometry
	 */
	getGeometry: function(){
		if(this.activeMethod){
			return this.activeMethod.currentGeometry;
		}else{
			return null;
		}
	},
	
	getSelectionMethodCombo: function(){		
    	var selectionMethodCombo = this.queryById(this.id + '_selectionMethod_id');
    	return  selectionMethodCombo;
	}
	
});
