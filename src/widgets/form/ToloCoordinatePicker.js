
Ext.ns('TolomeoExt.widgets.form');

/**
 * Widget relativa al Form Container per la gestione del campo di selezione 
 * delle coordinate puntuali su mappa. 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloCoordinatePicker', {
	
	extend: 'Ext.form.FieldContainer',

    alias: 'tolomeo_coordinate_picker',
	
	/**
     * @property {String} fieldLabel.
     *
     */
    fieldLabel: 'Coordinate',
	
	/**
     * @property {String} pointSelectionButtionTip.
     *
     */
    pointSelectionButtionTip: 'Click per abilitare la selezione del punto',
	
	/**
     * @property {String} latitudeEmptyText.
     * Stringa da mostrare per componente non valorizzato (latitudine)
     */
    latitudeEmptyText: 'Latitudine',
	 
 	/**
      * @property {String} longitudeEmptyText.
      * Stringa da mostrare per componente non valorizzato (longitudine)
      */
    longitudeEmptyText: 'Longitudine',
	 
 	/**
     * @property {String} outputSRS.
     * Codice EPSG per la trasformazione delle coordinate in 
     * visualizzazione all'interno della form.
     */
    outputSRS: 'EPSG:4326',
    
 	/**
     * @property {String} buttonIconCls.
     * Classe di stile usata per l'icona del pulsante di selezione.
     */
    buttonIconCls:'gx-cursor',

    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style usato come stile del punto su mappa.
     */
    selectStyle:{
        pointRadius: 4,
        graphicName: "cross",
        fillColor: "#FFFFFF",
        strokeColor: "#FF0000",
        fillOpacity:0.5,
        strokeWidth:2
    },

    /**
     * @property {Object} defaultSelectStyle.
     * Configurazione del OpenLayer.Style usato per riempire i campi mancati di "selectStyle".
     */
    defaultSelectStyle:{
        pointRadius: 4, // sized according to type attribute
        graphicName: "cross",
        fillColor: "#0000FF",
        strokeColor: "#0000FF",
        fillOpacity:0.5,
        strokeWidth:2        
    },
	
    /**
     * @cfg {Integer} decimalPrecision.
     * Massimo numero possibile di cifre decimali per i campi di coordinate.
     */
    decimalPrecision: 10,
    
    /**
     * @cfg {String} selectLayerName.
     * Nome del layer vettoriale che rappresenta il punto su mappa.
     */
    selectLayerName: "select_marker_position_layer",
    
    /**
     * @cfg {Boolean} displayInLayerSwitcher.
     * Usato per determinare se il layer vettoriale deve apparire all'interno del LayerSwitcher OpenLayers.
     */
    displayInLayerSwitcher: false,
    
	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloCoordinatePicker.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent:function(config){
        this.layout = {
            type: 'hbox'
        };
        
        this.defaults = {
            // applied to each contained panel
            bodyStyle:'padding:5px;'
        };
		
        var compositeField = this;
		
		Ext.applyIf(this.selectStyle, this.defaultSelectStyle);
		
        this.items= [
				{
                    xtype     : 'numberfield',
                    emptyText : this.longitudeEmptyText,
                    ref:'longitudeField',
                    decimalPrecision:this.decimalPrecision,
                    flex      : 1,
                    allowBlank: false,
                    name: 'lon',
					listeners: {
						scope:this,
						change: this.updatePoint
					}
                }, {
                    xtype: 'button',
					ref:'clickToggle',
                    tooltip: this.pointSelectionButtionTip,
                    iconCls: this.buttonIconCls,
                    enableToggle: true,
                    toggleGroup: this.toggleGroup,
                    width: 20,
                    listeners: {
                      scope: this, 
                      toggle: function(button, pressed) {  
                         if(pressed){
                              this.selectLonLat.activate();
                          }else{
                              this.selectLonLat.deactivate();
                          }
                      }
                    }
                }, {
                    xtype     : 'numberfield',
                    emptyText : this.latitudeEmptyText,
                    ref: 'latitudeField',
                    flex      : 1,
                    decimalPrecision: this.decimalPrecision,
                    allowBlank:false,
                    name: 'lat',
					listeners: {
						scope:this,
						change: this.updatePoint
					}
                }
            ];
        
        this.callParent(arguments);
        
        this.on("added", function(scope){
        	scope.latitudeField = scope.query('numberfield[ref=latitudeField]')[0];
        	scope.longitudeField = scope.query('numberfield[ref=longitudeField]')[0];
        	scope.clickToggle = scope.query('button[ref=clickToggle]')[0];
        });
    },
    
	/**
     * Controlla la validità dei valori inseriti.
     * 
     * @return {Boolean} Restituisce true se valido e false se non lo è.
     */
    isValid: function(){
    	if(this.latitudeField.isValid() &&
    	    	this.longitudeField.isValid()){
    		return true;
    	}else{
    		return false;
    	}
    },
	
	/**
     * Prende i valori dai campi e avvia la procedura di disegno sulla mappa.
     * 
     */
    updatePoint: function(){
        var lat = this.latitudeField.getValue();
		var lon = this.longitudeField.getValue();
		if( lon && lat ){
			//add point
			var lonlat = new OpenLayers.LonLat(lon,lat);
			lonlat.transform(new OpenLayers.Projection(this.outputSRS), this.projectionObject);
			this.updateMapPoint(lonlat);
		}
    },
	
	/**
     * Lancia l'evento per la rimozione del layer vettoriale 
     * che rappresente la selezione del punto sulla mappa.
     * 
     */
    resetMapPoint:function(){
    	this.fireEvent("reset", this.selectLayerName);
    },

	/**
     * Reimposta i campi della form e rimuove il layer dalla mappa.
     *
     */
    resetPoint:function(){
		this.latitudeField.reset();
        this.longitudeField.reset();
		
        this.resetMapPoint();
	},

	/**
     * Usato per impostare la pressione del pulsante di attivazione 
     * del controllo di disegno.
     * @param {Boolean} toggle valore del toggle da impostare per il componente Ext.
     */
	toggleButton: function(toggle){
		this.clickToggle.toggle(toggle);
	},
	
	/**
     * Aggiorna il punto sulla mappa tramite eventi gestiti dal Manager a livello superiore.
     * del controllo di disegno.
     * @param {OpenLayers.LonLat} lonlat valore delle coordinate da usare per il punto su mappa.
     */
    updateMapPoint:function(lonlat){
        if(this.selectStyle){
        	this.resetMapPoint();
        	this.fireEvent("update", lonlat, this);
        	this.fireEvent("updatebuffer", lonlat, this);
        }    
    },
	 
	/**
     * Recupera le coordinate dai campi della form.
     * del controllo di disegno.
     * @return {Array} Array delle coordinate.
     */
	getCoordinate: function(){
		return [this.longitudeField.getValue(), this.latitudeField.getValue()];
	}
    
});
