/**
* Copyright (c) 2014 Geosolutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.data
 *  class = WPSUniqueValuesStore
 *  base_link = `Ext.data.Store <http://extjs.com/deploy/dev/docs/?class=Ext.data.Store>`_
 */
Ext.ns('TolomeoExt.data');

/** api: constructor
 *  .. class:: WPSUniqueValuesStore(conn)
 *   
 *      A data store targeted to be used for the Geoserver WPS PagedUnique process.
 *      No config parameters are required on the constructor, the proxy can be
 *      fully configured on the doRequest method. Optionally a processName
 *      can be specified to override the default gs:PagedUnique process name.
 */
Ext.define('TolomeoExt.data.ToloUniqueValuesStore', {
	
	extend: 'Ext.data.Store',
	
	alias: 'widget.tolomeo_uniquestore',

	constructor: function(config) {
        config.baseParams = Ext.apply(config.baseParams || {}, {});

        this.TOLOMEOServer =  config.TOLOMEOServer;
        this.TOLOMEOContext = config.TOLOMEOContext;
        
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/UniqueValueServlet');
		var reader = proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
		
        TolomeoExt.data.ToloUniqueValuesStore.superclass.constructor.call(this,
            Ext.applyIf(config, {
//                sortInfo: {
//                    field: 'value',
//                    direction: 'ASC'
//                },
                proxy: proxy
            })
        );
    },
	 
    /** api: method[setWPSParams]
     *  Sets the WPS params to be passed to the proxy for data loading.
     *  See WPSUniqueValuesProxy.doRequest method for accepted parameters.
     */
    setParams: function(params) {
        this.baseParams = Ext.apply(this.baseParams, params);
    },
    
    /** api: method[load]
     *  Loads data on the store (see Ext.data.Store#load).
     *  See WPSUniqueValuesProxy.doRequest method for specific WPS parameters.
     */
    load: function(options) {
    	var params = options.params;
        if (!params.inputs) {
            return;
        }
        
        var filter;
        if(params.query) {
            var queryValue = params.query;
            if(queryValue.indexOf('*') === -1) {
                queryValue = '*' + queryValue + '*';
            }
            
            filter = new OpenLayers.Filter.Comparison({ 
                type: OpenLayers.Filter.Comparison.LIKE, 
                property: params.inputs.fieldName, 
                value: queryValue,
                matchCase: false                
            });
            
            var node = new OpenLayers.Format.Filter({version: "1.1.0"}).write(filter);
            filter = new OpenLayers.Format.XML().write(node);
        }
        
		var fparams = {
			filter: filter,
			codTPN: params.inputs.featureTypeName,
			format: "ext",
			ogcFilterVersion: "1.1.0",
			attributeName: params.inputs.fieldName
		};
		
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
		
        if (options) {
            this.baseParams = Ext.apply(this.baseParams, options.params);
        }
        
        this.superclass.load.call(this, options);
    } 
    
});
