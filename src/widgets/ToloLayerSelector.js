
Ext.ns('TolomeoExt.widgets');

/**
 * Class: ToloLayerSelector
 *
 * @overview Layer Selector.
 * @name Tolomeo - Interfaccia Layer Selector
 * @author Tobia Di Pisa
 */
Ext.define('TolomeoExt.widgets.ToloLayerSelector', {

	extend: 'Ext.Panel',
	
	/** 
	 * Property: layers
	 * {Array}
	 */
	layers: null,

	/**
	 * initComponent: TolomeoExt.widgets.ToloLayerSelector
	 * Crea un nuovo TolomeoExt.widgets.ToloLayerSelector
	 *
	 * Returns:
	 * {<TolomeoExt.ToloLayerSelector>} Un nuovo TolomeoExt.widgets.ToloLayerSelector
	 */
	initComponent: function(){	
		this.border = 0;
		
		this.layerStore = Ext.create('Ext.data.Store',{
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
	       	// TODO ///////////////////////////////////////
	        // Now we use a local store. The proper service 
		    // should be used in order to retrieve the 
		    // available layer list.
	       	// ////////////////////////////////////////////
//		    data: layerStore
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
		        	 // TODO ///////////////////////////////////////
		        	 // Manage here the event for the request 
		        	 // to retrieve the FeatureType schema 
		        	 // (attribute type and definition for the 
		        	 // QueryFilter component). 
		        	 // ////////////////////////////////////////////
		        	 this.fireEvent("layerselected", records);
		         }
		    }
		});	
		
		this.layerFieldSet = Ext.create('Ext.form.FieldSet',{
			title: 'Seleziona Livello',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			items:[this.layerSelectorCombo]
		});
		
//		TolomeoExt.widgets.ToloLayerSelector.superclass.initComponent.call(this);
		this.callParent();
		
		this.add(this.layerFieldSet);
    }   
    
});