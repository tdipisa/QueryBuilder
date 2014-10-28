
/**
 * Crea un poligono regolar dato il raggio. Utile per la creazione di cerchi gedetici.
 * @param {Object} origin Corrisponde al centro del poligono.
 * @param {Number} radius Rappresenta il raggio del poligono regolare.
 * @param {Number} sides Rappresenta il numero di lati per determinare il livello di aprossimazione 
                   del poligono regolare 20 approssima un cerchio. 
 * @param {Number} rotation angolo di rotazione in gradi.
 * @param {OpenLayers.Projection} projection Sistema di proiezione delle coordinate.
 */
OpenLayers.Geometry.Polygon.createGeodesicPolygon = function(origin, radius, sides, rotation, projection){
	if (projection.getCode() !== "EPSG:4326") {
		origin.transform(projection, new OpenLayers.Projection("EPSG:4326"));
	}
	var latlon = new OpenLayers.LonLat(origin.x, origin.y);
	
	var angle;
	var new_lonlat, geom_point;
	var points = [];
	
	for (var i = 0; i < sides; i++) {
		angle = (i * 360 / sides) + rotation;
		new_lonlat = OpenLayers.Util.destinationVincenty(latlon, angle, radius);
		new_lonlat.transform(new OpenLayers.Projection("EPSG:4326"), projection);
		geom_point = new OpenLayers.Geometry.Point(new_lonlat.lon, new_lonlat.lat);
		points.push(geom_point);
	}
	var ring = new OpenLayers.Geometry.LinearRing(points);
	return new OpenLayers.Geometry.Polygon([ring]);
};

Ext.ns('TolomeoExt.events');

/**
 * Plugin per la gesitione degli eventi che coinvolgono il query builder.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.events.ToloQueryBuilderEvtManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_event_manager",
	
	/**
     * Crea un nuovo TolomeoExt.events.ToloQueryBuilderEvtManager.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
		        /**
				 * @event
				 * Lanciato successivamente al disegno del box.
				 */
				"afterboxlayout",
				/**
				 * @event
				 * Lanciato dai componenti che lo necessitano per lo zoom all'extent specificato.
				 */
				"zoomtomapextent",
				/**
				 * @event
				 * Lanciato dai componenti che lo necessitano per la rimozione di un layer della mappa.
				 */
				"removelayer",
				/**
				 * @event
				 * Lanciato per l'aggiunta del controllo di selezione delle coordiante su mappa.
				 */
				"addcoordinatepickercontrol",
				/**
				 * @event
				 * Lanciato per l'aggiornemento del punto sulla mappa.
				 */
				"updatemappoint",
				/**
				 * @event
				 * Lanciato successivamente al disegno del box.
				 */
				"drawbuffer",
				/**
				 * @event
				 * Lanciato per l'attivazione del controllo di selezione spaziale.
				 */
				"polygonSpatialSelectorActive",
				/**
				 * @event
				 * Lanciato per l'impostazione delle unit di misura.
				 */
				"setmapvaluefield",
				/**
				 * @event
				 * Lanciato a seguito di una operazione di spostamento della mappa.
				 */
				"mapmoved",
				/**
				 * @event
				 * Lanciato per l'agginte di un layer vetoriale.
				 */
				"addvectorlayer"
		);	
		
		this.on("afterboxlayout", this.onAfterBoxLayout);
		this.on("zoomtomapextent", this.zoomToMapExtent);
		this.on("removelayer", this.removeLayer);
		this.on("addlayer", this.addLayer);
		this.on("addcoordinatepickercontrol", this.addCoordinatePickerControl);
		this.on("updatemappoint", this.updateMapPoint);
		this.on("drawbuffer", this.drawBuffer);
		this.on("polygonspatialselectoractive", this.polygonSpatialSelectorActive);
		this.on("setmapunitsvaluefield", this.setMapUnitsValueField);
	},
	
	/**
     * Imposta la mappa per le operaioni interne di gestione.
     * @param {OpenLayers.Map} map La mappa di TolomeoExt.
     */
	setMap: function(map){
		this.map = map;		
		this.map.events.register("moveend", this, function(){
			this.fireEvent("mapmoved", this.map.getExtent());
		});
	},
	
	/**
     * Aggiunge un dato layer alla mappa.
     * @param {OpenLayers.Layer} layer Layer OpenLayers WMS o Vector.
     */
	addLayer: function(layer){
		if(layer && this.map){
			//
			// check if already exists if yes remove it
			//
			var lay = this.map.getLayersByName(layer.name)[0];    	        
	        if(lay){
	            this.map.removeLayer(lay);
	        }	        
	        
			this.map.addLayer(layer);
		}
	},
	
	/**
     * Rimuove un dato layer dalla mappa.
     * @param {OpenLayers.Layer} layer Layer OpenLayers WMS o Vector.
     */
	removeLayer: function(layer){
		if(layer && this.map){
			var lay;
			if(typeof layer === 'string'){
				lay = this.map.getLayersByName(layer)[0];
			}else{
				lay = layer;
			}        
	        
			var remove = lay ? true : false;
			if(lay && lay instanceof OpenLayers.Layer.Vector && lay.features.length < 1){
				remove = false;
			}
			
	        if(remove){
	            this.map.removeLayer(lay);
	        }
		}
	}, 
	
	/**
     * Esegue una operazione di zoom usando l'extent fornito come argomento.
     * @param {Object} evt Oggetto contenente le proprietà di zoom.
	 * @param {OpenLayers.Bounds} [evt.dataExtent] Extent a cui eseguire lo zoom.
     */
	zoomToMapExtent: function(evt){
		if(evt.dataExtent){
			this.map.zoomToExtent(evt.dataExtent, false);
		}
	},
	
	/**
     * Disegna il box relativo alla selezione utente.
     * @param {Object} evt Oggetto contenente le proprietà relative alle operazioni da eseguire.
	 * @param {Object} [evt.scope] Scope su cui applicare le operazioni contenute.
     */
	onAfterBoxLayout: function(evt){
		var map = this.map;
		var scope = evt.scope;
		
        var link = Ext.get(scope.id+"_bboxAOI-set-EPSG");
        if(link){
          link.addListener("click", scope.openEPSGWin, scope);  
        }
        
		var baseProj = map.getProjection();
		var projection = baseProj ? baseProj : map.projection; 		
		
        scope.mapProjection = new OpenLayers.Projection(projection);
        
        scope.selectBBOX = new OpenLayers.Control.SetBox({      
            map: map,       
            layerName: scope.layerName,
            displayInLayerSwitcher: scope.displayBBOXInLayerSwitcher,
            boxDivClassName: "olHandlerBoxZoomBox_" + scope.id,
            aoiStyle: new OpenLayers.StyleMap({
				"default" : scope.defaultStyle,
				"select": scope.selectStyle,
				"temporary": scope.temporaryStyle
			}),
            onChangeAOI: function(){
            	var bounds = new OpenLayers.Bounds.fromString(this.currentAOI);  
              
                scope.northField.setValue(bounds.top);
                scope.southField.setValue(bounds.bottom);
                scope.westField.setValue(bounds.left);
                scope.eastField.setValue(bounds.right); 
                
                this.deactivate();
                scope.bboxButton.toggle();
                
                var geom = bounds.toGeometry();
                scope.ownerCt.setCurrentGeometry(geom);
            } 
        }); 

        map.addControl(scope.selectBBOX);
        map.enebaleMapEvent = true;
	},
	
    /**
     * Aggiunge il conrollo di selezione delle coordinate sulla mappa.
	 * @param {Object} scope Scope su cui applicare le operazioni contenute.
     */
	addCoordinatePickerControl: function(scope){
		var map = this.map;
		
		if(scope && map){
			var compositeField = scope;
			scope.projectionObject = map.getProjectionObject();
			
	        //create the click control
	        var ClickControl = OpenLayers.Class(OpenLayers.Control, {                
	            defaultHandlerOptions: {
	                'single': true,
	                'double': false,
	                'pixelTolerance': 0,
	                'stopSingle': false,
	                'stopDouble': false
	            },

	            initialize: function(options) {
	                this.handlerOptions = OpenLayers.Util.extend(
	                    {}, this.defaultHandlerOptions
	                );
	                OpenLayers.Control.prototype.initialize.apply(
	                    this, arguments
	                ); 
	                this.handler = new OpenLayers.Handler.Click(
	                    compositeField, {
	                        'click': this.trigger
	                    }, this.handlerOptions
	                );
	            }, 
	            trigger: function(e){
	                //get lon lat
	                var lonlat = map.getLonLatFromPixel(e.xy);
	                var geoJsonPoint = lonlat.clone();
	                geoJsonPoint.transform(map.getProjectionObject(), new OpenLayers.Projection(scope.outputSRS));
	                
	                scope.latitudeField.setValue(geoJsonPoint.lat);
	                scope.longitudeField.setValue(geoJsonPoint.lon);
	                
	                //update point on the map
	                scope.updateMapPoint(lonlat);
	                scope.toggleButton(false);
	            },
	            map: map
	        });       
	        
	        scope.selectLonLat = new ClickControl();
	        this.map.addControl(scope.selectLonLat);	
		}
	},
	
	/**
     * Aggiorna il punto sulla mappa a seguito di una selezione.
	 * @param {OpenLayers.LonLat} lonlat Coordinate relative al punto selezionato.
	 * @param {Object} scope Scope su cui applicare le operazioni contenute.
     */
	updateMapPoint: function(lonlat, scope){
		if(lonlat){
	        var style = new OpenLayers.Style(scope.selectStyle);
	        scope.layer = new OpenLayers.Layer.Vector(scope.selectLayerName, {
	            styleMap: style                
	        });
	        var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
	        var pointFeature = new OpenLayers.Feature.Vector(point);
	        scope.layer.addFeatures([pointFeature]);
	        scope.layer.displayInLayerSwitcher = scope.displayInLayerSwitcher;
	        this.map.addLayer(scope.layer);  
		}
	},
	
	/**
     * Disegna il buffer sulla mappa a seguinto delle impostazioni utente.
	 * @param {OpenLayers.Geometry.Point} point Centro del poligono.
	 * @param {Boolean} geodesic Scope su cui applicare le operazioni contenute.
	 * @param {number} radius Raggio del poligono.
	 * @param {OpenLayers.Style} style Style con cui disegnare il buffer.
	 * @param {String} layername Il nome del layer.
	 * @param {Boolean} displayInLayerSwitcher Indica se mostrare il layers all'interno del layers switcher OpenLayers.
	 * @param {Function} callback Funzione di callback da invocare successivamente alle operazioni contenute.
	 * @param {Object} scope Scope su cui applicare le operazioni contenute.
     */
	drawBuffer: function(point, geodesic, radius, style, 
			layername, displayInLayerSwitcher, callback, scope){
		var regularPolygon;
		var map = this.map;
		
		if(geodesic){
			regularPolygon = OpenLayers.Geometry.Polygon.createGeodesicPolygon(
				point,
				radius,
				100, 
				0,
				map.getProjectionObject()
			);
		}else{
			regularPolygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
				point,
				radius,
				100, 
				0
			);
		}

		if(style){
			var layer = map.getLayersByName(layername)[0];
            if(layer){
                map.removeLayer(layer);
            }
                
            var style = new OpenLayers.Style(style);
            
			var bufferLayer = new OpenLayers.Layer.Vector(layername, {
                styleMap: style                
            });

            var bufferFeature = new OpenLayers.Feature.Vector(regularPolygon);
            bufferLayer.addFeatures([bufferFeature]);			
            bufferLayer.displayInLayerSwitcher = displayInLayerSwitcher;
            
            if(callback){
            	callback.call(scope ? scope : this, bufferLayer, bufferFeature);
            }
            
            map.addLayer(bufferLayer);  
        } 
	},
	
	/**
     * Attiva il controllo OpenLayers di selezione spaziale.
	 * @param {Object} scope Scope su cui applicare le operazioni contenute.
     */
	polygonSpatialSelectorActive: function(scope){
		/**
		 * Create Polygon Selector
		 */
		scope.drawings = new OpenLayers.Layer.Vector({},
			{
				displayInLayerSwitcher:false,
				styleMap : new OpenLayers.StyleMap({
					"default" : scope.defaultStyle,
					"select" : scope.selectStyle,
					"temporary" : scope.temporaryStyle
				})
			}
		);

		scope.drawings.events.on({
            "featureadded": function(event) {
            	scope.setCurrentGeometry(event.feature.geometry);
            },                                
            "beforefeatureadded": function(event) {
            	scope.drawings.destroyFeatures();
            },
            scope: scope
        });                                 
    
		// Aggiunge il layers di selezione spaziale alla mappa
		this.addLayer(scope.drawings);
        
		scope.draw = scope.getDrawControl();
        
		// disable pan while drawing
		scope.draw.handler.stopDown = true;
		scope.draw.handler.stopUp = true;

		this.map.addControl(scope.draw);
		
        scope.draw.activate();
	},
	
	/**
     * Aggiorna le unità della mappa sul componente selezinato.
	 * @param {Object} component Componente su cui applicare le operazioni contenute.
     */
	setMapUnitsValueField: function(component){
		if(component){
			component.setValue(this.map.units);
		}
	}
	
});