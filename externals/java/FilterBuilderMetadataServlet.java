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
/**************************************************************
* Copyright © 2007 Comune di Prato - All Right Reserved
* Project:      Tolomeo - WebGis con funzioni di editing
* File:         AjaxQueryServlet.java
* Function:     Servlet di default per query oggetti secondo criterio
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 04/09/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * Questa classe implementa la servlet di default che viene utilizzata da Tolomeo per 
 * reperire i metadati relativi agli attributi, ed e' pensata per essere richiamata via ajax.
 * <br/>il risultato, in formato JSON extjs compatibile 
 * può essere utilizzato per tools che richiedono tali tipo di informazioni per l'inizializzazione dei sottocomponenti. 
 * 
 * 
 * Accetta i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - codice identificativo (nel package it.prato.comune.sit) del layer sul quale viene fatta l'interrogazione</li>
 * </ul>
 *  
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) la stringa JSON che rappresenta un
 * oggetto di tipo {@link net.sf.json.JSONObject} JSONObject.
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *         
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 * 
 */
public class FilterBuilderMetadataServlet extends TolomeoServlet {

	private static final long serialVersionUID = -7380651195335942052L;

	@Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);           
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	// Recupero il logger
        LogInterface logger = getLogger(request);
        
        // Recupero i parametri
        Integer codTPN     = getCodTPN(request);
        
        logger.debug("FilterBuilderMetadataServlet codTPN: " + codTPN);
        
        SITLayersManager comunePO = null;
        String risposta     = null;
        
        try {

        	// Recupero l'oggetto Territorio
        	comunePO = getTerritorio(logger);
	        // Recupero il layer identificato da codTPN
	        LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
	        
	        if (layer != null) {
	        	
	        	HashMap<String, String> layerAttributeNames = layer.getNomiCampi();
	        	HashMap<String, String> layerAttributeNamesReadable = layer.getNomiCampiLegibili();
	        	HashMap<String, String> layerAttributeRegEx = layer.getAttributiRegEx();
	        	
	        	HashMap<String, Class<?>> layerAttributeTypes = null;
	        	try {
	        		layerAttributeTypes = layer.getAttributiTipo();
				} catch (SITException e) {
		        	String errMsg = "Non è possibile reperire il tipo degli attributi per il layer con codice " + codTPN;
		        	risposta = new ExtStoreError(errMsg,null).toJSONString();
		            logger.error(errMsg);
				}
	        	
	        	JSONArray jsonArray = new JSONArray();
	        	
	        	Set<String> keys = layerAttributeNamesReadable.keySet();
	        	Iterator<String> iterator = keys.iterator();
	        	while(iterator.hasNext()){
	        		String key = (String)iterator.next();
	        		
	        		JSONObject obj = new JSONObject();
	        		obj.put("name", layerAttributeNamesReadable.get(key));
	        		obj.put("dbname", layerAttributeNames.get(key));
	        		obj.put("type", layerAttributeTypes.get(key));
	        		obj.put("restriction", "undefined");
	        		obj.put("regex", layerAttributeRegEx.get(key));
	        		
	        		jsonArray.add(obj);	        		
	        	}
	        	
	        	risposta = SITExtStore.extStore(jsonArray, null).toString();
	        	
	        } else {
	        	String errMsg = "Non è possibile effettuare i suggerimenti per la ricerca perchè il layer con codice " + codTPN + " è nullo";
	        	risposta = new ExtStoreError(errMsg,null).toJSONString();
	            logger.error(errMsg);
	        }
        } finally {        	
                
            if(comunePO != null){
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager",e);
                }
            }
            
            request.setAttribute("geometry", risposta);
            forward(request, response);
        }
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxQuery.jsp";
    }
}