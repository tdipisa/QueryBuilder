
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: ToloBufferSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on buffer fieldset
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod',  {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_buffer_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

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
		this.bufferFieldset = new TolomeoExt.widgets.form.ToloBufferFieldset({
			id: this.id + "bufferFieldset",
			map: null,
			minValue: this.bufferOptions.minValue,
            maxValue: this.bufferOptions.maxValue,
		    decimalPrecision: this.bufferOptions.decimalPrecision,
			outputSRS: null,
			selectStyle: this.selectStyle,
			geodesic: this.geodesic || true,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText,
			qbEventManager: this.qbEventManager
		});
		
		this.bufferFieldset.on("bufferadded", function(evt, feature){
			this.setCurrentGeometry(feature.geometry);
		}, this);

	    this.bufferFieldset.on("bufferremoved", function(evt, feature){
			this.setCurrentGeometry(null);
		}, this);
	    
	    this.bufferFieldset.on("afterlayout", function(evt){
	    	this.qbEventManager.fireEvent("addcoordinatepickercontrol", this.bufferFieldset.coordinatePicker);
		}, this);

    	this.output = this;

    	this.items = [this.bufferFieldset];

    	this.callParent();
    },

	// trigger action when activate the plugin
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
			if(Ext.isIE){
				this.output.doLayout();
			}
		}
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
			this.output.hide();
			this.output.disable();
		}
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.reset.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
		}
    }

});
