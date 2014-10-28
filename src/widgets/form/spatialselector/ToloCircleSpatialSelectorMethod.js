
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: ToloCircleSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on circle drawing
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloCircleSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod',

	alias: 'widget.tolomeo_spatial_circle_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],
  
    /** api: config[metricUnit]
	 *  ``Object``
	 *  The metric unit to display summary
	 */
    metricUnit :"km",
  
    /** api: config[displayProjection]
	 *  ``Object``
	 *  The projection for coordinate display (if null, the native) default null
	 */
    displayProjection: null,
  
    /** api: config[CRSDecimalPrecision]
	 *  ``Object``
	 *  The decimal precision of lon lat
	 */
    CRSDecimalPrecision: 3,
    
	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Cerchio',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Cerchio',

	// obtain draw control
	getDrawControl: function(){
        var polyOptions = {sides: 100};
        
        return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.RegularPolygon,
            {
                handlerOptions: polyOptions
            }
        );
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloCircleSpatialSelectorMethod.superclass.reset.call(this);
		if(this.circleCentroidLayer){
			this.circleCentroidLayer.removeAllFeatures();
		}
    }

});
