/*

This behavior uses these widgets:
* box
* link (and dependencies)
* targeter
* notifier (if available)
to:
make a link between two boxes (and their outlets) elegantly.

*/

ProtoWidgetsBehaviorMakeLink = Class.create({
	outlet_class_name: "protowidget-box-default-outlet",
	
	initialize: function(options) {
		/* If another MakeLink is active, don't do anything! */
		if(ProtoWidget.Behavior.MakeLink.active) {
			return false;
		}
		ProtoWidget.Behavior.MakeLink.active = true;
		
		this.options = options;
		this.boxes = options.boxes;
		this.toolbar = options.toolbar;
		this.notifier = options.notifier;
		this.startSelection();
	},
	
	startSelection: function() {
		this.outlets = [];
		
		this.notifyMessage("Click on a start point. ESC to cancel.");
		
		/* Show all the outlets */
		this.boxes.each(function(box) {
			box.showOutlets();
		});
		
		/* Show a targeter for the start point */
		new ProtoWidget.Targeter({
      target_class_name: this.options.outlet_class_name || this.outlet_class_name, 
      onTarget: function(element) {
        this.from_outlet = element;

				this.notifyMessage("Now click on an end point. ESC to cancel.");
				/* Show a targeter for the end point */
				new ProtoWidget.Targeter({
		      target_class_name: this.options.outlet_class_name || this.outlet_class_name, 
		      onTarget: function(element) {
		        this.to_outlet = element;
						return this.makeLink();
		      }.bindAsEventListener(this),
					onCancel: function(targeter) {
						this.returnWithError("Canceled!");
					}.bindAsEventListener(this)
		    });
      }.bindAsEventListener(this),
			onCancel: function(targeter) {
				this.returnWithError("Canceled!");
			}.bindAsEventListener(this)
    });
	},
	
	makeLink: function() {
		from_box_id = this.from_outlet.getAttribute("data-box-id");
		from_outlet_name = this.from_outlet.getAttribute("data-outlet-name");
		to_box_id = this.to_outlet.getAttribute("data-box-id");
		to_outlet_name = this.to_outlet.getAttribute("data-outlet-name");
		from_box_object = this.boxes.detect(function(box) {
			return box.options.id == from_box_id;
		}, this);
		to_box_object = this.boxes.detect(function(box) {
			return box.options.id == to_box_id;
		}, this);
		
		if(from_box_id == to_box_id) {
			return this.returnWithError("Cannot make link, both start and end points are in the same box!");
		}
		
		if(from_box_object.isParentOf(to_box_object)) {
			return this.returnWithError("Cannot make link, those boxes already have a link between them!");
	  };
		
		from_box_object.link({
			to: { object: to_box_object, outlet: to_outlet_name }, 
			relationship: "parent", 
			outlet: from_outlet_name
		});
		
		return this.returnWithMessage("Successfully created link!");
	},
	
	returnWithError: function(message) {
		this.returnWithMessage(message, true);
	},
	
	returnWithMessage: function(message, error) {
		this.notifyMessage(message, error);
		
		/* Hide all the outlets */
		this.boxes.each(function(box) {
			box.hideOutlets();
		});
		
		/* Make Link is not active anymore */
		ProtoWidget.Behavior.MakeLink.active = false;
		
		return !error; // we return true if error is false
	},
	
	notifyMessage: function(message, error) {
		if(this.notifier) {
			this.notifier.notify({ message: message, error: error });
		}
	}
});

if(!ProtoWidget) {
	ProtoWidget = {};
}
if(!ProtoWidget.Behavior) {
	ProtoWidget.Behavior = {};
}
Object.extend(ProtoWidget.Behavior, { MakeLink: ProtoWidgetsBehaviorMakeLink });
ProtoWidgetsBehaviorMakeLink = null;