
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
	name  : 'Poligono',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Poligono',

	// trigger action when activate the plugin
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.activate.call(this);

		if(this.qbEventManager){
			this.qbEventManager.fireEvent("polygonSpatialSelectorActive", this);
		}
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
    }
	
});
