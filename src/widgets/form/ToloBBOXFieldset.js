
Ext.ns("TolomeoExt.widgets.form");

/**
 * Widget per la gestione delle funzionalità relative alla modalità di selezione
 * per BBOX 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloBBOXFieldset', {
	
	extend: 'Ext.form.FieldSet',
	
    alias: "widget.tolomeo_bboxfieldset",
 
    id: "bboxFieldSet",
  
 	/**
     * @property {String} layerName.
     * Nome da usare per il layer vettoriale che rappresenta il BBOX disegnato.
     */
    layerName: "BBOX",

    /**
     * @cfg {Integer} decimalPrecision.
     * Massimo numero possibile di cifre decimali per i campi di coordinate.
     */
    decimalPrecision: 5,
    
 	/**
     * @property {String} outputSRS.
     * Codice EPSG per la trasformazione delle coordinate in 
     * visualizzazione all'interno della form.
     */
    outputSRS: 'EPSG:4326',

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
    spatialFilterOptions: {
        lonMax: null,   
        lonMin: null,
        latMax: null,   
        latMin: null  
    },

    /**
     * @cfg {Boolean} displayBBOXInLayerSwitcher.
     * Usato per determinare se il layer vettoriale deve apparire all'interno del LayerSwitcher OpenLayers.
     */
    displayBBOXInLayerSwitcher: false,

    /**
     * @property {Object} defaultStyle.
     * Configurazione del OpenLayer.Style predefinito usato come stile del BBOX su mappa.
     */
	defaultStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style di selezione usato come stile del BBOX su mappa.
     */
	selectStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

    /**
     * @property {Object} temporaryStyle.
     * Configurazione del OpenLayer.Style temporaneo usato come stile del BBOX su mappa.
     */
	temporaryStyle : {
		"pointRadius" : 6,
		"fillColor" : "#FF00FF",
		"strokeColor" : "#FF00FF",
		"label" : "Select",
		"graphicZIndex" : 2
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
     * @property {String} setAoiText.
     * Testo di etichetta per il pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiText: "ROI",
    
 	/**
     * @property {String} setAoiTooltip.
     * Testo per il tooltip del pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiTooltip: "Abilita il controllo Box per il disegno della ROI (BBOX) sulla mappa",
    
 	/**
     * @property {String} title.
     * Titolo del field set di contenimento.
     */
    title: "Regione di Interesse",

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloBBOXFieldset.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {       
        this.autoHeight = true;
        this.layout = {
            type: 'table',
            // The total column count must be specified here
            columns: 3
        },
		
        this.defaults = {
            // applied to each contained panel
            bodyStyle:'padding:5px;'
        };
		
        this.bodyCssClass = 'aoi-fields';
        
        // Define handlar box style
        Ext.util.CSS.createStyleSheet(".olHandlerBoxZoomBox_"+this.id+" {\n"
            +" border-width:" + 5 + "px; \n"
            +" border-style:solid; \n"
            +" border-color: " + "#66cccc" + ";"
            +" position: absolute; \n"
            +" background-color: " + "#66cccc" + "; \n"
            +" opacity: "+0.5+"; \n"
            +" font-size: 1px; \n"
            +" filter: alpha(opacity="+0.5 * 100+"); \n"
            +"}",
            "olHandlerBoxZoomBox_"+this.id);   
        
        var me = this;

        this.northField = Ext.create('Ext.form.NumberField', {
            fieldLabel: me.northLabel,
            labelAlign: "top",
            id: me.id+"_NorthBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: me.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.westField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.westLabel,
            labelAlign: "top",
            id: me.id+"_WestBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.eastField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.eastLabel,
            labelAlign: "top",
            id: me.id+"_EastBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
              
        this.southField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.southLabel,
            labelAlign: "top",
            id: me.id+"_SouthBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        if(this.spatialFilterOptions.lonMin && this.spatialFilterOptions.lonMax){
            this.southField.minValue=this.spatialFilterOptions.lonMin;
            this.southField.maxValue=this.spatialFilterOptions.lonMax;
            this.northField.minValue=this.spatialFilterOptions.lonMin;
            this.northField.maxValue=this.spatialFilterOptions.lonMax;
        }
        
        if(this.spatialFilterOptions.latMin && this.spatialFilterOptions.latMax){
            this.eastField.minValue=this.spatialFilterOptions.latMin;
            this.eastField.maxValue=this.spatialFilterOptions.latMax;
            this.westField.minValue=this.spatialFilterOptions.latMin;
            this.westField.maxValue=this.spatialFilterOptions.latMax;
        }
        
        this.bboxButton = Ext.create('Ext.Button', {
            text: this.setAoiText,
            tooltip: this.setAoiTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            iconCls: 'aoi-button',
            height: 50,
            width: 50,
            listeners: {
                scope: this, 
                toggle: function(button, pressed) {
                    if(pressed){      
                        //
                        // Activating the new control
                        //   
                        this.selectBBOX.activate();
                    }else{
                        this.selectBBOX.deactivate();
                    }
                }
            }
        }); 
                     
        this.items = [{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            colspan: 3,
            items: [this.northField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            items: [this.westField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            border: false,
            items: [this.bboxButton]                
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            items: [this.eastField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            colspan: 3,
            items: [this.southField]
        }];
            
        this.listeners = {
           "afterlayout": function(){
				if(this.ownerCt.qbEventManager){
					this.ownerCt.qbEventManager.fireEvent("afterboxlayout", {scope: me});
				}
            },
            beforecollapse : function(p) {
				if(this.ownerCt.qbEventManager){
					this.ownerCt.qbEventManager.fireEvent("removelayer", this.layerName);
				}
            }
          
        };

        this.callParent();
    },
    
	/**
     * Reimposta il pannello.
     * 
     */
    reset: function(){
		if(this.ownerCt.qbEventManager){
			this.ownerCt.qbEventManager.fireEvent("removebboxlayer", {scope: this});
		}
        this.northField.reset();
        this.southField.reset();
        this.eastField.reset();
        this.westField.reset(); 

		this.fireEvent('unselect', this);
    },

	/**
     * Controlla la validità dei valori inserito.
     * 
     * @return {Boolean} Restituisce true se valido e false se non lo è.
     */
    isValid: function(){
        return(this.westField.isValid() &&
            this.southField.isValid() && 
            this.eastField.isValid() && 
            this.northField.isValid());
    },
    
	/**
     * Controlla se i campi della form sono sttai modificati.
     * 
     * @return {Boolean} Restituisce true se modificati e false altrimenti.
     */
    isDirty: function(){
        return(this.westField.isDirty() &&
            this.southField.isDirty() && 
            this.eastField.isDirty() && 
            this.northField.isDirty());
    },

	/**
     * Restituisce i BBOX selezionato nella proiezione configurata.
     * 
     * @return {OpenLayers.Bounds} Il Bounding Box selezionato.
     */
    getBBOXBounds: function(){
        return new OpenLayers.Bounds(
            this.westField.getValue(), 
            this.southField.getValue(), 
            this.eastField.getValue(), 
            this.northField.getValue()
        );
    }
    
});
