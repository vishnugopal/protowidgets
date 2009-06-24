

var Label = Class.create({
	class_name: "protobox-editable",
	
	initialize: function(box, options) {
		this.options = options ? options: {};
		this.edit_box = new Element("input", { 'id': box.id + '-edit', 'class': this.options.class_name  || this.class_name  });
		this.edit_label = new Element("span", { 'id': box.id + '-label', 'class': this.options.class_name || this.class_name });
		Element.insert(box, this.edit_box);
		Element.insert(box, this.edit_label);
		center_top = (box.getHeight() / 2) - (this.edit_box.getHeight() / 2) + "px";
		center_left = (box.getWidth() / 2) - (this.edit_box.getWidth() / 2) + "px";
		this.edit_box.style.top = center_top;
		this.edit_box.style.left = center_left;
		this.edit_label.style.top = center_top;
		this.edit_label.style.left = center_left;
		this.edit_box.hide();
		this.setValue(this.options.value || "Untitled");
		
		Event.observe(this.edit_label, "dblclick", this.edit.bindAsEventListener(this));
		Event.observe(this.edit_box, "blur", this.restore.bindAsEventListener(this));
	},
	
	edit: function(event) {
		this.edit_box.show();
		this.edit_label.hide();
		this.edit_box.focus();
		this.edit_box.select();
	},
	
	restore: function(event) {
		this.setValue(this.edit_box.value);
		this.edit_box.hide();
		this.edit_label.show();
	},
	
	setValue: function(value) {
		this.edit_label.innerHTML = this.edit_box.value = value;
	}
});

var ProtoStraightLine = Class.create({
	class_name: "protobox-straight-line",
	
	initialize: function(options) {
		this.options = options;
		this.draw();
	},
	
	draw: function() {		
		this.line = new Element("div", { 'id': this.randomId(), 'class': this.options.class_name || this.class_name });
		Element.insert(this.options.insert_into || document.body, this.line);
		
		this.line.hide();
		
		if(this.options.left1 == this.options.left2) {
			height = Math.abs(this.options.top1 - this.options.top2).toString();
			top_start = (this.options.top1 < this.options.top2) ? this.options.top1: this.options.top2;
			
			this.line.style.left = this.options.left1 + "px";
			this.line.style.top = top_start + "px";
			this.line.style.height = height + "px";
			this.line.show();
		} else if (this.options.top1 == this.options.top2) {
			width = Math.abs(this.options.left1 - this.options.left2).toString();
			left_start = (this.options.left1 < this.options.left2) ? this.options.left1: this.options.left2;
			
			this.line.style.left = left_start + "px";
			this.line.style.top = this.options.top1 + "px";
			this.line.style.width = width + "px";
			this.line.show();
		} else {
			this.line.remove();
		}
	},
	
	randomId: function() {
		return this.class_name + "-" + Math.ceil(Math.random() * 10000).toString();
	},
	
	remove: function() {
		this.line.remove();
		this.line = null;
	}
});

var ProtoOrthogonalLine = Class.create({
	initialize: function(options) {
		this.options = options;
		this.draw();
	},
	
	draw: function(options) {
		// equalize left
		left_middle = (this.options.left1 + this.options.left2) / 2 + (this.options.randomOffset || 0);
		this.line1 = new ProtoStraightLine({ left1: this.options.left1, top1: this.options.top1, left2: left_middle, top2: this.options.top1 });
		this.line2 = new ProtoStraightLine({ left1: this.options.left2, top1: this.options.top2, left2: left_middle, top2: this.options.top2 });
		// draw top line
		this.line3 = new ProtoStraightLine({ left1: left_middle, top1: this.options.top1, left2: left_middle, top2: this.options.top2 });
	},
	
	remove: function() {
		this.line1.remove();
		this.line2.remove();
		this.line3.remove();
		this.line1 = null;
		this.line2 = null;
		this.line3 = null;
	}
});

var Protolink = Class.create({
	class_name: "protobox-link",
	
	initialize: function(options) {
		this.options = options;
		this.from = $(this.options.from.options.id);
		this.to = $(this.options.to.options.id);	
		this.randomOffset = Math.ceil(Math.random() * 100);	
		this.draw();
	},
	
	draw: function() {
		from_offset = this.from.cumulativeOffset();
		from_width = this.from.getWidth();
		from_height = this.from.getHeight();
		to_offset = this.to.cumulativeOffset();
		to_width = this.to.getWidth();
		to_height = this.to.getHeight();
		
		
		/* we draw 2 of ProtoStraightLine to denote start and end links,
			 and then a ProtoOrthogonalLine to connect these points. */
		
		start_line_left = from_offset[0] + from_width / 2;
		start_line_top = from_offset[1] + from_height;
		start_line_height = 10;
		this.start_line = new ProtoStraightLine({ 
			left1: start_line_left, 
			top1: start_line_top, 
			left2: start_line_left, 
			top2: start_line_top + start_line_height,
			class_name: "protobox-arrow-start"
		});
		
		end_line_left = to_offset[0] + to_width / 2;
		end_line_top = to_offset[1];
		end_line_height = 15;
		this.end_line = new ProtoStraightLine({ 
			left1: end_line_left, 
			top1: end_line_top, 
			left2: end_line_left, 
			top2: end_line_top - end_line_height,
			class_name: "protobox-arrow-end"
		});
		
		this.connecting_line = new ProtoOrthogonalLine({ 
			left1: start_line_left, 
			top1: start_line_top + start_line_height, 
			left2: end_line_left + 4, 
			top2: end_line_top - end_line_height - 1,
			randomOffset: this.randomOffset
		});
	},
	
	update: function() {
		this.remove();
		this.draw();
	},
	
	remove: function() {
		this.start_line.remove();
		this.end_line.remove();
		this.connecting_line.remove();
		this.start_line = null;
		this.end_line = null;
		this.connecting_line = null;
	}
});

var Protobox = Class.create({
	class_name: "protobox-default",
		
	initialize: function(options) {
		this.options = options;
		this.links = [];
		this.draw();
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
			this.label = new Label(this.box, { value: (this.options.label == true) ? "Untitled" : this.options.label });
		}
	},
	
	link: function(options) {
		if(options.relationship == 'child') {
			link = new Protolink({ from: options.to, to: this });
			this.links.push(link);
			options.to.links.push(link);
		} else if (options.relationship == "parent") {
			link = new Protolink({ from: this, to: options.to });
			this.links.push(link);
			options.to.links.push(link);
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
	}
});