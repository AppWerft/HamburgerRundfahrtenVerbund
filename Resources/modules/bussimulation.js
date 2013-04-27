exports.start = function(line) {
	var self = Ti.Map.createAnnotation({
		image : '/assets/bus.png',
		latitude : 53.5460196,
		longitude : 9.9705219,
		line : line.label,
		title : 'Rundfahrt Linie „' + line.label + '“',
		subtitle : ' ',
		animate : false,
		rightButton : null,
		layer : 'bus'
	});
	Ti.App.EPoly = require('modules/epoly');
	var EPoly = new Ti.App.EPoly(line.polyline);
	var nodes = EPoly.getPointsAtDistance(56);
	var lastnode = parseInt(Math.random() * (nodes.length - 1));
	function callSim() {
		if (self.selected) {
			require('modules/georeverse').get({
				lat : self.getLatitude(),
				lon : self.getLongitude()
			}, function(d) {
				if (d.success) {
					var subtitle = d.res.street + ' ' + d.res.number;
					self.setSubtitle(subtitle);
				} else {
					self.setSubtitle(' ');
				}
			});
		}
		setTimeout(callSim, Math.random() * 7777 + 777);
		self.setLongitude(nodes[lastnode].lon);
		self.setLatitude(nodes[lastnode].lat);
		self.rightButton = null;
		lastnode++;
		if (lastnode == nodes.length)
			lastnode = 0;
	}

	callSim();
	return self;
}