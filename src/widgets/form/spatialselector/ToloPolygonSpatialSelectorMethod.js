
Ext.ns('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin per la selezione poligonale
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',
	
	alias: 'widget.tolomeo_spatial_polygon_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'Poligono',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Poligono',

	/**
     * Attiva il controllo.
     * 
     */
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.activate.call(this);

		if(this.qbEventManager){
			this.qbEventManager.fireEvent("polygonSpatialSelectorActive", this);
		}
	},

	/**
     * Restituisce il controllo di disegno di questo componente.
     * 
     */
	getDrawControl: function(){
		return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.Polygon
        );
	},

	/**
     * Disattiva il controllo.
     * 
     */
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.draw){
			this.draw.deactivate();	
		}
		if (this.drawings) {
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("removelayer", this.drawings);
			}
			
			this.drawings = null;
		}
	},

	/**
     * Reimposta il controllo di sidegno poligonale.
     * 
     */
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.reset.call(this);
		if(this.drawings){
			this.drawings.removeAllFeatures();
		}
    }
	
});
