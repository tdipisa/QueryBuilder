
Ext.ns('TolomeoExt.widgets.grid');

/** api: constructor
 *  .. class:: ToloFeatureGrid(config)
 *
 *      Create a new grid displaying the contents.
 */
Ext.define('TolomeoExt.widgets.grid.ToloFeatureGrid', {
	
	extend: 'Ext.grid.GridPanel',
	
    alias: "widget.tolomeo_featuregrid",

//    /** api: config[ignoreFields]
//     *  ``Array`` of field names from the store's records that should not be
//     *  displayed in the grid.
//     */
//    ignoreFields: null,
    
//    /** api: config[layer]
//     *  ``OpenLayers.Layer.Vector``
//     *  The vector layer that will be synchronized with the layer store.
//     *  If the ``map`` config property is provided, this value will be ignored.
//     */
    
    /** api: config[schema]
     *  ``GeoExt.data.AttributeStore``
     *  Optional schema for the grid. If provided, appropriate field
     *  renderers (e.g. for date or boolean fields) will be used.
     */

    /** api: config[dateFormat]
     *  ``String`` Date format. Default is the value of
     *  ``Ext.form.DateField.prototype.format``.
     */

    /** api: config[timeFormat]
     *  ``String`` Time format. Default is the value of
     *  ``Ext.form.TimeField.prototype.format``.
     */

//    /** private: property[layer]
//     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
//     *  store
//     */
//    layer: null,
	
	actionTooltip: "Zoom To Feature",
    
    /** api: method[initComponent]
     *  Initializes the FeatureGrid.
     */
    initComponent: function(){
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }
        
        if(this.store) {
            this.cm = this.createColumnModel(this.store);
        }
        
        this.callParent();
    },
    
    /** private: method[onDestroy]
     *  Clean up anything created here before calling super onDestroy.
     */
    onDestroy: function() {
        TolomeoExt.widgets.grid.FeatureGrid.superclass.onDestroy.apply(this, arguments);
    },
    
    /** api: method[setStore]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :arg schema: ``GeoExt.data.AttributeStore`` Optional schema to
     *      determine appropriate field renderers for the grid.
     *  
     *  Sets the store for this grid, reconfiguring the column model
     */
    setStore: function(store, schema) {
        if (schema) {
            this.schema = schema;
        }
        
        if (store) {
            this.reconfigure(store, this.createColumnModel(store));
        }
    },

    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store) {
//        function getRenderer(format) {
//            return function(value) {
//                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
//                // is resolved, change the 5 lines below to
//                // return value.format(format);
//                var date = value;
//                if (typeof value == "string") {
//                	date = Date.parseDate(value.replace(/Z$/, ""), "c");
//                }
//                return date = date ? date.format(format) : value;
//            };
//        }
		
        var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data.feature;
					if(feature){
						var bounds = feature.geometry.getBounds();
						if(bounds){
							this.map.zoomToExtent(bounds);
							
							var showButton = Ext.getCmp("showButton");
							if(!showButton.pressed){
								showButton.toggle(true);								
							}
							
							grid.getSelectionModel().selectRow(rowIndex);					
						}
					}
				}
			}]
		}];
				
		var name, type, xtype, format, renderer;	
		
		if(this.schema){			
			var fields = this.store.model.prototype.fields;
			
			for(var i=0; i<this.schema.length; i++){
				var item = this.schema[i];
				
	            if (item) {
	                name = item.get("name");
	                dbname = item.get("dbname");
	                type = item.get("type");
	                format = null;
	                switch (type) {
	                    case "java.util.Date":
	                        format = this.dateFormat;
	                    case "java.util.Calendar":
	                        format = format ? format : this.dateFormat + " " + this.timeFormat;
	                        xtype = undefined;
	                        renderer = Ext.util.Format.dateRenderer(format) //getRenderer(format);
	                        break;
	                    case "java.lang.Boolean":
	                        xtype = "booleancolumn";
	                        break;
	                    case "java.lang.String":
	                        xtype = "gridcolumn";
	                        break;
	                    default:
	                        xtype = "numbercolumn";
	                }
	            } 
                columns.push({
                    dataIndex: dbname,
                    header: name,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer
                });
                
                fields.add(Ext.create("Ext.data.Field", {
	   		    	name: dbname,
	   		    	mapping: dbname
				}));
			}
		}
        
        return columns;
    },
    
    /** private: method[createColumnModel]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Ext.grid.ColumnModel``
     */
    createColumnModel: function(store) {
    	 this.columns = this.getColumns(store);
    	 return this.columns;
    }
    
});
