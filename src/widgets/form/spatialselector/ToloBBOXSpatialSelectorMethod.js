
Ext.namespace('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin per la selezione di una area di interesse a Bounding Box (BBOX).
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod', {
		
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_bbox_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

    /**
     * @cfg {String} latitudeEmptyText [displayProjection="null"]
     * La proiezione per il display delle coordinate (se null si usa la proiezione dell mappa).
     */
    displayProjection: null,
    
    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'BBOX',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Bounding Box',

 	/**
     * @cfg {Object} spatialFilterOptions.
     * Opzioni di configurazione per i campi di coordinata (valori massimi e minini consentiti per i campi).
     * 
     * @example
	 *    spatialFilterOptions: {
	 *	        lonMax: 180,   
	 *	        lonMin: -180,
	 *	        latMax: 90,   
	 *	        latMin: -90  
	 *	  }
     */
	spatialFilterOptions : {
		lonMax : 20037508.34, //90,
		lonMin : -20037508.34, //-90,
		latMax : 20037508.34, //180,
		latMin : -20037508.34 //-180
	},

 	/**
     * @property {String} northLabel.
     * Testo dell'etichetta per la coordinata Nord.
     */
    northLabel: "Nord",
    
 	/**
     * @property {String} westLabel.
     * Testo dell'etichetta per la coordinata Ovest.
     */
    westLabel: "Ovest",
    
 	/**
     * @property {String} eastLabel.
     * Testo dell'etichetta per la coordinata Est.
     */
    eastLabel: "Est",
    
 	/**
     * @property {String} southLabel.
     * Testo dell'etichetta per la coordinata Sud.
     */
    southLabel: "Sud",

 	/**
     * @property {String} setAoiTitle.
     * Titolo del field set di contenimento.
     */
	setAoiTitle : "Bounding Box",

 	/**
     * @property {String} setAoiText.
     * Testo di etichetta per il pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiText: "Box",

 	/**
     * @property {String} setAoiTooltip.
     * Testo per il tooltip del pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiTooltip: "Abilita il controllo Box per il disegno della ROI (BBOX) sulla mappa",

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {   
    	var displayProjection = this.displayProjection;
		
    	// ///////////////////////////////////////////
		// Spatial AOI Selector FieldSet
		// ///////////////////////////////////////////
		var confbbox = {
            map: null, 
            outputSRS : this.displayProjection  || null, 
            spatialFilterOptions: this.spatialFilterOptions,
            ref: "spatialFieldset",
            id: this.id + "_bbox",
            defaultStyle: this.defaultStyle,
            selectStyle: this.selectStyle,
            temporaryStyle: this.temporaryStyle,
            anchor: "100%",
            title: this.setAoiTitle,
		    northLabel:this.northLabel,
		    westLabel:this.westLabel,
		    eastLabel:this.eastLabel,
		    southLabel:this.southLabel,
		    setAoiText: this.setAoiText,
		    setAoiTooltip: this.setAoiTooltip,
		    waitEPSGMsg: "Please Wait..."
        };

    	this.output = Ext.create('TolomeoExt.widgets.form.ToloBBOXFieldset', confbbox);

    	this.items = [this.output];

    	this.callParent();
    },

	/**
     * Attiva il controllo.
     * 
     */
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
		}
	},

	/**
     * Disattiva il controllo.
     * 
     */
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("removelayer", this.output.layerName);
			}
			this.output.disable();
		}
	},

	/**
     * Reimposta il controllo di disegno del BBOX.
     * 
     */
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.reset.call(this);
    	
		if(this.qbEventManager){
			this.qbEventManager.fireEvent("removelayer", this.output.layerName);
		}
    	this.output.reset();
    }

});
