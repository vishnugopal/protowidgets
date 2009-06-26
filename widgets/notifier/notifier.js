
var ProtoWidgetNotifier = Class.create({
	class_name: 'protowidget-notifier-default',
	
	initialize: function() {
		this.messages = [];
	},
	
	notify: function(options) {
		options.id = options.window ? options.window.id : this.randomId();
		bottom_offset = (this.messages.length * 40) + 10;
		defaultOptions = {
			remove_after: 5,
			right: 30,
			bottom: bottom_offset,
			class_name: this.class_name,
			onRemove: this.removeMessageMatchingId.bindAsEventListener(this)
		}
		messageWindow = new ProtoWidget.SimpleWindow(Object.extend(defaultOptions, options));
		this.messages.push([options.id, messageWindow]);
	},
	
	removeMessageMatchingId: function(id) {
		this.messages = this.messages.reject(function(element) {
			return (id == element[0]);
		});
	},
	
	randomId: function() {
		return this.class_name + "-" + Math.ceil(Math.random() * 10000);
	}
});

Object.extend(ProtoWidget, { Notifier: ProtoWidgetNotifier });
ProtoWidgetNotifier = null;

