
var ProtoWidgetOrthogonalLine = Class.create({
	initialize: function(options) {
		this.options = options;
		this.draw();
	},
	
	draw: function(options) {
		// equalize left
		left_middle = (this.options.left1 + this.options.left2) / 2 + (this.options.randomOffset || 0);
		this.line1 = new ProtoWidget.StraightLine({ left1: this.options.left1, top1: this.options.top1, left2: left_middle, top2: this.options.top1 });
		this.line2 = new ProtoWidget.StraightLine({ left1: this.options.left2, top1: this.options.top2, left2: left_middle, top2: this.options.top2 });
		// draw top line
		this.line3 = new ProtoWidget.StraightLine({ left1: left_middle, top1: this.options.top1, left2: left_middle, top2: this.options.top2 });
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

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { OrthogonalLine: ProtoWidgetOrthogonalLine });
ProtoWidgetOrthogonalLine = null;