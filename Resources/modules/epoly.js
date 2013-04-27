/** Converts numeric degrees to radians */
if ( typeof Number.prototype.toRad == 'undefined') {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}

/** Converts radians to numeric (signed) degrees */
if ( typeof Number.prototype.toDeg == 'undefined') {
	Number.prototype.toDeg = function() {
		return this * 180 / Math.PI;
	}
}

////  Constructor ///////////////
/////////////////////////////////
function iEpoly(_poly) {
	this.init(_poly);
	return this;
}

iEpoly.prototype.init = function(_poly) {
	if (this._EPoly) {
		return;
	}
	this._EPoly = {};
	//this._EPoly.Bounds = this.getBounds();
	this._EPoly.lats = [];
	this._EPoly.lons = [];
	this._EPoly.points = [];
	for (var i = 0; i < _poly.length; i++) {
		this._EPoly.lats[i] = _poly[i][0];
		this._EPoly.lons[i] = _poly[i][1];
		this._EPoly.points[i] = {
			lat : _poly[i][0],
			lon : _poly[i][1]
		};
	}
}

iEpoly.prototype.getVertex = function(_ndx) {
	return this._EPoly.points[_ndx];
}

iEpoly.prototype.getVertexLength = function() {
	return this._EPoly.points.length;
}
iEpoly.prototype.getLength = function() {
	if (!this._EPoly) {
		this.init();
	}
	var length = 0;
	for (var i = 0; i < this._EPoly.points.length-1; i++) {		
		length += this.distanceFrom(this._EPoly.points[i],this._EPoly.points[i+1])
	}
	return length;
}
iEpoly.prototype.getPointsAtDistance = function(_metres) {
	if (!this._EPoly) {
		this.init();
	}
	var next = _metres;
	var points = [];
	if (_metres <= 0)
		return points;
	var dist = 0;
	var olddist = 0;
	for (var i = 1; i < this.getVertexLength(); i++) {
		olddist = dist;
		dist += this.distanceFrom(this.getVertex(i - 1), this._EPoly.points[i]);
		while (dist > next) {
			var p1 = this._EPoly.points[i - 1];
			var p2 = this._EPoly.points[i];
			var m = (next - olddist) / (dist - olddist);
			points.push({
				lat : p1.lat + (p2.lat - p1.lat) * m,
				lon : p1.lon + (p2.lon - p1.lon) * m
			});
			next += _metres;
		}
	}
	return points;
}

iEpoly.prototype.distanceFrom = function(foo, bar) {
	var R = 6371000;
	var dLat = (bar.lat - foo.lat).toRad();
	var dLon = (bar.lon - foo.lon).toRad();
	var lat1 = foo.lat.toRad();
	var lat2 = bar.lat.toRad();
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;

}
module.exports = iEpoly;
