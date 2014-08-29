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
 * @overview Query Filter.
 *
 * @name Tolomeo - Interfaccia Query Filter
 * @author Tobia Di Pisa
 */

/**
 * Class: TolomeoExt.ToloQueryFilter
 *
 *
 */
Ext.define('TolomeoExt.ToloQueryFilter', {

	extend: 'Ext.Panel',

	/**
	 * initComponent: TolomeoExt.ToloQueryBuilderExt
	 * Crea un nuovo TolomeoExt.ToloQueryBuilderExt
	 *
	 * Returns:
	 * {<TolomeoExt.ToloQueryBuilderExt>} Un nuovo TolomeoExt.ToloQueryBuilderExt
	 */
	initComponent: function(){				
		this.border = 0;
		
		this.filterBuilder = new TolomeoExt.FilterBuilder({
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
        
		TolomeoExt.ToloQueryFilter.superclass.initComponent.call(this);
		
		this.add(this.attributeFieldSet);
    }   
    
});
