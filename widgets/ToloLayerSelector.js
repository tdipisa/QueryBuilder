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
 * @overview Layer Selector.
 *
 * @name Tolomeo - Interfaccia Layer Selector
 * @author Tobia Di Pisa
 */

/**
 * Class: ToloLayerSelector
 *
 *
 */
Ext.define('TolomeoExt.ToloLayerSelector', {

	extend: 'Ext.Panel',

	/**
	 * initComponent: TolomeoExt.ToloLayerSelector
	 * Crea un nuovo TolomeoExt.ToloLayerSelector
	 *
	 * Returns:
	 * {<TolomeoExt.ToloLayerSelector>} Un nuovo TolomeoExt.ToloLayerSelector
	 */
	initComponent: function(){	
		this.border = 0;
		
		this.layerStore = Ext.create('Ext.data.Store',{
		    fields: [{
		    	name: 'description',
		    	mapping: 'description'
		    },{
		    	name: 'name', 
		    	mapping: 'name'
		    }],
	       	// TODO ///////////////////////////////////////
	        // Now we use a local store. The proper service 
		    // should be used in order to retrieve the 
		    // available layer list.
	       	// ////////////////////////////////////////////
		    data: layerStore
		});

		this.layerSelectorCombo = Ext.create('Ext.form.ComboBox',{
			typeAhead: true,
			forceSelection: true, 
			anchor: "-1",
			queryMode: 'local',
			triggerAction: 'all',
			emptyText: 'Seleziona il livello...',
			selectOnFocus: true,
			editable:false,
			fieldLabel: 'Livello',
			name: 'name',
			valueField: 'name',
			displayField: 'name',
			store: this.layerStore,
		    listeners:{
		         scope: this,
		         'select': function(){
		        	 // TODO ///////////////////////////////////////
		        	 // Manager here the event for the request 
		        	 // to retrieve the FeatureType schema 
		        	 // (attribute type and definition for the 
		        	 // QueryFilter component). 
		        	 // ////////////////////////////////////////////
		         }
		    }
		});	
		
		this.layerFieldSet = Ext.create('Ext.form.FieldSet',{
			title: 'Seleziona Livello',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			items:[this.layerSelectorCombo]
		});
		
		TolomeoExt.ToloLayerSelector.superclass.initComponent.call(this);
		
		this.add(this.layerFieldSet);
    }   
    
});
