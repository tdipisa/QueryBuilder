/* 
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

/**
 * @overview Query Tool (ricerca alfanumerica libera general purpose).
 *
 * Strumento di ricerca alfanumerica libera (Query Tool) general purpose (in grado cioè di 
 * lavorare su qualunque layer vettoriale configurato nel sistema) per Tolomeo.
 *
 * @name Tolomeo - Interfaccia Query Builder
 * @author Tobia Di Pisa
 */

/**
 * Class: TolomeoExt.ToloQueryBuilderExt
 *
 *
 */
Ext.define('TolomeoExt.ToloQueryBuilderExt', {

	extend: 'Ext.Panel',

	/** 
	 * Property: paramsJS
	 * {JSONObject}
	 */
	paramsJS: null,

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,

	/**
	 * initComponent: TolomeoExt.ToloQueryBuilderExt
	 * Crea un nuovo TolomeoExt.ToloQueryBuilderExt
	 *
	 * Returns:
	 * {<TolomeoExt.ToloQueryBuilderExt>} Un nuovo TolomeoExt.ToloQueryBuilderExt
	 */
	initComponent: function(){	
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		//this.layout = "fit";
    	
		this.layerSelector = new TolomeoExt.ToloLayerSelector();
		this.queryfilter = new TolomeoExt.ToloQueryFilter();
			
		this.bbar = ["->", {
            text: "Cancella",
            //iconCls: "cancel",
            scope: this,
            handler: function() {
            	alert("cancel");
            }
        }, {
            text: "Cerca",
            //iconCls: "gxp-icon-find",
            handler: function() {
            	var filters = [];
            	var queryfilter = this.queryfilter.filterBuilder.getFilter();

				var attributeFilter = queryfilter;
				attributeFilter && filters.push(attributeFilter);
					
				var filter = filters.length > 1 ?
                    new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: filters
                    }) :
                    filters[0];
					
                var xmlFormat = new OpenLayers.Format.XML();
                var serialized = xmlFormat.write(filter);
                
            	alert(serialized);
            	
                /*var filters = [];
                if (queryForm.spatialFieldset.collapsed !== true) {
                    filters.push(new OpenLayers.Filter.Spatial({
                        type: OpenLayers.Filter.Spatial.BBOX,
                        property: featureManager.featureStore.geometryName,
                        value: this.target.mapPanel.map.getExtent()
                    }));
                }
                if (queryForm.attributeFieldset.collapsed !== true) {
                    var attributeFilter = queryForm.filterBuilder.getFilter();
                    attributeFilter && filters.push(attributeFilter);
                }
                featureManager.loadFeatures(filters.length > 1 ?
                    new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: filters
                    }) :
                    filters[0]
                );*/
            },
            scope: this
        }];
		
		TolomeoExt.ToloQueryBuilderExt.superclass.initComponent.call(this);
		
		this.add([this.layerSelector, this.queryfilter]);
    }   
    
});
