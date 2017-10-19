var drawTool = null;
require([
	"esri/map",
	"esri/toolbars/draw",
	"esri/graphic",
	
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleMarkerSymbol",

	"esri/Color",
	"esri/geometry/geometryEngine",

	"dojo/dom",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/on",
	"dojo/domReady!"
], function (
	Map, Draw, Graphic,
	SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, 
	Color, geometryEngine,
	dom, domAttr, domClass, on
){
	// create map
	var map = new Map("map", {
		basemap: "osm",
		center : [121.118329, 25.059745],
		zoom   : 15
	});

	// initialize semantic ui
	initSemanticUIs();

	// bind events
	var buttons = [dom.byId("POINT"), dom.byId("POLYLINE"), dom.byId("RECTANGLE")],
		textareas = [dom.byId('geoString'), dom.byId('bufferString')],
		textarea = dom.byId('geoString'),
		bufferTextarea = dom.byId('bufferString');
	
	map.on("load", function (){
		drawTool = new Draw(map, {showTooltips: true});
		drawTool.on("draw-complete", finishDraw);
		
		buttons.forEach(function (button){
			on(button, "click", clickHandler);
		});
	});

	function clickHandler(evt){
		var drawType =  domAttr.get(this, "id"),
			drawStatus = domAttr.get(this, "class"),
			isDrawing = domClass.contains(this, 'drawing');

		buttons.forEach(function (button){
			if(domAttr.get(button, "id") === drawType){ 
				// 點到的按鈕事件
				if(isDrawing){
					// 尚未啟用繪圖功能
					setButtonClassAttr(button, "undrawing");
					drawTool.deactivate();
					map.graphics.clear();
				}
				if(!isDrawing){
					// 已經啟用繪圖功能
					setButtonClassAttr(button, "drawing");
					drawTool.activate(Draw[drawType]);
				}
			}
			else{ 
			    // 沒有點到的按鈕事件
				setButtonClassAttr(button, "undrawing");
			}
		});
	}

	function initSemanticUIs(){
		$('.ui.checkbox').checkbox();
		$('select.dropdown').dropdown();
	}

	function setButtonClassAttr(button, drawStatus){
		// 調整繪圖功能啟用狀況
		domClass.remove(button, "undrawing");
		domClass.remove(button, "drawing");
		domClass.add(button, drawStatus);

		// 調整按鈕顏色
		domClass.remove(button, "teal");
		if(drawStatus === "drawing"){
			domClass.add(button, "teal");
		}
	}

	function finishDraw(result){
		var geometry = result.geometry;

		// 清除字串內容
		textareas.forEach(function (textarea){
			domAttr.set(textarea, 'value', '');
		});		

		// 清除地圖上已存在的圖形			
		map.graphics.clear();

		// 產生幾何圖形參數字串
		addGeometryString(geometry, textareas[0]);
		addGraphic(geometry);

		// 產生環域圖形參數字串
		var bufferActive = $('#isBuffer').checkbox('is checked');
		if(bufferActive){
			var bufferGeometry = generateBuffer(geometry);
			addGeometryString(bufferGeometry, textareas[1]);
			addGraphic(bufferGeometry);
		}
	}

	function generateBuffer(geometry){
		var unit = $('#units').val(),
			distance = $('#distance').val();
		return geometryEngine.geodesicBuffer(geometry, distance, unit, true);
	}

	function addGeometryString(geometry, targetElement){
		var str = generateGeometryString(geometry);
		domAttr.set(targetElement, 'value', str);
	}
	
	function generateGeometryString(geometry){
		if(geometry.type === "point")
			return _pointString(geometry);
		if(geometry.type === "polyline")
			return _polylineString(geometry);
		if(geometry.type === "polygon")
			return _polygonString(geometry);
	}
	function _pointString(geometry){
		return JSON.stringify({
			x: geometry.x,
			y: geometry.y,
			spatialReference: geometry.spatialReference
		});
	}
	function _polylineString(geometry){
		return JSON.stringify({
			paths: geometry.paths,
			spatialReference: geometry.spatialReference
		});
	}
	function _polygonString(geometry){
		return JSON.stringify({
			rings: geometry.rings, 
			spatialReference: geometry.spatialReference
		});
	}

	function addGraphic(geometry){
		var symbol = generateSymbol(geometry.type);
		
		var graphic = new Graphic();
			graphic.setGeometry(geometry);
			graphic.setSymbol(symbol);

		map.graphics.add(graphic);
	}
	function generateSymbol(type){
		if(type === "point")
			return _pointSymbol();
		if(type === "polyline")
			return _polylineSymbol();
		if(type === "polygon")
			return _polygonSymbol();
	}
	function _pointSymbol(){
		var color = new Color([237, 131, 33, 1]);
		var line = new SimpleLineSymbol();
			line.setWidth(2.25);
			line.setColor(color);
		var marker = new SimpleMarkerSymbol();
			marker.setAngle(360);
			marker.setColor(color);
			marker.setOutline(line);
			marker.setSize(24);
			marker.setPath("M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z");
			marker.setStyle(SimpleMarkerSymbol.STYLE_PATH);
		return marker;
	}
	function _polylineSymbol(){
		var color = new Color([237, 131, 33, 1]);
		var line = new SimpleLineSymbol();
			line.setStyle(SimpleLineSymbol.STYLE_SOLID);
			line.setWidth(3);
			line.setColor(color);
		return line
	}
	function _polygonSymbol(){
		var line = new SimpleLineSymbol();
			line.setWidth(2);
			line.setStyle(SimpleLineSymbol.STYLE_DASH);
			line.setColor(new Color([255, 255, 255, 0.85]));				
		var fill = new SimpleFillSymbol();
			fill.setColor(new Color([255, 85, 0, 0.28]));
			fill.setOutline(line);
		return fill;
	}
});