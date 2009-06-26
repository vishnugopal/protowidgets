
var ProtoWidgetNotifier = Class.create({
	class_name: 'protowidget-notifier-default',
	
	initialize: function() {
		this.messages = [];
	},
	
	notify: function(options) {
		options.id = options.window ? options.window.id : this.randomId();
		defaultOptions = {
			remove_after: 5,
			right: 30,
			bottom: this.getNextBottomOffset(),
			class_name: this.class_name,
			onRemove: this.removeMessageMatchingId.bindAsEventListener(this)
		}
		messageWindow = new ProtoWidget.SimpleWindow(Object.extend(defaultOptions, options));
		this.messages.push([options.id, messageWindow]);
	},
	
	getNextBottomOffset: function() {
		offset = 0;
		this.messages.each(function(message) {
			offset += 10 + $(message[0]).getHeight();
		});
		return offset + 10;
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

