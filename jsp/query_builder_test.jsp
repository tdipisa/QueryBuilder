<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
	
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>
<% String titolo = "Query Builder"; %>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=8" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	
		<title>Query Builder - Comune di Prato</title>
	
		<link rel="stylesheet" type="text/css" href="/tolomeobinj/js/ext/extJS/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="/tolomeobinj/js/tolomeoExt/query_builder/theme/css/querybuilder.css" />
		
		<!-- for debug -->
		<script type="text/javascript" src="/tolomeobinj/js/ext/extJS/ext-all-debug-w-comments.js" charset="utf-8" ></script>
		<script type="text/javascript" src="/tolomeobinj/js/ext/openlayers/lib/OpenLayers.js" charset="utf-8" ></script>
		
		<!-- script removing OL/Ext lib, to restore at the end -->
		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/build/toloExt-all-debug.js" charset="utf-8" ></script>
		
		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/ToloPanelBase.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/layout/ToloPanelInter.js" charset="utf-8" ></script>
 		
 		<!-- TolomeoExt uncompressed classes (ONLY for test purpose) -->
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/ToloMapAPIExt.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/ToloCrossAjax.js" charset="utf-8" ></script>
 		
 		<!-- Caricamento scripts per Query Builder -->
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/controls/openlayers/SetBox.js" charset="utf-8" ></script>
 		
		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/events/ToloQueryBuilderEvtManager.js" charset="utf-8" ></script>

		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/data/ToloUniqueValuesStore.js" charset="utf-8" ></script>

		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloUniqueValuesCombo.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloBBOXFieldset.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloBufferFieldset.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloCoordinatePicker.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloComparisonComboBox.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/ToloFilterField.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/ToloFilterBuilder.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/ToloSpatialSelector.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/ToloLayerSelector.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/ToloFilterView.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/ToloAttributeFilter.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/grid/ToloFeatureGrid.js" charset="utf-8" ></script>
 		
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/spatialselector/ToloSpatialSelectorMethod.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/spatialselector/ToloBBOXSpatialSelectorMethod.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/spatialselector/ToloBufferSpatialSelectorMethod.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/spatialselector/ToloPolygonSpatialSelectorMethod.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/widgets/form/spatialselector/ToloCircleSpatialSelectorMethod.js" charset="utf-8" ></script>
 		
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/ToloFeatureManager.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/ToloQueryBuilderExt.js" charset="utf-8" ></script>
 		<script type="text/javascript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/ToloFeatureGridPanel.js" charset="utf-8" ></script>
		
		<!-- Caricamento Stores per Query Builder 
		<script type="text/JavaScript" src="/tolomeobinj/js/tolomeoExt/query_builder/src/data/stores.js" charset="utf-8"></script>-->
		
		<!-- Caricamento preset -->
		<script type="text/JavaScript" src="/tolomeobinj/ToloExtParamsJSServlet?paramPreset=QueryBuilder" charset="utf-8"></script>
		
		<!-- Inizio javascript mappa -->
		<script type="text/javascript">
			Ext.onReady(function() {
				new Ext.Viewport({
					layout   : 'fit',
					renderTo : 'mappa',
					items    : [
						new TolomeoExt.ToloPanelInter({
							withQueryBuilderPanel: true,
							withQueryPanel: true,
							withDataPanel: false,
							toolbarOpt         : {
								withTimeMachine: false,
								defaults       : {scale:'medium'},
								iconBasePath   : TolomeoExt.Vars.TOLOMEOContext + '/mycommon/img/icone24-default/'
							}
						})
					]
				});
			});
		</script>
		<!-- Fine javascript mappa -->
	
	</head>
	
	<body>
	
		<div id="mappa" class="clearCSS" style="width:100%"></div>
	
	</body>

</html>
