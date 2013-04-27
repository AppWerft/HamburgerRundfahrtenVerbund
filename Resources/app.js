function getButtonAction(button, line) {
	button.addEventListener('click', function() {
		if (line.route.visible == true) {
			mapView.removeRoute(line.route);
			line.route.visible = false;
			button.backgroundColor = 'gray';
		} else {
			mapView.addRoute(line.route);
			line.route.visible = true;
			button.backgroundColor = line.color;
		}
	});
}

var self = Titanium.UI.createWindow();

var lines = {};

var buttons = {};

Ti.include('datas.js');

var mapView = require('modules/map.widget').create();
self.add(mapView);
var clockView = require('modules/clock.widget').create();
clockView.setBottom(0);
clockView.setRight('10dp');
self.add(clockView);
for (var i = 0; i < lines.length; i++) {
	var line = lines[i];
	buttons[i] = Ti.UI.createButtonBar({
		labels : ['Linie ' + line.label],
		bottom : 0,
		height : 30,
		style : Ti.UI.iPhone.SystemButtonStyle.BAR,
		width : 80,
		left : 80 * i,
		backgroundColor : line.polyline ? line.color : 'gray'
	});
	self.add(buttons[i]);
	if (line.polyline) {
		var points = [];
		for (var j = 0; j < line.polyline.length; j++) {
			points.push({
				latitude : line.polyline[j][0],
				longitude : line.polyline[j][1]
			});
		}
		line.route = {
			name : 'line-' + line.label,
			points : points,
			color : line.color,
			visible : true,
			width : 2
		};
		mapView.addRoute(line.route);
		getButtonAction(buttons[i], line);
	}
}

var webView = Ti.UI.createWebView({
	url : './sv.html',
	loaded : false
});
var closer = Ti.UI.createButton({
	height : 30,
	opacity : 0.6,
	bottom : 5,
	right : 5,
	width : 120,
	title : 'Schließen'
});
closer.addEventListener('click', function() {
	//	mapView.deselectAnnotation(annotation);
	webView.evalJS('clearPano();');
	self.animate({
		view : mapView,
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
	setTimeout(function() {
		self.remove(webView);
	}, 100);
});
webView.add(closer);

mapView.addEventListener('click', function(p) {
	if (!p.clicksource)
		return;
	var annotation = p.annotation;
	switch (annotation.layer) {
		case  'bus':
			annotation.selected = (annotation.clicksource && annotation.clicksource == 'pin') ? true : false;
			break;
		case 'station':
			if (p.clicksource == 'pin') {
				if (webView.loaded == true) {
					webView.reload();
				}
				webView.addEventListener('load', function() {
					webView.evalJS('initSV(' + p.annotation.latlng + ');');
					webView.loaded = true;
				});
				webView.hide();
			};
			if (p.clicksource == 'rightButton' || p.clicksource == 'title') {
				self.add(webView);
				self.animate({
					view : webView,
					transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT,
				});
				setTimeout(function() {
					webView.show();
				}, 100);
			};
			break;
	}
});
self.add(Ti.UI.createImageView({
	top : 5,
	right : 5,
	width : 100,
	opacity : 0.4,
	image : '/assets/aw.png'
}));
self.open();
