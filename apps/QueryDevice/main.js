require([
	"esri/Map",
	"esri/views/MapView",

	"dojo/parser",
	"dojo/dom",

	"EPA/QueryByTime/Widget",
	"EPA/QueryByAttr/Widget",
	"EPA/QueryByExtent/Widget",

	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer",
	"dijit/layout/TabContainer",
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/Button",
	"dojo/domReady!"
], function (
	Map, MapView,
	parser, dom,
	QueryByTimeWidget, QueryByAttrWidget, QueryByExtentWidget
){

	// 解析dojo元素
	parser.parse();

	// 建立圖框並加入地圖文件
	var map = new Map({
		basemap: "osm"
	});

	var mapView = new MapView({
		container: "mapView",
		map   : map,
		center: [121, 24],
		zoom  : 7
	});
	
	var queryByTimeWidget = new QueryByTimeWidget({
		map: map, 
		view: mapView,
		tableDivId: "tableView"
	}, "queryByTime");
	queryByTimeWidget.startup();

	var queryByExtentWidget = new QueryByExtentWidget({
		map: map,
		view: mapView,
		tableDivId: "tableView"
	}, "queryByExtent");
	queryByExtentWidget.startup();
});