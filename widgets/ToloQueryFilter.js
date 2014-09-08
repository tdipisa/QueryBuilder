
/**
 * @overview Query Filter.
 *
 * @name Tolomeo - Interfaccia Query Filter
 * @author Tobia Di Pisa
 */

Ext.ns('TolomeoExt.widgets');

/**
 * Class: TolomeoExt.ToloQueryFilter
 *
 *
 */
Ext.define('TolomeoExt.widgets.ToloQueryFilter', {

	extend: 'Ext.Panel',

	/**
	 * initComponent: TolomeoExt.widgets.ToloQueryBuilderExt
	 * Crea un nuovo TolomeoExt.widgets.ToloQueryBuilderExt
	 *
	 * Returns:
	 * {<TolomeoExt.widgets.ToloQueryBuilderExt>} Un nuovo TolomeoExt.widgets.ToloQueryBuilderExt
	 */
	initComponent: function(){				
		this.border = 0;
		
		this.filterBuilder = new TolomeoExt.widgets.ToloFilterBuilder({
            //xtype: "tolomeo_filterbuilder",
            //ref: "../filterBuilder",
            //attributes: schema,
            attributes: Ext.create('Ext.data.Store',{
                baseParams: {
                    TYPENAME: "topp:states"
                },
    		    fields: [{
    		    	name: 'name',
    		    	mapping: 'name'
    		    },{
    		    	name: 'type', 
    		    	mapping: 'type'
    		    },{
    		    	name: 'restriction', 
    		    	mapping: 'restriction'
    		    }],
    	       	// TODO ///////////////////////////////////////
    	        // Now we use a local store. The proper service 
    		    // should be used in order to retrieve the 
    		    // available layer list.
    	       	// ////////////////////////////////////////////
    		    data: [
    		           {name: "name", type: "xsd:string", restriction: undefined},
    		           {name: "code", type: "xsd:double", restriction: undefined},
    		           {name: "date", type: "xsd:date", restriction: undefined}
    		    ]
    		}),
            allowBlank: true,
            allowGroups: false
        });
		
		this.attributeFieldSet = Ext.create('Ext.form.FieldSet',{
			title: 'Filtro Per Attributo',
			//anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			items:[this.filterBuilder]
		});
		
		// TODO ////////////////////////////////////
		// Add here more controls for the filter
		// builder addition 
		//
		
		this.items = [this.attributeFieldSet];
        
//		TolomeoExt.widgets.ToloQueryFilter.superclass.initComponent.call(this);
		this.callParent();
		
    }   
    
});
