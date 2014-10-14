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
 * Class: TolomeoExt.ToloPanelInter
 * Layout per applicazioni internet: toolbar nord, mappa center, pannello est (accordion ricerche e legenda) e pannello gestionale ovest (per default collapsed).
 *
 * Inherits from:
 *  - <TolomeoExt.ToloPanelBase>
 *  
 * Author: 
 * Mattia Gennari
 *
 */

Ext.define('TolomeoExt.ToloPanelInter', {

	extend: 'TolomeoExt.ToloPanelBase',
	alias:  'tx_ToloPanelInter',

	/** 
	 * Property: withDataPanel
	 * {Boolean} Indica se � presente o meno il data panel (iframe pannello).
	 * 
	 */
	withDataPanel: true,
	
	/** 
	 * Property: withToolsPanel
	 * {Boolean} Indica se � presente o meno il tools panel (pannello strumenti).
	 * 
	 */
	withToolsPanel: true,
	
	/** 
	 * Property: collapsedToolsPanel
	 * {Boolean}
	 * 
	 */
	collapsedToolsPanel: false,
	
	/** 
	 * Property: collapsedDataPanel
	 * {Boolean} 
	 * 
	 */
	collapsedDataPanel: true,
	
	/** 
	 * Property: withLegendaPanel
	 * {Boolean} Indica se � presente o meno la legenda.
	 * 
	 */
	withLegendaPanel: true,
	
	/** 
	 * Property: withQueryPanel
	 * {Boolean}
	 * 
	 */
	withQueryPanel : true,	
	
	/** 
	 * Property: initComponent
	 * 
	 */
	initComponent: function(){

		this.mapPanelOpt = {};
		this.layout = 'border';
		this.monitorResize = true;
		
		if (this.toolbarOpt==null) {
			this.toolbarOpt = {};
		} else {
			TolomeoExt.applyIfEmpty(this.toolbarOpt, {
				withPanArrows: true,
				withQuery: false,
				withLegenda: false,
				withNuovo: false,
				withUpdateAlfa: false,
				withAdd: false,
				withSubtract: false,
				withAddSub: false,
				withVertexEdit: false,
				withDragDrop: false,
				withDelete: false,
				withShowCoordinate: false,
				withSnap: false
			});
		}
		
		if (this.withToolsPanel) {
			if (this.withLegendaPanel) {
				this.legendaPanelOpt = this.legendaPanelOpt || {};
			}
			if (this.withQueryPanel)   this.ricercaPanelOpt = this.ricercaPanelOpt || {};
			if (this.withQueryBuilderPanel){
				this.queryBuilderPanelOpt = this.queryBuilderPanelOpt || {};
				this.featureGridPanelOpt = this.featureGridPanelOpt || {};
			}   
		}
		
		this.callParent(arguments);
		
		// Pannello strumenti in cui inserisco Ricerche e Legenda
		if (this.withToolsPanel) {
			
				// Pannello applicazione
			if (this.withDataPanel==true) {
				var frameName = 'pannello';
				
				this.dataPanel = Ext.create('Ext.Panel', {
					title: 'Informazioni',
					layout: 'fit',
					iconCls: 'iconPannelloInfo',
					tbar: ['->',{
						text: 'Stampa',
						iconCls: 'iconPrint',
						tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
			            handler: function(){
			            	top.frames[frameName].focus();
							top.frames[frameName].print();
						}, scope: this   
					}],
					items: [{
						xtype: 'tx_toloIFrame',
						iFrameName: frameName, 
						url: ''
					}]
				});
			}
			
			var items = [this.ricercaPanel, this.queryBuilderPanel]
			if (this.withLegendaPanel) items.push(this.legendaPanel);
			if (this.withDataPanel)    items.push(this.dataPanel);
			
			this.toolsPanelOpt = this.toolsPanelOpt || {}; 
				
			TolomeoExt.applyIfEmpty(this.toolsPanelOpt, {
				title: 'Strumenti',
				width: 350,
				minWidth: 270,
				maxWidth: 350,
				split: true,
				collapsible: true
			});
			
			Ext.apply(this.toolsPanelOpt, {
				region:'east',
				layout:'accordion',
				animCollapse: false,    // NB. Deve essere false per evitare ricaricamento iframe
				multi: false,
				collapsed: this.collapsedToolsPanel,
				floatable: false,
				layoutConfig:{
		            animate: false
		        },
				items: items
			});
			
			this.toolsPanel = Ext.create('Ext.Panel',this.toolsPanelOpt);
			this.add(this.toolsPanel);
			
			// /////////////////////////
			// Feature Grid Panel
			// /////////////////////////
		    var fgItems = [this.featureGridPanel];
			
			var fgConfig = {
				region: 'south',
				height: 300,
				minHeight: 200,
				maxHeight: 400,
				collapsible: true,
				items: fgItems
			}
			
			this.featureGridContainer = Ext.create('Ext.Panel', fgConfig);
			this.add(this.featureGridContainer);
		}
		
		this.add(this.mapPanel);
	},

	beforeOpenUrl: function(url, target) {	
		if (!this.toolsPanel.isVisible() && url!='about:blank') {	
			this.toolsPanel.on(
				'expand',
				function() {
					
					var activeItem = this.toolsPanel.down('panel:not([collapsed])');					
					/*
					if (this.toolsPanel.layout.activeItem.id != 'dataPanel') { 									
						this.toolsPanel.layout.setActiveItem("dataPanel",true);	
						this.toolsPanel.doLayout(false,true);
					} else {						
						if(this.dataPanel.collapsed){
							this.dataPanel.expand();
						}
					}*/
					if (activeItem.id != 'dataPanel') {
						//activeItem.collapse();
						this.dataPanel.expand();
						//this.toolsPanel.layout.setActiveItem("dataPanel",true);	
						//this.toolsPanel.doLayout(false,true);
					} else {						
						if(this.dataPanel.collapsed){
							this.dataPanel.expand();
						}
					}
				},
				this,
				{single:true}
			);
			this.toolsPanel.expand();
		} else {
			var activeItem = this.toolsPanel.down('panel:not([collapsed])');					
			
			if (activeItem.id != 'dataPanel') { 
				//activeItem.collapse();
				this.dataPanel.expand();
				//this.toolsPanel.layout.setActiveItem("dataPanel");
				//this.toolsPanel.doLayout(false,true);
			} else {			
				if(this.dataPanel.collapsed){
					this.dataPanel.expand();
				}
			}
			
			/*
			if (this.toolsPanel.layout.activeItem.id != 'dataPanel') { 						
				this.toolsPanel.layout.setActiveItem("dataPanel");
				this.toolsPanel.doLayout(false,true);
			} else {			
				if(this.dataPanel.collapsed){
					this.dataPanel.expand();
				}
			}
			*/		
		}
	},
	
	/**
     * Method: afterRender
     * Metodo privato incovato dopo che il pannello � stato renderizzato.
     * 
    */
	afterRender: function() {	
    	this.callParent(arguments);
		
		if (this.withToolsPanel && this.withDataPanel) {
			this.api.on("beforeOpenUrl", this.beforeOpenUrl, this);
		}
							
		var thisToolsPanel = this.toolsPanel;
		if (this.legendaPanel) {
			this.legendaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.legendaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
		if (this.ricercaPanel) {
			this.ricercaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.ricercaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
	}
});
