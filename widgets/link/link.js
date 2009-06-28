
var ProtoWidgetLink = Class.create({	
	initialize: function(options) {
		this.options = options;
		if(this.options.from.object) {
			this.from = $(this.options.from.object.options.id);
			this.from_outlet = this.options.from.outlet;
			this.from_object = this.options.from.object;
		} else {
			this.from = $(this.options.from.options.id);
			this.from_outlet = "bottom-center";
			this.from_object = this.options.from;
		}
		if(this.options.to.object) {
			this.to = $(this.options.to.object.options.id);	
			this.to_outlet = this.options.to.outlet;
			this.to_object = this.options.to.object;
		} else {
			this.to = $(this.options.to.options.id);
			this.to_object = this.options.to;
			this.to_outlet = "top-center";
		}
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
		
		start_line_dimensions = this.from_object.outletPosition(this.from_outlet);
		start_line_left = start_line_dimensions[0];
		start_line_top = start_line_dimensions[1];
		start_line_height = 10;
		this.start_line = new ProtoWidget.StraightLine({ 
			left1: start_line_left, 
			top1: start_line_top, 
			left2: start_line_left, 
			top2: start_line_top + start_line_height,
			class_name: "protowidget-link-arrow-start"
		});
		
		end_line_dimensions = this.to_object.outletPosition(this.to_outlet);
		end_line_left = end_line_dimensions[0];
		end_line_top = end_line_dimensions[1];
		end_line_height = 15;
		this.end_line = new ProtoWidget.StraightLine({ 
			left1: end_line_left, 
			top1: end_line_top, 
			left2: end_line_left, 
			top2: end_line_top - end_line_height,
			class_name: "protowidget-link-arrow-end"
		});
				
		this.connecting_line = new ProtoWidget.OrthogonalLine({ 
			left1: start_line_left, 
			top1: start_line_top + start_line_height, 
			left2: end_line_left + 4, 
			top2: end_line_top - end_line_height - 1,
			randomOffset: this.to_object.isParentOf(this.from_object) ? this.randomOffset : 0
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

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Link: ProtoWidgetLink });
ProtoWidgetLink = null;
