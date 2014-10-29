Ext.data.JsonP.TolomeoExt_widgets_form_ToloFilterField({"tagname":"class","name":"TolomeoExt.widgets.form.ToloFilterField","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ToloFilterField.js","href":"ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField"}],"author":[{"tagname":"author","name":"Tobia Di Pisa at tobia.dipisa@geo-solutions.it","email":null}],"aliases":{"widget":["tolomeo_tolofilterfield"]},"alternateClassNames":[],"extends":"Ext.form.FieldContainer","mixins":[],"requires":[],"uses":[],"members":[{"name":"autoComplete","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-autoComplete","meta":{}},{"name":"autoCompleteCfg","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-autoCompleteCfg","meta":{}},{"name":"caseInsensitiveMatch","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-caseInsensitiveMatch","meta":{}},{"name":"invalidRegExText","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-invalidRegExText","meta":{}},{"name":"lowerBoundaryTip","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-lowerBoundaryTip","meta":{}},{"name":"pageSize","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-pageSize","meta":{}},{"name":"upperBoundaryTip","tagname":"cfg","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"cfg-upperBoundaryTip","meta":{}},{"name":"attributes","tagname":"property","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"property-attributes","meta":{}},{"name":"attributesComboConfig","tagname":"property","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"property-attributesComboConfig","meta":{}},{"name":"change","tagname":"property","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"property-change","meta":{}},{"name":"comparisonComboConfig","tagname":"property","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"property-comparisonComboConfig","meta":{}},{"name":"filter","tagname":"property","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"property-filter","meta":{}},{"name":"addAutocompleteStore","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-addAutocompleteStore","meta":{}},{"name":"createDefaultConfigs","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-createDefaultConfigs","meta":{}},{"name":"createDefaultFilter","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-createDefaultFilter","meta":{}},{"name":"createValueWidget","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-createValueWidget","meta":{}},{"name":"createValueWidgets","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-createValueWidgets","meta":{}},{"name":"initComponent","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-initComponent","meta":{}},{"name":"initUniqueValuesStore","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-initUniqueValuesStore","meta":{}},{"name":"setFilter","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-setFilter","meta":{}},{"name":"setFilterType","tagname":"method","owner":"TolomeoExt.widgets.form.ToloFilterField","id":"method-setFilterType","meta":{}}],"code_type":"ext_define","id":"class-TolomeoExt.widgets.form.ToloFilterField","component":false,"superclasses":["Ext.form.FieldContainer"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.FieldContainer<div class='subclass '><strong>TolomeoExt.widgets.form.ToloFilterField</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField' target='_blank'>ToloFilterField.js</a></div></pre><div class='doc-contents'><p>Un campo Form che rappresenta un filtro di comparazione</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-autoComplete' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-autoComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-autoComplete' class='name expandable'>autoComplete</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>[autoComplete=\"false\"]\nAbilita la funzionalità di autocompletamento per i campi stringa. ...</div><div class='long'><p>[autoComplete=\"false\"]\nAbilita la funzionalità di autocompletamento per i campi stringa.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-autoCompleteCfg' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-autoCompleteCfg' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-autoCompleteCfg' class='name expandable'>autoCompleteCfg</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>[autoCompleteCfg=\"{}\"]\nStabilisce la configurazione da usare per la funzionalità di autocompletamento. ...</div><div class='long'><p>[autoCompleteCfg=\"{}\"]\nStabilisce la configurazione da usare per la funzionalità di autocompletamento.</p>\n\n<p>@example\nautoCompleteCfg: {\n    url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',\n    pageSize: 10\n}</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='cfg-caseInsensitiveMatch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-caseInsensitiveMatch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-caseInsensitiveMatch' class='name expandable'>caseInsensitiveMatch</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>[caseInsensitiveMatch=\"false\"]\nIl filtro di comparazione per i campi di tipo stringa deve essere case insensitive ? ...</div><div class='long'><p>[caseInsensitiveMatch=\"false\"]\nIl filtro di comparazione per i campi di tipo stringa deve essere case insensitive ?</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-invalidRegExText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-invalidRegExText' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-invalidRegExText' class='name expandable'>invalidRegExText</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Testo mostrato in caso di valore campo non valido. ...</div><div class='long'><p>Testo mostrato in caso di valore campo non valido.</p>\n<p>Defaults to: <code>&quot;Valore del campo non corretto&quot;</code></p></div></div></div><div id='cfg-lowerBoundaryTip' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-lowerBoundaryTip' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-lowerBoundaryTip' class='name expandable'>lowerBoundaryTip</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Tooltip per il campo inferiore di valorizzazione. ...</div><div class='long'><p>Tooltip per il campo inferiore di valorizzazione.</p>\n<p>Defaults to: <code>&quot;Valore inferiore&quot;</code></p></div></div></div><div id='cfg-pageSize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-pageSize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-pageSize' class='name expandable'>pageSize</a> : Integer<span class=\"signature\"></span></div><div class='description'><div class='short'>[autoComplete=\"5\"]\nConfigura il numero massimo predefinito di elementi per pagina per la\ncombo box di autocompletamento. ...</div><div class='long'><p>[autoComplete=\"5\"]\nConfigura il numero massimo predefinito di elementi per pagina per la\ncombo box di autocompletamento.</p>\n<p>Defaults to: <code>5</code></p></div></div></div><div id='cfg-upperBoundaryTip' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-cfg-upperBoundaryTip' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-cfg-upperBoundaryTip' class='name expandable'>upperBoundaryTip</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Tooltip per il campo superiore di valorizzazione. ...</div><div class='long'><p>Tooltip per il campo superiore di valorizzazione.</p>\n<p>Defaults to: <code>&quot;Valore superiore&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-attributes' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-property-attributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-property-attributes' class='name expandable'>attributes</a> : Ext.DataStore<span class=\"signature\"></span></div><div class='description'><div class='short'>Rappresenta lo store configurato degli attributi del layer\nda usare all'interno della combo box di filtraggio delle p...</div><div class='long'><p>Rappresenta lo store configurato degli attributi del layer\nda usare all'interno della combo box di filtraggio delle proprietà.</p>\n</div></div></div><div id='property-attributesComboConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-property-attributesComboConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-property-attributesComboConfig' class='name expandable'>attributesComboConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Oggetto di configurazione per la combo box degli attributi.</p>\n</div><div class='long'><p>Oggetto di configurazione per la combo box degli attributi.</p>\n</div></div></div><div id='property-change' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-property-change' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-property-change' class='name expandable'>change</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Event: change\nFires when the filter changes. ...</div><div class='long'><p>Event: change\nFires when the filter changes.</p>\n\n<p>Listener arguments:\nfilter - {OpenLayers.Filter} This filter.\nthis - {gxp.form.ToloFilterField} (TODO change sequence of event parameters)</p>\n</div></div></div><div id='property-comparisonComboConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-property-comparisonComboConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-property-comparisonComboConfig' class='name expandable'>comparisonComboConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Oggetto di configurazione per la combo box di comparazione.</p>\n</div><div class='long'><p>Oggetto di configurazione per la combo box di comparazione.</p>\n</div></div></div><div id='property-filter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-property-filter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-property-filter' class='name expandable'>filter</a> : OpenLayers.Filter<span class=\"signature\"></span></div><div class='description'><div class='short'>Filtro non logico opzionale messo a disposizione nella configurazione iniziale. ...</div><div class='long'><p>Filtro non logico opzionale messo a disposizione nella configurazione iniziale. Per\nrecuperare ili filtro usare il metodo <getFilter> invece di accedere direttamente questa\nproprietà.</getFilter></p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-addAutocompleteStore' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-addAutocompleteStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-addAutocompleteStore' class='name expandable'>addAutocompleteStore</a>( <span class='pre'>config</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Crea e aggiunge alla form una combo box di auto completamento. ...</div><div class='long'><p>Crea e aggiunge alla form una combo box di auto completamento.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>Un opzionale oggetto di configurazione per il componente ExtJs.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Ritorna l'oggetto relativo alla combobox di auto completamento.</p>\n</div></li></ul></div></div></div><div id='method-createDefaultConfigs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-createDefaultConfigs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-createDefaultConfigs' class='name expandable'>createDefaultConfigs</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Imposta la configurazione predefinita per la gestione dinamica dei componenti. ...</div><div class='long'><p>Imposta la configurazione predefinita per la gestione dinamica dei componenti.</p>\n<h3 class='pa'>Fires</h3><ul><li>change</li></ul></div></div></div><div id='method-createDefaultFilter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-createDefaultFilter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-createDefaultFilter' class='name expandable'>createDefaultFilter</a>( <span class='pre'></span> ) : OpenLayers.Filter<span class=\"signature\"></span></div><div class='description'><div class='short'>Crea il filtro predefinito di comparazione. ...</div><div class='long'><p>Crea il filtro predefinito di comparazione. Questo metodo può essere sovrascritto per cambiare\nil filtro predefinito.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>OpenLayers.Filter</span><div class='sub-desc'><p>Di default ritorna un filtro di comparazione.</p>\n</div></li></ul></div></div></div><div id='method-createValueWidget' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-createValueWidget' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-createValueWidget' class='name expandable'>createValueWidget</a>( <span class='pre'>type</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Se lo store degli attributi contiene anche una RegEx di validazione, applica\nil validatore al componente Ext che rapp...</div><div class='long'><p>Se lo store degli attributi contiene anche una RegEx di validazione, applica\nil validatore al componente Ext che rappresenta il valore.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Tipo dell'attributo relativo per configurare il componente.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Ritorna la configurazione relativa alla campo valore della proprietà.</p>\n</div></li></ul></div></div></div><div id='method-createValueWidgets' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-createValueWidgets' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-createValueWidgets' class='name expandable'>createValueWidgets</a>( <span class='pre'>type</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Crea il componente Ext destinato a contenere il valore delle proprietà. ...</div><div class='long'><p>Crea il componente Ext destinato a contenere il valore delle proprietà.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Tipo dell'attributo relativo per configurare il componente.</p>\n</div></li></ul><h3 class='pa'>Fires</h3><ul><li>change</li></ul></div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'>[config]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Inizializza un nuovo TolomeoExt.widgets.form.ToloFilterField. ...</div><div class='long'><p>Inizializza un nuovo <a href=\"#!/api/TolomeoExt.widgets.form.ToloFilterField\" rel=\"TolomeoExt.widgets.form.ToloFilterField\" class=\"docClass\">TolomeoExt.widgets.form.ToloFilterField</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Un opzionale oggetto di configurazione per il componente ExtJs.</p>\n</div></li></ul><h3 class='pa'>Fires</h3><ul><li>change</li></ul></div></div></div><div id='method-initUniqueValuesStore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-initUniqueValuesStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-initUniqueValuesStore' class='name expandable'>initUniqueValuesStore</a>( <span class='pre'>store, url, layerName, fieldName</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Crea il componente Ext destinato a contenere il valore delle proprietà. ...</div><div class='long'><p>Crea il componente Ext destinato a contenere il valore delle proprietà.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : <a href=\"#!/api/TolomeoExt.data.ToloUniqueValuesStore\" rel=\"TolomeoExt.data.ToloUniqueValuesStore\" class=\"docClass\">TolomeoExt.data.ToloUniqueValuesStore</a><div class='sub-desc'><p>Store della combo box di auto completamento.</p>\n</div></li><li><span class='pre'>url</span> : String<div class='sub-desc'><p>Url del servizio remoto di auto completamento.</p>\n</div></li><li><span class='pre'>layerName</span> : String<div class='sub-desc'><p>codTPN da usare com eparametro della richiesta.</p>\n</div></li><li><span class='pre'>fieldName</span> : String<div class='sub-desc'><p>Nome della proprietà di cui ritornare i suggerimenti.</p>\n</div></li></ul></div></div></div><div id='method-setFilter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-setFilter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-setFilter' class='name expandable'>setFilter</a>( <span class='pre'>filter</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Cambia l'oggetto del filtro con uno nuovo che si desidera utilizzare. ...</div><div class='long'><p>Cambia l'oggetto del filtro con uno nuovo che si desidera utilizzare.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>filter</span> : OpenLayers.Filter<div class='sub-desc'><p>Il filtro da impostare</p>\n</div></li></ul><h3 class='pa'>Fires</h3><ul><li>change</li></ul></div></div></div><div id='method-setFilterType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='TolomeoExt.widgets.form.ToloFilterField'>TolomeoExt.widgets.form.ToloFilterField</span><br/><a href='source/ToloFilterField.html#TolomeoExt-widgets-form-ToloFilterField-method-setFilterType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/TolomeoExt.widgets.form.ToloFilterField-method-setFilterType' class='name expandable'>setFilterType</a>( <span class='pre'>type</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Imposta il tipo di filtro che si desidera. ...</div><div class='long'><p>Imposta il tipo di filtro che si desidera.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : String<div class='sub-desc'><p>Tipo del filtro da impostare.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});