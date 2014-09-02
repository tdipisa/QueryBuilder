/** api: constructor
 *  .. class:: ComparisonComboBox(config)
 *   
 *      A combo box for selecting comparison operators available in OGC
 *      filters.
 */
Ext.define('TolomeoExt.ComparisonComboBox', {
	
	extend: 'Ext.form.ComboBox',
	
	alias: 'widget.tolomeo_comparisoncombo',
    
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

    allowBlank: false,

    mode: "local",

    typeAhead: true,

    forceSelection: true,

    triggerAction: "all",

    width: 80,

    editable: true,
  
    initComponent: function() {
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
        
        TolomeoExt.ComparisonComboBox.superclass.initComponent.call(this);
    }
});
