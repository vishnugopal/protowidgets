
/* Creates a HUD style inspector element that is great for making
	 OSX-like inspector windows. */

var ProtoInspector = Class.create({
	class_name: "protoinspector-default",
	
	initialize: function(options) {
		this.options = options;
		this.initializeInspector();
	},
	
	initializeInspector: function() {
		this.inspector = $(this.options.id);
		this.inspector.addClassName(this.class_name);
		new Draggable(this.inspector);
		this.inspector.hide();
	},
	
	show: function(options) {
		this.inspector.style.left = options.left + "px";
		this.inspector.style.top = options.top + "px";
		this.inspector.show();
	}
});