define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	
	"dijit/_WidgetsInTemplateMixin", // 在父元件中，加入子元件
	"dijit/_Container",
	"dojo/text!QueryByAttr/Widget.html"
	
], function (
	declare, _WidgetBase, _TemplatedMixin,
	 _WidgetsInTemplateMixin, _Container, templates
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
			console.log('QueryByAttr is loaded');
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
			
		}

	});
});