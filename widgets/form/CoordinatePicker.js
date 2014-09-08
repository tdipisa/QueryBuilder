
Ext.ns('TolomeoExt.widgets.form');

Ext.define('TolomeoExt.widgets.form.CoordinatePicker', {
	
	extend: 'Ext.form.FieldContainer',

    alias: 'tolomeo_coordinate_picker',
	
    /** i18n */
    fieldLabel:'Coordinates',
	
    pointSelectionButtionTip:'Click to enable point selection',
	
     /**
     * Property: latitudeEmptyText
     * {string} emptyText of the latitude field
     */
     latitudeEmptyText:'Latitude',
	 
    /**
     * Property: longitudeEmptyText
     * {string} emptyText of the longitude field
     */
     longitudeEmptyText:'Longitude',
	 
    /** end of i18n */
    
    /**
     * Property: outputSRS
     * {String} EPSG code of the export SRS
     *     
     */
    outputSRS: 'EPSG:4326',
    /**
     * Property: buttonIconCls
     * {String} Icon of the selection Button
     *     
     */
    buttonIconCls:'gx-cursor',
    /**
     * Property: selectStyle
     * {Object} Configuration of OpenLayer.Style. 
     *    used to highlight the clicked point
     *     
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
     * Private 
     * Property: defaultSelectStyle
     * {Object} Configuration of OpenLayer.Style.
     * used to fill "selectStyle" missing fields
     *     
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
     * Property: decimalPrecision
     * {int} precision of the textFields   
     */
    decimalPrecision:10,
    /**
     * Property: selectLayerName
     * {string} name of the layer to highlight the clicked point   
     */
    selectLayerName: "select_marker_position_layer",
    /**
     * Property: displayInLayerSwitcher
     * {boolean} display the selection layer in layer switcher   
     */
    displayInLayerSwitcher: false,
    
    initComponent:function(){
        this.layout = {
            type: 'hbox'
        };
        
        this.defaults = {
            // applied to each contained panel
            bodyStyle:'padding:5px;'
        };
        
        map = this.map;
		
        var compositeField = this;
		
		Ext.applyIf(this.selectStyle, this.defaultSelectStyle);
		
        //create the click control
        var ClickControl = OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Click(
                    compositeField, {
                        'click': this.trigger
                    }, this.handlerOptions
                );
            }, 
            trigger: this.clickHandler,
            map:map
        });       
        
        this.selectLonLat = new ClickControl();
        // TODO: restore this : map.addControl(this.selectLonLat);
         
        this.items= [
				{
                    xtype     : 'numberfield',
                    emptyText : this.longitudeEmptyText,
                    ref:'longitudeField',
                    decimalPrecision:this.decimalPrecision,
                    flex      : 1,
                    allowBlank:false,
                    name: 'lon',
					listeners: {
						scope:this,
						change: this.updatePoint
					}
                }, {
                    xtype: 'button',
					ref:'clickToggle',
                    tooltip: this.pointSelectionButtionTip,
                    iconCls:this.buttonIconCls,
                    enableToggle: true,
                    toggleGroup: this.toggleGroup,
                    width:20,
                    listeners: {
                      scope: this, 
                      toggle: function(button, pressed) {  
                         if(pressed){
                              this.selectLonLat.activate();
                              //this.updatePoint();                            
                          }else{
                              this.selectLonLat.deactivate();
                             
                              /*
							  var layer = map.getLayersByName(this.selectLayerName)[0];
                              if(layer){
                                  map.removeLayer(layer);
                              }
							  */
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
        
//        return  TolomeoExt.widgets.form.CoordinatePicker.superclass.initComponent.apply(this, arguments);
        this.callParent(arguments);
    },
	
	/** event handler for the ClickControl click event*/
    clickHandler: function(e){
        //get lon lat
        var map = this.map;
        var lonlat = map.getLonLatFromPixel(e.xy);
        //
        var geoJsonPoint = lonlat.clone();
        geoJsonPoint.transform(map.getProjectionObject(),new OpenLayers.Projection(this.outputSRS));
        this.latitudeField.setValue(geoJsonPoint.lat);
        this.longitudeField.setValue(geoJsonPoint.lon);
        //update point on the map
        this.updateMapPoint(lonlat);
		this.clickToggle.toggle();      
    },
	
	/** gets values from the fields and drow it on the map */
    updatePoint: function(){
        var lat = this.latitudeField.getValue();
		var lon = this.longitudeField.getValue();
		if( lon && lat ){
			//add point
			var lonlat = new OpenLayers.LonLat(lon,lat);
			lonlat.transform(new OpenLayers.Projection(this.outputSRS),map.getProjectionObject() );
			this.updateMapPoint(lonlat);
		}
    },
	
	/**
	 * Remove the point displayed in the map 
	 */
    resetMapPoint:function(){
		if(this.selectStyle){
			var layer = null; // map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
		}
		
        this.fireEvent("reset");
    },

    /**
     * Reset the fields and remove the point from the map
     */
    resetPoint:function(){
        this.resetMapPoint();
        
		//this.latitudeField.reset();
		this.query('numberfield[ref=latitudeField]')[0].reset();
        //this.longitudeField.reset();
        this.query('numberfield[ref=longitudeField]')[0].reset();
		
		this.fireEvent("reset");
	},
	
	toggleButton: function(toggle){
		//this.clickToggle.toggle(toggle);
		this.query('button[ref=clickToggle]')[0].toggle(toggle);
	},
	
	/** private point update */
    updateMapPoint:function(lonlat){
        if(this.selectStyle){
            this.resetMapPoint();
            var style = new OpenLayers.Style(this.selectStyle);
            this.layer = new OpenLayers.Layer.Vector(this.selectLayerName,{
                styleMap: style                
            });
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            var pointFeature = new OpenLayers.Feature.Vector(point);
            this.layer.addFeatures([pointFeature]);
            this.layer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            map.addLayer(this.layer);  

			this.fireEvent("update");
        }    
    },
	 
	getCoordinate: function(){
		return [this.longitudeField.getValue(), this.latitudeField.getValue()];
	}
});
