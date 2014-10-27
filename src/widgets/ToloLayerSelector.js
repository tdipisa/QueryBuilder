
Ext.ns('TolomeoExt.widgets');

/**
 * Widget per la selezione dei layers per cui il plugin query form è abilitato all'uso.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloLayerSelector', {

	extend: 'Ext.Panel',
	
	/**
	 * @cfg {Array} layers
	 * Array dei layers rappresentante lo store.
	 */
	layers: null,

	/**
     * Inizializza un componente di tipo TolomeoExt.widgets.ToloLayerSelector.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		this.border = 0;
		
		this.layerStore = Ext.create('Ext.data.Store', {
		    fields: [{
		    	name: 'descrizione',
		    	mapping: 'descrizione'
		    },{
		    	name: 'name', 
		    	mapping: 'name'
		    },{
		    	name: 'codTPN', 
		    	mapping: 'codTPN'
		    }],
		    data: this.layers
		});

		this.layerSelectorCombo = Ext.create('Ext.form.ComboBox',{
			typeAhead: true,
			forceSelection: true, 
			anchor: "-1",
			queryMode: 'local',
			triggerAction: 'all',
			emptyText: 'Seleziona il livello...',
			selectOnFocus: true,
			editable:false,
			fieldLabel: 'Livello',
			name: 'name',
			valueField: 'name',
			displayField: 'name',
			store: this.layerStore,
		    listeners:{
		         scope: this,
		         select: function(combo, records, eOpts){
		        	 this.fireEvent("layerselected", records);
		         }
		    }
		});	
		
		this.layerFieldSet = Ext.create('Ext.form.FieldSet', {
			title: 'Seleziona Livello',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			items:[this.layerSelectorCombo]
		});
		
		this.callParent();
		
		this.add(this.layerFieldSet);
    }   
	
});
