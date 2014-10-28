
Ext.ns('TolomeoExt.widgets');

/**
 * Widget per la selezione della regione di interesse. Collega 
 * le specifiche funzionalità di di selezione spaziale e le 
 * relative caratteristiche in un'unica form dinamica.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloSpatialSelector', {

	extend: 'Ext.Panel',
	
	/**
	 * @cfg {Object} spatialSelectorsConfig
     * Configurazione dei metodi di selezione che si vuole rendere disponibili.
     */
    spatialSelectorsConfig:{
	    /**
		 * @cfg {Object} bbox
		 * Metodo di selezione per bounding box.
		 */
        bbox:{
            xtype : 'widget.tolomeo_spatial_bbox_selector'
        },
	    /**
		 * @cfg {Object} buffer
		 * Metodo di selezione pre buffer.
		 */
        buffer:{
            xtype : 'widget.tolomeo_spatial_buffer_selector'
        },
	    /**
		 * @cfg {Object} circle
		 * Metodo di selezione per cerchio.
		 */
        circle:{
            xtype : 'widget.tolomeo_spatial_circle_selector',
            zoomToCurrentExtent : true
        },
	    /**
		 * @cfg {Object} polygon
		 * Metodo di selezione per poligono.
		 */
        polygon:{
            xtype : 'widget.tolomeo_spatial_polygon_selector'
        }
    },

	/**
	 * @cfg {String} defaultSelectionMethod
	 * (xtype) Metodo di selezione da usare come predefinito.
	 */
	defaultSelectionMethod: null,

	/**
	 * @cfg {String} filterGeometryName
	 * None del campo geometrico usato per la preparazione del filtro.
	 */
	filterGeometryName: "the_geom",

	/**
	 * @cfg {String} titleText
	 * Titolo usato per il fielset di contenimento.
	 */
	titleText: "Selettore Spaziale",

	/**
	 * @cfg {String} comboEmptyText
	 * Testo predefinito per la combo box del metodo di selezione spaziale.
	 */
	comboEmptyText : "Seleziona un Metodo...",

	/**
	 * @cfg {String} comboSelectionMethodLabel
	 * Testo per l'etichetta della combo box di selezione del metodo.
	 */
	comboSelectionMethodLabel : "Metodo di Selezione",
	
	/**
	 * @property {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager
	 * Gestore di eventi per il query builder.
	 */
	qbEventManager: null,
    
	/**
     * Crea un nuovo TolomeoExt.widgets.ToloSpatialSelector.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor : function(config) {
		this.layoutConfig = {
            xtype: 'container',
            defaults:{
                layout: "form"
            }
        };

		// Apply config
		Ext.apply(this, config);

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				var plugin = Ext.create(spConfig.xtype, {
					qbEventManager: this.qbEventManager
				});
				this.spatialSelectors[key] = plugin;
				var selectorItem = plugin.getSelectionMethodItem();
				selectorItem.value = key;
				this.spatialSelectorsItems.push(selectorItem);
			}	
		}
		
		this.callParent(arguments);
	},

	/**
     * Inizializza un oggetto di tipo TolomeoExt.widgets.ToloSpatialSelector.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		this.border = 0;
		
    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		var selectionMethodCombo = {
			xtype : 'combo',
			// anchor : '100%',
			id : this.id + '_selectionMethod_id',
			fieldLabel : this.comboSelectionMethodLabel,
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : false,
			queryMode : 'local',
			name : 'roiSelectionMethod',
			forceSelection : true,
			emptyText : this.comboEmptyText,
			allowBlank : false,
			//autoLoad : true,
			displayField : 'label',
			valueField : 'value',
			editable : false,
			readOnly : false,
			store : Ext.create('Ext.data.JsonStore', {
				autoLoad : true,
				fields : [{
					name : 'name',
					dataIndex : 'name'
				}, {
					name : 'label',
					dataIndex : 'label'
				}, {
					name : 'value',
					dataIndex : 'value'
				}],
				data : this.spatialSelectorsItems
			}),
			listeners : {
				select : function(c, record, index) {
					this._updating = true;
					this.reset();
					this._updating = false;
					var method = this.spatialSelectors[c.getValue()];//record.json.method;
					method.activate();
					this.activeMethod = method;
                    setTimeout(function(){
                        //TODO: ??? c.refOwner.doLayout();
                    }, 500);
				},
				scope : this
			}
		};

		var selItems = [];
		selItems.push(selectionMethodCombo);
		
		if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		var output = this.spatialSelectors[key];
	    		if(output){
					selItems.push(output);
	    		}
	    	}
	    }

		this.spatialFieldSet = Ext.create('Ext.form.FieldSet', {
			collapsed : true,
			checkboxToggle: true,
			title: this.comboSelectionMethodLabel,
			items: selItems
		});
		
	    // initialize layout
		layout.items = [];		
		layout.items.push(this.spatialFieldSet);

    	this.items = [layout];
    	
    	this.callParent();    	
    	
    	//
    	// Update the current map extent
    	//
    	this.qbEventManager.on("mapmoved", function(extent){
    		this.currentMapExtent = extent;
    	}, this);
    },
 
	/**
     * Reimposta lo stato del selettore spaziale.
	 *
     */
    reset: function(){
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		this.spatialSelectors[key].deactivate();
	    		this.activeMethod = null;
	    	}
	    	if(!this._updating 
	    		&& this.defaultSelectionMethod
	    		&& this.spatialSelectors[this.defaultSelectionMethod]){
	    		this.spatialSelectors[this.defaultSelectionMethod].activate();
				this.activeMethod = this.spatialSelectors[this.defaultSelectionMethod];
	    	}   	
    	}
    },

	/**
     * Genera un filtro per il metodo di selezione scelto.
     * @param {Boolean} currentExtent Stabilisce se ritornare un filtro semplice basato sull'estensione corente della mappa.
     */
	getQueryFilter: function(currentExtent){
		var currentExtentFilter = new OpenLayers.Filter.Spatial({
			type: OpenLayers.Filter.Spatial.BBOX,
			property: this.filterGeometryName,
			value: this.currentMapExtent 
		});
		
		if(currentExtent === true){
			return currentExtentFilter;
		}
		
		if(this.activeMethod && this.activeMethod.currentGeometry){
			this.activeMethod.filterGeometryName = this.filterGeometryName;
			return this.activeMethod.getQueryFilter();
		}else{
			return currentExtentFilter;
		}
	},

	/**
     * Restituisce la geometria selezionata.
     * 
     */
	getGeometry: function(){
		if(this.activeMethod){
			return this.activeMethod.currentGeometry;
		}else{
			return null;
		}
	},
	
	/**
     * Restituisce l'elemento ext relativo alla combo box del metodo di selezione spaziale.
     * 
     */
	getSelectionMethodCombo: function(){		
    	var selectionMethodCombo = this.queryById(this.id + '_selectionMethod_id');
    	return  selectionMethodCombo;
	}
	
});
