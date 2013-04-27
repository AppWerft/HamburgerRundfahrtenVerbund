exports.create = function(s) {
	return Ti.Map.createAnnotation({
		latitude : s.ll.split(',')[0],
		longitude : s.ll.split(',')[1],
		image : 'assets/h.png',
		title : s.label,
		subtitle : (s.sublabel) ? s.sublabel : '',
		rightButton : 'assets/streetview.png',
		latlng : s.ll,
		layer : 'station',
		animate : true,
	});
}
