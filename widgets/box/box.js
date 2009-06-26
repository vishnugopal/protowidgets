
var ProtoWidgetBox = Class.create({
	class_name: "protowidget-box-default",
		
	initialize: function(options) {
		this.options = options;
		this.links = [];
		this.draw();
		if(this.options.inspector) {
			this.setInspector();
		};
	},
	
	draw: function(options) {
		this.box = new Element("div", { 'id': this.options.id, 'class': this.options.class_name || this.class_name });
		this.box.style.left = (this.options.left || 100) + "px";
		this.box.style.top = (this.options.top || 100) + "px";
		Element.insert(this.options.insert_into || document.body, this.box);
		
		if(this.options.draggable) {
			new Draggable(this.box, { onDrag: this.updateLinks.bindAsEventListener(this) });
		}
		
		if(this.options.label) {
			this.label = new ProtoWidget.Label(this.box, { value: (this.options.label == true) ? "Untitled" : this.options.label });
		}
	},
	
	link: function(options) {
		if(options.relationship == 'child') {
			link = new ProtoWidget.Link({ from: options.to, to: this });
			this.links.push(link);
			options.to.links.push(link);
		} else if (options.relationship == "parent") {
			link = new ProtoWidget.Link({ from: this, to: options.to });
			this.links.push(link);
			options.to.links.push(link);
		}
		if(parentLink = this.parentLinkTo(options.to)) {
			parentLink.update();
		}
		if(childLink = this.childLinkTo(options.to)) {
			childLink.update();
		}
	},
	
	removeLinks: function() {
		this.links.each(function(link) {
			link.remove();
			link = null;
		});
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
			return (link.options.from == this) && (link.options.to == box);
		}, this);
	},
	
	isChildOf: function(box) {
		return this.links.any(function(link) {
			return (link.options.from == box) && (link.options.to == this);
		}, this);
	},
	
	parentLinkTo: function(box) {
		return this.links.detect(function(link) {
			return (link.options.from == this) && (link.options.to == box);
		}, this);
	},
	
	childLinkTo: function(box) {
		return this.links.detect(function(link) {
			return (link.options.from == box) && (link.options.to == this);
		}, this);
	}
});

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Box: ProtoWidgetBox });
ProtoWidgetBox = null;


