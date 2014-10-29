
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin per la selezione di una area di interesse circolare.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloCircleSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod',

	alias: 'widget.tolomeo_spatial_circle_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],
  
    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'Cerchio',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Cerchio',

	/**
     * Restituisce il controllo di disegno di questo componente.
     * 
     */
	getDrawControl: function(){
        var polyOptions = {sides: 100};
        
        return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.RegularPolygon,
            {
                handlerOptions: polyOptions
            }
        );
	},

	/**
     * Reimposta il controllo di disegno poligonale.
     * 
     */
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloCircleSpatialSelectorMethod.superclass.reset.call(this);
		if(this.circleCentroidLayer){
			this.circleCentroidLayer.removeAllFeatures();
		}
    }

});
