/**
 * 
 */
Ext.ns('TolomeoExt.events');

Ext.define('TolomeoExt.events.ToloQueryBuilderEvtManager', {
	
	extend: 'Ext.util.Observable',
	
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
				"polygonspatialselectoractive"	
		);		
	}
});