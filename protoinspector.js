
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
		this.inspector.addClassName(this.options.class_name || this.class_name);
		
		//focus/defocus target
		Event.observe(this.inspector, "mouseover", this.focusTarget.bindAsEventListener(this));
		Event.observe(this.inspector, "mouseout", this.defocusTarget.bindAsEventListener(this));
		
		//close button
		this.close_button = new Element("a", { 
			'id': this.options.id + "-close-button", 
			'class': this.options.class_name_close_button || this.class_name + "-close-button" 
		});
		this.close_button.style.left = "5px";
		this.close_button.style.top = "5px";
		Element.insert(this.inspector, {top: this.close_button});
		Event.observe(this.close_button, "click", this.close.bindAsEventListener(this));
		
		new Draggable(this.inspector);
		this.inspector.hide();
	},
	
	setPosition: function(position) {
		this.options.left = position.left;
		this.options.top = position.top;
	},
	
	setTarget: function(target) {
		this.options.target = $(target);
	},
	
	focusTarget: function(event) {
		console.log(this.options.target);
		if(this.options.target) {
			this.options.target.addClassName("protoinspector-target-focus");
		}
	},
	
	defocusTarget: function(event) {
		if(this.options.target) {
			this.options.target.removeClassName("protoinspector-target-focus");
		}
	},
	
	show: function() {
		if(!this.inspector.style.left) {		
			this.inspector.style.left = this.options.left + "px";
		}
		if(!this.inspector.style.right) {
			this.inspector.style.top = this.options.top + "px";
		}
		this.inspector.show();
	},
	
	toggle: function() {
		if(this.inspector.visible()) {
			this.inspector.hide();
		} else {
			this.show();
		}
	},
	
	close: function(event) {
		this.inspector.hide();
	}
});