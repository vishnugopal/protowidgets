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
		Element.insert(headElement, { after: this.styleElement });
		this.addRuleToStyle();
	},
	
	remove: function() {
		this.styleElement.remove();
	}
});

var ProtoWidgets = {
	
	var Selector = Class.create({
		
	});
	
};
