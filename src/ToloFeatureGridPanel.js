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
	
//	/** api: config[showTotalResults]
//	 *  ``Boolean`` If set to true, the total number of records will be shown
//	 *  in the bottom toolbar of the grid, if available.
//	 */
//	showTotalResults: false,
//
//	/** api: config[alwaysDisplayOnMap]
//	 *  ``Boolean`` If set to true, the features that are shown in the grid
//	 *  will always be displayed on the map, and there will be no "Display on
//	 *  map" button in the toolbar. Default is false. If set to true, no
//	 *  "Display on map" button will be shown.
//	 */
//	alwaysDisplayOnMap: false,
//
//	/** api: config[showExportCSV]
//	 *  ``Boolean`` If set to true, show CSV export bottons.
//	 *  Deprecated. Use exportFormats = ["CSV"]
//	 */
//	showExportCSV: false,
//
//	/** api: config[exportFormats]
//	 *  ``Array`` With the extra formats to download.
//	 *  For example: "CSV","shape-zip","excel", "excel2007"
//	 */
//	exportFormats: null,
//
//	/** api: config[exportFormatsConfig]
//	 *  ``Object`` With specific configuration by export format.
//	 *  Allowed configurations are: <ul>
//	 *     <li>`addGeometry`: to append the geometry to the `propertyName` url parameter</li>
//	 *     <li>`exportAll`: to not include `propertyName` url parameter and export all layer data</li>
//	 *  </ul>
//	 *  The default one include a valid configuration for shp-zip export
//	 */
//	exportFormatsConfig:{
//		"shape-zip": {
//			addGeometry: true
//		}
//	},
//
//	/** api: config[exportAction]
//	 *  ``String`` Export action type. 
//	 *  It can be `button` (append one button for each export format) 
//	 *  or `window` (append only one button `Export` and show options in a new window).
//	 *  Default is `window`.
//	 */
//	exportAction: "window",
//
//	/** api: config[displayMode]
//	 *  ``String`` Should we display all features on the map, or only the ones
//	 *  that are currently selected on the grid. Valid values are "all" and
//	 *  "selected". Default is "all".
//	 */
//	displayMode: "all",
//
//	/** api: config[autoExpand]
//	 *  ``Boolean`` If set to true, and when this tool's output is added to a
//	 *  container that can be expanded, it will be expanded when features are
//	 *  loaded. Default is false.
//	 */
//	autoExpand: false,
//
//	/** api: config[autoCollapse]
//	 *  ``Boolean`` If set to true, and when this tool's output is added to a
//	 *  container that can be collapsed, it will be collapsed when no features
//	 *  are to be displayed. Default is false.
//	 */
//	autoCollapse: false,
//
//	/** api: config[selectOnMap]
//	 *  ``Boolean`` If set to true, features can not only be selected on the
//	 *  grid, but also on the map, and multi-selection will be enabled. Only
//	 *  set to true when no feature editor or feature info tool is used with
//	 *  the underlying feature manager. Default is false.
//	 */
//	selectOnMap: false,
//
//	/** api: config[comboFormatTpl]
//	 *  ``String`` Tpl for the export combo in the export window.
//	 */
//	comboFormatTpl: "<tpl for=\".\"><div class=\"x-combo-list-item gxp-icon-featuregrid-export {iconCls}\">{name}</div></tpl>",
//
//	/** api: config[displayFeatureText]
//	 * ``String``
//	 * Text for feature display button (i18n).
//	 */
//	displayFeatureText: "Display on map",
//
//	/** api: config[displayExportCSVText]
//	 * ``String``
//	 * Text for CSV Export buttons (i18n).
//	 */
//	displayExportCSVText: "Export to CSV",
//
//	/** api: config[displayExportText]
//	 * ``String``
//	 * Text for Export buttons (i18n).
//	 */
//	displayExportText: "Export to {0}",
//
//	/** api: config[exportCSVSingleText]
//	 * ``String``
//	 * Text for CSV Export Single Page button (i18n).
//	 */
//	exportCSVSingleText: "Single Page",
//
//	/** api: config[exportCSVMultipleText]
//	 * ``String``
//	 * Text for CSV Export Multiple Pages button (i18n).
//	 */
//	exportCSVMultipleText: "Whole Page",       
//
//	/** api: config[failedExportCSV]
//	 * ``String``
//	 * Text for CSV Export error (i18n).
//	 */
//	failedExportCSV: "Failed to find response for output format CSV",       
//
//	/** api: config[failedExport]
//	 * ``String``
//	 * Text for Export error (i18n).
//	 */
//	failedExport: "Failed to find response for output format {0}",
//
//	/** api: config[nvalidParameterValueErrorText]
//	 * ``String``
//	 * Text for CSV Export error (i18n).
//	 */
//	invalidParameterValueErrorText: "Invalid Parameter Value",    
//
//	/** api: config[zoomFirstPageTip]
//	 *  ``String``
//	 *  Tooltip string for first page action (i18n).
//	 */
//	firstPageTip: "First page",
//
//	/** api: config[previousPageTip]
//	 *  ``String``
//	 *  Tooltip string for previous page action (i18n).
//	 */
//	previousPageTip: "Previous page",
//
//	/** api: config[zoomFirstPageTip]
//	 *  ``String``
//	 *  Tooltip string for zoom to page extent action (i18n).
//	 */
//	zoomPageExtentTip: "Zoom to page extent",
//
//	/** api: config[nextPageTip]
//	 *  ``String``
//	 *  Tooltip string for next page action (i18n).
//	 */
//	nextPageTip: "Next page",
//
//	/** api: config[lastPageTip]
//	 *  ``String``
//	 *  Tooltip string for last page action (i18n).
//	 */
//	lastPageTip: "Last page",
//
//	/** api: config[totalMsg]
//	 *  ``String``
//	 *  String template for showing total number of records (i18n).
//	 */
//	totalMsg: "Total: {0} records",
//
//	/** api: config[comboFormatMethodLabel]
//	 *  ``String``
//	 *  String for the export format label (i18n).
//	 */
//	comboFormatMethodLabel: "Format",
//
//	/** api: config[comboFormatEmptyText]
//	 *  ``String``
//	 *  String for the export format empty combo (i18n).
//	 */
//	comboFormatEmptyText: "Please, select format",
//
//	/** api: config[noFormatTitleText]
//	 *  ``String``
//	 *  SString for the unselected format title (i18n).
//	 */
//	noFormatTitleText: "Incorrect format",
//
//	/** api: config[noFormatBodyText]
//	 *  ``String``
//	 *  String for the unselected format body (i18n).
//	 */
//	noFormatBodyText: "Please, select a valid format",
//
//	/** api: config[exportTitleText]
//	 *  ``String``
//	 *  String for the Export button i18n).
//	 */
//	exportTitleText: "Export",
//
//	/** api: config[title]
//	 *  ``String``
//	 *  Feature Grid title.
//	 */
//	title: "Features",
//
//	/** api: config[defaultComboFormatValue]
//	 *  ``String``
//	 *  Default output format selection for export. Default is 'CSV'
//	 */
//	defaultComboFormatValue: "CSV",
//
//	/** api: config[zoomToFeature]
//	 *  ``String``
//	 */
//	zoomToFeature: "Zoom To Feature",
//
//	/** api: config[exportDoubleCheck]
//	 *  ``Boolean``
//	 *  Do check on feature grid export (one to show a possible error and another one to download the file)
//	 */
//	exportDoubleCheck: true,
//
//	/** api: config[exportCheckLimit]
//	 *  ``integer``
//	 *  if present, limit the number of feature to query for the first check
//	 */
//	exportCheckLimit: null,
//
//	/** api: config[pageLabel]
//	 *  ``String``
//	 */
//	pageLabel: "Page",
//
//	/** api: config[pageOfLabel]
//	 *  ``String``
//	 */
//	pageOfLabel: "of",	
//
//	/** api: config[totalRecordsLabel]
//	 *  ``String``
//	 */
//	totalRecordsLabel: "Total Records",
//
//	/** api: config[filterPropertyNames]
//	 *  ``Boolean``
//	 */
//	filterPropertyNames: true,

//	/** private: method[displayTotalResults]
//	 */
//	displayTotalResults: function() {
//		var featureManager = this.target.tools[this.featureManager];
//		if (this.showTotalResults === true && featureManager.numberOfFeatures !== null) {
//			this.displayItem.setText(
//					String.format(
//							this.totalMsg,
//							featureManager.numberOfFeatures
//					)
//			);
//		}
//	},

	/** api: method[addOutput]
	 */
	initComponent: function(config) {

		//////////////////////////////////////////////////////////////////
		//TODO: Restore commented fragments (if not otherwise specified)//
		//////////////////////////////////////////////////////////////////

// restore this ???		// Export formats 
//		if(this.exportFormats){
//			if(this.exportAction == 'window'){
//				bbar.push(this.getExportWindowButton());
//			}else{
//				var appendedCSVExporter = false;
//				for (var i = 0; i < this.exportFormats.length; i++){
//					var format = this.exportFormats[i];
//					// Retrocompatibilty
//					if(format == "CSV"){
//						appendedCSVExporter = true;
//					}
//					bbar.push(this.getExportButton(format));
//				}
//				// Retrocompatibilty
//				if(!appendedCSVExporter && this.showExportCSV){
//					bbar.push(this.getExportButton("CSV"));
//				}
//			}
//		}else{
//			// Retrocompatibilty
//			if(this.showExportCSV){
//				bbar.push(this.getExportButton("CSV"));
//			}
//		}
		
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
								this.qbFeatureManager.fireEvent("exportpage", {format: "shp", items: "all"});
							}, 
							scope: this
						}, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("exportpage", {format: "shp", items: "single"});
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
								this.qbFeatureManager.fireEvent("exportpage", {format: "spatialite", items: "all"});
							}, 
							scope: this
					   }, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("exportpage", {format: "spatialite", items: "single"});
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

//	/** api: method[getExportWindowButton]
//	 *  Generate a export button to open a new dialog with the configured formats
//	 */    
//	getExportWindowButton: function(){
//		var exportWindow = this.exportWindow;
//		if(!exportWindow){
//			var formatStore = [];
//			var appendedCSVExporter = false;
//			for (var i = 0; i < this.exportFormats.length; i++){
//				var format = this.exportFormats[i];
//				// Retrocompatibilty
//				if(format == "CSV"){
//					appendedCSVExporter = true;
//				}
//				formatStore.push({
//					name: format,
//					value: format,
//					iconCls: "gxp-icon-" + format.toLowerCase() + "export"
//				});
//			}
//			// Retrocompatibilty
//			if(!appendedCSVExporter && this.showExportCSV){
//				formatStore.push({
//					name: "CSV",
//					value: "CSV",
//					iconCls: "gxp-icon-csvexport-single"
//				});
//			}
//			var selectionFormatCombo = {
//					xtype : 'combo',
//					width: 179,
//					fieldLabel : this.comboFormatMethodLabel,
//					typeAhead : true,
//					triggerAction : 'all',
//					lazyRender : false,
//					mode : 'local',
//					name : 'format',
//					forceSelected : true,
//					emptyText : this.comboFormatEmptyText,
//					value : this.defaultComboFormatValue,
//					allowBlank : false,
//					autoLoad : true,
//					displayField : 'name',
//					valueField : 'value',
//					editable : false,
//					readOnly : false,
//					tpl: this.comboFormatTpl,
//					listConfig: {
//						getInnerTpl: function(displayField) {
//							return '<div class="{iconCls}"> {' + displayField + '}' + "</div>";
//						}
//					},
//					store : new Ext.data.JsonStore({
//						fields : [{
//							name : 'name',
//							dataIndex : 'name'
//						}, {
//							name : 'value',
//							dataIndex : 'value'
//						}, {
//							name : 'iconCls',
//							dataIndex : 'iconCls'
//						}],
//						data : formatStore
//					})
//			};
//			exportWindow = new Ext.Window({
//				title: this.exportTitleText,
//				width: 300,
//				closeAction: 'hide',
//				items: [{
//					xtype: 'form',
//					ref: "form",
//					items: [selectionFormatCombo],
//					bbar: ["->", {
//						iconCls: "gxp-icon-csvexport-single",
//						text: this.exportCSVSingleText,
//						handler: function() {
//							if(this.exportWindow.form.getForm().isValid()){
//								var format = this.exportWindow.form.getForm().getValues().format;
//								this.doExport(false, format);
//							}else{
//								Ext.Msg.show({
//									title: this.noFormatTitleText,
//									msg: this.noFormatBodyText,
//									buttons: Ext.Msg.OK,
//									icon: Ext.MessageBox.ERROR
//								}); 
//							}
//						},
//						scope: this
//					},{
//						iconCls: "gxp-icon-csvexport-multiple",
//						text: this.exportCSVMultipleText,
//						handler: function() {
//							if(this.exportWindow.form.getForm().isValid()){
//								var format = this.exportWindow.form.getForm().getValues().format;
//								this.doExport(false, format);
//							}else{
//								Ext.Msg.show({
//									title: this.noFormatTitleText,
//									msg: this.noFormatBodyText,
//									buttons: Ext.Msg.OK,
//									icon: Ext.MessageBox.ERROR
//								}); 
//							}
//						},
//						scope: this
//					}]
//				}]
//			});
//			this.exportWindow = exportWindow;
//		}
//		return {
//			text: this.exportTitleText,
//			xtype: 'button',
//			disabled: true,
//			iconCls: "gxp-icon-csvexport",
//			ref: "../exportButton",
//			handler:function() {                    
//				this.exportWindow.show();
//			},
//			scope: this
//		};
//	}, 
//
//	/** api: method[getExportButton]
//	 *  Generate a export button for an specific format
//	 */    
//	getExportButton: function(format){
//		var displayExportText = String.format(this.displayExportText, format);
//		return {
//			text: displayExportText,
//			xtype: 'button',
//			disabled: true,
//			iconCls: "gxp-icon-" + format.toLowerCase() + "export",
//			ref: "../export" + format + "Button",
//			menu:{
//				xtype: "menu",
//				showSeparator: true, 
//				items: [{
//					iconCls: "gxp-icon-csvexport-single",
//					text: this.exportCSVSingleText,
//					handler: function() {                    
//						this.me.doExport(true, this.format);
//					},
//					scope: {
//						me: this,
//						format: format
//					}
//				},{
//					iconCls: "gxp-icon-csvexport-multiple",
//					text: this.exportCSVMultipleText,
//					handler: function() {                    
//						this.me.doExport(false, this.format);
//					},
//					scope: {
//						me: this,
//						format: format
//					}
//				}]
//			}
//		};
//	},
//
//	/** api: method[doExport]
//	 */    
//	doExport: function(single, outputFormat){
//
//		var featureManager = this.target.tools[this.featureManager];
//		var grid = this.output[0];
//		var protocol = grid.getStore().proxy.protocol;
//		var allPage = {};
//
//		allPage.extent = featureManager.getPagingExtent("getMaxExtent");
//
//		var filter = featureManager.setPageFilter(single ? featureManager.page : allPage);
//
//		var node = new OpenLayers.Format.Filter({
//			version: protocol.version,
//			srsName: protocol.srsName
//		}).write(filter);
//
//		this.xml = new OpenLayers.Format.XML().write(node);
//
//		var colModel = grid.getColumnModel();
//		//get all columns and see if they are visible
//		var numColumns = colModel.getColumnCount(false);
//		var propertyName = [];
//
//		for (var i=0; i<numColumns; i++){
//			var header = colModel.getColumnHeader(i) ;
//			if( header && header != "" && !colModel.isHidden(i)){
//				propertyName.push(header);
//			}
//		}   
//		var failedExport = String.format(this.failedExport, outputFormat);
//
//		// Url generation
//		var url =  protocol.url;
//		var propertyNamesString = "";
//		if(this.exportFormatsConfig[outputFormat]){
//			// Read specific xonfiguration for the output format
//			if(this.exportFormatsConfig[outputFormat].addGeometry){
//				propertyName.push(featureManager.featureStore.geometryName);
//			}
//			if(!this.exportFormatsConfig[outputFormat].exportAll){
//				propertyNamesString += "propertyName=" + propertyName.join(',') + "&";
//			}
//		}else{
//			propertyNamesString += "propertyName=" + propertyName.join(',') + "&";
//		}
//		//get the name space
//		var prefix = featureManager.layerRecord.get("prefix");
//		var namespace = (prefix && prefix !="")  ?  featureManager.layerRecord.get("prefix") + ":" : "";
//		url += "service=WFS" +
//		(this.filterPropertyNames ? "&" + propertyNamesString : "") +
//		"&version=" + protocol.version +
//		"&request=GetFeature" +
//		"&typeName=" + namespace + protocol.featureType +
//		"&exceptions=application/json" +
//		"&outputFormat="+ outputFormat;
//		this.url =  url;
//
//		if(this.exportDoubleCheck){
//			//show mask
//			var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
//			myMask.show();
//			OpenLayers.Request.POST({
//				//add the maxFeatures attribute if present to the test request
//				url: this.url + (this.exportCheckLimit ? "&maxFeatures=" + this.exportCheckLimit :"") ,
//				data: this.xml,
//				callback: function(request) {
//					myMask.hide();
//					if(request.status == 200){
//
//						try
//						{
//							var serverError = Ext.util.JSON.decode(request.responseText);
//							Ext.Msg.show({
//								title: "Error",
//								msg: "outputFormat: " + outputFormat + "</br></br>" +
//								failedExport + "</br></br>" +
//								"Error: " + serverError.exceptions[0].text,
//								buttons: Ext.Msg.OK,
//								icon: Ext.MessageBox.ERROR
//							});                        
//						}
//						catch(err)
//						{
//							// submit filter in a standard form (before check)
//							this.doDownloadPost(this.url, this.xml,outputFormat);
//						}
//
//					}else{
//						Ext.Msg.show({
//							title: failedExport,
//							msg: request.statusText,
//							buttons: Ext.Msg.OK,
//							icon: Ext.MessageBox.ERROR
//						});
//					}
//				},
//				scope: this
//			});   
//		}else{
//			// submit filter in a standard form to skip double check
//			this.doDownloadPost(this.url, this.xml,outputFormat);
//		}     
//
//	},
//
//	/** api: method[doDownloadPost]
//	 * create a dummy iframe and a form. Submit the form 
//	 */    
//
//	doDownloadPost: function(url, data,outputFormat){
//		//        
//		//delete other iframes appended
//		//
//		if(document.getElementById(this.downloadFormId)) {
//			document.body.removeChild(document.getElementById(this.downloadFormId)); 
//		}
//		if(document.getElementById(this.downloadIframeId)) {
//			document.body.removeChild(document.getElementById(this.downloadIframeId));
//		}
//		// create iframe
//		var iframe = document.createElement("iframe");
//		iframe.setAttribute("style","visiblity:hidden;width:0px;height:0px;");
//		this.downloadIframeId = Ext.id();
//		iframe.setAttribute("id",this.downloadIframeId);
//		iframe.setAttribute("name",this.downloadIframeId);
//		document.body.appendChild(iframe);
//		iframe.onload = function(){
//			if(!iframe.contentWindow) return;
//
//			var error ="";
//			var body = iframe.contentWindow.document.getElementsByTagName('body')[0];
//			var content ="";
//			if (body.textContent){
//				content = body.textContent;
//			}else{
//				content = body.innerText;
//			}
//			try{
//				var serverError = Ext.util.JSON.decode(content);
//				error = serverError.exceptions[0].text
//			}catch(err){
//				error = body.innerHTML || content;
//			}
//			Ext.Msg.show({
//				title: me.invalidParameterValueErrorText,
//				msg: "outputFormat: " + outputFormat + "</br></br>" +
//				"</br></br>" +
//				"Error: " + error,
//				buttons: Ext.Msg.OK,
//				icon: Ext.MessageBox.ERROR
//			});   
//		}
//		var me = this;
//
//		// submit form with enctype = application/xml
//		var form = document.createElement("form");
//		this.downloadFormId = Ext.id();
//		form.setAttribute("id", this.downloadFormId);
//		form.setAttribute("method", "POST");
//		//this is to skip cross domain exception notifying the response body
//		var urlregex =/^https?:\/\//i;
//		//if absoulte url and do not contain the local host
//		var iframeURL = (!urlregex.test(url) || url.indexOf(location.host)>0) ? url :  proxy + encodeURIComponent(url);
//		form.setAttribute("action", iframeURL );
//		form.setAttribute("target",this.downloadIframeId);
//
//		var hiddenField = document.createElement("input");      
//		hiddenField.setAttribute("name", "filter");
//		hiddenField.value= data;
//		form.appendChild(hiddenField);
//		document.body.appendChild(form);
//		form.submit(); 
//	} 
	
});

