
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: ToloPolygonSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on simple polygon
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',
	
	alias: 'widget.tolomeo_spatial_polygon_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Polygon',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Polygon',

	// trigger action when activate the plugin
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.activate.call(this);

		if(this.qbEventManager){
			this.qbEventManager.fireEvent("polygonSpatialSelectorActive", this);
		}
		
//		/**
//		 * Create Polygon Selector
//		 */
//        this.drawings = new OpenLayers.Layer.Vector({},
//			{
//				displayInLayerSwitcher:false,
//				styleMap : new OpenLayers.StyleMap({
//					"default" : this.defaultStyle,
//					"select" : this.selectStyle,
//					"temporary" : this.temporaryStyle
//				})
//			}
//		);
//
//        this.drawings.events.on({
//            "featureadded": function(event) {
//				this.setCurrentGeometry(event.feature.geometry);
//            },                                
//            "beforefeatureadded": function(event) {
//                this.drawings.destroyFeatures();
//            },
//            scope:this
//        });                                 
//    
//        //this.target.mapPanel.map.addLayer(this.drawings);
//        
//        this.draw = this.getDrawControl();
//        
//		// disable pan while drawing
//		this.draw.handler.stopDown = true;
//		this.draw.handler.stopUp = true;
//
//		//this.target.mapPanel.map.addControl(this.draw);
//		
//        //this.draw.activate();
	},

	// obtain draw control
	getDrawControl: function(){
		return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.Polygon
        );
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.draw){
			this.draw.deactivate();	
		}
		if (this.drawings) {
			//this.target.mapPanel.map.removeLayer(this.drawings);
			
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("removelayer", this.drawings);
			}
			
			this.drawings = null;
		}
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.reset.call(this);
		if(this.drawings){
			this.drawings.removeAllFeatures();
		}
    },

// Not restore this
//	/** api: method[getSummary]
//     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
//     *  Obtain selection summary
//	 */
//    getSummary: function(geometry){
//		var summary = TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.getSummary.call(this, geometry);
//		var metricUnit = "km";
//
//		var perimeter = this.getLength(geometry, metricUnit);
//		if (perimeter) {
//			summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
//		}
//
//		return summary;
//    }
});
