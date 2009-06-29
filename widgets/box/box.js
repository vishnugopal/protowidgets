
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
		this.outlets = new Array();
		this.addOutlet({ name: "top-center", link_offset: { top: +12, left: 0 } });
		this.addOutlet({ name: "bottom-center", link_offset: { top: +5, left: +4 } });
	},
	
	addOutlet: function(outlet) {
		this.outlets.push(outlet);
	},
	
	findOutletByName: function(outlet_name) {
		return this.outlets.detect(function(outlet) {
			return outlet_name == outlet.name
		});
	},
	
	outletPosition: function(outlet_name) {
		outlet = this.findOutletByName(outlet_name);
		this.showOutlet(outlet.name, outlet.link_offset);
		outlet_div = $(this.options.id + "-outlet-" + outlet_name)
		offset = outlet_div.cumulativeOffset();
		offset_top = outlet_div.getAttribute("data-link-offset-top");
		offset_left = outlet_div.getAttribute("data-link-offset-left");
		this.hideOutlet(outlet_name);
		return [ parseInt(offset[0]) + parseInt(offset_left), parseInt(offset[1]) + parseInt(offset_top) ];
	},
	
	showOutlets: function() {
		if(!this.outlets_visible) {
			this.outlets.each(function(outlet) {
				this.showOutlet(outlet.name, outlet.link_offset);
			}, this);
		}
		this.outlets_visible = true;
	},
	
	showOutlet: function(outlet, link_offset) {
		outlet_div = new Element("div", { 
			'id': this.options.id + "-outlet-" + outlet,
			'class': 
				(this.options.class_name || this.class_name) + '-outlet' + ' ' +
				(this.options.class_name || this.class_name) + '-outlet-' + outlet
		});
		outlet_div.setAttribute("data-box-id", this.options.id);
		outlet_div.setAttribute("data-outlet-name", outlet);
		outlet_div.setAttribute("data-link-offset-top", link_offset.top);
		outlet_div.setAttribute("data-link-offset-left", link_offset.left);
		Element.insert(this.options.insert_into || this.box, { top: outlet_div });
	},
	
	hideOutlets: function() {
		if(this.outlets_visible) {
			this.outlets.each(function(outlet) {
				this.hideOutlet(outlet.name);
			}, this);
		}
		this.outlets_visible = false;
	},
	
	hideOutlet: function(outlet) {
		Element.remove($(this.options.id + "-outlet-" + outlet));
	},
		
	removeOutlets: function() {
		this.hideOutlets();
		this.outlets = null;
		this.outlets = new Array();
	},
	
	draw: function(options) {
		this.box = new Element("div", { 'id': this.options.id, 'class': this.options.class_name || this.class_name });
		this.box.style.left = (this.options.left || 100) + "px";
		this.box.style.top = (this.options.top || 100) + "px";
		Element.insert(this.options.insert_into || document.body, this.box);
		
		if(this.options.draggable) {
			new Draggable(this.box, { 
				onDrag: this.updateDrawing.bindAsEventListener(this),
				onEnd: this.updateDrawing.bindAsEventListener(this)
			});
		}
		
		if(this.options.label) {
			this.label = new ProtoWidget.Label(this.box, { 
				value: (this.options.label == true) ? "Untitled" : this.options.label
			});
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
	
	removeLink: function(link) {
		this.links = this.links.reject(function(link_item) {
			return link == link_item;
		}, this);
	},
	
	removeLinks: function() {
		this.links.each(function(link) {
			if(link.to_object == this) {
				link.from_object.removeLink(link);
			} else {
				link.to_object.removeLink(link);
			}
			link.remove();
			link = null;
		}, this);
	},
	
	updateDrawing: function(draggable, event) {
		this.updateLinks();
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
	},
	
	remove: function(box) {
		this.removeLinks();
		this.removeOutlets();
		this.box.remove();
	}
});

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Box: ProtoWidgetBox });
ProtoWidgetBox = null;


