
Ext.ns('TolomeoExt.widgets');

/**
 * Class: ToloFilterView
 *
 * @overview Layer Selector.
 * @name Tolomeo - Interfaccia Filter View
 * @author Tobia Di Pisa
 */
Ext.define('TolomeoExt.widgets.ToloFilterView', {

	extend: 'Ext.Panel',

	/**
	 * initComponent: TolomeoExt.widgets.ToloFilterView
	 * Crea un nuovo TolomeoExt.widgets.ToloFilterView
	 *
	 * Returns:
	 * {<TolomeoExt.ToloFilterView>} Un nuovo TolomeoExt.widgets.ToloFilterView
	 */
	initComponent: function(){	
		this.border = 0;
			
		this.filterTypeStore = Ext.create('Ext.data.Store',{
		    fields: [{
		    	name: 'type', 
		    	mapping: 'type'
		    },{
		    	name: 'name', 
		    	mapping: 'name'
		    }],
		    data: [
	           {type: 1, name: "OGC"},
	           {type: 2, name: "CQL"}
		    ]
		});

		this.filterTypeCombo = Ext.create('Ext.form.ComboBox',{
			typeAhead: true,
			forceSelection: true, 
			width: 200,
			queryMode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			editable: false,
			fieldLabel: 'Tipo Filtro',
			name: 'name',
			value: 1,
			valueField: 'type',
			displayField: 'name',
			store: this.filterTypeStore,
		    listeners:{
		         scope: this,
		         select: function(combo, records, eOpts){
		        	 this.fireEvent("typeselected", records);
		         }
		    }
		});	
		
		this.filterView = Ext.create('Ext.form.TextArea', {
			flex: 1,
	        xtype: 'textareafield',
	        grow: true,
	        name: 'filterView',
	        fieldLabel: 'Filtro',
	        anchor: '100%',
	        labelAlign: "top",
	        height: 100
	    });
		
		var viewContainer = Ext.create('Ext.Panel', {
			border: false,
			height: 120,
		    layout: {
		        type: 'hbox',
		        align: 'middle'
		    },
		    items: [
	            this.filterView,
	            {
			        xtype: 'button',
			        iconCls: "filterviewupdate",
//			        style: "padding-top: 20px;",
			        tooltip: "Aggiorna Filtro",
			        handler: function(button){
			        	var selectedRecord = this.filterTypeCombo.findRecordByValue(this.filterTypeCombo.getValue());
			        	this.fireEvent("typeselected", selectedRecord);
			        },
			        scope: this
			    }
	        ]
		});
				
		this.filterViewFieldSet = Ext.create('Ext.form.FieldSet',{
			title: 'Vista Filtro',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			collapsed : true,
			checkboxToggle: true,
			items:[this.filterTypeCombo, viewContainer]
		});
		
		this.callParent();
		
		this.add(this.filterViewFieldSet);
    },
    
    setFilter: function(filterString){
    	this.filterView.setRawValue(filterString);
    },
    
    resetView: function(){
    	this.filterView.setRawValue("");
    	this.filterTypeCombo.reset();
    }
    
});
