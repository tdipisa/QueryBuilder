/**
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: BufferSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on buffer fieldset
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.BufferSpatialSelectorMethod',  {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.SpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_buffer_selector',

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Buffer',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Buffer',

    /**
     * Property: latitudeEmptyText
     * {string} emptyText of the latitude field
     */
    latitudeEmptyText : 'Y',

    /**
     * Property: longitudeEmptyText
     * {string} emptyText of the longitude field
     */
    longitudeEmptyText : 'X',

	/** api: config[bufferOptions]
	 *  ``Object``
	 * Buffer spatial selector options.
	 */
	bufferOptions : {
		"minValue": 1,
		"maxValue": 1000,
		"decimalPrecision": 2,
		"distanceUnits": "m"
	},

    /** api: method[initComponent]
     */
    initComponent: function() {
		// ///////////////////////////////////////////
		// Spatial Buffer Selector FieldSet
		// ///////////////////////////////////////////
		this.bufferFieldset = new TolomeoExt.widgets.form.BufferFieldset({
			id: this.id + "bufferFieldset",
			//ref: "bufferFieldset",
			map: null, //this.target.mapPanel.map,
			minValue: this.bufferOptions.minValue,
            maxValue: this.bufferOptions.maxValue,
		    decimalPrecision: this.bufferOptions.decimalPrecision,
			outputSRS: null, //this.target.mapPanel.map.projection,
			selectStyle: this.selectStyle,
			geodesic: this.geodesic || true,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText
		});
		this.bufferFieldset.on("bufferadded", function(evt, feature){
			this.setCurrentGeometry(feature.geometry);
		}, this);

	    this.bufferFieldset.on("bufferremoved", function(evt, feature){
			this.setCurrentGeometry(null);
		}, this);

    	this.output = this;

    	this.items = [this.bufferFieldset];

//    	TolomeoExt.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.initComponent.call(this);
    	this.callParent();
    },

	// trigger action when activate the plugin
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
			if(Ext.isIE){
				this.output.doLayout();
			}
		}
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
			this.output.hide();
			this.output.disable();
		}
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.reset.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
		}
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){
		var summary = "", metricUnit = "km";

		var area = this.getArea(geometry, metricUnit);
		if (area) {
			summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
		}

		// //////////////////////////////////////////////////////////
		// Draw also the circle center as a part of summary report
		// //////////////////////////////////////////////////////////
		var circleSelectionCentroid = geometry.getCentroid();

		if (circleSelectionCentroid) {
			var lon = circleSelectionCentroid.x.toFixed(3);
			var lat = circleSelectionCentroid.y.toFixed(3);
			var xField = null /*this.target.mapPanel.map.projection*/ == "EPSG:4326" ? "Lon" : "X";
			var yField = null /*this.target.mapPanel.map.projection*/ == "EPSG:4326" ? "Lat" : "Y";
			summary += this.centroidLabel + ": " + lon + " ("+xField+") " + lat + " ("+yField+")" + '<br />';
		}

		return summary;
    }
});
