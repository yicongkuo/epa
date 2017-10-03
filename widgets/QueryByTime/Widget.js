define([
	// Custom Widget Modules
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/on",

	"dijit/_WidgetsInTemplateMixin", // 在父元件中，加入子元件
	"dijit/_Container",
	"dojo/text!QueryByTime/Widget.html", 
	// Esri 
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query",
	"esri/layers/GraphicsLayer",

	// Dijit Built-In Widgets					  
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/Button"
], function (
	declare, _WidgetBase, _TemplatedMixin, on,
	 _WidgetsInTemplateMixin, _Container, templates,
	QueryTask, Query, GraphicsLayer	 
){
	return declare([
		_WidgetBase, _TemplatedMixin, 
		_Container, _WidgetsInTemplateMixin
	], {
		
		templateString: templates, // 繼承自 _TemplatedMixin

		map : null,
		view: null,

		constructor: function (attrs){ // 繼承自 _WidgetBase
			console.log('QueryByTime is loaded');
		},

		postMixInProperties: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);

		},

		postCreate: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			console.log(this.removeButton);
			on(this.queryButton, 'click', this._query.bind(this));
		},

		startup: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
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

			// 設定查詢參數
			var query = new Query();
				query.where = this._queryExpression(begin, end);
				query.outSpatialReference = { wkid:102100 };
				query.returnGeometry = true;
				query.outFields = ["*"];

			// 執行查詢
			var queryTask = new QueryTask({url: this.layerUrl.value});
				queryTask.execute(query)
				  	     .then(this._querySuccess.bind(this))
				         .otherwise(this._queryError.bind(this));
				
		},

		_querySuccess: function (response){
			var symbol = {
			  type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
			  style: "square",
			  color: "blue",
			  size: "8px",  // pixels
			  outline: {  // autocasts as new SimpleLineSymbol()
			    color: [ 255, 255, 0 ],
			    width: 3  // points
			  }
			}
			this.view.graphics.removeAll();
		    response.features.forEach(function (graphic){
		    	graphic.symbol = symbol;
		    	this.view.graphics.add(graphic);
		    }.bind(this));
		},  

		_removeGraphics: function (){
			this.view.graphics.removeAll();
		},

		_queryError: function (error){
			alert("查詢參數有誤! 請重新查詢!");
			console.log(error);
			return;
		},

		_queryExpression: function (begin, end){
			return "time > '" + begin + "' AND time < '" + end + "'";
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
		}
	});
});