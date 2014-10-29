
Ext.ns('TolomeoExt.widgets.form');

/**
 * Una combo box utilizzata per visualizzare valori unici per un dato campo del layer.
 * Questo componente accetta tutte le configurazioni previste per una Ext.ComboBox
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloUniqueValuesCombo', {
	
	extend: 'Ext.form.ComboBox',
	
	alias: 'widget.tolomeo_uniquevaluescb',
	
	/**
     * Restituisce i parametri usati nella richiesta ajax per il popolamento dello store.
     * @param {Object} q I parametri delo store per la richiesta.
	 * @return {Object} I patametri per la richiesta di popolamento dello store
     */
    getParams : function(q){
    	var superclass = this.superclass;
    	
        var params = superclass.getParams.call(this, q);
        Ext.apply(params, this.store.baseParams);
        return params;
    },
    
	/**
     * Inizializza la lista dei valori della paging toolbar
	 * 
     */
    initList : function() { 
    	// warning: overriding ComboBox private method
        this.superclass.initList.call(this);
        if (this.pageTb && this.pageTb instanceof Ext.PagingToolbar) {
            this.pageTb.afterPageText = "";
            this.pageTb.beforePageText = "";
            this.pageTb.displayMsg = "";
        }
    }
});

