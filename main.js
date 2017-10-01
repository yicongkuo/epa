require([
	"esri/Map",
	"esri/views/MapView",
	
	"dojo/parser",
	"dojo/dom",
	"dijit/registry",

	"dojo/date/stamp",

	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer",
	"dijit/layout/TabContainer",
	
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/Button",
	"dojo/domReady!"
], function (
	Map, MapView,
	parser, dom, registry,
	stamp
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

	//執行查詢功能
	var queryTimeWidget = registry.byId('queryTime');
		queryTimeWidget.set('onClick', function (){
			var startDateWidget = registry.byId('startDate'),
				startTimeWidget = registry.byId('startTime');

			console.log(startTimeWidget.get('value'));

			var dateString = stamp.toISOString(startDateWidget.get('value'), {selector: 'date'});
			console.log(dateString);
		});


	function queryByTime(filter){

	}

	function addGraphics(graphics){

	}

	function removeGraphics(graphics){

	}

	function addTable(graphics){

	}

	function removeTable(){

	}
});