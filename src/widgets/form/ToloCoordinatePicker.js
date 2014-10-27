
Ext.ns('TolomeoExt.widgets.form');

Ext.define('TolomeoExt.widgets.form.ToloCoordinatePicker', {
	
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
        
		
        var compositeField = this;
		
		Ext.applyIf(this.selectStyle, this.defaultSelectStyle);
		
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
    
    isValid: function(){
    	if(this.latitudeField.isValid() &&
    	    	this.longitudeField.isValid()){
    		return true;
    	}else{
    		return false;
    	}
    },
	
	
	/** gets values from the fields and drow it on the map */
    updatePoint: function(){
        var lat = this.latitudeField.getValue();
		var lon = this.longitudeField.getValue();
		if( lon && lat ){
			//add point
			var lonlat = new OpenLayers.LonLat(lon,lat);
			lonlat.transform(new OpenLayers.Projection(this.outputSRS), this.projectionObject /*map.getProjectionObject()*/);
			this.updateMapPoint(lonlat);
		}
    },
	
	/**
	 * Remove the point displayed in the map 
	 */
    resetMapPoint:function(){
    	this.fireEvent("reset", this.selectLayerName);
    },

    /**
     * Reset the fields and remove the point from the map
     */
    resetPoint:function(){
		this.latitudeField.reset();
        this.longitudeField.reset();
		
        this.resetMapPoint();
	},
	
	toggleButton: function(toggle){
		this.clickToggle.toggle(toggle);
	},
	
	/** private point update */
    updateMapPoint:function(lonlat){
        if(this.selectStyle){
        	this.resetMapPoint();
        	this.fireEvent("update", lonlat, this);
        	this.fireEvent("updatebuffer", lonlat, this);
        }    
    },
	 
	getCoordinate: function(){
		return [this.longitudeField.getValue(), this.latitudeField.getValue()];
	}
});
