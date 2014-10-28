
Ext.ns('TolomeoExt.widgets.grid');

/**
 * Griglia Ext dinamica per gestire la visualizzazione dei risultati 
 * di una ricerca sulla base del filtro composto.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.grid.ToloFeatureGrid', {
	
	extend: 'Ext.grid.GridPanel',
	
    alias: "widget.tolomeo_featuregrid",

	/**
     * @property {Object} schema
	 * Lo schema per la griglia.
     */
	 
	/**
     * @property {Ext.form.DateField.prototype.format} dateFormat
	 * Lo schema per la griglia.
     */
	 
	/**
     * @property {Ext.form.TimeField.prototype.format} timeFormat
	 * Lo schema per la griglia.
     */

	/**
     * @cfg {String} actionTooltip
     *
     */
	actionTooltip: "Zoom alla Feature",
    
	/**
     * Inizializza un nuovo TolomeoExt.widgets.grid.ToloFeatureGrid.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config){
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

	/**
     * Cancella ogni cosa creata prima di chiamare il distruttore della classe padre.
     * 
     */
    onDestroy: function() {
        TolomeoExt.widgets.grid.FeatureGrid.superclass.onDestroy.apply(this, arguments);
    },
    
	/**
     * Imposta lo store per questa griglia, riconfigurando il modello delle colonne.
     * @param {Ext.Data.Store} store Lo store da impostare.
	 * @param {Array} schema Schema opzionale per determinare i campi appropriati da mostrare per la griglia.
     */
    setStore: function(store, schema) {
        if (schema) {
            this.schema = schema;
        }
        
        if (store) {
            this.reconfigure(store, this.createColumnModel(store));
        }
    },

	/**
     * Restituisce la configurazione per il modello delle colonne.
     * @param {Ext.Data.Store} store Lo store corrente da usare.
	 * @return {Array} Il modello delle colonne
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
					var feature = row.data;
					if(feature){
						
						var geometry = OpenLayers.Geometry.fromWKT(feature.geometry);
						var bounds = geometry.getBounds();
						if(bounds){
							
							this.fireEvent("zoomtofeatureextent", {dataExtent: bounds});
// RESTORE THIS
//							grid.getSelectionModel().selectRow(rowIndex);					
						}
					}
				}
			}]
		}];
				
		var name, dbname, type, xtype, format, renderer;	
		
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
			}
		}
        
        return columns;
    },

	/**
     * Invocare questo metodo per creare il modello delle colonne per la griglia.
     * @param {Ext.Data.Store} store Lo store corrente su cui creare il modello.
	 * 
     */
    createColumnModel: function(store) {
    	 this.columns = this.getColumns(store);
    	 return this.columns;
    }
    
});
