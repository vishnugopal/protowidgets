var ProtoWidgetSimpleWindow = Class.create({
	class_name: 'protowidget-simple-window',
	
	initialize: function(options) {
		this.options = options;
		this.draw();
	},
	
	draw: function() {
		if(this.options.window && this.options.window.id) {
			this.simpleWindow = $(this.options.window.id)
		} else if (this.options.window) {
			this.simpleWindow = this.options.window;
		} else if (this.options.message) {
			this.simpleWindow = new Element("div", { id: this.options.id || this.randomId(), "class": this.options.class_name || this.class_name });
			this.simpleWindow.appendChild(document.createTextNode(this.options.message));
		}
		
		/* Position */
		if(this.options.top) {
			this.simpleWindow.style.top = this.options.top + "px";
		}
		if(this.options.bottom) {
			this.simpleWindow.style.bottom = this.options.bottom + "px";
		}
		if(this.options.left) {
			this.simpleWindow.style.left = this.options.left + "px";
		}
		if(this.options.right) {
			this.simpleWindow.style.right = this.options.right + "px";
		}
		
		/* Other style */
		if(this.options.style) {
			this.simpleWindow.setStyle(this.options.style);
		}
		
		/* Insert element */
		Element.insert(this.options.insert_into || document.body, this.simpleWindow);
		
		/* Remove if any */
		if(this.options.remove_after) {
			this.remove(this.options.remove_after);
		}
	},
	
	remove: function(delay) {		
		if(this.options.beforeRemove) {
			if(!this.options.beforeRemove(this.options.id)) {
				return false;
			}
		}
		if(delay) {
			Element.remove.delay(delay, this.simpleWindow);
			this.options.onRemove.delay(delay, this.options.id);
		} else {
			this.simpleWindow.remove();
			this.options.onRemove(this.options.id);
		}
	},
	
	addClassName: function(class_name) {
		this.simpleWindow.addClassName(class_name);
	},
	
	randomId: function() {
		return this.class_name + "-" + Math.ceil(Math.rand * 10000);
	}
});

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { SimpleWindow: ProtoWidgetSimpleWindow });
ProtoWidgetSimpleWindow = null;

