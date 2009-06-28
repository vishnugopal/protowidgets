
var ProtoWidgetBox = Class.create({
	class_name: "protowidget-box-default",
		
	initialize: function(options) {
		this.options = options;
		this.links = [];
		this.draw();
		this.defineDefaultOutlets();
		if(this.options.inspector) {
			this.setInspector();
		};
	},
	
	defineDefaultOutlets: function() {
		this.outlet_callbacks = new Hash();
		this.addOutlet("top-center", function() {
			return [
				this.box.cumulativeOffset()[0] + this.box.getWidth() / 2, this.box.cumulativeOffset()[1]
			];
		}.bindAsEventListener(this));
		this.addOutlet("bottom-center", function() {
			return [
				this.box.cumulativeOffset()[0] + this.box.getWidth() / 2, this.box.cumulativeOffset()[1] + this.box.getHeight()
			];
		}.bindAsEventListener(this));
	},
	
	addOutlet: function(outlet_name, outlet_callback) {
		this.outlet_callbacks.set(outlet_name, outlet_callback);
	},
	
	outletPosition: function(outlet_name) {
		return this.outlet_callbacks.get(outlet_name)();
	},
	
	showOutlets: function() {
		this.outlet_callbacks.each(function(outlet) {
			outlet_div = new Element("div", { 
				'id': this.options.id + "-outlet-" + outlet[0],
				'class': (this.options.class_name || this.class_name) + '-outlet'
			});
			outlet_position = outlet[1]();
			outlet_div.style.left = outlet_position[0] + "px";
			outlet_div.style.top = outlet_position[1] + "px";
			outlet_div.setAttribute("data-box-id", this.options.id);
			outlet_div.setAttribute("data-outlet-name", outlet[0]);
			Element.insert(this.options.insert_into || document.body, outlet_div);
		}, this);
		this.outlets_visible = true;
	},
	
	hideOutlets: function() {
		this.outlet_callbacks.each(function(outlet) {
			Element.remove($(this.options.id + "-outlet-" + outlet[0]));
		}, this);
		this.outlets_visible = false;
	},
	
	updateOutlets: function() {
		if(this.outlets_visible) {
			this.hideOutlets();
			this.showOutlets();
		}
	},
	
	draw: function(options) {
		this.box = new Element("div", { 'id': this.options.id, 'class': this.options.class_name || this.class_name });
		this.box.style.left = (this.options.left || 100) + "px";
		this.box.style.top = (this.options.top || 100) + "px";
		Element.insert(this.options.insert_into || document.body, this.box);
		
		if(this.options.draggable) {
			new Draggable(this.box, { onDrag: this.updateDrawing.bindAsEventListener(this) });
		}
		
		if(this.options.label) {
			this.label = new ProtoWidget.Label(this.box, { value: (this.options.label == true) ? "Untitled" : this.options.label });
		}
	},
	
	link: function(options) {
		if(options.to.object) {
			to_object = options.to.object;
			to_outlet = options.to.outlet;
		} else {
			to_object = options.to;
			if(options.relationship == "parent") {
				to_outlet = "top-center";
			} else {
				to_outlet = "bottom-center";
			}
		}
		
		if(options.outlet) {
			this_outlet = options.outlet;
		} else {
			if(options.relationship == "parent") {
				this_outlet = "bottom-center";
			} else {
				this_outlet = "top-center";
			}
		}
		
		if(options.relationship == 'child') {
			link = new ProtoWidget.Link({ from: { object: to_object, outlet: to_outlet }, to: { object: this, outlet: this_outlet } });
			this.links.push(link);
			to_object.links.push(link);
		} else if (options.relationship == "parent") {
			link = new ProtoWidget.Link({ from: { object: this, outlet: this_outlet }, to: { object: to_object, outlet: to_outlet } });
			this.links.push(link);
			to_object.links.push(link);
		}
		if(parentLink = this.parentLinkTo(to_object)) {
			parentLink.update();
		}
		if(childLink = this.childLinkTo(to_object)) {
			childLink.update();
		}
	},
	
	removeLinks: function() {
		this.links.each(function(link) {
			link.remove();
			link = null;
		});
	},
	
	updateDrawing: function(draggable, event) {
		this.updateLinks();
		this.updateOutlets();
	},
	
	updateLinks: function(draggable, event) {
		this.links.each(function(link) {
			link.update();
		});
	},
	
	setInspector: function() {
		if(this.options.inspector.id) {
			this.inspector = new ProtoWidget.Inspector(this.options.inspector);
		} else {
			this.inspector = this.options.inspector;
		}
		this.inspector.setPosition({
			left: this.box.cumulativeOffset()[0] + this.box.getWidth() + 10,
			top: this.box.cumulativeOffset()[1] + 10
		});
		this.inspector.setTarget(this.box);
		Event.observe(this.box, "dblclick", this.toggleInspector.bindAsEventListener(this));
	},
	
	toggleInspector: function(event) {
		if(this.inspector) {
			this.inspector.toggle();
		}
	},
	
	isParentOf: function(box) {
		return this.links.any(function(link) {
			return (link.from_object == this) && (link.to_object == box);
		}, this);
	},
	
	isChildOf: function(box) {
		return this.links.any(function(link) {
			return (link.from_object == box) && (link.to_object == this);
		}, this);
	},
	
	parentLinkTo: function(box) {
		return this.links.detect(function(link) {
			return (link.from_object == this) && (link.to_object == box);
		}, this);
	},
	
	childLinkTo: function(box) {
		return this.links.detect(function(link) {
			return (link.from_object == box) && (link.to_object == this);
		}, this);
	}
});

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Box: ProtoWidgetBox });
ProtoWidgetBox = null;


