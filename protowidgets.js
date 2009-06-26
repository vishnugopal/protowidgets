var CSSRule = Class.create({
	initialize: function(selector, rule) {
		this.selector = selector;
		this.rule = rule;
		this.addRule();
	},
	
	addRuleToStyle: function() {
		// IE doesn't allow you to append text nodes to <style> elements
		if (this.styleElement.styleSheet) {
			if (this.styleElement.styleSheet.cssText == '') {
				this.styleElement.styleSheet.cssText = '';
			}
			this.styleElement.styleSheet.cssText += this.selector + " { " + this.rule + " }";
		} else {
			this.styleElement.appendChild(document.createTextNode(this.selector + " { " + this.rule + " }"));
		}
	},
	
	addRule: function() {
		headElement = $$("head")[0];
		this.styleElement = document.createElement("style");
		this.styleElement.type = "text/css";
		Element.insert(headElement, { bottom: this.styleElement });
		this.addRuleToStyle();
	},
	
	remove: function() {
		this.styleElement.remove();
	}
});


var ProtoWidget = {
	
	options: {
		icons_path: "icons",
		icons_extension: "gif"
	},
	
	Targeter: Class.create({	
		class_name_target: "protowidget-selector-target",
	
		initialize: function(options) {
			this.options = options;
			if(this.options.id) {
				this.element = $(this.options.id)
			} else {
				this.element = this.options.element;
			}
			this.initSelector();
		},
	
		initSelector: function() {
			this.element.observe("click", this.initObservers.bindAsEventListener(this));
		},
	
		addSelectorToTarget: function(event, target) {
			target.addClassName(this.class_name_target);
		},
	
		removeSelectorFromTarget: function(event, target) {
			target.removeClassName(this.class_name_target);
		},
	
		initObservers: function(event) {
			this.targetObserverAddSelectorFunctions = [];
			this.targetObserverRemoveSelectorFunctions = [];
			this.targetObserverSelectFunctions = [];
			
			//observers for class name mouseover, mouseout and click
			$$('.' + this.options.target_class_name).each(function(target) {
				targetObserverAddSelector = this.addSelectorToTarget.bindAsEventListener(this, target);
				targetObserverRemoveSelector = this.removeSelectorFromTarget.bindAsEventListener(this, target);
				targetObserverSelect = this.selectTarget.bindAsEventListener(this, target);
			
				this.targetObserverAddSelectorFunctions.push([targetObserverAddSelector, target]);
				this.targetObserverRemoveSelectorFunctions.push([targetObserverRemoveSelector, target]);
				this.targetObserverSelectFunctions.push([targetObserverSelect, target]);
			
				target.observe("mouseover", targetObserverAddSelector);
				target.observe("mouseout", targetObserverRemoveSelector);
				target.observe("click", targetObserverSelect);
			}, this);
			
			//observer for ESC key to quit selection
			this.documentObserverEscape = this.monitorKeyPressForEscape.bindAsEventListener(this);
			Event.observe(document, 'keydown', this.documentObserverEscape);
			
			//cross hair cursor for entire document
			this.style_move_cursor = new CSSRule('*', 'cursor:crosshair;');			
			
			event.stop();
		},
		
		monitorKeyPressForEscape: function(event) {
			console.log("key pressed");
			if(event.keyCode == Event.KEY_ESC) {
				this.removeAllObservers();
			}
		},
	
		selectTarget: function(event, target) {
			this.target = target;
			this.removeAllObservers();
			if(this.options.onTarget) {
				this.options.onTarget(target);
			}
			target.removeClassName(this.class_name_target);
		},
	
		removeAllObservers: function(event) {
			this.targetObserverAddSelectorFunctions.each(function(observerTargetPair) {
				observer = observerTargetPair[0];
				target = observerTargetPair[1];
				Event.stopObserving(target, "mouseover", observer);
			});
			this.targetObserverRemoveSelectorFunctions.each(function(observerTargetPair) {
				observer = observerTargetPair[0];
				target = observerTargetPair[1];
				Event.stopObserving(target, "mouseout", observer);
			});
			this.targetObserverSelectFunctions.each(function(observerTargetPair) {
				observer = observerTargetPair[0];
				target = observerTargetPair[1];
				Event.stopObserving(target, "click", observer);
			});
			Event.stopObserving(document, "keydown", this.documentObserverEscape);
			this.style_move_cursor.remove();
			
			this.targetObserverAddSelectorFunctions = null;
			this.targetObserverRemoveSelectorFunctions = null;
			this.targetObserverSelectFunctions = null;
			this.documentObserverEscape = null;
			this.style_move_cursor = null;
		}
	}),
	
	Toolbar: Class.create({
		class_name: "protowidget-toolbar",
		
		initialize: function(options) {
			this.options = options;
			this.draw();
		},
		
		draw: function() {
			this.toolbar = $(this.options.id);
			this.toolbar.addClassName(this.options.class_name || this.class_name);
			$$("#" + this.options.id + " button.icon").each(function(button) {
				icon_name = button.readAttribute("data-icon");
				icon_path = ProtoWidget.options.icons_path + "/" + icon_name + "." + ProtoWidget.options.icons_extension;
				console.log(icon_path);
				button.setStyle({
					backgroundImage: "url('" + icon_path + "')"
				});
			});
		}
	})
}

