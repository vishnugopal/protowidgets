
var ProtoWidgetLink = Class.create({	
	initialize: function(options) {
		this.options = options;
		console.log(this.options);
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
		this.start_line = new ProtoWidget.StraightLine({ 
			left1: start_line_left, 
			top1: start_line_top, 
			left2: start_line_left, 
			top2: start_line_top + start_line_height,
			class_name: "protowidget-link-arrow-start"
		});
		
		end_line_left = to_offset[0] + to_width / 2;
		end_line_top = to_offset[1];
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
			randomOffset: this.options.to.isParentOf(this.options.from) ? this.randomOffset : 0
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
