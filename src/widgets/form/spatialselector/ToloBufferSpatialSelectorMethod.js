
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin per la selezione di una area di interesse a buffer.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod',  {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_buffer_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'Buffer',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Buffer',

    /**
     * @cfg {String} latitudeEmptyText.
     * Testo da mostrare se ili campo Y (latitude) non è valorizzato.
     */
    latitudeEmptyText : 'Y',

    /**
     * @cfg {String} longitudeEmptyText.
     * Testo da mostrare se ili campo X (longitude) non è valorizzato.
     */
    longitudeEmptyText : 'X',

	/**
	 * @cfg {Object} bufferOptions 
	 * Opzioni di configurazione per la selezione del buffer.
	 *
	 * @example
	 *	bufferOptions : {
	 *		"minValue": 1,
	 *		"maxValue": 1000, 
	 *			"decimalPrecision": 2,
	 *		"distanceUnits": "m"
	 *	}
	 */
	bufferOptions : {
		"minValue": 1,
		"maxValue": 1000,
		"decimalPrecision": 2,
		"distanceUnits": "m"
	},
	
    /**
     * @cfg {Boolean} geodesic.
     * 
     */
	geodesic: false,

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
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
			geodesic: this.geodesic != undefined ?  this.geodesic : false,
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

	/**
     * Attiva il controllo.
     * 
     */
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
			if(Ext.isIE){
				this.output.doLayout();
			}
		}
	},

	/**
     * Disattiva il controllo.
     * 
     */
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
			this.output.hide();
			this.output.disable();
		}
	},

	/**
     * Reimposta il controllo di disegno del buffer.
     * 
     */
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.reset.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
		}
    }

});
