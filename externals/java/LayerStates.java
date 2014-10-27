package it.prato.comune.sit.plugin.demo.states;

import it.prato.comune.sit.ConfigBean;
import it.prato.comune.sit.ILayersManager;
import it.prato.comune.sit.LayerPoligoniTerritorio;
import it.prato.comune.sit.Layers;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import org.opengis.feature.simple.SimpleFeature;

/**
 * Classe demo LayerStates.
 * 
 * @author Mattia Gennari
 *
 */
public class LayerStates extends LayerPoligoniTerritorio {

    public final static int defaultCodTPN = 1;
    
    public static final String NL_NAME = "NL_NAME";
    public static final String NL_ABBR = "NL_ABBR";
    public static final String NL_PERS = "NL_PERS";
    
    public static final String UR_NAME = "UR_NAME";
    public static final String UR_ABBR = "UR_ABBR";
    public static final String UR_PERS = "UR_PERS";
    
    public static final String RE_NAME = "RE_NAME";
    public static final String RE_ABBR = "RE_ABBR";
    public static final String RE_PERS = "RE_PERS";
    
    public String getConfigPrefix() {  
    	return "STATES";  
    };

    /**
     * @param ter
     * @return LayerStates
     */
    static public LayerStates getInstance(ILayersManager ter) {
       return (LayerStates) ter.getLayerByCodTPN(defaultCodTPN);
    }
    
    /**
     * Costruttore della classe LayerStates.
     * 
     * @param configFilePath
     * @param logger
     * @param configBean
     * @param nome
     * @param codTPN
     * @param layer
     * @param nomiCampi
     */
    public LayerStates(String configFilePath,
            LogInterface logger, ConfigBean configBean, String nome, int codTPN, int layer,
            HashMap<String, String> nomiCampi) {
        super(configFilePath, logger, configBean, nome, codTPN, layer, nomiCampi);
    }
    
    /**
     * Costruttore di default della classe LayerStates.
     */   
    public LayerStates() {
        super();
    }

    /* 
     * @see it.prato.comune.sit.LayerTerritorio#creaOggetto(org.opengis.feature.simple.SimpleFeature)
     */
    protected OggettoTerritorio creaOggetto(SimpleFeature curFeat) {
        return new PoligonoState(logger, this, curFeat); 
    }

    /* 
     * @see it.prato.comune.sit.LayerTerritorio#initNomiCampi(java.util.Properties, java.lang.String, java.lang.String)
     */
    protected void initNomiCampi(Properties pr, String ente, String nomeLayer) {
        addnomicampi(pr,ente,nomeLayer, Layers.NL_IDTPN);
        addnomicampi(pr,ente,nomeLayer, NL_NAME);
        addnomicampi(pr,ente,nomeLayer, NL_ABBR);
        addnomicampi(pr,ente,nomeLayer, NL_PERS);
        
        addnomicampiLeggibili(pr,ente,nomeLayer, NL_NAME, UR_NAME);
        addnomicampiLeggibili(pr,ente,nomeLayer, NL_ABBR, UR_ABBR);
        addnomicampiLeggibili(pr,ente,nomeLayer, NL_PERS, UR_PERS);
        
        addnomicampiRegEx(pr,ente,nomeLayer, NL_NAME, RE_NAME);
        addnomicampiRegEx(pr,ente,nomeLayer, NL_ABBR, RE_ABBR);
        addnomicampiRegEx(pr,ente,nomeLayer, NL_PERS, RE_PERS);
    }
    
    /* 
     * @see it.prato.comune.sit.LayerTerritorio#initRicerche()
     */
    @Override
    protected void initRicerche() throws SITException  {
    	addRicerca(1, "Per nome", "findState", new Class[]{String.class}, "Nome stato");
    };

    /**
     * Trova uno stato per nome
     * @param nome
     * @return
     */
	@SuppressWarnings("unchecked")
	public List<PoligonoState> findState(String name) {
        
        ArrayList<String> valore = new ArrayList<String>();
        ArrayList<String> campi = new ArrayList<String>();
        
        campi.add(NL_NAME);
        
        valore.add(name);
        
        return (List<PoligonoState>) super.cercaPoligoniLike(campi, valore);        
    }
}