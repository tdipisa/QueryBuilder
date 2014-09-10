
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
	name  : 'Circle',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Circle',

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
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){
		var summary = "", metricUnit = this.metricUnit;

		var area = this.getArea(geometry, metricUnit);
		if (area) {
			summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
		}

		var radius = Math.sqrt(area / Math.PI);
		if (radius) {
			summary += this.radiusLabel + ": " + radius + " " + metricUnit + '<br />';
		}

		// //////////////////////////////////////////////////////////
		// Draw also the circle center as a part of summary report
		// //////////////////////////////////////////////////////////
		var circleSelectionCentroid = geometry.getCentroid();

		if (circleSelectionCentroid) {
			var lon = circleSelectionCentroid.x;
			var lat = circleSelectionCentroid.y;
		    var xField,yField;
		    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
		      
		    if(this.displayProjection){
		        var dProj = new OpenLayers.Projection(this.displayProjection);
		        var point = new OpenLayers.Geometry.Point(lon,lat).transform(this.target.mapPanel.map.projection,dProj);
		        lon = point.x;
		        lat = point.y;
		        xField = "Lon"; //TODO distinguish if projected or not
		        yField= "Lat";
		        
		    }else{
		        xField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lon" : "X";
		        yField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lat" : "Y";
		    }
		    
		    summary += this.centroidLabel + ": " + lon.toFixed(this.CRSDecimalPrecision) + " ("+xField+") " + lat.toFixed(this.CRSDecimalPrecision) + " ("+yField+")" + '<br />';
		}

		var options = {};
		var centroidStyle = {
			pointRadius : 4,
			graphicName : "cross",
			fillColor : "#FFFFFF",
			strokeColor : "#FF0000",
			fillOpacity : 0.5,
			strokeWidth : 2
		};

		if (centroidStyle) {
			var style = new OpenLayers.Style(centroidStyle);
			var options = {
				styleMap : style,
				displayInLayerSwitcher: false
			};
		}

		var circleCentroidLayer = null;
		if(!this.circleCentroidLayer){
			circleCentroidLayer = new OpenLayers.Layer.Vector("bboxqf-circleCentroid", options);
			this.circleCentroidLayer = circleCentroidLayer;
			this.target.mapPanel.map.addLayer(circleCentroidLayer);
		}else{
			circleCentroidLayer = this.circleCentroidLayer;
			this.circleCentroidLayer.removeAllFeatures();
		}

		var pointFeature = new OpenLayers.Feature.Vector(circleSelectionCentroid);
		circleCentroidLayer.addFeatures([pointFeature]);

		circleCentroidLayer.displayInLayerSwitcher = false;

		return summary;
    }
});
