
Ext.namespace('TolomeoExt.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: ToloBBOXSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on BBOX fieldset
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod', {
		
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_bbox_selector',
	
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
	 *  The projection for coordinate display (if null, the map one) default null
	 */
    displayProjection: null,
    
    /** api: property[infoEPSG]
     *  ``Boolean``
     *  Display information about current reference system
     */
    infoSRS: true,
  
    /** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'BBOX',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Bounding Box',

	/** api: config[spatialFilterOptions ]
	 *  ``Object``
	 * Default CRS limits if not selection has been made. Must be compliant with the map CRS.
	 */
	spatialFilterOptions : {
		lonMax : 20037508.34, //90,
		lonMin : -20037508.34, //-90,
		latMax : 20037508.34, //180,
		latMin : -20037508.34 //-180
	},

	/** api: config[northLabel]
	 * ``String``
	 * Text for Label North (i18n).
	 */
	northLabel : "North",

	/** api: config[westLabel]
	 * ``String``
	 * Text for Label West (i18n).
	 */
	westLabel : "West",

	/** api: config[eastLabel]
	 * ``String``
	 * Text for Label East (i18n).
	 */
	eastLabel : "East",

	/** api: config[southLabel]
	 * ``String``
	 * Text for Label South (i18n).
	 */
	southLabel : "South",

	/** api: config[setAoiTitle]
	 * ``String``
	 * Text for Bounding Box fieldset (i18n).
	 */
	setAoiTitle : "Bounding Box",

	/** api: config[setAoiText]
	 * ``String``
	 * Text for Bounding Box Draw button (i18n).
	 */
	setAoiText : "Draw Box",

	/** api: config[setAoiTooltip]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	setAoiTooltip : 'Enable the SetBox control to draw a ROI (Bounding Box) on the map',

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {   
    	var displayProjection = this.displayProjection;
		
    	// ///////////////////////////////////////////
		// Spatial AOI Selector FieldSet
		// ///////////////////////////////////////////
		var confbbox = {
            map: null, //this.target.mapPanel.map,
            outputSRS : this.displayProjection  || null, //this.target.mapPanel.map.projection,
            spatialFilterOptions: this.spatialFilterOptions,
            // checkboxToggle: false,
            ref: "spatialFieldset",
            id: this.id + "_bbox",
            infoSRS: this.infoSRS,
            defaultStyle: this.defaultStyle,
            selectStyle: this.selectStyle,
            temporaryStyle: this.temporaryStyle,
            // width: 300,
            anchor: "100%",
		    // start i18n
            title: this.setAoiTitle,
		    northLabel:this.northLabel,
		    westLabel:this.westLabel,
		    eastLabel:this.eastLabel,
		    southLabel:this.southLabel,
		    setAoiText: this.setAoiText,
		    setAoiTooltip: this.setAoiTooltip,
		    waitEPSGMsg: "Please Wait..."//,
//		    listeners : {
//		    	"onChangeAOI" : function(bounds) {
//		            var geom = bounds.toGeometry();
//		            if(displayProjection){
//		              geom = bounds.toGeometry().transform(new OpenLayers.Projection(displayProjection),this.target.mapPanel.map.projection);
//		              this.setCurrentGeometry(geom);
//		            }else{
//		              this.setCurrentGeometry(geom);
//		            }
//		    	},
//		    	scope: this
//		    }
        };

    	this.output = Ext.create('TolomeoExt.widgets.form.ToloBBOXFieldset', confbbox);

    	this.items = [this.output];

    	//TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.initComponent.call(this);
    	this.callParent();
    },

	// trigger action when activate the plugin
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
		}
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
//    		this.output.removeBBOXLayer();
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("removelayer", this.output.layerName);
			}
			this.output.disable();
		}
	},

    // Reset method
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.reset.call(this);
//    	this.output.removeBBOXLayer();
    	
		if(this.qbEventManager){
			this.qbEventManager.fireEvent("removelayer", this.output.layerName);
		}
    	this.output.reset();
    },

//  Not Restore this
//	/** api: method[getSummary]
//     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
//     *  Obtain selection summary
//	 */
//    getSummary: function(geometry){
//		var summary = TolomeoExt.widgets.form.spatialselector.ToloBBOXSpatialSelectorMethod.superclass.getSummary.call(this, geometry);
//		var metricUnit = this.metricUnit;
//
//		var perimeter = this.getLength(geometry, metricUnit);
//		if (perimeter) {
//			summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
//		}
//
//		return summary;
//    }
});
