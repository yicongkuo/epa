define([
	// Custom Widget Modules
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",

	"dijit/_WidgetsInTemplateMixin", // 在父元件中，加入子元件
	"dijit/_Container",
	"dojo/text!EPA/QueryByTime/Widget.html", 

	// dojo library
	"dojo/dom-construct",
	"dojo/on",
	"dojo/date/locale",

	'dgrid/Grid',

	// Esri 
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query",
	"esri/layers/FeatureLayer",

	// Dijit Built-In Widgets					  
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/Button"
], function (
	declare, _WidgetBase, _TemplatedMixin, 
	_WidgetsInTemplateMixin, _Container, templates,
	domConstruct, on, locale,
	Grid,
	QueryTask, Query, FeatureLayer
){
	return declare([
		_WidgetBase, _TemplatedMixin, 
		_Container, _WidgetsInTemplateMixin
	], {
		
		templateString: templates, // 繼承自 _TemplatedMixin

		map : null,
		view: null,  // MapView 或是 SceneView
		tableDivId: "", // 存放表格的div元素ID
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
			}
		},

		constructor: function (attrs){ // 繼承自 _WidgetBase
			this.inherited(arguments);
		},

		postMixInProperties: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);

		},

		postCreate: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			on(this.queryButton, 'click', this._query.bind(this));
			on(this.removeButton, 'click', this._removeResults.bind(this));
		},

		startup: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			console.log('QueryByTime is loaded');
		},

		_query: function (){
			// 檢查輸入的參數使否有誤
			this._validateInput({
				data: this.layerUrl.value,
				beginDate: this.startDate.value,
				beginTime: this.startTime.value,
				endDate: this.endDate.value,
				endTime: this.endTime.value 
			});

			// 取得查詢參數
			var begin = this._transferDateTime(this.startDate.value, this.startTime.value);
			var end = this._transferDateTime(this.endDate.value, this.endTime.value);
			var devId = this.devList.value;

			// 設定查詢參數
			var query = new Query();
				query.where = this._queryExpression(devId, begin, end);
				query.outSpatialReference = { wkid:102100 };
				query.returnGeometry = true;
				query.outFields = ["*"];
				console.log(query.where);
			// 執行查詢
			var queryTask = new QueryTask({url: this.layerUrl.value});
				queryTask.execute(query)
				  	     .then(this._querySuccess.bind(this))
				         .otherwise(this._queryError.bind(this));
				queryTask.executeForExtent(query)
						 .then(this._queryExtentSuccess.bind(this))
						 .otherwise(this._queryExtentError.bind(this));
		},

		_queryExpression: function (devId, begin, end){
			return "time > '" + begin + "' AND time < '" + end + "'" + " AND deviceId = "+ devId;
		},

		_querySuccess: function (response){
			this._removeGraphics(); // 清除地圖上的圖形
			this._removeTable(); //清除表格資料

			console.log(response.features);
			this._addGraphics(response.features, response.fields);
			this._addTable(response.features, response.fields);
		},  

		_queryError: function (error){
			alert("查詢參數有誤! 請重新查詢!");
			console.log(error);
			return;
		},

		_queryExtentSuccess: function (response) {
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
			console.log(fields);
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

		_validateInput: function (input){
			if(!input.data){ alert("請選擇資料來源"); return;}
			if(!input.beginDate){ alert("請選擇起始日期!"); return;}
			if(!input.beginTime){ alert("請選擇起始時間!"); return;}
			if(!input.endDate){ alert("請選擇終止日期!"); return;}
			if(!input.endTime){ alert("請選擇終止時間!"); return;}
			if(input.beginDate > input.endDate){ alert("起始日大於終止日，無法運算!"); return;}
			
			if( input.beginDate.valueOf() === input.endDate.valueOf() && 
				input.endTime.valueOf() < input.beginTime.valueOf()
			){ 
				alert("起始時間大於終止時間，無法運算!"); 
				return;	
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