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

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.JSGeometryArrayList;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.SITPaginatedResult;
import it.prato.comune.sit.SortItem;
import it.prato.comune.sit.SortItem.Dir;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * Questa classe implementa la servlet di default che viene utilizzata da Tolomeo per 
 * come servizio di ricerca e export delle features, ed e' pensata per essere richiamata via ajax.
 * <br/>Il formato del risultato dipende dalla richiesta e può essere: in formato JSON extjs compatibile,
 * shp o spatialite. 
 * 
 * 
 * Accetta i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - codice identificativo (nel package it.prato.comune.sit) del layer sul quale viene fatta l'interrogazione</li>
 *  <li>SRID - sistema di rifermimento dei dato in output</li>
 *  <li>filter - filtro OGC o CQL da usare per la ricerca</li>
 *  <li>ogcFilterVersion - in caso di filtro OGC identifica la versione da usare per il parsing</li>
 *  <li>maxFeatures - numero di features per pagina</li>
 *  <li>startIndex - pagina da ritornarte al client</li>
 *  <li>format - Identofica il tipo di output (JSON, SHP o Spatialite)</li>
 * </ul>
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *         
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 * 
 */
public class SearchExportServlet extends TolomeoServlet {

	private static final long serialVersionUID = -7380651195335942052L;

	private static final int BUFSIZE = 4096;
	
	@Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);           
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	// Recupero il logger
        LogInterface logger = getLogger(request);
        
        String filename = request.getParameter("filename");
        
        if(filename != null && !filename.isEmpty()){
        	String tempdirpath = System.getProperty("java.io.tmpdir");
        	File tempDir = new File(tempdirpath);
        	
            ServletOutputStream outStream = null;
            DataInputStream in = null;
            File file = null;
            try {
    			file = new File(tempDir, filename);
                int length   = 0;
                
            	outStream = response.getOutputStream();
	            ServletContext context  = getServletConfig().getServletContext();
	            String mimetype = context.getMimeType(file.getPath());
	            
	            // sets response content type
	            if (mimetype == null) {
	                mimetype = "application/octet-stream";
	            }
	            response.setContentType(mimetype);
	            response.setContentLength((int)file.length());
	            String fileName = (new File(file.getPath())).getName();
	            
	            // sets HTTP header
	            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
	            
	            byte[] byteBuffer = new byte[BUFSIZE];
	            in = new DataInputStream(new FileInputStream(file));
	            
	            while ((in != null) && ((length = in.read(byteBuffer)) != -1)){
	                outStream.write(byteBuffer, 0, length);
	            }
	            
            }catch(IOException ex){
            	String errMsg = "Errore riscontrato scaricando il file";
                logger.error(errMsg, ex);
            } finally {
                in.close();
                outStream.close();
                
                file.delete();
            }
        }else{
        	doPost(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	// Recupero il logger
        LogInterface logger = getLogger(request);
        
        // Recupero i parametri
        Integer codTPN    = getCodTPN(request);
        String srid       = request.getParameter("SRID");
        String filter     = request.getParameter("filter");
        String ogcFilterVersion     = request.getParameter("ogcFilterVersion");
        
        Integer maxFeatures = Integer.parseInt(request.getParameter("maxFeatures"));
        maxFeatures = maxFeatures == -1 ? null : maxFeatures;
        Integer startIndex = Integer.parseInt(request.getParameter("startIndex"));
        startIndex = startIndex == -1 ? null : startIndex;
        
        String format = request.getParameter("format");
        
        logger.debug("SearchExportServlet codTPN: " + codTPN);
        
        SITLayersManager comunePO = null;
        String resp     = null;
        
        try {

        	// Recupero l'oggetto Territorio
        	comunePO = getTerritorio(logger);
	        // Recupero il layer identificato da codTPN
	        LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
	        
	        if (layer != null) {
	        	try {
	        		if((format!=null) && (format.equals("ext"))){	        
	        			Map<String, String> attributes = layer.getNomiCampi();
        				Set<String> attributesKeys = attributes.keySet();
        				
        				// Manages the order of the features to return
        				Iterator<String> keyIterator = attributesKeys.iterator();
        				
        				int size = attributes.size();
        				SortItem[] sortItems = new SortItem[size];
        				int i = 0;
	        			while(keyIterator.hasNext() && i<size){
	        				String key = (String)keyIterator.next();
	        				
	        				SortItem sortItem = new SortItem();
	        				sortItem.setNomeLogico(key);
	        				sortItem.setOrdine(Dir.CRESCENTE);
	        				
	        				sortItems[i] = sortItem;
	        				i++;
	        			}
	        			
	        			//
	        			// Search the features
	        			//
	        			SITPaginatedResult pagRes = layer.searchByFilter(filter, ogcFilterVersion, maxFeatures, startIndex, sortItems);
	        			List<? extends OggettoTerritorio> pagResList = pagRes.getResult();
	        			
	        			JSONObject obj = new JSONObject();
	        			obj.put("success", "true");
	        			obj.put("total", pagRes.getTotalCount());

	        			//
	        			// Retrieve the page bbox information
	        			//
	        			JSGeometryArrayList<JSGeometry> geometryList = JSGeometryArrayList.toJSGeometryArrayList(pagResList, srid, logger, true);
	        			String pageBBOX = geometryList.getBoundingbox();
	        			
	        			JSONObject metadataObj = new JSONObject();
	        			metadataObj.put("pageBBOX", pageBBOX);	        			
	        			
	        			JSONArray jsonArray = new JSONArray();
	        			JSONArray metadataFields = new JSONArray();
	        			
	        			//
	        			// Populate the JSON object of the features to return as response for the store
	        			//
	        			Iterator<?  extends OggettoTerritorio> iterator = pagResList.iterator();
	        			while(iterator.hasNext()){
	        				OggettoTerritorio ogg = (OggettoTerritorio)iterator.next();
	        				   
	        				JSONObject attrObj = new JSONObject();
	        				
		        			Iterator<String> keysIterator = attributesKeys.iterator();	
	        				while(keysIterator.hasNext()){
	        					String key = (String) keysIterator.next();
	        					String attrName = attributes.get(key);
	        					
	        					// Populate the result list
	        					Object attributeValue = ogg.getAttributeByNL(key);
	        					
	        					if(!attrName.contains("FID")){
	        						attrObj.put(attrName, attributeValue);
	        					}
	        					
	        					String geometry = ogg.getGeometryAttributeWKT();
	        					if(geometry != null){
	        						attrObj.put("geometry", geometry);
	        					}
	        				}

	        				jsonArray.add(attrObj);
	        			}
	        			
	        			// Populate the metadata list
        				Iterator<String> keysIterator = attributesKeys.iterator();	
        				while(keysIterator.hasNext()){
        					String key = (String) keysIterator.next();
        					String attrName = attributes.get(key);
        					
        					JSONObject metadataField = new JSONObject();
        					if(!attributes.get(key).contains("FID")){
        						metadataField.put("name", attrName);
        						metadataField.put("mapping", attrName);
        						metadataFields.add(metadataField);
        					}
        				}

        				// Finish populating the metadata list with the geometry field
	        			JSONObject metadataField = new JSONObject();
    					metadataField.put("name", "geometry");
    					metadataField.put("mapping", "geometry");
    					
    					metadataFields.add(metadataField);
    					
    					metadataObj.put("fields", metadataFields);	
    					
    					obj.put("metaData", metadataObj);       			
	        			obj.put("rows", jsonArray);
	        			
	        			resp = obj.toString();
	        			
	        		}else if(format!=null){
	        			String tempdirpath = System.getProperty("java.io.tmpdir");
	        			File shp = layer.exportData(filter, ogcFilterVersion, maxFeatures, startIndex, null, tempdirpath, format);

	        			JSONObject obj = SITExtStore.extStoreFromString(shp.getName());
	        			
	        			resp = obj.toString();
	        		}
				} catch (SITException e) {
	            	String errMsg = "SITException in SearchExportServlet durante la ricerca";
	            	resp = new ExtStoreError(e).toJSONString();
	                logger.error(errMsg, e);
				}
	        	
	        } else {
	        	String errMsg = "Non è possibile effettuare la ricerca perchè il layer con codice " + codTPN + " è nullo";
	        	resp = new ExtStoreError(errMsg,null).toJSONString();
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
            
            if(resp == null){
	        	String errMsg = "Errore durante la ricerca output: null";
	        	resp = new ExtStoreError(errMsg,null).toJSONString();
	            logger.error(errMsg);
            }
            
            request.setAttribute("geometry", resp);
            forward(request, response);
        }
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxQuery.jsp";
    }
   
}