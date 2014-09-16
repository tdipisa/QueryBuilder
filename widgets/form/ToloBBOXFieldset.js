
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

//    /** api: property[infoEPSG]
//     *  ``Boolean``
//     *  
//     */
//    infoSRS: true,
    
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
    northLabel:"North",
    westLabel:"West",
    eastLabel:"East",
    southLabel:"South",
    setAoiText: "SetROI",
    waitEPSGMsg: "Please Wait...",
    setAoiTooltip: "Enable the SetBox control to draw a ROI (BBOX) on the map",
    title: "Region of Interest",
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

//        this.bboxProjection = this.outputSRS ? new OpenLayers.Projection(this.outputSRS) : null;
       
        this.northField = Ext.create('Ext.form.NumberField', {
            fieldLabel: me.northLabel,
            labelAlign: "top",
            id: me.id+"_NorthBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: me.decimalPrecision,
            allowDecimals: true,
            //colspan: 3,
            //cellCls: 'spatial-cell',
            hideLabel : false                    
        });
        
        this.westField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.westLabel,
            labelAlign: "top",
            id: me.id+"_WestBBOX",
            width: 100,
            allowBlank: false,
          /*  minValue: this.spatialFilterOptions.latMin,
            maxValue: this.spatialFilterOptions.latMax,*/
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            //cellCls: 'spatial-cell',
            hideLabel : false                    
        });
        
        this.eastField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.eastLabel,
            labelAlign: "top",
            id: me.id+"_EastBBOX",
            width: 100,
            allowBlank: false,
            /*minValue: this.spatialFilterOptions.latMin,
            maxValue: this.spatialFilterOptions.latMax,*/
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            //cellCls: 'spatial-cell',
            hideLabel : false                    
        });
              
        this.southField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.southLabel,
            labelAlign: "top",
            id: me.id+"_SouthBBOX",
            width: 100,
            allowBlank: false,
            /*minValue: this.spatialFilterOptions.lonMin,
            maxValue: this.spatialFilterOptions.lonMax,*/
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            //colspan: 3,
            //cellCls: 'spatial-cell',
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
                        // Reset the previous control
                        //
                        //this.reset();

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
            //labelAlign: "top",
            cls: 'center-align',
            width: 100,
            border: false,
            colspan: 3,
            items: [this.northField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            //labelAlign: "top",
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
            //labelAlign: "top",
            width: 100,
            border: false,
            items: [this.eastField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            //labelAlign: "top",
            width: 100,
            border: false,
            colspan: 3,
            items: [this.southField]
        }];
            
//        if(this.infoSRS)   
//            this.title += " <a href='#' id='"+me.id+"_bboxAOI-set-EPSG'>[TODO"+/*this.bboxProjection.getCode()+*/"]</a>";
        
        this.listeners = {
           "afterlayout": function(){
				if(this.ownerCt.qbEventManager){
					/* var baseProj = me.map.getProjection();
					var projection = baseProj ? baseProj : me.map.projection; 				
	                me.mapProjection = new OpenLayers.Projection(projection);
	                me.selectBBOX = new OpenLayers.Control.SetBox({      
	                    map: me.map,       
	                    layerName: me.layerName,
	                    displayInLayerSwitcher: me.displayBBOXInLayerSwitcher,
	                    boxDivClassName: "olHandlerBoxZoomBox_"+me.id,
	                    aoiStyle: new OpenLayers.StyleMap({
							"default" : me.defaultStyle,
							"select": me.selectStyle,
							"temporary": me.temporaryStyle
						}),
	                    onChangeAOI: function(){
	                    	var bounds = new OpenLayers.Bounds.fromString(this.currentAOI);  
	                        me.setBBOX(bounds); 
	                        this.deactivate();
	                        me.bboxButton.toggle();
	                        
	                        me.fireEvent('onChangeAOI', bounds);
	                    } 
	                }); 
	        
	                me.map.addControl(me.selectBBOX);
	                me.map.enebaleMapEvent = true;*/
					
					this.ownerCt.qbEventManager.fireEvent("afterboxlayout", {scope: me});
				}
            },
            beforecollapse : function(p) {
//                me.removeBBOXLayer();
                
				if(this.ownerCt.qbEventManager){
					this.ownerCt.qbEventManager.fireEvent("removelayer", this.layerName);
				}
            }
          
        };

        //TolomeoExt.form.ToloBBOXFieldset.superclass.initComponent.call(this);
        this.callParent();
    },
    
    /** private: method[isDark]
     *  :arg hex: ``String`` A RGB hex color string (prefixed by '#').
     *  :returns: ``Boolean`` The color is dark.
     *  
     *  Determine if a color is dark by avaluating brightness according to the
     *  W3C suggested algorithm for calculating brightness of screen colors.
     *  http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
     */

// Not restore this
//    /** public: method[removeBBOXLayer]	 
//     *     remove the BBOX selection layer from the map
//     */
//    removeBBOXLayer: function(){
//        var bboxLayer = null; //this.map.getLayersByName(this.layerName)[0];
//      
//        if(bboxLayer){
//            this.map.removeLayer(bboxLayer);
//        }
//    },

    /** public: method[reset]	 
     *    reset BBOX Panel
     */
    reset: function(){
//        this.removeBBOXLayer();
		if(this.ownerCt.qbEventManager){
			this.ownerCt.qbEventManager.fireEvent("removebboxlayer", {scope: this});
		}
        this.northField.reset();
        this.southField.reset();
        this.eastField.reset();
        this.westField.reset(); 

		this.fireEvent('unselect', this);
    },
    
    /** public: method[setBBOX]
     *  :arg bounds: ``Object``
     *     change the current BBOX, to the given bounds, converting it to BBOX projection if needed
     */
//    setBBOX: function(bounds) {
//        var bboxBounds;
//
//        if(this.map.getProjection() != this.bboxProjection.getCode()){
//            bboxBounds = bounds.transform(this.map.getProjectionObject(),this.bboxProjection);
//        }else{
//            bboxBounds = bounds;
//        }
//      
//        this.northField.setValue(bboxBounds.top);
//        this.southField.setValue(bboxBounds.bottom);
//        this.westField.setValue(bboxBounds.left);
//        this.eastField.setValue(bboxBounds.right); 
//        
//        this.fireEvent('select', this, bboxBounds);
//
//    },

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

    /** public: method[getBBOXMapBounds]
     *  
     *   return the selected BBOX bounds defined with the Map Projection  
     */
//    getBBOXMapBounds: function(){
//        if(this.map.getProjection() != this.bboxProjection.getCode()){  
//            return this.getBBOXBounds().transform(this.bboxProjection,this.mapProjection);
//        }else{
//            return this.getBBOXBounds();
//        }
//    },
    
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
    },
    
    /** private: method[openEpsgWin]
     *    Opens a popup with current BBOX CRS description 
     */
//    openEPSGWin: function() {      
//        this.epsgWinHeight= this.epsgWinHeight ? this.epsgWinHeight : Ext.getBody().getHeight()*.7;
//        this.epsgWinWidth=  this.epsgWinWidth ? this.epsgWinWidth : Ext.getBody().getWidth()*.8;
//     
//        var me= this;
//        var win= Ext.create('Ext.Window', {
//            layout:'fit', 
//            id: me.id+'_epsg_info_win',
//            width:me.epsgWinWidth,
//            closeAction:'destroy',
//            html: '<div id="'+me.id+'_loaderIframe"><iframe id="'+me.id+'_epsgIframe" src="'+ me.getCRSURLFromCode() +'" width="99%" height="'+me.epsgWinHeight+'"></iframe></div>',
//            listeners: {
//                afterrender: function(el, eOpts) {
//                    var ml = new Ext.LoadMask(document.getElementById(me.id+'_loaderIframe'), 
//                    {
//                        msg: me.waitEPSGMsg,
//                        removeMask: true
//                    });
//                    ml.show();   
//                    function rml(){
//                        ml.hide();
//                    }
//                    var iframe = document.getElementById(me.id+'_epsgIframe');
//                    if (iframe.attachEvent) {
//                        iframe.attachEvent("onload", rml);
//                    } else if (iframe.addEventListener) {
//                        iframe.addEventListener("load", rml, false);
//                    } 
//                }   
//            }
//        }); 
//        win.show();
//    },
//     
//    /** private: method[getCRSURLFromCode]
//     *    Get CRS HTML page URL description
//     */
//    getCRSURLFromCode: function(){
//        var srsURL;
//        if( ! this.infoEPSGURL){
//            srsURL="http://spatialreference.org/ref/";
//            switch (this.bboxProjection.getCode()){
//            case "EPSG:900913":
//                srsURL+= "sr-org/7483/";
//                break;
//                
//            default:
//               srsURL+= "epsg/"+( +this.bboxProjection.getCode().split(":")[1]+"/"); 
//            }
//        }else
//         srsURL=this.infoEPSGURL;
//         
//       return srsURL;
//    }  
});
