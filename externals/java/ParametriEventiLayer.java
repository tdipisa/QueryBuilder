/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.web.parametri;



public class ParametriEventiLayer {
	
	private Integer codTPN;            //ID del layer nel package SIT
	private String nomeLayer;
	private String descrizioneLayer;
	//private String nomeChiave="key";
	private Integer tipoGeometria;
//	private Integer tipoGeometria1;
	private Boolean copertura=false;   // indica se il layer e' una copertura (editing aggiunta/sottrazione se attivo UpdateGeom
	private String clippingCodTPN=null;
	private Boolean caricaLayerSeparato = false;
	private ParametriMappa mappaLayerSeparato = null;
	private String customQueryOnSelect = null;
	private String customQueryOnNOSelect = null;
	private Boolean autoIdentifyAllowed = false;
	private Boolean autoIdentifyWithHighlight = true;
	private Boolean queryBuilder = false;

	private ParametriEventoLayerVisList azioniEventiVis = new ParametriEventoLayerVisList();
	private ParametriEventoLayerCancList azioniEventiCanc = new ParametriEventoLayerCancList();
	private ParametriEventoLayerUpdateGeomList azioniEventiUpdateGeom = new ParametriEventoLayerUpdateGeomList();
	private ParametriEventoLayerUpdateAlphaList azioniEventiUpdateAlpha  = new ParametriEventoLayerUpdateAlphaList();
	private ParametriEventoLayerInsList azioniEventiIns = new ParametriEventoLayerInsList();
	private ParametriEventoLayerRicercaList azioniEventiRicercaList = new ParametriEventoLayerRicercaList();
	private ParametriEventoLayerCustomList azioniEventiCustomButtonList = new ParametriEventoLayerCustomList();
	
	private ParametriSnappingList snapping = new ParametriSnappingList();	
	
    public ParametriEventiLayer() {

    }

    public Integer getCodTPN() {
        return codTPN;
    }

    public void setCodTPN(Integer codTPN) {
        this.codTPN = codTPN;
    }

    public String getNomeLayer() {
        return nomeLayer;
    }

    public void setNomeLayer(String nomeLayer) {
        this.nomeLayer = nomeLayer;
    }

    public String getDescrizioneLayer() {
        return descrizioneLayer;
    }

    public void setDescrizioneLayer(String descrizioneLayer) {
        this.descrizioneLayer = descrizioneLayer;
    }
    
    public Integer getTipoGeometria() {
        return tipoGeometria;
    }

    public void setTipoGeometria(Integer tipoGeometria) {
        this.tipoGeometria = tipoGeometria;
    }

    public Boolean getCopertura() {
        return copertura;
    }

    public void setCopertura(Boolean copertura) {
        this.copertura = copertura;
    }
/*
    public Integer getTipoGeometria1() {
        return tipoGeometria1;
    }

    public void setTipoGeometria1(Integer tipoGeometria1) {
        this.tipoGeometria1 = tipoGeometria1;
    }
*/
    public ParametriEventoLayerVisList getAzioniEventiVis() {
        return azioniEventiVis;
    }

    public ParametriEventoLayerCancList getAzioniEventiCanc() {
        return azioniEventiCanc;
    }

    public ParametriEventoLayerUpdateGeomList getAzioniEventiUpdateGeom() {
        return azioniEventiUpdateGeom;
    }

    public ParametriEventoLayerUpdateAlphaList getAzioniEventiUpdateAlpha() {
        return azioniEventiUpdateAlpha;
    }

    public ParametriEventoLayerInsList getAzioniEventiIns() {
        return azioniEventiIns;
    }

    public void setAzioniEventiUpdateGeom(
            ParametriEventoLayerUpdateGeomList azioniEventiUpdateGeom) {
        this.azioniEventiUpdateGeom = azioniEventiUpdateGeom;
    }

    public void setAzioniEventiVis(ParametriEventoLayerVisList azioniEventiVis) {
        this.azioniEventiVis = azioniEventiVis;
    }

    public void setAzioniEventiCanc(ParametriEventoLayerCancList azioniEventiCanc) {
        this.azioniEventiCanc = azioniEventiCanc;
    }

    public void setAzioniEventiUpdateAlpha(
            ParametriEventoLayerUpdateAlphaList azioniEventiUpdateAlpha) {
        this.azioniEventiUpdateAlpha = azioniEventiUpdateAlpha;
    }

    public void setAzioniEventiIns(ParametriEventoLayerInsList azioniEventiIns) {
        this.azioniEventiIns = azioniEventiIns;
    }

    public ParametriEventoLayerRicercaList getAzioniEventiRicercaList() {
        return azioniEventiRicercaList;
    }

    public void setAzioniEventiRicercaList(
            ParametriEventoLayerRicercaList azioniEventiRicercaList) {
        this.azioniEventiRicercaList = azioniEventiRicercaList;
    }

    public Boolean getCaricaLayerSeparato() {
        return caricaLayerSeparato;
    }

    public void setCaricaLayerSeparato(Boolean caricaLayerSeparato) {
        this.caricaLayerSeparato = caricaLayerSeparato;
    }

    public ParametriMappa getMappaLayerSeparato() {
        return mappaLayerSeparato;
    }

    public void setMappaLayerSeparato(ParametriMappa mappaLayerSeparato) {
        this.mappaLayerSeparato = mappaLayerSeparato;
    }

    public String getClippingCodTPN() {
        return clippingCodTPN;
    }

    public void setClippingCodTPN(String clippingCodTPN) {
        this.clippingCodTPN = clippingCodTPN;
    }

    public String getCustomQueryOnSelect() {
        return customQueryOnSelect;
    }

    public void setCustomQueryOnSelect(String customQueryOnSelect) {
        this.customQueryOnSelect = customQueryOnSelect;
    }

    public String getCustomQueryOnNOSelect() {
        return customQueryOnNOSelect;
    }

    public void setCustomQueryOnNOSelect(String customQueryOnNOSelect) {
        this.customQueryOnNOSelect = customQueryOnNOSelect;
    }

    public ParametriEventoLayerCustomList getAzioniEventiCustomButtonList() {
        return azioniEventiCustomButtonList;
    }

    public void setAzioniEventiCustomButtonList(
            ParametriEventoLayerCustomList azioniEventiCustomButtonList) {
        this.azioniEventiCustomButtonList = azioniEventiCustomButtonList;
    }

    public Boolean getAutoIdentifyAllowed() {
        return autoIdentifyAllowed;
    }

    public void setAutoIdentifyAllowed(Boolean autoIdentifyAllowed) {
        this.autoIdentifyAllowed = autoIdentifyAllowed;
    }

    public Boolean getAutoIdentifyWithHighlight() {
        return autoIdentifyWithHighlight;
    }

    public void setAutoIdentifyWithHighlight(Boolean autoIdentifyWithHighlight) {
        this.autoIdentifyWithHighlight = autoIdentifyWithHighlight;
    }
    
    public Boolean getQueryBuilder() {
		return queryBuilder;
	}

	public void setQueryBuilder(Boolean queryBuilder) {
		this.queryBuilder = queryBuilder;
	}

	public ParametriSnappingList getSnapping() {
        return snapping;
    }

    public void setSnapping(ParametriSnappingList snapping) {
        this.snapping = snapping;
    }

    public Boolean getInteractable(){
    	return
    	((this.getAzioniEventiCanc().getAzioneList() != null)        && (this.getAzioniEventiCanc().getAzioneList().size() != 0)) ||
    	((this.getAzioniEventiIns().getAzioneList() != null)         && (this.getAzioniEventiIns().getAzioneList().size() != 0)) ||
    	((this.getAzioniEventiUpdateAlpha().getAzioneList() != null) && (this.getAzioniEventiUpdateAlpha().getAzioneList().size() != 0)) ||
    	((this.getAzioniEventiUpdateGeom().getAzioneList() != null)  && (this.getAzioniEventiUpdateGeom().getAzioneList().size() != 0))  ||
    	((this.getAzioniEventiVis().getAzioneList() != null)         && (this.getAzioniEventiVis().getAzioneList().size() != 0)) ||
    	this.getAzioniEventiCanc().getForceEnable() || 
    	this.getAzioniEventiIns().getForceEnable() ||
    	this.getAzioniEventiUpdateAlpha().getForceEnable() ||
    	this.getAzioniEventiUpdateGeom().getForceEnable() ||
    	this.getAzioniEventiVis().getForceEnable();
    }
    
    
    public Boolean getSnappable(){
        return
        this.getSnapping() != null && 
        this.getSnapping().getSnappingLayerList() != null && 
        this.getSnapping().getSnappingLayerList().size() > 0 && 
        (
            ((this.getAzioniEventiIns().getAzioneList() != null)         && (this.getAzioniEventiIns().getAzioneList().size() != 0)) ||        
            ((this.getAzioniEventiUpdateGeom().getAzioneList() != null)  && (this.getAzioniEventiUpdateGeom().getAzioneList().size() != 0))  ||                 
            this.getAzioniEventiIns().getForceEnable() ||        
            this.getAzioniEventiUpdateGeom().getForceEnable()
         );        
    }
  
}
