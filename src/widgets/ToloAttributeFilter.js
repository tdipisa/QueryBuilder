
Ext.ns('TolomeoExt.widgets');

/**
 * Class: TolomeoExt.ToloQueryFilter
 *
 * @overview Query Filter.
 * @name Tolomeo - Interfaccia Query Filter
 * @author Tobia Di Pisa
 *
 */
Ext.define('TolomeoExt.widgets.ToloAttributeFilter', {

	extend: 'Ext.Panel',
	
	caseInsensitiveMatch: false,

	/**
	 * initComponent: TolomeoExt.widgets.ToloQueryBuilderExt
	 * Crea un nuovo TolomeoExt.widgets.ToloQueryBuilderExt
	 *
	 * Returns:
	 * {<TolomeoExt.widgets.ToloQueryBuilderExt>} Un nuovo TolomeoExt.widgets.ToloQueryBuilderExt
	 */
	initComponent: function(){				
		this.border = 0;
		
		this.attributeFieldSet = Ext.create('Ext.form.FieldSet', {
			title: 'Filtro Per Attributo',
			//anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			collapsed : true,
			checkboxToggle: true
		});
		
		this.items = [this.attributeFieldSet];
        
		this.callParent();
    },
    
    addFilterBuilder: function(results){
    	var schema = results;
    	
		this.filterBuilder = new TolomeoExt.widgets.ToloFilterBuilder({
			 caseInsensitiveMatch: this.caseInsensitiveMatch,
			 attributes: Ext.create('Ext.data.Store', {
	   		    fields: [{
	   		    	name: 'name',
	   		    	mapping: 'name'
	   		    },{
	   		    	name: 'type', 
	   		    	mapping: 'type'
	   		    },{
	   		    	name: 'restriction', 
	   		    	mapping: 'restriction'
	   		    },{
	   		    	name: 'regex', 
	   		    	mapping: 'regex'
	   		    },{
	   		    	name: 'dbname', 
	   		    	mapping: 'dbname'
	   		    }],
	   		    data: schema
	   		}),
            allowBlank: true,
            allowGroups: false
        });
		
		this.attributeFieldSet.add(this.filterBuilder);
		
		this.enable();
    }
    
});
