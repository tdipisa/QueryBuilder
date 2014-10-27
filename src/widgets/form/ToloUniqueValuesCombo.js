/** api: (define)
 *  module = gxp.widgets.form
 *  class = WPSUniqueValuesCombo
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.ns('TolomeoExt.widgets.form');

/** api: constructor
 *  .. class:: WPSUniqueValuesCombo(config)
 *   
 *      A combo box targeted to show unique values for a given field and layer.
 *      It accepts all the config values of ComboBox.
 */
Ext.define('TolomeoExt.widgets.form.ToloUniqueValuesCombo', {
	
	extend: 'Ext.form.ComboBox',
	
	alias: 'widget.tolomeo_uniquevaluescb',
	
    // private
    getParams : function(q){
    	var superclass = this.superclass;
    	
        var params = superclass.getParams.call(this, q);
        Ext.apply(params, this.store.baseParams);
        return params;
    },
    
    // private
    initList : function() { // warning: overriding ComboBox private method
        this.superclass().initList.call(this);
        if (this.pageTb && this.pageTb instanceof Ext.PagingToolbar) {
            this.pageTb.afterPageText = "";
            this.pageTb.beforePageText = "";
            this.pageTb.displayMsg = "";
        }
    }
});

