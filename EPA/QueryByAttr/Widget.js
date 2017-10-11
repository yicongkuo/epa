define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	
	"dijit/_WidgetsInTemplateMixin", // 在父元件中，加入子元件
	"dijit/_Container",
	"dojo/text!EPA/QueryByAttr/Widget.html",

	// dojo library
	"dojo/dom-construct",
	"dojo/on",
	"dojo/date/locale",

	// Esri 
	"esri/tasks/QueryTask",
	"esri/tasks/support/Query",
	"esri/layers/FeatureLayer",

	// Dijit Built-In Widgets
	"dgrid/Grid",					  
	"dijit/form/FilteringSelect",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/Button"
	
], function (
	declare, _WidgetBase, _TemplatedMixin,
	_WidgetsInTemplateMixin, _Container, templates,
	domConstruct, on, locale,
	QueryTask, Query, FeatureLayer,
	Grid, FilteringSelect
){
	return declare([
		_WidgetBase, _TemplatedMixin, 
		_Container, _WidgetsInTemplateMixin
	], {
		// Attributes
		templateString: templates, // 繼承自 _TemplatedMixin

		map : null,
		view: null,

		constructor: function (attrs){ // 繼承自 _WidgetBase
			this.map = attrs.map;
			this.view = attrs.view;
		},

		postMixInProperties: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			
		},

		postCreate: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			
		},

		startup: function (){  // 繼承自 _WidgetBase
			this.inherited(arguments);
			console.log('QueryByAttr is loaded');
		}

	});
});