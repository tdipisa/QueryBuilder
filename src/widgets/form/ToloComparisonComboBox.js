
Ext.ns('TolomeoExt.widgets.form');

/**
 * Una combo box Ext per selezionare gli operatori di comparazione disponibili 
 * per i filtri OGC.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloComparisonComboBox', {
	
	extend: 'Ext.form.ComboBox',
	
	alias: 'widget.tolomeo_comparisoncombo',
    
 	/**
     * @property {Array} allowedTypes.
     * Tipi di operatori disponibili.
     */
    allowedTypes: [
        [OpenLayers.Filter.Comparison.EQUAL_TO, "="],
        [OpenLayers.Filter.Comparison.NOT_EQUAL_TO, "<>"],
        [OpenLayers.Filter.Comparison.LESS_THAN, "<"],
        [OpenLayers.Filter.Comparison.GREATER_THAN, ">"],
        [OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO, "<="],
        [OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO, ">="],
        [OpenLayers.Filter.Comparison.LIKE, "like"],
        // simulate ilike operator (not match case)
        ["ilike", "ilike"],
        [OpenLayers.Filter.Comparison.BETWEEN, "between"]
    ],

 	/**
     * @cfg {Boolean} allowBlank.
     * Stabilisce se consentire testo vuoto all'interno della combo.
     */
    allowBlank: false,

 	/**
     * @cfg {String} mode.
     * Stabilisce il metodo di caricamento dello store.
     */
    mode: "local",

 	/**
     * @cfg {Boolean} typeAhead.
     * 
     */
    typeAhead: true,

 	/**
     * @cfg {Boolean} forceSelection.
     * 
     */
    forceSelection: true,

 	/**
     * @cfg {String} triggerAction.
     * 
     */
    triggerAction: "all",

 	/**
     * @cfg {Integer} width.
     * 
     */
    width: 80,

 	/**
     * @cfg {Boolean} editable.
     * 
     */
    editable: true,
  
	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloComparisonComboBox.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
        var defConfig = {
            displayField: "text",
            valueField: "value",
            store: new Ext.data.SimpleStore({
                data: this.allowedTypes,
                fields: ["value", "text"]
            }),
            value: (this.value === undefined) ? this.allowedTypes[0][0] : this.value,
            listeners: {
                // workaround for select event not being fired when tab is hit
                // after field was autocompleted with forceSelection
                "blur": function() {
                    var index = this.store.findExact("value", this.getValue());
                    if (index != -1) {
                        this.fireEvent("select", this, this.store.getAt(index));
                    } else if (this.startValue != null) {
                        this.setValue(this.startValue);
                    }
                }
            }
        };
        
        Ext.applyIf(this, defConfig);
        
        this.callParent();
    }

});
