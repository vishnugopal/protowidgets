var ProtoWidgetToolbar = Class.create({
	class_name: "protowidget-toolbar-default",
	icons_path: "icons",
	icons_extension: "gif",
	
	initialize: function(options) {
		this.options = options;
		this.draw();
	},
	
	draw: function() {
		this.toolbar = $(this.options.id);
		this.toolbar.addClassName(this.options.class_name || this.class_name);
		$$("#" + this.options.id + " button.icon").each(function(button) {
			icon_name = button.readAttribute("data-icon");
			icon_path = this.icons_path + "/" + icon_name + "." + this.icons_extension;
			button.setStyle({
				backgroundImage: "url('" + icon_path + "')"
			});
		}, this);
	},
	
	getContentsHTML: function() {
		return this.toolbar.innerHTML;
	},
	
	setContentsHTML: function(contents) {
		this.toolbar.innerHTML = contents;
	}
});

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Toolbar: ProtoWidgetToolbar });
ProtoWidgetToolbar = null;