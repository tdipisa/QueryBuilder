/**
 * @include widgets/form/spatialselector/SpatialSelectorMethod.js
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: PolygonSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on simple polygon
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.PolygonSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.SpatialSelectorMethod',
	
	alias: 'widget.tolomeo_spatial_polygon_selector',

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
		TolomeoExt.widgets.form.spatialselector.PolygonSpatialSelectorMethod.superclass.activate.call(this);

		/**
		 * Create Polygon Selector
		 */
        this.drawings = new OpenLayers.Layer.Vector({},
			{
				displayInLayerSwitcher:false,
				styleMap : new OpenLayers.StyleMap({
					"default" : this.defaultStyle,
					"select" : this.selectStyle,
					"temporary" : this.temporaryStyle
				})
			}
		);

        this.drawings.events.on({
            "featureadded": function(event) {
				this.setCurrentGeometry(event.feature.geometry);
            },                                
            "beforefeatureadded": function(event) {
                this.drawings.destroyFeatures();
            },
            scope:this
        });                                 
    
    	// TODO: restore this
        //this.target.mapPanel.map.addLayer(this.drawings);
        
        this.draw = this.getDrawControl();
        
		// disable pan while drawing
		// TODO: make it configurable
		this.draw.handler.stopDown = true;
		this.draw.handler.stopUp = true;

        // TODO: restore this
		//this.target.mapPanel.map.addControl(this.draw);
		
		// TODO: restore this
        //this.draw.activate();
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
		TolomeoExt.widgets.form.spatialselector.PolygonSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.draw){
			this.draw.deactivate();	
		}
		if (this.drawings) {
			// TODO: restore this
			//this.target.mapPanel.map.removeLayer(this.drawings);
			this.drawings = null;
		}
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.PolygonSpatialSelectorMethod.superclass.reset.call(this);
		if(this.drawings){
			this.drawings.removeAllFeatures();
		}
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){
		var summary = TolomeoExt.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.getSummary.call(this, geometry);
		var metricUnit = "km";

		var perimeter = this.getLength(geometry, metricUnit);
		if (perimeter) {
			summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
		}

		return summary;
    }
});
