
Ext.ns('TolomeoExt.widgets');

/**
 * Crea un panello per assembrale la form di composizione del filtro.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloFilterBuilder', {
	
	extend: 'Ext.Container',

	alias: 'widget.tolomeo_tolofilterbuilder',
	
	/**
     * @cfg {Array} spatialSelectorsConfig [builderTypeNames=``["ognuno", "tutti", "nessuno", "non tutti"]``]
	 * La lista di etichette che corrispondono ai tipi di costanti del costruttore.
     */
	builderTypeNames: ["ognuno", "tutti", "nessuno", "non tutti"],
    
	/**
     * @cfg {Array} spatialSelectorsConfig 
	 * La lista delle costanti dei tipi di costruttore. Valori possibili sono ``[ANY_OF, ALL_OF, NONE_OF]``
     */
    allowedBuilderTypes: null,

	/**
     * @cfg {Boolean} allowBlank [allowBlank="false"]
	 * Impostare a true se si desidera consentire campi vuoti.
     */
    allowBlank: false,

	/**
     * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Il filtro di comparazione per i campi di tipo stringa deve essere case insensitive ?
     */
    caseInsensitiveMatch: false,

	/**
     * @cfg {String} preComboText
	 * Testo da mostrare prima della combo box per il tipo.
     */
    preComboText: "Confronta",

    /**
     * @cfg {String} postComboText
	 * Testo da mostrare dopo la combo box per il tipo.
     */
    postComboText: "dei seguenti:",

	/**
     * @cfg {String} cls
	 * La classe di stile da usare per i pannelli di questo componente.
     */
    cls: "tolomeo-tolofilterbuilder",

	/**
     * @property {Object} builderType
	 * 
     */
    builderType: null,

	/**
     * @property {Object} childFilterContainer
	 * 
     */
    childFilterContainer: null,
    
	/**
     * @cfg {Object} customizeFilterOnInit [customizeFilterOnInit="true"]
	 * 
     */
    customizeFilterOnInit: true,
    
    /**
     * @cfg {String} addConditionText
	 * 
     */
    addConditionText: "Aggiungi Condizione",
	
	/**
     * @cfg {String} addGroupText
	 * 
     */
    addGroupText: "Aggiungi Gruppo",
	
	/**
     * @cfg {String} removeConditionText
	 * 
     */
    removeConditionText: "Rimuovi Condizione",

	/**
     * @cfg {Boolean} allowGroups [customizeFilterOnInit="false"]
	 * Consente di agiungere gruppi di condizioni. Se "false" solo condizioni individuali saranno aggiunte al filtro.
     */
    allowGroups: false,
    
	/**
     * @cfg {Object} attributesComboConfig 
	 * Configurazione della combo box degli attributi.
     */
    attributesComboConfig: null,

	/**
     * @cfg {Boolean} autoComplete [autoComplete="false"]
	 * Abilita la funzionalità di autocompletamento per i campi stringa.
     */
    autoComplete: false,
    
	/**
     * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Stabilisce la configurazione da usare per la funzionalità di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
     */
    autoCompleteCfg: {},

	/**
     * Inizializza un nuovo TolomeoExt.widgets.ToloFilterBuilder.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
        var defConfig = {
            defaultBuilderType: TolomeoExt.widgets.ToloFilterBuilder.ANY_OF
        };
        Ext.applyIf(this, defConfig);
        
        if(this.customizeFilterOnInit) {
            this.filter = this.customizeFilter(this.filter);
        }
        
        this.builderType = this.getBuilderType();
        
        this.items = [{
            xtype: "container",
            layout: "form",
            ref: "form",
            defaults: {anchor: "100%"},
            hideLabels: true,
            items: [
                {
	                xtype: "fieldcontainer",
	                style: "padding-left: 2px",
	                items: [{
	                    xtype: "label",
	                    style: "padding-top: 0.3em",
	                    text: this.preComboText
	                }, this.createBuilderTypeCombo(), 
	                {
	                    xtype: "label",
	                    style: "padding-top: 0.3em",
	                    text: this.postComboText
	                }]
	            }, 
	            this.createChildFiltersPanel(), 
	            {
	                xtype: "toolbar",
	                items: this.createToolBar()
	            }
		    ]        
        }];
        
        this.addEvents(
			/**
			 * @event
			 * Lanciato quando il filtro subisce un cambiamento.
			 */
            "change"
        ); 

        this.callParent();
        
        this.on("added", function(scope){
        	scope.form = scope.query('container[ref=form]')[0];
        	scope.builderTypeCombo = scope.query('combo[ref=builderTypeCombo]')[0];
        });
    },

	/**
     * Crea la toolbar di comando.
     *
     */
    createToolBar: function() {
        var bar = [{
            text: this.addConditionText,
            iconCls: "add",
            handler: function() {
                this.addCondition();
            },
            scope: this
        }];
        if(this.allowGroups) {
            bar.push({
                text: this.addGroupText,
                iconCls: "add",
                handler: function() {
                    this.addCondition(true);
                },
                scope: this
            });
        }
        return bar;
    },
    
	/**
     * Restituisce il filtro che corrisponde al modello delle specifiche di Filter Encoding.
	 * Usare questo metodo invece che accedere direttamente alla proprietà ``filter`` della proprità.
	 * Il valore di ritorno sarà ``false`` se nessun figlio possiede una proprietà, un typo o un valore.
     * @return {OpenLayers.Filter} Il filtro corrente.
     */
    getFilter: function() {
        var filter;
        if(this.filter) {
            filter = this.filter.clone();
            if(filter instanceof OpenLayers.Filter.Logical) {
                filter = this.cleanFilter(filter);
            }
        }
        return filter;
    },
    
	/**
     * Assicura che i filtri binary logici abbiano più di un figlio.
     * @param {OpenLayers.Filter.Logical} filter Il filtro corrente.
	 * @return {OpenLayers.Filter} Un filtro che rispetta il modello usato da questo costruttore.
     */
    cleanFilter: function(filter) {
        if(filter instanceof OpenLayers.Filter.Logical) {
            if(filter.type !== OpenLayers.Filter.Logical.NOT &&
               filter.filters.length === 1) {
                filter = this.cleanFilter(filter.filters[0]);
            } else {
                var child;
                for(var i=0, len=filter.filters.length; i<len; ++i) {
                    child = filter.filters[i];
                    if(child instanceof OpenLayers.Filter.Logical) {
                        child = this.cleanFilter(child);
                        if(child) {
                            filter.filters[i] = child;
                        } else {
                            filter = child;
                            break;
                        }
                    } else if(!child || child.type === null || child[child.property] === null || child[child.type === OpenLayers.Filter.Comparison.BETWEEN ? "lowerBoundary" : "value"] === null || child[child.type === OpenLayers.Filter.Comparison.BETWEEN ? "upperBoundary" : "value"] === null ) {
                        filter = false;
                        break;
                    }
                }
            }
        } else {
            if(!filter || filter.type === null || filter.property === null || filter[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "lowerBoundary" : "value"] === null || filter[filter.type === OpenLayers.Filter.Comparison.BETWEEN ? "upperBoundary" : "value"] === null) {
                filter = false;
            }
        }
        return filter;
    },
    
	/**
     * Crea un filtro che corrisponde al modello del corrente costruttore.
	 * Questo filtro non rispetterà necessariamente e specifiche di Filter Encoding.
	 * In particolare, i filtri che rappresentano operatori logici binary possono non avere due filtri figlio.
	 * Usare il metodo <getFilter> per ottenere un filtro che rispetta le specifiche di Filter Encoding
     * @param {OpenLayers.Filter} filter Il filtro corrente.
	 * @return {OpenLayers.Filter} Un filtro che rispetta il modello usato da questo costruttore.
     */
    customizeFilter: function(filter) {
        if(!filter) {
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            filter = this.cleanFilter(filter);
            var child, i, len;
            switch(filter.type) {
                case OpenLayers.Filter.Logical.AND:
                case OpenLayers.Filter.Logical.OR:
                    if(!filter.filters || filter.filters.length === 0) {
                        // give the filter children if it has none
                        filter.filters = [this.createDefaultFilter()];
                    } else {
                        for(i=0, len=filter.filters.length; i<len; ++i) {
                            child = filter.filters[i];
                            if(child instanceof OpenLayers.Filter.Logical) {
                                filter.filters[i] = this.customizeFilter(child);
                            }
                        }
                    }
                    // wrap in a logical OR
                    filter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.OR,
                        filters: [filter]
                    });
                    break;
                case OpenLayers.Filter.Logical.NOT:
                    if(!filter.filters || filter.filters.length === 0) {
                        filter.filters = [
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.OR,
                                filters: [this.createDefaultFilter()]
                            })
                        ];
                    } else {
                        // NOT filters should have one child only
                        child = filter.filters[0];
                        if(child instanceof OpenLayers.Filter.Logical) {
                            if(child.type !== OpenLayers.Filter.Logical.NOT) {
                                // check children of AND and OR
                                var grandchild;
                                for(i=0, len=child.filters.length; i<len; ++i) {
                                    grandchild = child.filters[i];
                                    if(grandchild instanceof OpenLayers.Filter.Logical) {
                                        child.filters[i] = this.customizeFilter(grandchild);
                                    }
                                }
                            } else {
                                // silly double negative
                                if(child.filters && child.filters.length > 0) {
                                    filter = this.customizeFilter(child.filters[0]);
                                } else {
                                    filter = this.wrapFilter(this.createDefaultFilter());
                                }
                            }
                        } else {
                            // non-logical child of NOT should be wrapped
                            var type;
                            if(this.defaultBuilderType === TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF) {
                                type = OpenLayers.Filter.Logical.AND;
                            } else {
                                type = OpenLayers.Filter.Logical.OR;
                            }
                            filter.filters = [
                                new OpenLayers.Filter.Logical({
                                    type: type,
                                    filters: [child]
                                })
                            ];
                        }
                    }
                    break;
                default:
                    // non-logical filters get wrapped
                    filter = this.wrapFilter(filter);
                    break;
            }
        }
        return filter;
    },
	
	/**
     * Inizializza il filtro predefinito.
	 * @return {OpenLayers.Filter} Un filtro che rispetta il modello usato da questo costruttore.
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({
                            matchCase: !this.caseInsensitiveMatch});
    },
    
	/**
     * Prende un filtro non logico per creare un parent che dipende da ``defaultBuilderType``.
	 * @param {OpenLayers.Filter} filter Un filtro non logico.
	 * @return {OpenLayers.Filter} Una versione wrapped del filtro passato come argomento.
     */
    wrapFilter: function(filter) {
        var type;
        if(this.defaultBuilderType === TolomeoExt.widgets.ToloFilterBuilder.ALL_OF) {
            type = OpenLayers.Filter.Logical.AND;
        } else {
            type = OpenLayers.Filter.Logical.OR;
        }
        return new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.OR,
            filters: [
                new OpenLayers.Filter.Logical({
                    type: type, filters: [filter]
                })
            ]
        });
    },
    
	/**
     * Aggiunge una nuova condizione o gruppo di condizion al costruttore del filtro.
	 * Qusto modifica il filtro a aggiunge un pannello che rappresenta la nuova condizione 
	 * o grupo di condizioni.
	 * @param {Object} group Un nuovo gruppo di condizioni.
     */
    addCondition: function(group) {
        var filter, type;
        if(group) {
            type = "tolomeo_tolofilterbuilder";
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            type = "tolomeo_tolofilterfield";
            filter = this.createDefaultFilter();
        }
        var newChild = this.newRow({
            xtype: type,
            filter: filter,
            columnWidth: 1,
            attributes: this.attributes,
            autoComplete: this.autoComplete,
            autoCompleteCfg: this.autoCompleteCfg,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext,
            allowBlank: group ? undefined : this.allowBlank,
            customizeFilterOnInit: group && false,
            caseInsensitiveMatch: this.caseInsensitiveMatch,
            listeners: {
                change: function() {
                    this.fireEvent("change", this);
                },
                scope: this
            }
        });
        this.childFilterContainer.add(newChild);
        this.filter.filters[0].filters.push(filter);
        this.childFilterContainer.doLayout();
    },
    
	/**
     * Rimuove una condizione o gruppo di condizioni da costruttore. 
	 * Questo modificha il filtro e rimuove il pannello che rappresenta la nuova condizione 
	 * o grupo di condizioni.
	 * @param {Object} item elemento da rimuovere.
	 * @param {OpenLayers.Filter} filter Il filtro corrente .
     */
    removeCondition: function(item, filter) {
		var parent = this.filter.filters[0].filters;
		if(parent.length > 1) {
			var a = parent.indexOf(filter);
			if(a!=-1){
				parent.splice(a,1)
			}
			
			this.childFilterContainer.remove(item, true);
		}else{
			var items = item.query("tolomeo_tolofilterfield");
			
			var i = 0;
			while(items[i]){
				for(var k = 0; k<items.length; k++){
					items[k].items.each(function(f) {
					    if (Ext.isFunction(f.reset)) {
					        f.reset();
					    }
					});
				}
				
                for(var c = 1;c<items[i].items.items.length;c++){
                	var cmp = items[i].items.get(c);
                	if(cmp.xtype == "container"){
                		cmp.removeAll();
                	}else{
                		cmp.disable();
                	}
                }

				filter.value = null;
                filter.lowerBoundary = null;
                filter.upperBoundary = null;
				i++;
			}
		}
		
		this.fireEvent("change", this);
    },
    
	/**
     * Rimuove dal pannello tutte le condizioni presenti.
     * 
     */
    removeAllConditions: function(){
    	var containers = this.query("container[name=filtercondition_container]");
    	for(var i=0; i<containers.length; i++){
    		var container = containers[i];
    		var filter = container.items.items[1].filter;
    		this.removeCondition(container, filter);
    	}    	
    },
    
    /**
     * Crea la combo box corrispondente ai tipi di costruttore possibili per il filtro.
	 *
     */
    createBuilderTypeCombo: function() {
        var types = this.allowedBuilderTypes || [
            TolomeoExt.widgets.ToloFilterBuilder.ANY_OF, 
            TolomeoExt.widgets.ToloFilterBuilder.ALL_OF,
            TolomeoExt.widgets.ToloFilterBuilder.NONE_OF
        ];
        var numTypes = types.length;
        var data = new Array(numTypes);
        var type;
        for(var i=0; i<numTypes; ++i) {
            type = types[i];
            data[i] = [type, this.builderTypeNames[type]];
        }
        return {
            xtype: "combo",
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: this.builderType,
            ref: "builderTypeCombo",
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            queryMode: "local",
            listeners: {
                select: function(combo, records) {
                	var record = records;
                	if(records instanceof Array){
                		record = records[0];
                	}
                    this.changeBuilderType(record.get("value"));
                    this.fireEvent("change", this);
                },
                scope: this
            },
            width: 70 
        };
    },

	/**
     * Altera i tipi di filtroquando la combo dei tipi di filtro cambia di valore.
	 * @param {Integer} type elemento da rimuovere.
     */
    changeBuilderType: function(type) {
        if(type !== this.builderType) {
            this.builderType = type;
            var child = this.filter.filters[0];
            switch(type) {
                case TolomeoExt.widgets.ToloFilterBuilder.ANY_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.NONE_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
            }
        }
    },

	/**
     * Crea il pannello che ospita tutte le condizioni e i gruppi di condizioni.
	 * Dato che questo è chiamato dopo che il filtro è stato personalizzato, noi abbiamo sempre 
     * un filtro logico con un filtro figlio che è un filtro logico. 	 
	 * @param {Integer} type elemento da rimuovere.
	 * @return {Ext.Container} il pannello contenitore.
     */
    createChildFiltersPanel: function() {
        this.childFilterContainer = new Ext.Container();
        var grandchildren = this.filter.filters[0].filters;
        var grandchild;
        for(var i=0, len=grandchildren.length; i<len; ++i) {
            grandchild = grandchildren[i];
            var fieldCfg = {
                xtype: "tolomeo_tolofilterfield",
                allowBlank: this.allowBlank,
                columnWidth: 1,
                filter: grandchild,
                attributes: this.attributes,
                autoComplete: this.autoComplete,
                autoCompleteCfg: this.autoCompleteCfg,
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
                caseInsensitiveMatch: this.caseInsensitiveMatch,
                listeners: {
                    change: function() {
                        this.fireEvent("change", this);
                    },
                    scope: this
                }
            };
            var containerCfg = Ext.applyIf(
                grandchild instanceof OpenLayers.Filter.Logical ?
                    {
                        xtype: "tolomeo_tolofilterbuilder"
                    } : {
                        xtype: "container",
                        layout: "form",
                        hideLabels: true,
                        items: fieldCfg
                    }, fieldCfg
            );
                
            this.childFilterContainer.add(this.newRow(containerCfg));
        }
        
        return this.childFilterContainer;
    },

	/**
     * Genera una nuova condizione per il filtro figlio del pannello. Questo accoppia 
	 * un altro pannello filtro o costruttore di filtro con un componente che consente la rimozione.	 
	 * @param {Ext.Container} filterContainer Il pannello contenitore degli elementi del filtro.
	 * @return {Ext.Container} il pannello contenitore della nuova condizione del filtro.
     */
    newRow: function(filterContainer) {
        var ct = Ext.create('Ext.Container', {
            layout: "column",
            name: "filtercondition_container",
            items: [
                {
	                xtype: "container",
	                width: 28,
	                height: 26,
	                style: "padding-left: 2px",
	                items: [{
	                    xtype: "button",
	                    style: {
	                    	marginTop: '3px'
	                    },
	                    tooltip: this.removeConditionText,
	                    iconCls: "delete",
	                    handler: function(btn){
	                        this.removeCondition(ct, filterContainer.filter);
	                    },
	                    scope: this
	                }]
	            }, filterContainer
            ]
        });
        return ct;
    },

	/**
     * Determina il tipo di costruttore basato sul filtro corrente.	 
	 * @return {Object} il tipo di costruttore.
     */
    getBuilderType: function() {
        var type = this.defaultBuilderType;
        if(this.filter) {
            var child = this.filter.filters[0];
            if(this.filter.type === OpenLayers.Filter.Logical.NOT) {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = TolomeoExt.widgets.ToloFilterBuilder.NONE_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF;
                        break;
                }
            } else {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = TolomeoExt.widgets.ToloFilterBuilder.ANY_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = TolomeoExt.widgets.ToloFilterBuilder.ALL_OF;
                        break;
                }
            }
        }
        
        return type;
    },

	/**
     * Cambia il filtro associato a questa istanza del costruttore.	 
	 * @param {OpenLayers.Filter} filter Un filtro da impostare.
     */
    setFilter: function(filter) {
        this.filter = this.customizeFilter(filter);
        this.changeBuilderType(this.getBuilderType());
        this.builderTypeCombo.setValue(this.builderType);
        this.form.remove(this.childFilterContainer);
        this.form.insert(1, this.createChildFiltersPanel());
        this.form.doLayout();
        this.fireEvent("change", this);
    }

});

/**
 * Tipi di costruttore
 */
TolomeoExt.widgets.ToloFilterBuilder.ANY_OF = 0;
TolomeoExt.widgets.ToloFilterBuilder.ALL_OF = 1;
TolomeoExt.widgets.ToloFilterBuilder.NONE_OF = 2;
TolomeoExt.widgets.ToloFilterBuilder.NOT_ALL_OF = 3;
