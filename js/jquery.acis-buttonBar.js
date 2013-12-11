(function ($) {
/*global jQuery: false */

/* Create a buttonset bar
   Required options: barName, buttonInfo
   Optional options: buttonDefault, barOrient, autoShow
----------------------------------------------------------*/
	$.widget("acis.buttonBar", {

		options: {
			autoShow: true,
			barOrient: "horizontal"
		},

		_create: function () {
			var	binput, blabel,
				div = $("<div></div>"),
				input = $("<input />", {type: "radio"}),
				label = $("<label></label>"),
				barName = this.options.barName,
				defButton = this.options.buttonDefault || this.options.buttonInfo[0][0],
				where = this.element,
				barContainer = div.clone().attr("id", barName).appendTo(where);
			$(this.options.buttonInfo).each(function (i, item) {
				binput = input.clone().attr({"name": barName, "id": item[0]}).appendTo(barContainer);
				blabel = label.clone().attr("for", item[0]).text(item[1]).appendTo(barContainer);
				if (defButton === item[0]) {
					binput.prop("checked", true);
					blabel.addClass("ui-state-active");
				}
			});
			barContainer.buttonset();
			if (this.options.barOrient !== "vertical") {
				barContainer.css({"text-align": "center", "margin-right": 0});
			} else {
				barContainer.find("label").removeClass('ui-corner-left').removeClass('ui-corner-right');
				barContainer.find("label:first-of-type").addClass("ui-corner-top");
				barContainer.find("label:last-of-type").addClass("ui-corner-bottom");
			}
			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				barContainer.hide();
			}
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			$("#" + this.options.barName).buttonset("disable");
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			$("#" + this.options.barName).buttonset("enable");
		}
	});

}(jQuery));