
var ProtoWidgetStraightLine = Class.create({
	class_name: "protowidget-straightline-default",
	
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
			this.remove();
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


if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { StraightLine: ProtoWidgetStraightLine });
ProtoWidgetStraightLine = null;

