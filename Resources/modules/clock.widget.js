exports.create = function() {
	var setClock = function() {
		var zeit = new Date();
		var mm = zeit.getMinutes();
		var hh = zeit.getHours() % 12 + mm / 60;
		h.setTransform(Ti.UI.create2DMatrix().rotate(hh * 360 / 12));
		m.setTransform(Ti.UI.create2DMatrix().rotate(mm * 360 / 60));
	};
	var self = Ti.UI.createImageView({
		image : 'assets/clock/hafenuhr3.png',
		width : 280,
		height : 460,
	});
	var center = {
		"x" : 136,
		"y" : 388
	};
	var m = Ti.UI.createImageView({
		image : 'assets/clock/m.png',
		width : 7,
		opacity : 0.86,
		height : 85,
		center : center,
		anchorPoint : {
			"x" : 0.5,
			"y" : 0.5
		}
	});
	var h = Ti.UI.createImageView({
		image : 'assets/clock/h.png',
		width : 10,
		height : 60,
		opacity : 0.88,
		center : center,
		anchorPoint : {
			"x" : 0.5,
			"y" : 0.5
		}
	});
	self.add(m);
	self.add(h);
	setClock();
	setInterval(setClock, 5000);
	if (Ti.Platform.displayCaps.platformWidth == 320) {
		setTimeout(function() {
			self.animate({
				bottom : -460,
				duration : 2000
			});
		}, 10000);
		self.addEventListener('click', function() {
			self.animate({
				bottom : -460,
				duration : 2000
			});
		})
	} else {
		self.touchEnabled = false;
		self.bubbleParent = true;
		Ti.Gesture.addEventListener('orientationchange', function(ev) {
			if (Ti.Gesture.isLandscape(ev.orientation)) {
				self.show();
			} else {
				self.hide();
				// Update your UI for portrait orientation
			}
		});
	}
	return self;
};

