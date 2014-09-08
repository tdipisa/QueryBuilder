/** api: (define)
 *  module = TolomeoExt.form
 *  class = BufferFieldset
 */
Ext.ns('TolomeoExt.widgets.form');

/** api: constructor
 *  .. class:: BufferFieldset(config)
 *   
 *    Buffer fieldset
 */
Ext.define('TolomeoExt.widgets.form.BufferFieldset', {
	
	extend: 'Ext.form.FieldSet',
	
    alias: "widget.tolomeo_bufferfieldset",
    
    /** api: config[id]
     *  ``String``
     */
    id: "bufferFieldSet",
	
	/**
     * Property: buttonIconCls
     * {String} Icon of the selection Button
     *     
     */
    buttonIconCls:'gx-buffer',
	
	/** api: config[bufferFieldLabel]
     * ``String``
     * Text for buffer number field label.
     */ 	 
	bufferFieldLabel: "Buffer Range",
	
	/** api: config[bufferFieldSetTitle]
     * ``String``
     * Text for buffer field set title.
     */ 
	bufferFieldSetTitle: "Buffer",

	/** api: config[coordinatePickerLabel]
     * ``String``
     * Text for coordinate picker label.
     */ 
	coordinatePickerLabel: "Coordinates",
	
    /** api: config[draweBufferTooltip]
     * ``String``
     * Text for draw buffer button tooltip.
     */ 
	draweBufferTooltip: "Draw the Buffer",
	
    /** api: config[errorBufferText]
     * ``String``
     * Text for buffer error text.
     */ 
	map: null,
	
	/** api: config[outputSRS]
     * ``String``
     * coordinates output SRS.
     */ 
	outputSRS: "EPSG:4326",
	
	/** api: config[selectLayerName]
     * ``String``
     * Text for buffer layer.
     */ 
	selectLayerName: "buffer-layer",
	
    /** api: config[displayInLayerSwitcher]
     * ``String``
     */ 
	displayInLayerSwitcher: false,
	
	/** api: config[selectStyle]
     * ``String``
     * Default Style.
     */ 
	selectStyle: {
		strokeColor: "#FF0000",
		handlerFillColor: "#FFFFFF",
		fillColor: "#FFFFFF",
		fillOpacity: 0,
		strokeWidth: 2
	},
	
	/** api: config[minValue]
     * ``String``
     * Min buffer range.
     */ 
	minValue: 1,

	/** api: config[maxValue]
     * ``String``
     * Max buffer range.
     */ 
	maxValue: 1000,
	
   /** api: config[decimalPrecision]
     * ``String``
     * Default decimal precision for the buffer number.
     */ 
	decimalPrecision: 0,
	
	geodesic: true,
	
    /** 
	 * private: method[initComponent]
     */
    initComponent: function() {
		this.coordinatePicker = Ext.create('TolomeoExt.widgets.form.CoordinatePicker', {
			map: this.map,
			fieldLabel: this.coordinatePickerLabel,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText,
			outputSRS: this.outputSRS,
			//selectStyle: this.selectStyle,
			toggleGroup: this.toggleGroup,
			ref: "coordinatePicker",
			listeners: {
				scope: this,
				update: function(){
				    var cv = this.coordinatePicker.isValid();
				    var bv = this.bufferField.isValid();
					if(cv && bv ){                                 
                        var coords = this.coordinatePicker.getCoordinate();
                        var lonlat = new OpenLayers.LonLat(coords[0], coords[1]);
                        var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                        
                        var regularPolygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
                            point,
                            this.bufferField.getValue(),
                            100, 
                            null
                        );
                        
                        this.drawBuffer(regularPolygon);
                    }
				}
			}			
		});
		
		this.bufferField = Ext.create('Ext.form.NumberField', {
			name: 'buffer',
			ref: 'bufferField',
			fieldLabel: this.bufferFieldLabel + " (TODO"+/*this.map.units+*/")",
			allowBlank: false,
			disabled: false,
			width: 195,
			flex: 1,
			minValue: this.minValue,
            maxValue: this.maxValue,
			enableKeyEvents: true,
		    decimalPrecision: this.decimalPrecision,
			allowDecimals: true,
			hideLabel : false,
			validationDelay: 1500
		});
		
		this.bufferField.addListener("keyup", function(){        
			if(this.coordinatePicker.isValid() && this.bufferField.isValid()){						
				var coords = this.coordinatePicker.getCoordinate();
				var lonlat = new OpenLayers.LonLat(coords[0], coords[1]);
				var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
				
				var polygon;
				if(this.geodesic){
					polygon = OpenLayers.Geometry.Polygon.createGeodesicPolygon(
						point,
						this.bufferField.getValue(),
						100, 
						0,
						this.map.getProjectionObject()
					);
				}else{
					polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
						point,
						this.bufferField.getValue(),
						100, 
						0
					);
				}
				
				this.drawBuffer(polygon);
			}else{
				this.resetBuffer();
			}
		}, this, {delay: 1500});
		
		this.items = [
			this.coordinatePicker,
			this.bufferField
		];
        
		this.title = this.bufferFieldSetTitle;
		
		//TolomeoExt.widgets.form.BufferFieldset.superclass.initComponent.call(this);
		this.callParent();
    },
	
    drawBuffer: function(regularPolygon){
        if(this.selectStyle){
            this.resetBuffer();
            var style = new OpenLayers.Style(this.selectStyle);
            
			this.bufferLayer = new OpenLayers.Layer.Vector(this.selectLayerName,{
                styleMap: style                
            });

            var bufferFeature = new OpenLayers.Feature.Vector(regularPolygon);
            this.bufferLayer.addFeatures([bufferFeature]);
			
            this.bufferLayer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            this.map.addLayer(this.bufferLayer);  
			
			this.fireEvent('bufferadded', this, bufferFeature);
        }    
    },
	
	resetBuffer: function(){
		if(this.selectStyle){
			var layer = null; //map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
			
			this.fireEvent('bufferremoved', this);
		}
	},
	
	isValid: function(){
		return(this.coordinatePicker.isValid() &&
			this.bufferField.isValid());
	},
	
	resetPointSelection: function(){
		this.coordinatePicker.resetPoint();
        this.bufferField.reset();
		this.resetBuffer();
	}
});
