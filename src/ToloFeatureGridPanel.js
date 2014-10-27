Ext.ns("TolomeoExt.widgets");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */   
Ext.define('TolomeoExt.ToloFeatureGridPanel', {

	extend: 'Ext.Panel',

	/** api: ptype = tolomeo_featurecomponent */
	alias: "widget.tolomeo_featurecomponent",
	
	id: "tolomeo_featuregrid",

	/** 
	 * Property: paramsJS
	 * {JSONObject}
	 */
	paramsJS: null,

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,

	/** 
	 * private: property[schema]
	 * {JSONObject}
	 */
	schema: null,

	qbFeatureManager: null,

	/** api: method[addOutput]
	 */
	initComponent: function(config) {
		
		if(!this.featureLayer){
			this.featureLayer = new OpenLayers.Layer.Vector("gridFeatureLayer", {
				displayInLayerSwitcher: false
			});
		}
		
		if(!this.qbEventManager){
			this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		}
		
		this.qbFeatureManager.setProxy();
		this.qbFeatureManager.setFeatureStore(Ext.create('Ext.data.JsonStore', {
			fields: [],
			pageSize: this.qbFeatureManager.maxFeatures,
			proxy: this.qbFeatureManager.getProxy()
		}));
		
		var exportMenu = Ext.create('Ext.button.Split', {
            tooltip: 'Esporta Dati',
            iconCls: "pageexport",
            menu : {
                items: [{
                    text: 'Esporta SHP',
                    menu: {
                        showSeparator: false,
                        items: [{
							text: "Tutte le pagine",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "shp", items: "all"});
							}, 
							scope: this
						}, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "shp", items: "single"});
							}, 
							scope: this
						}]
                    }
                }, {
                    text: 'Esporta Spatialite',
                    menu: {
                      showSeparator: false,
                      items: [{
							text: "Tutte le pagine",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "spatialite", items: "all"});
							}, 
							scope: this
					   }, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "spatialite", items: "single"});
							}, 
							scope: this
					   }]
                    }
                }, {
                    text: 'Esporta CSV',
                    menu: {
                      showSeparator: false,
                      items: [{
							text: "Tutte le pagine",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "csv", items: "all"});
							}, 
							scope: this
					   }, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "csv", items: "single"});
							}, 
							scope: this
					   }]
                    }
                }]
            }
		});
        
		config = Ext.apply({
			xtype: "tolomeo_featuregrid",
			autoScroll: true,
			header: {
				hidden: true
			},
			height: 250,
			border: false,
			title: this.title,
			store: this.qbFeatureManager.featureStore,
			colums: [],
		    dockedItems: [{
		        xtype: 'pagingtoolbar',
		        store: this.qbFeatureManager.featureStore,   // same store GridPanel is using
		        dock: 'bottom',
		        displayInfo: true,
		        disabled: true,
		        items: [
					{
						tooltip: "Visualizza su Mappa",
						name: "viewOnMapButton",
						enableToggle: true,
						iconCls: "pageviewonmap",
						handler: function(button){
							this.updateLayerOnMap(this.qbFeatureManager.featureStore, button.pressed);
						},
						scope: this
					},
					{
						tooltip: "Zoom alla Pagina",
						name: "zoomOnPageButton",
					    iconCls: "pagezoomonmap",
						handler: function(){
							this.qbEventManager.fireEvent("zoomtomapextent", {dataExtent: this.pageBBOx});
						}, 
						scope: this
					}, "-", exportMenu
		        ]
		    }],
		    listeners:{
		    	scope: this,
		    	zoomtofeatureextent: function(evt){
		    		this.qbEventManager.fireEvent("zoomtomapextent", evt);
		    	}
		    }
		}, config || {});

		this.items = [config];
		this.callParent();
		
		this.on("afterrender", function(){
			this.waitMask = new Ext.LoadMask(this.id, {msg: "Ricerca in corso..."});
		}, this);

		// /////////////////////////////////////
		// FeatureManager events's listeners
		// /////////////////////////////////////
		this.qbFeatureManager.on({
			scope: this,
			layerchange: function(results){
				this.ownerCt.expand();
				
				var featureGrid = this.query("tolomeo_featuregrid")[0];
				featureGrid.setStore(featureGrid.store, results);
			},
			loadfeatures: function(results, store){
				this.waitMask.hide();
				this.ownerCt.expand();
			},
			loadfeaturesfailure: function(){
				this.waitMask.hide();
			},
			resetfeaturelayer: function(){
				this.updateLayerOnMap(null, false);
				
				//
        		// Disable the paging toolbar
        		//
        		this.query("pagingtoolbar")[0].disable();
        		
        		// Collapse the Grid
        		this.ownerCt.collapse();
			}
		});
		
    	this.qbFeatureManager.featureStore.on("beforeload", function(store, operation, eOpts){
    		if(operation){
    			this.qbFeatureManager.maxFeatures = operation.limit;
    			this.qbFeatureManager.startIndex = operation.start;
    		}
    	}, this);
    	
    	this.qbFeatureManager.featureStore.on("load", function(store, records, successful, eOpts){
    		if(records.length > 0){
        		var proxy = store.getProxy();
        		var reader = proxy.getReader();
        		var metadata = reader.metaData;
        		
        		this.pageBBOx = OpenLayers.Geometry.fromWKT(metadata.pageBBOX).getBounds();
        		
        		//
        		// Enable the paging toolbar
        		//
        		this.query("pagingtoolbar")[0].enable();
        		
        		//
        		// Check if the vector layers on map should be updated
        		//
        		var button = this.query("[name=viewOnMapButton]")[0];
        		if(button.pressed){
        			this.updateLayerOnMap(store, button.pressed);
        		}
    		}else{
                Ext.Msg.show({
                    title: "Informazioni sul Risultato",
                    msg: "La ricerca non ha prodotto risultati.",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
    		}
    	}, this);
	},
	
	updateLayerOnMap: function(store, pressed){
		if(pressed){
			var store = this.qbFeatureManager.featureStore;
			var count = store.getCount(); // the elements inside the current page
			var records = store.getRange(0, count-1);
			
			// Create the OL features vector
			var features = [];
			for(var i=0; i<records.length; i++){
				var record = records[i];
				
				var attributes = {};
				for(key in record.data){
					if(key != "geometry"){
						attributes[key] = record.data[key];
					}
				}
				
				var geometry = OpenLayers.Geometry.fromWKT(record.data.geometry);
				var feature = new OpenLayers.Feature.Vector(geometry, attributes, null);
				features.push(feature);						
			}
			
			this.featureLayer.removeAllFeatures();
			this.featureLayer.addFeatures(features);
			this.qbEventManager.fireEvent("addlayer", this.featureLayer);
		}else{
			this.qbEventManager.fireEvent("removelayer", this.featureLayer);
		}
	}

});

