require([
	"esri/Map",
	"esri/views/MapView",
	
	"dojo/parser",
	"dojo/dom",
	"dijit/registry",

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
	parser, dom, registry
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

	/*******************************************************************
	 * 執行時間查詢功能
	 ******************************************************************/
	var queryTimeWidget = registry.byId('queryTime');
		queryTimeWidget.set('onClick', function (){
			// 取得起訖日期與時間
			var startDate = registry.byId('startDate').get('value'),
				startTime = registry.byId('startTime').get('value'),
				endDate   = registry.byId('endDate').get('value'),
				endTime   = registry.byId('endTime').get('value');

			if(!startDate){ alert("請選擇起始日期!"); return;}
			if(!startTime){ alert("請選擇起始時間!"); return;}
			if(!endDate){ alert("請選擇終止日期!"); return;}
			if(!endTime){ alert("請選擇終止時間!"); return;}

			if(startDate > endDate){ alert("起始日大於終止日，無法運算!"); return;}
			
			if( startDate.valueOf() === endDate.valueOf() && 
				endTime.valueOf() < startTime.valueOf()
			){ 
				alert("起始時間大於終止時間，無法運算!"); 
				return;	
			}

			// 將日期時間轉換成查詢字串
			var startStr = transferDateTime(startDate, startTime),
				endStr = transferDateTime(endDate, endTime);

			console.log(startStr, endStr); 
		});


	function queryByTime(filter){

	}

	function addToMap(graphics){

	}

	function rmFromMap(graphics){

	}

	function addToTable(graphics){

	}

	function rmFromTable(graphics){

	}

	function transferDateTime(date, time) {
		var result  = '',
			year    = date.getFullYear(),
			month   = date.getMonth() +　1,
			day     = date.getDate(),
			hours   = time.getHours(),
			minutes = time.getMinutes(),
			sec     = time.getSeconds();

			year    = String(year);
		    month   = (month < 10)  ?('0' + String(month))   : String(month);
		    day     = (day < 10)    ?('0' + String(day))     : String(day);
		    hours   = (hours < 10)  ?('0' + String(hours))   : String(hours);
		    minutes = (minutes < 10)?('0' + String(minutes)) : String(minutes);
		    sec     = (sec < 10)    ?('0' + String(sec))     : String(sec);

		    result = year + '/' + month + '/' + day + ' ' 
		    	   + hours + ':' + minutes + ':' + sec;

		return result; 
	}
});