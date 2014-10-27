
Ext.ns('TolomeoExt.widgets');

/**
 * Widget per la visualizzazione del filtro impostato dall'utente nella form.
 * Le modifiche apportate dall'untente al filtro sono formattate in formato stringa.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloFilterView', {

	extend: 'Ext.Panel',

	/**
     * Inizializza un componente di tipo TolomeoExt.widgets.ToloFilterView.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		this.border = 0;
			
		this.filterTypeStore = Ext.create('Ext.data.Store', {
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

		this.filterTypeCombo = Ext.create('Ext.form.ComboBox', {
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
    
	/**
     * Imposta all'interno della TextArea definita la stringa corispondente il filtro selezionato.
     * @param {String} filterString Il filtro in formato stringa.
     */
    setFilter: function(filterString){
    	this.filterView.setRawValue(filterString);
    },
    
	/**
     * Reimposta la TextArea contenente il filro in formato stringa.
     *
     */
    resetView: function(){
    	this.filterView.setRawValue("");
    	this.filterTypeCombo.reset();
    }
    
});
