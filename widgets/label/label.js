
var ProtoWidgetLabel = Class.create({
	class_name: "protowidget-label-default",
	
	initialize: function(box, options) {
		this.options = options ? options: {};
		this.edit_box = new Element("input", { 'id': box.id + '-edit', 'class': this.options.class_name  || this.class_name  });
		this.edit_label = new Element("span", { 'id': box.id + '-label', 'class': this.options.class_name || this.class_name });
		Element.insert(box, this.edit_box);
		Element.insert(box, this.edit_label);
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
		event.stop();
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

if(typeof(ProtoWidget) == "undefined") {
	var ProtoWidget = {};
}

Object.extend(ProtoWidget, { Label: ProtoWidgetLabel });
ProtoWidgetLabel = null;



