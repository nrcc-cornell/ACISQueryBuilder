(function ($) {
	/*global defaults: true, overlaysArray: true, map: true */
	/*global jQuery: false, setTimeout: false, document: true, google: false, showMap: false, hideMap: false, setupMaps: false, addBbox: false */

/* Single station selection by location search
   Required options: srchFunction
   Modifies: defaults (global)
-----------------------------------------------------------------------------*/
	$.widget("acis.stationSrch", {

		options: {
			autoShow: true,
			srchFunction: null,
			srchMoreFunction: null
		},

		_create: function () {
			var idp,
				div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>"),
				span = $("<span></span>"),
				label = $("<label></label>"),
				select = $("<select></select>", {"class": "ui-widget-content ui-corner-all ui-state-default"}),
				where = this.element,
				srchFunction = this.options.srchFunction,
				areaContainer = div.clone().appendTo(where),
				srchBox = div.clone().addClass("ui-widget-content ui-corner-all ui-state-default ui-helper-clearfix acis-srchBox").appendTo(areaContainer),
				srchResults = fieldset.clone().addClass("ui-helper-hidden").attr("id", "srchResults").appendTo(areaContainer),
				srchName = select.clone().appendTo(srchResults),
				srchGo = div.clone().addClass("acis-goSrch").appendTo(srchBox),
				srchString = $("<input />", {
					"type": "text",
					"id": "stnSrchString",
					"class": "ui-state-default",
					"maxlength": 35,
					"value": "enter city,state or zip"
				}).prependTo(srchBox);
			this.areaContainer = areaContainer;
			this.srchGo = srchGo;
			span.clone().text("Search").addClass("ui-helper-hidden").appendTo(srchGo);
			label.clone().text("Station:").prependTo(srchResults);
			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}
			srchString.bind({
				click: function () { this.select(); },
				keyup: function (e) { if (e.keyCode === 13) { srchFunction(); } }
			});
			srchGo.bind({
				click: srchFunction
			});
			srchName.bind({
				change: function () {
					idp = $(this).val().split(" ");
					defaults.sId = idp[0];
					defaults.idType = idp[1];
				}
			});
		},

		shower: function () {
			this.areaContainer.show();
			$("#stnSrchString").focus().select();
		},

		hider: function () {
			this.areaContainer.hide();
			if ($("#restoreMap").length) {
				$("#restoreMap").hide();
			}
		},

		getter: function () {
			if ($("#srchResults select").val()) {
				return $("#srchResults select").val();
			}
			return false;
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.find("input").unbind();
			this.element.find("select").unbind();
			this.srchGo.unbind();
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("input").unbind();
			this.element.find("select").unbind();
			this.srchGo.unbind();
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("input").bind({
				click: function () { this.select(); },
				keyup: function (e) { if (e.keyCode === 13) { this.options.srchFunction(); } }
			});
			this.srchGo.bind({
				click: this.options.srchFunction
			});
			this.element.find("select").bind({
				change: function () {
					var idp = $(this).val().split(" ");
					defaults.sId = idp[0];
					defaults.idType = idp[1];
				}
			});
		}
	});

/* Single station selection by id
   Optional option: defSid
   Modifies: defaults (global)
----------------------------------------------------*/
	$.widget("acis.stationId", {

		options: {
			autoShow: true,
			defSid: "304174"
		},

		guessType: function (keystr, typeSelect) {
			function isLetters(inpstr) {
				return (/^[A-Za-z]+$/).test(inpstr);
			}
			if (keystr.length >= 3) {
				if (keystr.length === 3 && isLetters(keystr.charAt(1))) {
					typeSelect.attr("value", 3);
				} else if (keystr.length === 4 && isLetters(keystr.charAt(0))) {
					typeSelect.attr("value", 5);
				} else if (keystr.length === 5 && isLetters(keystr.substring(0, 4)) && $.isNumeric(keystr.substring(4, 5))) {
					typeSelect.attr("value", 7);
				} else if (keystr.length === 5 && $.isNumeric(keystr)) {
					typeSelect.attr("value", 1);
				} else if (keystr.length === 6 && $.isNumeric(keystr)) {
					typeSelect.attr("value", 2);
				} else if (keystr.length === 6 && keystr.substring(3, 6).toLowerCase() === 'thr') {
					typeSelect.attr("value", 9);
				} else if (keystr.length === 7 && $.isNumeric(keystr)) {
					typeSelect.attr("value", 16);
				} else if (keystr.length === 8) {
					typeSelect.attr("value", 10);
				} else if (keystr.length === 11) {
					typeSelect.attr("value", 6);
				} else {
					typeSelect.attr("value", "any");
				}
				defaults.idType = typeSelect.val();
			}
		},

		_create: function () {
			var	id_types = {any: "Any", 2: "Coop", 1: "WBAN", 5: "ICAO", 6: "GHCN", 7: "NWS LI", 4: "WMO", 3: "FAA",
					9: "ThreadEx", 10: "CoCoRaHS", 16: "AWDN", 26: "NEWA", 8: "RCC"},
				div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				select = $("<select></select>", {"class": "ui-widget-content ui-corner-all ui-state-default"}),
				where = this.element,
				guessType = this.guessType,
				areaContainer = div.clone().addClass("acis-idContainer").appendTo(where),
				idContainer = fieldset.clone().appendTo(areaContainer),
				typeContainer = fieldset.clone().appendTo(areaContainer),
				idInput = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default",
					"value": this.options.defSid,
					"maxlength": 11
				}).prependTo(idContainer),
				typeSelect = select.clone().appendTo(typeContainer);
			this.areaContainer = areaContainer;
			label.clone().text("ID:").prependTo(idContainer);
			label.clone().text("Type:").prependTo(typeContainer);
			$.each(id_types, function (key, value) {
				$('<option value="' + key + '">' + value + '<\/option>').appendTo(typeSelect);
			});
			guessType(idInput.val(), typeSelect);
			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}
			idInput.bind({
				'change blur': function () { defaults.sId = $(this).val(); },
				keyup: function () { guessType($(this).val(), typeSelect); }
			});
		},

		shower: function () {
			this.areaContainer.show();
			this.areaContainer.find("input").focus().select();
		},

		hider: function () {
			this.areaContainer.hide();
		},

		getter: function () {
			var selectedIdType = this.areaContainer.find("select").val(),
				selectedId = this.areaContainer.find("input").val();
			if (selectedIdType === "9") {
				selectedId = selectedId.substring(0, 3).toUpperCase() + selectedId.substring(3, 6).toLowerCase();
			} else if (selectedIdType === "16") {
				selectedId = selectedId.toLowerCase();
			} else {
				selectedId = selectedId.toUpperCase();
				if (selectedIdType === "any") {
					selectedIdType = "";
				}
			}
			defaults.sId = selectedId;
			defaults.idType = selectedIdType;
			return (defaults.sId + (defaults.idType !== "" ? " " + defaults.idType : ""));
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.find("input").unbind();
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("input").unbind();
		},

		enable: function () {
			var guessType = this.guessType;
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("input").bind({
				'change blur': function () { defaults.sId = $(this).val(); },
				keyup: function () { guessType($(this).val(), this.areaContainer.find("select")); }
			});
		}
	});

/* Single station selection by station list
   Optional option: defCwa, stationFile, cwaFile
   Modifies: defaults (global)
-------------------------------------------*/
	$.widget("acis.stationList", {

		options: {
			autoShow: true,
			defCwa: "NRCC",
			stationFile: "station_dict.txt",
			cwaFile: "cwa_dict.txt"
		},

		listUpdater: function () {
			var stnList, jres;
			$("#listStn").parents().eq(1).loadSpinner({message: "Loading menu ..."});
			defaults.cwa = $("#listCwa").val() || this.options.defCwa;
			$.get(this.options.stationFile, function (res) {
				jres = $.parseJSON(res);
				stnList = jres[defaults.cwa];
				$("#listStn").empty();
				if (!stnList || stnList.length === 0) {
					$('<option value="">List unavailable for ' + defaults.cwa + '<\/option>').appendTo("#listStn");
				} else {
					$(stnList).each(function (i, stn) {
						$('<option value="' + stn[0] + ' ' + stn[2] + '">' + stn[1] + '<\/option>').appendTo("#listStn");
					});
				}
			});
			$("#listStn").parents().eq(1).loadSpinner("fadeOut");
		},

		_create: function () {
			var	div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				select = $("<select></select>", {"class": "ui-widget-content ui-corner-all ui-state-default"}),
				option = $("<option></option>"),
				where = this.element,
				defCwa = this.options.defCwa,
				areaContainer = div.clone().addClass("acis-listContainer").appendTo(where),
				listContainer = fieldset.clone().appendTo(areaContainer),
				cwaSelect = select.clone().attr("id", "listCwa").appendTo(areaContainer);
			this.areaContainer = areaContainer;
			select.clone().attr("id", "listStn").appendTo(listContainer);
			label.clone().attr("for", "listStn").text("Station:").prependTo(listContainer);
			this.element.addClass("ui-widget ui-helper-reset");

			$.get(this.options.cwaFile)
				.success(function (res) {
					if (res.length === 0) {
						option.clone().text("List unavailable").appendTo(cwaSelect);
					} else {
						option.clone().val(defCwa).text("Change CWA").appendTo(cwaSelect);
						$.each($.parseJSON(res), function (key, value) {
							option.clone().val(key).text(key + ' - ' + value).appendTo(cwaSelect);
						});
						$.proxy(this.listUpdater, this);
						cwaSelect.trigger("change");
					}
				})
				.error(function () {
					option.clone().text("List unavailable").appendTo(cwaSelect);
				});

			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}
			cwaSelect.bind({
				focus: function () {
					$(this).css("width", "80%").unbind("focus");
				},
				change: $.proxy(this.listUpdater, this)
			});
		},

		shower: function () {
			this.areaContainer.show();
			if ($("#listCwa").val() !== defaults.cwa) {
				$("#listCwa").val(defaults.cwa).trigger("change");
			}
		},

		hider: function () {
			this.areaContainer.hide();
		},

		getter: function () {
			var idp,
				id_codes = {"coop": 2, "wban": 1, "icao": 5, "ghcn": 6, "shef": 7, "wmo": 4, "faa": 3,
							"thrdx": 9, "cocorahs": 10, "awdn": 16, "newa": 26, "any": "any"};
			if ($("#listStn").val()) {
				idp = $("#listStn").val().split(" ");
				defaults.sId = idp[0];
				// station list has id types as character abbreviations; need to convert to numerial value
				defaults.idType = id_codes[idp[1]];
				return (defaults.sId + " " + defaults.idType);
			}
			return false;
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.find("select").unbind();
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("select").unbind();
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			$("#listCwa").bind({
				change: function () {
					$.proxy(this.listUpdater, this);
				}
			});
		}
	});

/* Station selection by bounding box
   Optional option: maxArea (in square degrees), mapInteraction
   MapInteraction (if turned on) uses google map API and ACIS routines: setupMaps, showMap, hideMap, addBbox
   Custom event: boxdrawn
   Uses: defaults (global)
----------------------------------------------------------*/
	$.widget("acis.bboxSelection", {

		options: {
			autoShow: true,
			maxArea: 250,
			mapInteraction: false
		},

		showBbox: function () {
			var sw, ne, bbox_params = this.getter();
			$(".acis-bboxContainer").find("button").hide();
			if (bbox_params) {
				setupMaps(this.showBbox);
				showMap();
				sw = new google.maps.LatLng(bbox_params[1], bbox_params[0]);
				ne = new google.maps.LatLng(bbox_params[3], bbox_params[2]);
				// may need timeout for time for map to appear
				setTimeout(function () { addBbox(sw, ne); }, 500);
				this._trigger("boxdrawn");
			}
		},

		_create: function () {
			var div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>", {
					"title": "Negative values for West longitudes and South latitudes"
				}),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default"
				}),
				button = $("<button></button>", {
					"class": "acis-smallButton"
				}),
				label = $("<label></label>"),
				self = this,
				where = this.element,
				mapInteraction = this.options.mapInteraction,
				areaContainer = div.clone().addClass("acis-bboxContainer").appendTo(where),
				westContainer = fieldset.clone().appendTo(areaContainer),
				southContainer = fieldset.clone().appendTo(areaContainer),
				eastContainer = fieldset.clone().appendTo(areaContainer),
				northContainer = fieldset.clone().appendTo(areaContainer),
				showboxButton = button.clone().attr("id", "showBox").text("Show Box").appendTo(areaContainer);
			label.clone().attr("for", "bbox_w").text("West:").appendTo(westContainer);
			input.clone().attr("id", "bbox_w").appendTo(westContainer);
			label.clone().attr("for", "bbox_s").text("South:").appendTo(southContainer);
			input.clone().attr("id", "bbox_s").appendTo(southContainer);
			label.clone().attr("for", "bbox_e").text("East:").appendTo(eastContainer);
			input.clone().attr("id", "bbox_e").appendTo(eastContainer);
			label.clone().attr("for", "bbox_n").text("North:").appendTo(northContainer);
			input.clone().attr("id", "bbox_n").appendTo(northContainer);

			$([["West", "bbox_w"], ["South", "bbox_s"], ["East", "bbox_e"], ["North", "bbox_n"]]).each(function (i, item) {
				var defval = (defaults.bbox && defaults.bbox[i] !== null) ? defaults.bbox[i] : item[0];
				if ($.isNumeric(defval)) {
					defval = defval.toFixed(2);
				} else if (mapInteraction) {
					showboxButton.hide();
				}
				$('#' + item[1]).val(defval);
			});

			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}

			if (!mapInteraction) { showboxButton.addClass("ui-helper-hidden"); }
			showboxButton.button().on("click", function () { self.showBbox(); });

			if (mapInteraction) {
				areaContainer.find("input").on({
					change: function () {
						showboxButton.show();
						$("#map_area button").hide();
					},
					keyup: function (e) {
						if (e.keyCode === 13) {
							showboxButton.trigger("click");
						} else {
							$(this).trigger("change");
						}
					}
				});
			}
		},

		getter: function () {
			var area,
//				sw, ne, se, nw,
				bbox_array = [];
			$.each(["#bbox_w", "#bbox_s", "#bbox_e", "#bbox_n"], function (i, item) {
				if ($.isNumeric(parseFloat($(item).val()))) {
					bbox_array.push(parseFloat($(item).val()));
				} else {
					$(document).reportError({errorText: "bad latlon", makeActive: 1, focusElement: item});
					return false;
				}
			});
			if (bbox_array.length === 4) {
//				sw = new google.maps.LatLng(bbox_array[1], bbox_array[0]);
//				ne = new google.maps.LatLng(bbox_array[3], bbox_array[2]);
//				se = new google.maps.LatLng(bbox_array[1], bbox_array[2]);
//				nw = new google.maps.LatLng(bbox_array[3], bbox_array[0]);
//				area = google.maps.geometry.spherical.computeArea([sw, nw, ne, se, sw]);	//square meters
				area = Math.abs(bbox_array[0] - bbox_array[2]) * Math.abs(bbox_array[3] - bbox_array[1]);	//square degrees
				if (area > this.options.maxArea) {
					$(document).reportError({errorText: "big area", makeActive: 1});
					return false;
				}
				defaults.bbox = bbox_array;
				return bbox_array;
			}
			return false;
		},

		_setOption: function (key, value) {
			var good_count = 0;
			if (key === "mapInteraction") {
				if (value) {
					$.each(["#bbox_w", "#bbox_s", "#bbox_e", "#bbox_n"], function (i, item) {
						if ($.isNumeric(parseFloat($(item).val()))) {
							good_count += 1;
						} else {
							return false;
						}
					});
					if (good_count === 4) {
						$("#showBox").show();
					}
					setupMaps();
					showMap();
					$(".acis-bboxContainer").find("input").on({
						change: function () {
							$("#showBox").show();
							$("#map_area button").hide();
						},
						keyup: function (e) {
							if (e.keyCode === 13) {
								$("#showBox").trigger("click");
							} else {
								$(this).trigger("change");
							}
						}
					});
				} else {
					hideMap();
					$(".acis-bboxContainer").find("input").unbind();
				}
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		shower: function () {
			var good_count = 0;
			$(".acis-bboxContainer").show();
			$.each(["#bbox_w", "#bbox_s", "#bbox_e", "#bbox_n"], function (i, item) {
				if ($.isNumeric(parseFloat($(item).val()))) {
					good_count += 1;
				} else {
					return false;
				}
			});
			if (this.options.mapInteraction) {
				if (good_count === 4) {
					$("#showBox").show();
				} else {
					$("#showBox").hide();
				}
				setupMaps();
				showMap();
			}
		},

		hider: function () {
			$(".acis-bboxContainer").hide();
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			$(".acis-bboxContainer").find("button").off();
			$(".acis-bboxContainer").find("input").off();
			$(".acis-bboxContainer").children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			$(".acis-bboxContainer").find("button").off();
			$(".acis-bboxContainer").find("input").off();
		},

		enable: function () {
			var self = this;
			$.Widget.prototype.enable.call(this, arguments);
			$(".acis-bboxContainer").find("button").on("click", function () { self.showBbox(); });
			if (this.options.mapInteraction) {
				$(".acis-bboxContainer").find("input").on({
					change: function () {
						$("#showBox").show();
						$("#map_area button").hide();
					},
					keyup: function (e) {
						if (e.keyCode === 13) {
							$("#showBox").trigger("click");
						} else {
							$(this).trigger("change");
						}
					}
				});
			}
		}
	});

/* Station selection by state or substate areas
   Optional options: defState, statesFile, mapInteraction, polySelectStyle, polyUnselectStyle, polyHoverStyle
   MapInteraction (if turned on) uses  google map API and ACIS routines: setupMaps, showMap, hideMap
   Modifies: defaults (global), overlaysArray (global; for mapInteraction)
----------------------------------------------------------*/
	$.widget("acis.areaSelection", {

		options: {
			autoShow: true,
			statesFile: "states_dict.txt",
			defState: "CT",
			mapInteraction: false,
			polySelectStyle: {fillColor: '#0000ff', fillOpacity: 0.7},
			polyUnselectStyle: {fillColor: '#ff0000', fillOpacity: 0.2},
			polyHoverStyle: {fillColor: '#00ff00'}
		},

		updateSubstateMap: function (new_val, subType) {
			var prev_val, ssb,
				subAreaMenuvals = {county: "fips", climdiv: "climdiv", cwa: "cwa", basin: "huc"},
				polyFillStyle = function (pid, style) {
					var arrind = $.acis.areaSelection.prototype.poly_ids[pid] || 0,
						polygon = overlaysArray[arrind];
					polygon.setOptions(style);
					google.maps.event.clearListeners(polygon, "mouseout");
					google.maps.event.addListener(polygon, "mouseout", function () {
						$("#map_msg").empty();
						polygon.setOptions(style);
					});
				};
			if (!subType) {
				ssb = $("input[name=acis-state_select_type]:checked").attr("id");
				subType = subAreaMenuvals[ssb];
			}
			if (!new_val) {
				new_val = $("#substate").val();
			} else {
				$("#substate").val(new_val);
			}
			prev_val = defaults[subType];
			defaults[subType] = new_val;
			polyFillStyle(prev_val, $.acis.areaSelection.prototype.options.polyUnselectStyle);
			polyFillStyle(new_val, $.acis.areaSelection.prototype.options.polySelectStyle);
		},

		setupSubstateMap: function () {
			var ssb, paths, polygon, section, bnds, id, bb, sw, ne,
				updateSubstateMap = $.acis.areaSelection.prototype.updateSubstateMap,
				box_ext = [999, 999, -999, -999];
			if (setupMaps(this.setupSubstateMap) === false) {
				return false;
			}
			showMap();
			$("#map_msg").empty().loadSpinner({message: "Loading map ..."});
			ssb = $("input[name=acis-state_select_type]:checked").attr("id");
			$.acis.areaSelection.prototype.poly_ids = {};
			$.each($.acis.areaSelection.prototype.crnt_meta, function (i, c) {
				if (ssb === "county") {
					id = c.id;
				} else if (ssb === "climdiv") {
					id = c.id;
				} else if (ssb === "cwa") {
					id = c.id;
				} else if (ssb === "basin") {
					id = c.id;
				}
				bb = c.bbox;
				box_ext[0] = box_ext[0] < bb[0] ? box_ext[0] : bb[0];
				box_ext[1] = box_ext[1] < bb[1] ? box_ext[1] : bb[1];
				box_ext[2] = box_ext[2] > bb[2] ? box_ext[2] : bb[2];
				box_ext[3] = box_ext[3] > bb[3] ? box_ext[3] : bb[3];
				paths = [];
				$.each(c.geojson.coordinates, function () {
					section = [];
					$.each(this[0], function (j, pt) {
						section.push(new google.maps.LatLng(pt[1], pt[0]));
					});
					paths.push(section);
				});
				polygon = new google.maps.Polygon($.extend({
					paths: paths,
					strokeColor: "#0000ff",
					strokeOpacity: 1,
					strokeWeight: 2
				}, $.acis.areaSelection.prototype.options.polyUnselectStyle));
				polygon.setMap(map);
				overlaysArray.push(polygon);
				$.acis.areaSelection.prototype.poly_ids[id] = i;
				google.maps.event.addListener(polygon, "mouseover", function () {
					$("#map_msg").text(c.name);
					this.setOptions($.acis.areaSelection.prototype.options.polyHoverStyle);
				});
				google.maps.event.addListener(polygon, "mouseout", function () {
					$("#map_msg").empty();
					this.setOptions($.acis.areaSelection.prototype.options.polyUnselectStyle);
				});
				google.maps.event.addListener(polygon, "click", function () {
					$("#map_msg").text("Selected: " + c.name);
					if (ssb === "county") {
						updateSubstateMap(c.id, "fips");
					} else if (ssb === "climdiv") {
						updateSubstateMap(c.id, "climdiv");
					} else if (ssb === "cwa") {
						updateSubstateMap(c.id, "cwa");
					} else if (ssb === "basin") {
						updateSubstateMap(c.id, "huc");
					}
				});
			});
			updateSubstateMap(null, null);
			$("#map_msg").loadSpinner("fadeOut");
			sw = new google.maps.LatLng(box_ext[1], box_ext[0]);
			ne = new google.maps.LatLng(box_ext[3], box_ext[2]);
			bnds = new google.maps.LatLngBounds(sw, ne);
			setTimeout(function () { map.fitBounds(bnds); }, 500);
		},

		setupStateMap: function () {
			var statebox, sw, ne, bnds, paths, section, polygon;
			if (setupMaps(this.setupStateMap) === false) {
				return false;
			}
			showMap();
			$("#map_msg").loadSpinner({message: "Loading map ..."});
			$.ajax({
				type: "GET",
				url: "/virgaGeneral/state",
				data: {"meta":"bbox,geojson", "state":defaults.state},
				dataType: "json",
				timeout: 10000,
				success: function (res) {
					paths = [];
					$.each(res.meta[0].geojson.coordinates, function (i) {
						section = [];
						$.each(this[0], function (i, pt) {
							section.push(new google.maps.LatLng(pt[1], pt[0]));
						});
						paths.push(section);
					});
					polygon = new google.maps.Polygon({
						paths: paths,
						strokeColor: "#0000ff",
						strokeOpacity: 0.75,
						strokeWeight: 1,
						fillOpacity: 0.0
					});
					polygon.setMap(map);
					overlaysArray.push(polygon);
					statebox = res.meta[0].bbox;
					sw = new google.maps.LatLng(statebox[1], statebox[0]);
					ne = new google.maps.LatLng(statebox[3], statebox[2]);
					bnds = new google.maps.LatLngBounds(sw, ne);
					setTimeout(function () { map.fitBounds(bnds); }, 500);
				},
				complete: function () {
					$("#map_msg").loadSpinner("fadeOut");
				}
			});
		},

		setupSubstateMenu: function (donotshowmap) {
			var mapInteraction = $.acis.areaSelection.prototype.options.mapInteraction,
				self = this,
				option = $("<option></option>"),
				area = $(".acis-state_selections fieldset:last"),
				substate = area.find("select"),
				substateLabel = area.find("label"),
				settings = {county: {label: "County:", code: "id"},
							climdiv: {label: "Climate Division:", code: "id"},
							cwa: {label: "NWS CWA:", code: "id"},
							basin: {label: "Hydro Basin:", code: "id"},
							all: {label: null, code: null} },
				ssb = $("input[name=acis-state_select_type]:checked").attr("id"),
				mySettings = settings[ssb],
				params = {state: $("#state").val() || defaults.state,
						  meta: "id,name,bbox,geojson"};
			if (ssb === "all") {
				$(area).hide();
				if (mapInteraction) {
					self.setupStateMap();
				}
				return;
			}
			$(area).show().loadSpinner({message: "Loading menu ..."});
			$(substate).empty();
			$.ajax({
				type: "GET",
				url: "/virgaGeneral/" + ssb,
				data: params,
				dataType: "json",
				success: function (res) {
					if (res && res.meta.length === 0) {
						$(substateLabel).text("Information unavailable");
						$(substate).hide();
						if (mapInteraction) { hideMap(); }
					} else {
						$(substateLabel).text(mySettings.label);
						$(substate).show();
						$.acis.areaSelection.prototype.crnt_meta = res.meta;
						$.each(res.meta, function (i, v) {
							option.clone().attr("value", v[mySettings.code]).text(v.name).appendTo(substate);
						});
						if (!defaults[mySettings.code]) {
							defaults[mySettings.code] = res.meta[0][mySettings.code];
						}
						$(substate).attr("value", defaults[mySettings.code]);
						if (mapInteraction && !donotshowmap) { self.setupSubstateMap(); }
					}
				},
				error: function () {
					$(substateLabel).text("Error obtaining menu");
					$(substate).hide();
				},
				complete: function () {
					$(area).loadSpinner("fadeOut");
				}
			});
		},

		_create: function () {
			var div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>"),
				select = $("<select></select>", {
					"class": "ui-widget-content ui-corner-all ui-state-default"
				}),
				option = $("<option></option>"),
				label = $("<label></label>"),
				self = this,
				defState = this.options.defState,
				mapInteraction = this.options.mapInteraction,
				where = this.element,
				areaContainer = div.clone().addClass("acis-statecontainer").buttonBar({
					barName: "acis-state_select_type",
					barOrient: "vertical",
					buttonInfo: [["all", "State"], ["county", "County"], ["climdiv", "Division"], ["cwa", "CWA"], ["basin", "Basin"]],
					buttonDefault: defaults.state_select_type || "cwa"
				}).appendTo(where).loadSpinner({message: "Loading states ..."}),
				stateSelectors = div.clone().addClass("acis-state_selections").appendTo(areaContainer),
				stateMenu = select.clone().attr({"id": "state"}).appendTo(stateSelectors),
				substateArea = fieldset.clone().attr("id", "sub_state_area").addClass("ui-helper-hidden").appendTo(stateSelectors);
			$.acis.areaSelection.prototype.options.mapInteraction = this.options.mapInteraction;
			select.clone().attr("id", "substate").appendTo(substateArea);
			label.clone().attr("for", "substate").prependTo(substateArea);
			$.get(this.options.statesFile)
				.success(function (res) {
					if (res.length === 0) {
						option.clone().attr("value", defState).text("State menu unavailable").appendTo(stateMenu);
					} else {
						$.each($.parseJSON(res), function (abb, name) {
							option.clone().attr("value", abb).text(name).appendTo(stateMenu);
						});
						stateMenu
							.attr("value", defState)
							.one("change", function () {
								self.setupSubstateMenu(true);
								$(this).bind("change", function () {
									defaults.state = $(this).val();
									defaults.climdiv = null;
									defaults.cwa = null;
									defaults.fips = null;
									defaults.huc = null;
									self.setupSubstateMenu();
								});
							})
							.trigger("change");
					}
				})
				.error(function () {
					option.clone().attr("value", defState).text("State menu unavailable").appendTo(stateMenu);
				})
				.complete(function () {
					areaContainer.loadSpinner("fadeOut");
				});
			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}
			$("#acis-state_select_type input").on("click", function () {
				defaults.state_select_type = $(this).attr("id");
				self.setupSubstateMenu();
			});
			substateArea.find("select").on("change", function () {
				if (mapInteraction) {
					self.updateSubstateMap($(this).val(), null);
				}
			});

		},

		_setOption: function (key, value) {
			if (key === "mapInteraction") {
				if (value) {
					if ($("input[name=acis-state_select_type]:checked").attr("id") !== "all") {
						this.setupSubstateMap();

					} else {
						this.setupStateMap();
					}
				} else {
					hideMap();
				}
				$.acis.areaSelection.prototype.options.mapInteraction = value;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		shower: function () {
			$(".acis-statecontainer").show();
			if (this.options.mapInteraction) {
				if ($("input[name=acis-state_select_type]:checked").attr("id") !== "all") {
					this.setupSubstateMap();

				} else {
					this.setupStateMap();
				}
			}
		},

		hider: function () {
			$(".acis-statecontainer").hide();
		},

		getter: function () {
			var ssb = $("input[name=acis-state_select_type]:checked").attr("id");
			if (ssb === "all") {
				return ['state', $("#state").val()];
			}
			if (ssb.length > 0 && $("#substate").length > 0) {
				return [ssb, $("#substate").val()];
			}
			// default if nothing has been selected
			return ["cwa", defaults.cwa || "NRCC"];
		},

		getStateType: function () {
			return $("input[name=acis-state_select_type]:checked").attr("id") || "cwa";
		},

		getStateName: function () {
			return $(".acis-state_selections select:first").find(":selected").text();
		},

		getSubstateName: function () {
			return $(".acis-state_selections select:last").find(":selected").text();
		},

		getStateAbbr: function () {
			return $(".acis-state_selections select").filter(":first").val();
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			$(".acis-statecontainer").find("select").unbind();
			$(".acis-statecontainer").children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			$(".acis-statecontainer").find("select").unbind();
			$(".acis-statecontainer").buttonBar("disable");
		},

		enable: function () {
			var setupSubstateMenu = this.setupSubstateMenu;
			$.Widget.prototype.enable.call(this, arguments);
			$(".acis-statecontainer").buttonBar("enable");
			$(".acis-statecontainer").find("select:first").bind("change", function () {
				defaults.state = $(this).val();
				defaults.climdiv = null;
				defaults.cwa = null;
				defaults.fips = null;
				defaults.huc = null;
				setupSubstateMenu();
			});
			setupSubstateMenu();
		}
	});

/* Field to enter a single date; getter does validation
   Optional options: sdFormat, sdLabel
----------------------------------------------------------*/
	$.widget("acis.singleDateSelection", {

		options: {
			sdFormat: "ymd",
			sdLabel: "Date:",
			autoShow: true
		},

		dfinfo : {
			'ymd': {'titleFormat': "yyyy-mm-dd", 'className': "acis-ymdRange", 'initDate': Date.today().toString("yyyy-MM-dd"), 'dpOptions': { dateFormat: "yy-mm-dd" }},
			'md':  {'titleFormat': "mm-dd", 'className': "acis-mdRange", 'initDate': Date.today().toString("MM-dd"), 'dpOptions': { dateFormat: "mm-dd", changeYear: false }},
			'ym':  {'titleFormat': "yyyy-mm", 'className': "acis-ymRange", 'initDate': Date.parse("lastmonth").toString("yyyy-MM"), 'dpOptions': {
				dateFormat: "yy-mm",
				showButtonPanel: true,
				onChangeMonthYear: function (yr, mn) {
					$(this).datepicker('setDate', new Date(yr, mn - 1));
				},
				beforeShow : function () {
					var datestr, actDate, yr, mn;
					if ((datestr = $(this).val()).length > 0) {
						actDate = datestr.split('-');
						yr = actDate[0];
						mn = actDate[1] - 1;
						$(this).datepicker('option', 'defaultDate', new Date(yr, mn));
						$(this).datepicker('setDate', new Date(yr, mn));
					}
				}
			}},
			// map some variations on format to above
			'yy-mm-dd': "ymd",
			'yyyy-mm-dd': "ymd",
			'yy-mm': "ym",
			'yyyy-mm': "ym",
			'mm-dd': "md"
		},

		_create: function () {
			var fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default"
				}),
				where = this.element,
				sdFormat = this.options.sdFormat.toLowerCase(),
				sdLabel = this.options.sdLabel,
				dfinfo = this.dfinfo,
				areaContainer = fieldset.clone().appendTo(where),
				tDatepicker = input.clone().attr({"id": "tDatepicker"}).appendTo(areaContainer);
			while (typeof (dfinfo[sdFormat]) === 'string') {
				sdFormat = dfinfo[sdFormat];
			}
			label.clone().attr("for", "tDatepicker").html(sdLabel).prependTo(areaContainer);
			areaContainer.attr("title", "Date has the format " + dfinfo[sdFormat].titleFormat);
			tDatepicker.addClass(dfinfo[sdFormat].className).val(dfinfo[sdFormat].initDate).datepicker(dfinfo[sdFormat].dpOptions);
			this.element.addClass("ui-widget ui-helper-reset");
			if (!this.options.autoShow) {
				areaContainer.addClass("ui-helper-hidden");
			}
		},


		getter: function () {
			var dateValue, dateFormat,
				sdFormat = this.options.sdFormat.toLowerCase();
			while (typeof (this.dfinfo[sdFormat]) === 'string') {
				sdFormat = this.dfinfo[sdFormat];
			}
			dateFormat = this.dfinfo[sdFormat].dpOptions.dateFormat;
			try {
				if (dateFormat === "yy-mm") {
					dateValue = $.datepicker.parseDate("yy-mm-dd", $("#tDatepicker").val() + "-01");
				} else {
					dateValue = $.datepicker.parseDate(dateFormat, $("#tDatepicker").val());
				}
				return $.datepicker.formatDate(dateFormat, dateValue);
			} catch (e) {
				$(document).reportError({errorText: e});
				return false;
			}
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.find("input").datepicker().datepicker('destroy');
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("input").datepicker().datepicker('disable');
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("input").datepicker().datepicker('enable');
		}
	});

/* Display a dateRangePicker
   Optional options: caliconSrc, changeFunction, autoShow
----------------------------------------------------------*/
	$.widget("acis.dateRangeSelection", {

		options: {
			caliconSrc: "./images/calicon.gif",
			changeFunction: null,
			autoShow: true
		},

		_create: function () {
			var fs,
				daterangepicker_options = {
					dateFormat: "yy-mm-dd",
					closeOnSelect: true,
					rangeStartTitle: "Start date (click a day to set)",
					rangeEndTitle: "End date (click a day to set)",
					// need delay when datarangepicker closes for these changes to stick
					onClose: function () {
						setTimeout(function () {
							if ($("#sDatepicker").val() === "1111-01-01") { $("#sDatepicker").val("por"); }
							if ($("#eDatepicker").val() === "9999-12-31") { $("#eDatepicker").val("por"); }
						}, 200);
					},
					posX: 232,
					posY: 140,
					presetRanges: [
						{text: "Last 7 Days",      dateStart: "today-7days",  dateEnd: "Today"},
						{text: 'Last 30 Days',     dateStart: 'Today-30days', dateEnd: 'Today' },
						{text: 'Last 90 Days',     dateStart: 'Today-90days', dateEnd: 'Today' },
						{text: "Month to Date",    dateStart: function () { return Date.today().moveToFirstDayOfMonth(); }, dateEnd: "Today"},
						{text: "Previous Month",   dateStart: function () { return Date.parse("lastmonth").moveToFirstDayOfMonth(); }, dateEnd: function () { return Date.parse("lastmonth").moveToLastDayOfMonth(); }},
						{text: "Year to Date",     dateStart: function () { return Date.today().moveToMonth(0, -1).moveToFirstDayOfMonth(); }, dateEnd: "Today"},
						{text: "Oct 1 to Date",    dateStart: function () { return Date.today().moveToMonth(9, -1).moveToFirstDayOfMonth(); }, dateEnd: 'Today' },
						{text: "Period of Record", dateStart: "1111-01-01", dateEnd: "9999-12-31"}
					],
					presets: {dateRange: "Select Dates"}
				},
				div = $("<div></div>"),
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default acis-ymdRange"
				}),
				calimage = $("<img></img>", {
					"class": "ui-datepicker-trigger",
					"id": "dp_calicon",
					"alt": "...",
					"title": "Click for calendar"
				}),
				br = $("<br />"),
				where = this.element,
				inputContainer = div.clone().appendTo(where);
			calimage.attr("src", this.options.caliconSrc).appendTo(where);
			fs = fieldset.clone().appendTo(inputContainer);
			label.clone().text("Start date:").appendTo(fs);
			input.clone().attr("id", "sDatepicker").val(Date.today().toString("yyyy-MM-01")).appendTo(fs);
			br.clone().appendTo(inputContainer);
			fs = fieldset.clone().appendTo(inputContainer);
			label.clone().text("End date:").appendTo(fs);
			input.clone().attr("id", "eDatepicker").val(Date.today().toString("yyyy-MM-dd")).appendTo(fs);
			where.addClass("date_range ui-widget ui-helper-reset ui-helper-clearfix").attr("title", "Dates have the format yyyy-mm-dd");
			if (this.options.changeFunction) {
				daterangepicker_options.onChange = this.options.changeFunction;
			}
			$(".acis-ymdRange").daterangepicker(daterangepicker_options);
			if (!this.options.autoShow) {
				where.addClass("ui-helper-hidden");
			}
		},


		getter: function () {
			var sDate, eDate,
				makeDate = function (el, datePor) {
					var dateInput = $(el).val().toLowerCase();
					try {
						return dateInput === 'por' ? datePor : $.datepicker.parseDate('yy-mm-dd', dateInput);
					} catch (e) {
						$(document).reportError({errorText: e + ": " + dateInput, makeActive: 0});
						return false;
					}
				},
				startPor = Date.parse("1111-01-01"),
				endPor = Date.parse("9999-12-31"),
				startDate = makeDate("#sDatepicker", startPor),
				endDate = makeDate("#eDatepicker", endPor);
			if (!startDate || !endDate) {
				return false;
			}
			if (startDate.isAfter(endDate)) {
				$(document).reportError({errorText: "Start date is after end date", makeActive: 0});
				return false;
			}
			if (startDate.equals(startPor)) {
				sDate = "por";
				$("#sDatepicker").val("por");
			} else {
				sDate = startDate.toString("yyyy-MM-dd");
			}
			if (endDate.equals(endPor)) {
				eDate = "por";
				$("#eDatepicker").val("por");
			} else {
				eDate = endDate.toString("yyyy-MM-dd");
			}
			return {"sDate": sDate, "eDate": eDate};
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.find("input").datepicker().datepicker('destroy');
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("input").datepicker().datepicker('disable');
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("input").datepicker().datepicker('enable');
		}
	});

/* Get desired element, reduction and, when appropriate, operator and threshold
   Optional options: elements, reduces, defElement, operators, mode
----------------------------------------------------------*/
	$.widget("acis.elementSelection", {

		options: {
			// default elements, reduces and operators arrays are in _create due to extend problems
			elements: [],
			defElement: "maxt",
			reduces: [],
			operators: [],
			//supported modes are "full", "numberDaysOnly", "elementOnly"
			mode: "full"
		},

		changeElem: function () {
			var reduce;
			switch (this.myElem.val()) {
			case "maxt":
				reduce = "max";
				break;
			case "mint":
				reduce = "min";
				break;
			case "avgt":
				reduce = "mean";
				break;
			case "pcpn":
				reduce = "sum";
				break;
			case "snow":
				reduce = "sum";
				break;
			case "snwd":
				reduce = "max";
				break;
			default:
				reduce = "sum";
			}
			this.myReduce.val(reduce).trigger("change");
		},

		changeReduce: function () {
			var self = this;
			if (this.myReduce.val() === "cnt" || this.myReduce.val() === "pct") {
				this.myOper.attr("value", self.myElem.val() === 'mint' ? 'le' : 'ge');
				this.threshSelect.show("slide", 200);
				setTimeout(function () { self.myThresh.focus().select(); }, 200);
			} else {
				if (this.threshSelect.css("display") !== "none") {
					this.threshSelect.hide("slide", 100);
				}
			}
		},

		_create: function () {
			var defaultElementArray = [["maxt", "Max temp"], ["mint", "Min temp"], ["avgt", "Avg temp"], ["pcpn", "Precipitation"], ["snow", "Snowfall"], ["snwd", "Snow depth"], ["hdd", "HDD base 65"], ["cdd", "CDD base 65"], ["gdd", "GDD base 50"]],
				defaultReduceArray = [["sum", "Sum"], ["mean", "Mean"], ["max", "Maximum"], ["min", "Minimum"], ["cnt", "Number of days"], ["pct", "Percent of days"]],
				defaultOperatorArray = [["lt", "<"], ["le", "<="], ["eq", "="], ["ge", ">="], ["gt", ">"], ["ne", "<>"]],
				self = this,
				where = this.element,
				reduceFS,
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				select = $("<select></select>", {"class": "ui-widget-content ui-corner-all ui-state-default"}),
				option = $("<option></option>"),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default"
				}),
				paragraph = $("<p></p>"),
				elemFS = fieldset.clone().addClass("acis-fsElem").appendTo(where);
			where.addClass("ui-widget ui-helper-reset ui-helper-clearfix");
			this.myElem = select.clone().appendTo(elemFS);
			label.clone().text("Variable").prependTo(elemFS);
			if (this.options.elements.length === 0) { this.options.elements = defaultElementArray; }
			$(this.options.elements).each(function (i, item) {
				option.clone().val(item[0]).text(item[1]).appendTo(self.myElem);
			});
			this.myElem.val(this.options.defElement);
			if (this.options.mode !== "elementOnly") {
				reduceFS = fieldset.clone().addClass("acis-fsReduce").appendTo(where);
				this.myReduce = select.clone().appendTo(reduceFS);
				label.clone().text("Summary").prependTo(reduceFS);
				if (this.options.reduces.length === 0) { this.options.reduces = defaultReduceArray; }
				$(this.options.reduces).each(function (i, item) {
					option.clone().val(item[0]).text(item[1]).appendTo(self.myReduce);
				});
				self.changeElem();
				this.threshSelect = fieldset.clone().addClass("acis-fsThresh").appendTo(where);
				label.clone().text("Threshold:").prependTo(this.threshSelect);
				this.myOper = select.clone().appendTo(this.threshSelect);
				if (this.options.operators.length === 0) { this.options.operators = defaultOperatorArray; }
				$(this.options.operators).each(function (i, item) {
					option.clone().val(item[0]).text(item[1]).appendTo(self.myOper);
				});
				this.myOper.val("ge");
				this.myThresh = input.clone().appendTo(this.threshSelect);
				this.myOper.on("change", function () { self.myThresh.focus().select(); });
				if (this.options.mode === "numberDaysOnly") {
					paragraph.clone().addClass("acis-uaLabel").text("Criteria:").prependTo(where);
					elemFS.css("margin-top", "0").find("label").css("display", "none");
					reduceFS.css("display", "none").find("select").val("cnt");
					this.threshSelect.css({"float": "left", "padding": "0", "margin": "0"}).find("label").css("display", "none");
					this.threshSelect.find("select").css({"margin-top": "3px"});
					this.myElem.on("change", function () { self.myOper.attr("value", self.myElem.val() === 'mint' ? 'le' : 'ge'); });
				} else {
					this.threshSelect.addClass("ui-helper-hidden");
					this.myElem.on("change", function () { self.changeElem(); });
					this.myReduce.on("change", function () { self.changeReduce(); });
				}
			} else {
				elemFS.css("width", "100%").find("label").css("margin-left", "0").text("Variable:");
				elemFS.find("select").css("width", "auto");
			}
		},

		getter: function (mdtype) {
			var nextelem = {
				"interval": mdtype || "dly",
				"duration": 1,					// replaces dly or mly in new ACIS WS calls
				"name": this.myElem.val()
			};
			if (this.myReduce) {
				$.extend(nextelem, {"reduce": {"reduce": this.myReduce.val()}});
				if (nextelem.reduce.reduce === "cnt" || nextelem.reduce.reduce === "pct") {
					if (this.myThresh.val() !== "") {
						nextelem.reduce.reduce += "_" + this.myOper.val() + "_" + this.myThresh.val();
					} else {
						$(document).reportError({errorText: "Enter a threshold value", makeActive: 0, focusElement: this.myThresh});
						return false;
					}
				}
			}
			return nextelem;
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			if (this.options.mode !== "elementOnly") {
				this.myOper.off("change");
				this.myElem.off("change");
				if (this.options.mode === "full") {
					this.myReduce.off("change");
				}
			}
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			if (this.options.mode !== "elementOnly") {
				this.myOper.off("change");
				this.myElem.off("change");
				if (this.options.mode === "full") {
					this.myReduce.off("change");
				}
			}
		},

		enable: function () {
			var self = this;
			$.Widget.prototype.enable.call(this, arguments);
			if (this.options.mode !== "elementOnly") {
				this.myOper.on("change", function () { self.myThresh.focus().select(); });
				if (this.options.mode === "numberDaysOnly") {
					this.myElem.on("change", function () { self.myOper.attr("value", self.myElem.val() === 'mint' ? 'le' : 'ge'); });
				} else {
					this.myElem.on("change", function () { self.changeElem(); });
					this.myReduce.on("change", function () { self.changeReduce(); });
				}
			}
		}
	});

/* Select desired season from list (radio buttons)
   Optional options: oneYear, addSeason, addSeasonIndex, highlightCSS, nohighlightCSS
----------------------------------------------------------*/
	$.widget("acis.seasonSelection", {

		options: {
			oneYear: false,
			addSeason: null,
			addSeasonIndex: 6,
			highlightCSS: {'color': 'blue', 'font-weight': 'normal'},
			nohighlightCSS: {'color': 'black', 'font-weight': 'normal'}
		},

		highlightSeason: function () {
			var syear, eyear, thisLabel, spantext,
				self = this,
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default acis-tother",
					"title": "Enter 2-digit month and day in the form mm-dd",
					"value": "mm-dd"
				}),
				newseason = $("input[name=seasonChoices]:checked").val();
			$(this.seasons).each(function (i, item) {
				thisLabel = self.element.find("label:contains(" + item[1] + ") span");
				if (item[0] === newseason) {
					if (newseason === "tother") {
						if (thisLabel.find("input").length === 0) {
							input.clone().appendTo(thisLabel);
							thisLabel.append("to");
							input.clone().appendTo(thisLabel);
						}
						thisLabel.find("input:first").focus().select();
					} else if (item[2].length !== 0) {
						if (self.options.oneYear) {
							eyear = self.theYear.val();
							syear = item[0] === "winter" || item[0] === "water" ? parseFloat(eyear) - 1 : eyear;
							spantext = " (" + item[2] + " " + syear + "-" + item[3] + " " + eyear + ")";
						} else {
							spantext = " (" + item[2] + "-" + item[3] + ")";
						}
						thisLabel.text(spantext).css(self.options.highlightCSS);
					}
				} else if (item[2].length !== 0) {
					spantext = " (" + item[2] + "-" + item[3] + ")";
					thisLabel.text(spantext).css(self.options.nohighlightCSS);
				}
			});
		},

		_create: function () {
			var fs,
				self = this,
				where = this.element,
				seasons = [["annual", "Annual", "Jan", "Dec"], ["spring", "Spring", "Mar", "May"], ["summer", "Summer", "Jun", "Aug"],
						   ["fall", "Fall", "Sep", "Nov"], ["winter", "Winter", "Dec", "Feb"], ["water", "Water Year", "Oct", "Sep"],
						   ["tmonth", "Month: <select><\/select>", "", ""], ["tother", "Other:", "", ""]],
				monthAbbs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				option = $("<option></option>"),
				paragraph = $("<p></p>"),
				br = $("<br />"),
				radio_input = $("<input />", {
					"type": "radio",
					"class": "ui-widget-content ui-corner-all ui-state-default"
				}),
				text_input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default acis-tyear"
				});
			if (this.options.addSeason) {
				seasons.splice(this.options.addSeasonIndex, 0, this.options.addSeason);
			}
			this.seasons = seasons;
			if (this.options.oneYear) {
				fs = fieldset.clone().appendTo(where);
				label.clone().text("Year:").appendTo(fs);
				this.theYear = text_input.clone().attr("maxlength", 4).val(Date.today().toString("yyyy")).appendTo(fs);
			}
			paragraph.clone().text("Period of interest:").addClass("acis-uaLabel").appendTo(where);
			$(this.seasons).each(function (i, item) {
				fs = fieldset.clone().addClass("acis-fsSeason").appendTo(where);
				radio_input.clone().attr({"name": "seasonChoices"}).val(item[0]).appendTo(fs);
				label.clone().html(item[1] + "<span><\/span>").appendTo(fs);
				br.clone().appendTo(where);
			});
			this.tmonth = this.element.find("label select").addClass('ui-widget-content ui-corner-all ui-state-default').on("change", function () {
				$(this).parents("fieldset").find("input").prop("checked", true).trigger("change");
			});
			$(monthAbbs).each(function (i, item) {
				option.clone().text(item).val((i < 9 ? '0' : '') + (i + 1)).appendTo(self.tmonth);
			});
			this.element.find("input[value='annual']").prop("checked", true);
			this.highlightSeason();
			this.element.addClass("ui-widget ui-helper-reset");
			$("input[name=seasonChoices]").on("change", function () {
				self.highlightSeason();
			});
			if (this.options.oneYear) {
				this.theYear.on("change keyup", function () {
					if ($("input[name=seasonChoices]:checked").val() !== "tother" && $(this).val().length === 4) {
						self.highlightSeason();
					}
				});
			}
		},

		getter: function (seyrs) {
			var dstart, sYear, eYear, seasonStart, seasonEnd,
				self = this,
				addMDInput = function (where, tyear) {
					var dateValue,
						mmddval = $(where).val(),
						mmdd = mmddval.split("-");
					if (mmdd.length !== 2 || !$.isNumeric(mmdd[0]) || !$.isNumeric(mmdd[1])) {
						$(document).reportError({errorText: "bad mmdd", makeActive: 0});
						return false;
					}
					try {
						dateValue = $.datepicker.parseDate("yy-m-d", (tyear + "-" + mmddval));
						return $.datepicker.formatDate("yy-mm-dd", dateValue);
					} catch (e) {
						$(document).reportError({errorText: e, makeActive: 0});
						return false;
					}
				};
			if (this.options.oneYear) {
				sYear = this.theYear.val();
				eYear = this.theYear.val();
			} else if (seyrs) {
				sYear = seyrs[0];
				if (sYear === 'por') { seasonStart = sYear; }
				eYear = seyrs[1];
				if (eYear === 'por') { seasonEnd = eYear; }
			} else {
				sYear = Date.today().toString("yyyy");
				eYear = Date.today().toString("yyyy");
			}
			switch ($("input[name=seasonChoices]:checked").val() || 'annual') {
			case "annual":
				if (sYear !== 'por') { seasonStart = sYear + "-01-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-12-31"; }
				break;
			case "spring":
				if (sYear !== 'por') { seasonStart = sYear + "-03-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-05-31"; }
				break;
			case "summer":
				if (sYear !== 'por') { seasonStart = sYear + "-06-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-08-31"; }
				break;
			case "fall":
				if (sYear !== 'por') { seasonStart = sYear + "-09-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-11-30"; }
				break;
			case "winter":
				if (sYear !== 'por') { seasonStart = sYear + "-12-01"; }
				if (eYear !== 'por') {
					seasonEnd = eYear + "-02-28";
					if (Date.isLeapYear(Date.parse(seasonEnd).getFullYear())) {
						seasonEnd = eYear + "-02-29";
					}
				}
				break;
			case "water":
				if (sYear !== 'por') { seasonStart = sYear + "-10-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-09-30"; }
				break;
			case "tall":
				if (sYear !== 'por') { seasonStart = sYear + "-01-01"; }
				if (eYear !== 'por') { seasonEnd = eYear + "-12-31"; }
				break;
			case "tmonth":
				if (sYear !== 'por') { seasonStart = sYear + "-" + self.tmonth.val() + "-01"; }
				if (eYear !== 'por') {
					seasonEnd = Date.parse(eYear + "-" + self.tmonth.val() + "-01").moveToLastDayOfMonth().toString("yyyy-MM-dd");
				}
				break;
			case "tother":
				if (sYear !== 'por') {
					seasonStart = addMDInput(self.element.find("label:contains('Other') span").find("input:first"), sYear);
					if (!seasonStart) { return false; }
				}
				if (eYear !== 'por') {
					seasonEnd = addMDInput(self.element.find("label:contains('Other') span").find("input:last"), eYear);
					if (!seasonEnd) { return false; }
				}
				break;
			}
			if (this.options.oneYear && sYear !== 'por' && eYear !== 'por') {
				// decrement start year when crossing year boundary
				dstart = Date.parse(seasonStart);
				if (dstart.getMonth() > Date.parse(seasonEnd).getMonth()) {
					seasonStart = dstart.addYears(-1).toString("yyyy-MM-dd");
				}
			}
			return [seasonStart, seasonEnd];
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			$("input[name=seasonChoices]").off("change");
			this.element.find("label select").off("change");
			if (this.options.oneYear) {
				this.theYear.off("change keyup");
			}
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			$("input[name=seasonChoices]").off("change");
			this.element.find("label select").off("change");
			if (this.options.oneYear) {
				this.theYear.off("change keyup");
			}
		},

		enable: function () {
			var self = this;
			$.Widget.prototype.enable.call(this, arguments);
			$("input[name=seasonChoices]").on("change", function () {
				self.highlightSeason();
			});
			this.element.find("label select").on("change", function () {
				$(this).parents("fieldset").find("input").prop("checked", true).trigger("change");
			});
			if (this.options.oneYear) {
				this.theYear.on("change keyup", function () {
					if ($("input[name=seasonChoices]:checked").val() !== "tother" && $(this).val().length === 4) {
						self.highlightSeason();
					}
				});
			}
		}
	});

/* Select desired start and end years
   Optional options: defaultStart, defaultEnd
----------------------------------------------------------*/
	$.widget("acis.yearRangeSelection", {

		options: {
			defaultStart: "1850",
			defaultEnd: Date.today().getFullYear()
		},

		_create: function () {
			var where = this.element,
				div = $("<div></div>", {
					"class": "ui-helper-hidden choiceExplain"
				}),
				span = $("<span></span>"),
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default acis-tyear"
				}),
				fs = fieldset.clone().appendTo(where);
			$.fn.showOnce = function (what) {
				$(this).on("focus", function () {
					$(".choiceExplain").show().text(what);
					$(this).on("blur keypress", function () {
						$(".choiceExplain").hide();
						$(this).off("blur keypress focus");
					});
				});
			};
			label.clone().text("Year range:").appendTo(fs);
			input.clone().val(this.options.defaultStart).appendTo(fs);
			span.clone().text("-").appendTo(fs);
			input.clone().val(this.options.defaultEnd).appendTo(fs);
			div.clone().appendTo(where);
			this.element.addClass("ui-widget ui-helper-reset");
			fs.find("input").on("click", function () { $(this).focus().select(); });
			fs.find("input:first").showOnce("Enter starting year or 'por' for start of record.");
			fs.find("input:last").showOnce("Enter ending year or 'por' for end of record.");
		},

		getter: function () {
			return [this.element.find("fieldset input:first").val().toLowerCase(), this.element.find("fieldset input:last").val().toLowerCase()];
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.children().remove();
			this.element.find("fieldset input").off("click blur keypress focus");
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("fieldset input").off("click blur keypress focus");
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("fieldset input").on("click", function () { $(this).focus().select(); });
		}
	});

/* Select desired start and end months
   Optional options: defaultStart, defaultEnd
----------------------------------------------------------*/
	$.widget("acis.monthRangeSelection", {

		options: {
			defaultStart: "1",
			defaultEnd: "12"
		},

		_create: function () {
			var where = this.element,
				span = $("<span></span>"),
				fieldset = $("<fieldset></fieldset>"),
				label = $("<label></label>"),
				input = $("<input />", {
					"type": "text",
					"class": "ui-widget-content ui-corner-all ui-state-default acis-tmonth"
				}),
				fs = fieldset.clone().appendTo(where);
			label.clone().text("Month range:").appendTo(fs);
			input.clone().val(this.options.defaultStart).appendTo(fs);
			span.clone().text("-").appendTo(fs);
			input.clone().val(this.options.defaultEnd).appendTo(fs);
			this.element.addClass("ui-widget ui-helper-reset");
			fs.find("input").on("click", function () { $(this).focus().select(); });
		},

		getter: function () {
			return [parseInt(this.element.find("fieldset input:first").val(), 10), parseInt(this.element.find("fieldset input:last").val(), 10)];
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.children().remove();
			this.element.find("fieldset input").off("click");
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
			this.element.find("fieldset input").off("click");
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
			this.element.find("fieldset input").on("click", function () { $(this).focus().select(); });
		}
	});

/* Check desired elements off from a table
   Optional options: elements, defChecked, defDisabled
----------------------------------------------------------*/
	$.widget("acis.multiElementPicker", {

		options: {
			elements: [["maxt", "Max temp"], ["mint", "Min temp"], ["avgt", "Avg temp"], ["obst", "Obs temp"], ["pcpn", "Precipitation"], ["snow", "Snowfall"], ["snwd", "Snow depth"], ["hdd_", "HDD base 65"], ["cdd_", "CDD base 65"], ["gdd_", "GDD base 50"]],
			defChecked: ["maxt", "mint", "pcpn", "snow", "snwd"],
			defDisabled: ["snwdnrm", "snwddpt", "gdd_nrm", "gdd_dpt"]
		},

		_create: function () {
			var tablerow,
				self = this,
				where = this.element,
				table = $("<table></table>"),
				tr = $("<tr></tr>"),
				td = $("<td></td>"),
				th = $("<th></th>"),
				input = $("<input />", {
					"type": "checkbox",
					"class": "ui-widget-content ui-corner-all ui-state-default"
				});
			this.inputTable = table.clone().addClass("acis-multiInputTable").appendTo(where);
			tablerow = tr.clone();
			$(['Variable', 'Value', 'Normal', 'Depart']).each(function (i, item) {
				th.clone().text(item).appendTo(tablerow);
			});
			tablerow.appendTo(self.inputTable);
			$(this.options.elements).each(function (i, item) {
				tablerow = tr.clone();
				td.clone().text(item[1]).appendTo(tablerow);
				$([item[0], item[0] + "nrm", item[0] + "dpt"]).each(function (j, name) {
					td.clone().html(input.clone().attr("name", name)).appendTo(tablerow);
				});
				tablerow.appendTo(self.inputTable);
			});
			$(this.options.defChecked).each(function (i, item) {
				$("input[name=" + item + "]").attr('checked', true);
			});
			$(this.options.defDisabled).each(function (i, item) {
				$("input[name=" + item + "]").attr('disabled', true);
			});
			this.element.addClass("ui-widget ui-helper-reset");
		},

		getter: function () {
			var checkedItemNames = [];
			$(this.inputTable.find("input:checked")).each(function (i, item) {
				checkedItemNames.push(item.name);
			});
			return checkedItemNames;
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.removeClass("ui-widget ui-helper-reset");
			this.element.children().remove();
		},

		disable: function () {
			$.Widget.prototype.disable.call(this, arguments);
		},

		enable: function () {
			$.Widget.prototype.enable.call(this, arguments);
		}
	});

/* Display a dialog box where users can click years of interest
   Optional options: sYear, eYear, position, open, close, listArea (element where results are displayed)
----------------------------------------------------------*/
	$.widget("acis.yearPicker", {

		options: {
			sYear: "1850",
			eYear: Date.today().getFullYear().toString(10),
			listArea: null,
			position: [0, 0],
			open: null,
			close: null
		},

		buildYrTable: function () {
			var refreshAreaList = function (self) {
					if (self.options.listArea) {
						$(self.options.listArea).empty();
						$.each(self.yrsSelected, function (i, val) {
							$(self.options.listArea).append(val + " ");
						});
					}
				},
				i,
				self = this,
				next_tr = "",
				yrTable = this.filterDialog.find("table"),
				begyr = this.options.sYear.toLowerCase() === "por" ? 1850 : parseInt(this.options.sYear, 10),
				endyr = this.options.eYear.toLowerCase() === "por" ? Date.today().getFullYear() : parseInt(this.options.eYear, 10);
			this.filterDialog.dialog('open');
			yrTable.empty();
			for (i = begyr; i <= endyr; i += 1) {
				next_tr += '<td>' + i + '<\/td>';
				if ((i - begyr) % 10 === 9 || i === endyr) {
					yrTable.append('<tr>' + next_tr + '<\/tr>');
					next_tr = "";
				}
			}
			yrTable.find("td").each(function (i) {
				if ($.inArray($(this).text(), self.yrsSelected) >= 0) {
					$(this).toggleClass("acis-highlightYr", true);
				}
			});
			yrTable.find("td").click(function () {
				$(this).toggleClass("acis-highlightYr");
				if ($(this).hasClass("acis-highlightYr")) {
					self.yrsSelected.push($(this).text());
					self.yrsSelected.sort();
				} else {
					i = $.inArray($(this).text(), self.yrsSelected);
					self.yrsSelected.splice(i, 1);
				}
				refreshAreaList(self);
			});
			refreshAreaList(self);
		},

		update: function () {
			var self = this,
				begyr = this.options.sYear.toLowerCase(),
				endyr = this.options.eYear.toLowerCase();
			if (begyr === "por") { begyr = "1850"; }
			if (endyr === "por") { endyr = Date.today().getFullYear().toString(10); }
			$.each(self.yrsSelected, function (i, val) {
				if (val < begyr || val > endyr) {
					self.yrsSelected.splice(i, 1);
				}
			});
			self.buildYrTable();
		},

		_create: function () {
			var self = this;
			if (!this.filterDialog || this.filterDialog.length === 0) {
				this.filterDialog = $("<div></div>")
					.appendTo(document.body)
					.addClass("ui-widget")
					.html('<span>Click years of interest<\/span><br \/><table class="acis-yrTable"><\/table>')
					.dialog({
						width: 470,
						title: "Year selector",
						buttons: [{ text: "Clear all", click: function () { self.yrsSelected = []; self.buildYrTable(); } },
								  { text: "Done", click: function () { $(this).dialog('close'); } }
								 ],
						position: self.options.position,
						open: self.options.open,
						close: self.options.close
					});
			}
			self.yrsSelected = [];
			self.buildYrTable();
		},

		getter: function () {
			var i, years = [];
			for (i = 0; i < this.yrsSelected.length; i += 1) {
				years.push(parseInt(this.yrsSelected[i], 10));
			}
			return years;
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.children().remove();
		}

	});

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
				if (!$.browser.msie) {
					barContainer.find("label:first-of-type").addClass("ui-corner-top");
					barContainer.find("label:last-of-type").addClass("ui-corner-bottom");
				}
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

/* Create loading message with spinner
   Optional options: message, disableElement
----------------------------------------------------------*/
	$.widget("acis.loadSpinner", {

		options: {
			message: "Processing ...",
			disableElement: "#go"
		},

		_create: function () {
			var	div = $("<div></div>", {
					"class": "loading"
				}),
				span = $("<span></span>"),
				loadContainer = div.clone().appendTo(this.element);
			span.clone().text(this.options.message).appendTo(loadContainer);
			$(this.options.disableElement).button("disable");
		},

		fadeOut: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.children(".loading").fadeOut(200, function () { $(this).remove(); });
			$(this.options.disableElement).button("enable");
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this, arguments);
			this.element.children(".loading").remove();
			$(this.options.disableElement).button("enable");
		}
	});

/* Display an error message, optionally select an accordian panel and optionally highlight an input field
   Required option: errorText
   Optional options: makeActive, focusElement
----------------------------------------------------------*/
	$.widget("acis.reportError", {

		options: {
			errorText: "Unknown error",
			makeActive: -1,
			focusElement: null
		},

		_create: function () {
			if (!this.errorDialog) {
				this.errorDialog = $("<div></div>")
					.appendTo(document.body)
					.addClass("ui-widget")
					.css("padding", "0")
					.append('<div class="ui-widget-content ui-state-error ui-corner-all ui-helper-clearfix errorBox">' +
							'<span class="ui-icon ui-icon-alert"><\/span><span class="ui-state-error-text"><\/span><\/div>')
					.dialog({
						width: 550,
						modal: true,
						minHeight: 40,
						buttons: { OK: function () { $(this).dialog("close"); } }
					});
			}
		},

		_init: function () {
			var errorText = this.options.errorText,
				makeActive = this.options.makeActive,
				focusElement = this.options.focusElement,
				errorInfo = [
					{reperr: "Unknown station id", accact: 1},
					{reperr: "bad station", msgtxt: "Bad station selection", accact: 1},
					{reperr: "elems", msgtxt: "Bad element selection. Select one or more variables", accact: 0},
					{reperr: "sDate", msgtxt: "Bad starting date selection. Make sure the date is of the form yyyy-mm-dd.", accact: 0},
					{reperr: "eDate", msgtxt: "Bad ending date selection. Make sure the date is of the form yyyy-mm-dd.", accact: 0},
					{reperr: "bad mmdd", msgtxt: "Bad date. Make sure the month and day are digits of the form mm-dd.", accact: 0},
					{reperr: "bad latlon", msgtxt: "Invalid input - latitudes and longitudes must be numbers", accact: 1},
					{reperr: "big area", msgtxt: "Select a smaller area", accact: 1},
					{reperr: "ajaxError", msgtxt: "Error processing request"}
				];
			// look for custom message info
			$.each(errorInfo, function (i, errobj) {
				if (errorText.indexOf(errobj.reperr) > -1) {
					if (errobj.msgtxt) { errorText = errobj.msgtxt; }
					if (errobj.accact && !makeActive) { makeActive = errobj.accact; }
					return false;
				}
			});
			this.errorDialog
				.dialog("open")
				.one("dialogclose", function () {
					$(this).find("span:last").empty();
					if (makeActive >= 0 && $(":ui-accordion").accordion('option', 'active') !== makeActive) {
						$(":ui-accordion").accordion("activate", makeActive);
					}
					if (focusElement) {
						$(focusElement).effect("highlight", {color: "red"}, 2000);
						// delay to override any other focus selects for accordian change events
						setTimeout(function () {$(focusElement).focus().select(); }, 500);
					}
				})
				.find("span:last").text('Error: ' + errorText);
		}
	});

}(jQuery));