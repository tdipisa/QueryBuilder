
Ext.ns("TolomeoExt.widgets.form");

/** api: constructor
 *  .. class:: ToloBBOXFieldset(config)
 *   
 *    BBOX fieldset
 */
Ext.define('TolomeoExt.widgets.form.ToloBBOXFieldset', {
	
	extend: 'Ext.form.FieldSet',
	
    alias: "widget.tolomeo_bboxfieldset",
 
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "bboxFieldSet",
  
    /** api: property[map]
     *  ``Object``
     *  
     */
    map: "BBOX",

    /** api: property[layerName]
     *  ``String``
     *  
     */
    layerName: "BBOX",

    /**
     * Property: decimalPrecision
     * {int} precision of the BBOX textFields   
     */
    decimalPrecision:5,
    
    /**
     * Property: outputSRS
     * {String} EPSG code of the BBOX
     *     
     */
    outputSRS: 'EPSG:4326',

    /** api: property[infoEPSGURL]
     *  ``String``
     *  
     */
    infoEPSGURL: null,
    
    /** api: property[epsgWinWidth]
     *  ``String``
     *  
     */
    epsgWinWidth: null,

    /** api: property[epsgWinHeight]
     *  ``String``
     *  
     */
    epsgWinHeight: null,

    /** api: config[spatialFilterOptions]
     *  ``Object``
     *  
     */
    spatialFilterOptions: {
        lonMax: null,   
        lonMin: null,
        latMax: null,   
        latMin: null  
    },

    /** api: config[displayBBOXInLayerSwitcher]
     *  ``Boolean``
     *  
     */
    displayBBOXInLayerSwitcher: false,

    /** api: config[defaultStyle]
	 *  ``Object``
	 */
	defaultStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

	/** api: config[temporaryStyle]
	 *  ``Object``
	 */
	temporaryStyle : {
		"pointRadius" : 6,
		"fillColor" : "#FF00FF",
		"strokeColor" : "#FF00FF",
		"label" : "Select",
		"graphicZIndex" : 2
	},

    // start i18n
    northLabel:"Nord",
    westLabel:"Ovest",
    eastLabel:"Est",
    southLabel:"Sud",
    setAoiText: "ROI",
    waitEPSGMsg: "Si prega di attendere...",
    setAoiTooltip: "Abilita il controllo Box per il disegno della ROI (BBOX) sulla mappa",
    title: "Regione di Interesse",
    // end i18n

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {       
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
    
    /** public: method[reset]	 
     *    reset BBOX Panel
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

    /** public: method[isValid]
     *  
     *     
     */
    isValid: function(){
        return(this.westField.isValid() &&
            this.southField.isValid() && 
            this.eastField.isValid() && 
            this.northField.isValid());
    },
    
    /** public: method[isDirty]
     *  
     *     
     */
    isDirty: function(){
        return(this.westField.isDirty() &&
            this.southField.isDirty() && 
            this.eastField.isDirty() && 
            this.northField.isDirty());
    },

    /** public: method[getBBOXBounds]
     *  
     *  return the selected BBOX bounds defined with the Panel Projection   
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
