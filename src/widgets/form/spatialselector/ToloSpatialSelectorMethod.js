/**
 * include widgets/form/spatialselector/BBOXToloSpatialSelectorMethod.js
 * include widgets/form/spatialselector/BufferToloSpatialSelectorMethod.js
 * include widgets/form/spatialselector/CircleToloSpatialSelectorMethod.js
 * include widgets/form/spatialselector/GeocoderToloSpatialSelectorMethod.js
 * include widgets/form/spatialselector/PolygonToloSpatialSelectorMethod.js
 */

Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: ToloSpatialSelectorMethod(config)
 *
 *    Common code for plugins for spatial selection.
 *    Known plugins: <ul>
 *       <li>BBOXToloSpatialSelectorMethod: `gxp_spatial_bbox_selector` ptype</li>
 *       <li>BufferToloSpatialSelectorMethod: `gxp_spatial_buffer_selector` ptype</li>
 *       <li>CircleToloSpatialSelectorMethod: `gxp_spatial_circle_selector` ptype</li>
 *       <li>GeocoderToloSpatialSelectorMethod: `gxp_spatial_geocoding_selector` ptype</li>
 *       <li>PolygonToloSpatialSelectorMethod: `gxp_spatial_polygon_selector` ptype</li>
 * 	  </ul>
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod', {
	
	extend: 'Ext.Container',

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */

	/** api: config[output]
	 *  ``Object``
	 *  Output for this plugin
	 */

	/** api: config[currentGeometry]
	 *  ``Object``
	 *  Selected geometry
	 */

	/** api: config[filterGeometryName]
	 *  ``Object``
	 *  Parameter to perform the filter
	 */
   
   /** api: config[metricUnit]
	 *  ``Object``
	 *  The metric unit to display summary
	 */
    metricUnit :"km",
    
	/** api: config[hideWhenDeactivate]
	 *  ``Boolean``
	 *  Flag to hide output when the selection method is deactivated. Default is true
	 */
	hideWhenDeactivate: true,

	/** api: config[zoomToCurrentExtent]
	 *  ``Boolean``
	 *  Flag to zoom the current map to the selected geometry when you select one. Default is false
	 */
	zoomToCurrentExtent: false,

	/** api: config[defaultStyle]
	 *  ``Object``
	 */
	defaultStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

	/** api: config[temporaryStyle]
	 *  ``Object``
	 */
	temporaryStyle : {
		"strokeColor": "#ee9900",
		"fillColor": "#ee9900",
		"fillOpacity": 0.4,
		"strokeWidth": 1
	},
	
	/** api: config[showSelectionSummary]
	 *  ``Boolean``
	 *  Whether we want to show or not the selection summary as a pop-up on the map.
	 */
	showSelectionSummary : true,

	/** api: config[addGeometryOperation]
	 *  ``Boolean``
	 *  Append geometry operation as fieldset.
	 */
	addGeometryOperation: true,

	/** api: config[geometryOperations]
	 *  ``Array``
	 *  With allowed geometry operations.
	 */
	geometryOperations:[{
		name: "INTERSECTS",
		label: "INTERSECTS",
		value: OpenLayers.Filter.Spatial.INTERSECTS
	},{
		name: "BBOX",
		label: "BBOX",
		value: OpenLayers.Filter.Spatial.BBOX
	},{
		name: "CONTAINS",
		label: "CONTAINS",
		value: OpenLayers.Filter.Spatial.CONTAINS
	},{
		name: "DWITHIN",
		label: "DWITHIN",
		value: OpenLayers.Filter.Spatial.DWITHIN
	},{
		name: "WITHIN",
		label: "WITHIN",
		value: OpenLayers.Filter.Spatial.WITHIN
	}],

	/** api: config[defaultGeometryOperation]
	 *  ``String``
	 *  Default geometry operation selected.
	 */
	defaultGeometryOperation: OpenLayers.Filter.Spatial.INTERSECTS,

	/** api: config[areaLabel]
	 * ``String``
	 * Text for the Selection Summary Area Label (i18n).
	 */
	areaLabel : "Area",

	/** api: config[lengthLabel]
	 * ``String``
	 * Text for the Selection Summary Perimeter Label (i18n).
	 */
	lengthLabel : "Length",

	/** api: config[perimeterLabel]
	 * ``String``
	 * Text for the Selection Summary Perimeter Label (i18n).
	 */
	perimeterLabel : "Perimeter",

	/** api: config[selectionSummary]
	 * ``String``
	 * Text for the Selection Summary (i18n).
	 */
	selectionSummary : "Selection Summary",

	/** api: config[radiusLabel]
	 * ``String``
	 * Text for the Selection Summary Radius Label (i18n).
	 */
	radiusLabel : "Radius",

	/** api: config[centroidLabel]
	 * ``String``
	 * Text for the Selection Summary Centroid Label (i18n).
	 */
	centroidLabel : "Centroid",

	/** api: config[geometryOperationText]
	 * ``String``
	 * Text for the Geometry Operation Label (i18n).
	 */
	geometryOperationText: "Geometry operation",

	/** api: config[geometryOperationEmptyText]
	 * ``String``
	 * Text for the empty geometry operation combo (i18n).
	 */
	geometryOperationEmptyText: "Select a operation",

	/** api: config[distanceTitleText]
	 * ``String``
	 * Text for the Distance field label (i18n).
	 */
	distanceTitleText: "Distance",

	/** api: config[centroidLabel]
	 * ``String``
	 * Text for distance unit field label (i18n).
	 */
	distanceUnitsTitleText: "Distance units",

	/** api: config[noOperationTitleText]
	 * ``String``
	 * Text for no valud operation title msg (i18n).
	 */
	noOperationTitleText: "No valid operation",

	/** api: config[noOperationMsgText]
	 * ``String``
	 * Text for no operation msg (i18n).
	 */
	noOperationMsgText: "Please, select an operation before query",

	/** api: config[noCompleteMsgText]
	 * ``String``
	 * Text msg for no complete form (i18n).
	 */
	noCompleteMsgText: "Please, complete form before query",
	
	qbEventManager: null,

	// init spatialSelector method
	constructor : function(config) {
		Ext.apply(this, config);
		
		this.callParent(arguments);
	},

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function(config) {   

		Ext.apply(this, config);

		if(!this.output){
			this.output = this;
		}

		if(this.addGeometryOperation){
			if (!this.items){
				this.items = [];
			}

			this.items.push({
				xtype: 'fieldset',
				ref: "geometryOperationFieldset",
				title: this.geometryOperationText,
                checkboxToggle: true,
                collapsed : true,
				items: [this.getGeometryOperationCombo()]
			});
			
			this.items.push(this.getDistanceFieldset());
		}

		this.output.addEvents(
				"geometrySelect"
		);	
		
		this.callParent();
		
        this.on("added", function(scope){
        	scope.geometryOperationFieldset = scope.query('fieldset[ref=geometryOperationFieldset]')[0];
        	scope.geometryOperation = scope.query('combo[ref=geometryOperation]')[0];
        	scope.distanceFieldset = scope.query('fieldset[ref=distanceFieldset]')[0];
        	scope.distance = scope.query('numberfield[ref="distance"]')[0];
        	scope.dunits = scope.query('textfield[ref=dunits]')[0];
//TODO: fix this     	
//			if(scope.qbEventManager){
//				scope.qbEventManager.fireEvent("setmapunitsvaluefield", scope.dunits);
//			}
        });
    },

	/** api: method[getSelectionMethodItem]
     *  :returns: ``Object`` For the selection type combo
	 * Generate a item for the selection type combo
	 */
	getSelectionMethodItem: function(){
        return {
        	label: this.label, 
        	name: this.name
        };
	},

	/** api: method[getQueryFilter]
     *  :returns: ``Object`` filter to perform a WFS query
	 * Generate a filter for the selected method
	 */
	getQueryFilter: function(){
		var operation = null;
		
		if(this.addGeometryOperation && !this.geometryOperationFieldset.collapsed){
			if(this.geometryOperation.isValid() ){
				operation = this.geometryOperation.getValue();
			}else{
                Ext.Msg.show({
                    title: this.noOperationTitleText,
                    msg: this.noOperationMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
				return null;
			}
		}else{
			operation = OpenLayers.Filter.Spatial.INTERSECTS;
		}
		
		if(this.currentGeometry){
			switch (operation){
				case OpenLayers.Filter.Spatial.CONTAINS:
				case OpenLayers.Filter.Spatial.INTERSECTS:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry,
						bounds: this.currentGeometry.getBounds()
					});
					break;
				case OpenLayers.Filter.Spatial.WITHIN:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry
					});
					break;
				case OpenLayers.Filter.Spatial.DWITHIN:
					if(this.distance.isValid()
						&& this.dunits.isValid()){
						this.currentFilter = new OpenLayers.Filter.Spatial({
							type: operation,
							property:  this.filterGeometryName,
					        distanceUnits: this.dunits.getValue(),
					        distance: this.distance.getValue(),
							value: this.currentGeometry
						});
					}else{
		                Ext.Msg.show({
		                    title: this.noOperationTitleText,
		                    msg: this.noCompleteMsgText,
		                    buttons: Ext.Msg.OK,
		                    icon: Ext.MessageBox.ERROR
		                });
		                return null;
					}
					break;
				case OpenLayers.Filter.Spatial.BBOX:
				default: 
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: OpenLayers.Filter.Spatial.BBOX,
						property:  this.filterGeometryName,
						value: this.currentGeometry.getBounds()
					});
			}
			
		}else{
	        this.currentFilter = null;
		}

		return this.currentFilter;
	},

	/** api: method[activate]
     *  Trigger action when activate the plugin
	 */
	activate: function(){
		this.reset();
		this.doLayout();
		this.show();
	},

	/** api: method[deactivate]
     *  Trigger action when deactivate the plugin
	 */
	deactivate: function(){
		this.reset();
		this.hide();
	},

    /** api: method[addOutput]
     */
    addOutput: function() {
    	// TODO: Override it on plugins
    },

	/** api: method[reset]
     *  Trigger action when reset the plugin
	 */
    reset: function(){
    	this.currentGeometry = null;
    	this.currentFilter = null;
    },

	/** api: method[setCurrentGeometry]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Set current geometry
	 */
    setCurrentGeometry: function(geometry){
		this.currentGeometry = geometry;
		
    	if (geometry) {
			if (this.zoomToCurrentExtent && geometry && geometry.getBounds) {
				var dataExtent = geometry.getBounds();
				
				// create an event to manage the zoom to extent
				this.qbEventManager.fireEvents("zoomtomapextent", {dataExtent: dataExtent});
			}

			this.output.fireEvent("geometrySelect", geometry);
		} 
    },

	/** api: method[getGeometryOperationCombo]
     *  Obtain the geometry operation combo
	 */
	getGeometryOperationCombo : function() {
		var geometryOperationMethodCombo = Ext.create('Ext.form.ComboBox', {
			ref : 'geometryOperation',
			typeAhead : true,
			forceSelection: true, 
			queryMode: 'local',
			triggerAction: 'all',
			emptyText : this.geometryOperationEmptyText,
			selectOnFocus: true,
			editable:false,
			fieldLabel : this.geometryOperationText,
			name : 'geometryOperation',
			displayField : 'label',
			valueField : 'value',
			readOnly : false,
			lazyRender : false,
			value: this.defaultGeometryOperation,
			allowBlank : false,
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
				data : this.geometryOperations
			}),
			listeners : {
				// SHOW /Hide distance units for DWITHIN
				select : function(c, record, index) {
					if(c.getValue() == OpenLayers.Filter.Spatial.DWITHIN){
						this.distanceFieldset.show();
					}else if(this.distanceFieldset.isVisible()){
						this.distanceFieldset.hide();
					}
				},
				scope : this
			}
		});
		 
		return geometryOperationMethodCombo;
	},

	/** api: method[getDistanceFieldset]
     *  Obtain the distance fieldset for DWITHIN
	 */
	getDistanceFieldset: function(){
		return {
			xtype: 'fieldset',
			title: this.distanceTitleText,
			ref: "distanceFieldset",
			hidden: true,
			items: [{
				xtype: "textfield",
				fieldLabel: this.distanceUnitsTitleText,
				name: "dunits",
				ref: "dunits",
				labelStyle: 'width: 130px;',
				allowBlank: false
			},{
				xtype: "numberfield",
				fieldLabel: this.distanceTitleText,
				name: "distance",
				ref: "distance",
				labelStyle: 'width: 130px;',
				allowBlank: false
			}]
		}
	}
});
