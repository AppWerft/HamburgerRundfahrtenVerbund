Ti.include('datas.js');

exports.create = function() {
	var self = Ti.Map.createView({
		bottom : 40,
		top : 0,
		height : '100%',
		userLocation : true,
		mapType : Ti.Map.STANDARD_TYPE,
		region : {
			latitude : 53.56,
			longitude : 9.98,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		}
	});
	var annotations = [];
	for (var i = 0; i < h.length; i++) {
		annotations.push(require('modules/station').create(h[i]));
	}
	self.addAnnotations(annotations);
	self.addEventListener('complete', function() {
		if (self.busadded)
			return;
		setTimeout(function() {
			self.addAnnotation(require('modules/bussimulation').start(lines[0]));
			self.addAnnotation(require('modules/bussimulation').start(lines[0]));
			self.addAnnotation(require('modules/bussimulation').start(lines[0]));
			self.addAnnotation(require('modules/bussimulation').start(lines[1]));
			self.addAnnotation(require('modules/bussimulation').start(lines[1]));
			self.addAnnotation(require('modules/bussimulation').start(lines[1]));
			self.busadded = true;
		}, 5000);
	});

	return self;
}