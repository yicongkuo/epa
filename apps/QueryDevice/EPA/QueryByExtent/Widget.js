define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	
	"dijit/_WidgetsInTemplateMixin", // 在父元件中，加入子元件
	"dijit/_Container",
	"dojo/text!EPA/QueryByExtent/Widget.html",

	// dojo library
	"dojo/dom-construct",
	"dojo/on",
	"dojo/date/locale",

	// Esri 
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query",
	"esri/layers/FeatureLayer",

	"esri/geometry/geometryEngine",
	"esri/Graphic",

	// Dijit Built-In Widgets
	'dgrid/Grid',				  
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dijit/form/Button"
], function (
	declare, _WidgetBase, _TemplatedMixin,
	 _WidgetsInTemplateMixin, _Container, templates,
 	domConstruct, on, locale,
	QueryTask, Query, FeatureLayer, 
	geometryEngine, Graphic,
	Grid, FilteringSelect
){
	return declare([
		_WidgetBase, _TemplatedMixin, 
		_Container, _WidgetsInTemplateMixin
	], {
		
		templateString: templates,  // 繼承自 _TemplatedMixin

		map : null,
		view: null,
		symbols: {
			point: {
			  type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
			  style: "circle",
			  color: "orange",
			  size: "12px",  // pixels
			  outline: {  // autocasts as new SimpleLineSymbol()
			    color: [ 255, 255, 0 ],
			    width: 1  // points
			  }
			},
			polygon: {
				type: "simple-fill",  // autocasts as new SimpleFillSymbol()
				color: [ 51,241, 204, 0.1],
				style: "solid",
				outline: {  // autocasts as new SimpleLineSymbol()
					color: "white",
					width: 1
				}
			}
		},

		_mapCviewkEvent: null,

		constructor: function (attrs){ // 繼承自 _WidgetBase
			this.map = attrs.map;
			this.view = attrs.view;
		},

		postMixInProperties: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			
		},

		postCreate: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			this.isCheck.on('change', this._addViewClickEvent.bind(this));
			this.removeButton.on('click', this._removeResults.bind(this));
		},

		startup: function (){  // 繼承自 _WidgetBase
			console.log('QueryByExtent is loaded');
			this.inherited(arguments);
		},

		_addViewClickEvent: function (check){
			if(check){
				this._viewClickEvent = this.view.on('click', this._viewClick.bind(this));
			}
			if(!check){
				// 移除圖框點擊事件
				this._viewClickEvent.remove();
			}
		},

		_viewClick: function (evt){
			var mapPoint = evt.mapPoint;
				radius   = 50,
				units    = "kilometers";
			
			// 清除地圖上的圖形與表格資料
			this._removeGraphics(); 	
			this._removeTable();

			// 建立環域圖形
			this._createBuffer(mapPoint, radius, units);

			// 執行空間查詢分析
			this._query(mapPoint, radius, units);
		},

		_createBuffer: function (point, radius, units){
			var buffer = geometryEngine.buffer(point, radius, units);		
			var graphic = new Graphic({
				  geometry: buffer,
  				  symbol: this.symbols.polygon,
			});
			this.view.graphics.add(graphic);
		},

		_query: function (mapPoint, radius, units){
			// 準備查詢參數
			var params = new Query();
				params.geometry = mapPoint;
			    params.distance = radius;
			    params.units = units;
			    params.spatialRelationship = "intersects"; // All features that intersect 100mi buffer
				params.returnGeometry = true;
				params.outFields = ["*"];

			// 執行查詢
			var queryTask = new QueryTask({url: this.layerUrl.value});
				queryTask.execute(params)
						 .then(this._querySuccess.bind(this))
						 .otherwise(this._queryError.bind(this));
				queryTask.executeForExtent(params)
						 .then(this._queryExtentSuccess.bind(this))
						 .otherwise(this._queryExtentError.bind(this));
		},

		_querySuccess: function (response){
			console.log(response.features);
			// 沒有包含任何點資料時
			if(response.features.length === 0){
				alert("沒有包含任何資料，請重新選擇!");
				this.view.center = [121, 24];
				this.view.zoom = 8;
				return;
			}
			// 有包含點資料時
			this._addGraphics(response.features, response.fields);
			this._addTable(response.features, response.fields);
		},  

		_queryError: function (error){
			alert("查詢參數有誤! 請重新查詢!");
			console.log(error);
			return;
		},

		_queryExtentSuccess: function (response) {
			if(!response.extent){
				this.view.center = [121, 24];
				this.view.zoom = 8;
				return;
			}
			this.view.goTo(response.extent);
		},
		
		_queryExtentError: function (error) {
			console.log(error);
		},

		_addGraphics: function (grahpics, fields){
			var symbol = this.symbols.point,
				popupTemplate = this._createPopupTemplate(fields);

		    grahpics.forEach(function (graphic){
		    	graphic.symbol = symbol;
		    	graphic.popupTemplate = popupTemplate;
		    	this.view.graphics.add(graphic);
		    }.bind(this));
		},

		_addTable: function (graphics, fields){
			// 取得時間欄位
			var dateField = "";
			
			// 設定表格欄位與別名
			var columns = [];
			fields.forEach(function (field){
				columns.push({
					field: field.name,
					label: field.alias
				});
				
				if(field.type === "date"){
					dateField = field.name;
				}
			});

			// 設定表格資料來源
			var data = []; 
			graphics.forEach(function (graphic){
				graphic.attributes[dateField] = this._transferDateField(graphic.attributes[dateField]);
				data.push(graphic.attributes);
			}.bind(this));

			// 建立表格
			var table = new Grid({
				columns: columns
			}, this.tableDivId);
			table.renderArray(data);
		},

		_removeResults: function (){
			this._removeGraphics();
			this._removeTable();
		},

		_removeGraphics: function (){
			this.view.graphics.removeAll();
		},

		_removeTable: function (){
			domConstruct.empty(this.tableDivId);
		},

		_createPopupTemplate: function(fields){
			var fieldInfos = [];

			fields.forEach(function (field){
				var format = this._createFieldFormat(field.type);
				fieldInfos.push({
					fieldName: field.name,
					visible: true,
					label: field.alias,
					format: format
				});
			}.bind(this));

			return {
			  title: "圖層資訊",
			  content: [{
			    type: "fields",
			    fieldInfos: fieldInfos
			  }]
			};
		},

		_createFieldFormat: function (type){
			if( type === "double"){
				return {digitSeparator: true, places: 2};
			}
			if( type === "integer" ){
				return {digitSeparator: true, places: 0};
			}
			if( type === "string"){
				return {};
			}
			if( type === "date"){
				return { dateFormat: 'short-date-le-long-time'};
			}
		},

		_transferDateTime: function (date, time){
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
		},

		_transferDateField: function (value){
			var result  = '',
				date = new Date(value);

			year    = date.getFullYear(),
			month   = date.getMonth() +　1,
			day     = date.getDate(),
			hours   = date.getHours(),
			minutes = date.getMinutes(),
			sec     = date.getSeconds();

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
});