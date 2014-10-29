// /////////////////////////////////////
// requires OpenLayers/Control.js
// requires OpenLayers/Handler/Box.js
// /////////////////////////////////////

/**
 * Controllo OpenLayers per la selezione del Box.
 * 
 * @extends {OpenLayers.Control}
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
OpenLayers.Control.SetBox = OpenLayers.Class(OpenLayers.Control, {

    /**
     * @cfg {OpenLayers.Control.TYPE} type [displayProjection="OpenLayers.Control.TYPE_TOOL"]
     * 
     */ 
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * @cfg {Boolean} out [displayProjection="false"]
     * 
     */ 
    out: false,
    
    /**
     * @cfg {Object} aoi [displayProjection="false"]
     * 
     */ 
    aoi: null,
    
    /**
     * @cfg {OpenLayers.Bounds} boxes [displayProjection="false"]
     * 
     */ 
    boxes: null,
    
    /**
     * @cfg {String} currentAOI [displayProjection="false"]
     * 
     */ 
    currentAOI: "",
    
    /**
     * @cfg {Function} onChangeAOI [displayProjection="false"]
     * 
     */ 
    onChangeAOI: null,
    
    /**
     * @cfg {String} layerName [displayProjection="false"]
     * 
     */ 
    layerName: "AOI",
    
    /**
     * @cfg {Object} aoiStyle [displayProjection="false"]
     * 
     */ 
    aoiStyle: null,
    
    /**
     * @cfg {OpenLayers.Map} out [displayProjection="false"]
     * 
     */ 
    map: null,
    
    /**
     * @cfg {Boolean} displayInLayerSwitcher [displayProjection="false"]
     * 
     */ 
    displayInLayerSwitcher: false,

	/**
     * Disegna il BOX.
     * 
     */ 
    draw: function() {
       
        this.handler = new OpenLayers.Handler.Box(this,
        {
            done: this.setAOI
        }, 
        {
            boxDivClassName: this.boxDivClassName   
        },
        {
            keyMask: this.keyMask
        });
    },

	/**
     * Imposta la regione di interesse risultante dal disegno dell'utente sulla mappa.
     * @param {Object} la posizione del Box nella mappa.
     * 
     */
    setAOI: function (position) {
        var control;
      
        if(this.map.enebaleMapEvent)
            control = this.map.enebaleMapEvent;
        else
            control = false;
           
        if(control){        
            if(this.aoi!=null){       
                this.boxes.removeFeatures(this.aoi);
            }
            
            var bounds;
            
            if (position instanceof OpenLayers.Bounds) {
                if (!this.out) {
                    var minXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.left, position.bottom));
                    var maxXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.right, position.top));
                    bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                        maxXY.lon, maxXY.lat);

                    this.currentAOI= minXY.lon+','+minXY.lat+','+
                    maxXY.lon+','+maxXY.lat;   
                } else {
                    var pixWidth = Math.abs(position.right-position.left);
                    var pixHeight = Math.abs(position.top-position.bottom);
                    var zoomFactor = Math.min((this.map.size.h / pixHeight),
                        (this.map.size.w / pixWidth));
                    var extent = this.map.getExtent();
                    var center = this.map.getLonLatFromPixel(
                        position.getCenterPixel());
                    var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                    var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                    var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                    var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                    bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);

                    this.currentAOI=xmin+','+ymin+','+xmax+','+ymax;
                }

                if(this.layerName){
                    var x=this.map.getLayersByName(this.layerName);
                    var index=null;
                    if(x.length>0){
                        index=this.map.getLayerIndex(x[0]);
                        this.map.removeLayer(x[0]);
                    }
                    var me=this;
                    this.boxes  = new OpenLayers.Layer.Vector( this.layerName,{
                        displayInLayerSwitcher: me.displayInLayerSwitcher,
                        styleMap: me.aoiStyle
                    });
                    this.aoi = new OpenLayers.Feature.Vector(bounds.toGeometry());
                    this.boxes.addFeatures(this.aoi);
                    this.map.addLayer(this.boxes);

                    if(index)
                        this.map.setLayerIndex(this.boxes,index); 
                }

                if(this.onChangeAOI)
                    this.onChangeAOI();
                   
            } else { 
                //
                // it's a pixel
                //
                if (!this.out) {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() + 1);
                } else {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() - 1);
                }
            }
        }      
    },

    CLASS_NAME: "OpenLayers.Control.SetBox"
    	
});
