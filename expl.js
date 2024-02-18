Array.prototype.shuffle = function (hom = 1) {
	let count = this.length * hom;

	while (count-- > 0) {
		let from = (Math.random() * this.length) | 0,
			to = (Math.random() * this.length) | 0,
			tmp = this[from];

		this[from] = this[to];
		this[to] = tmp;
	}
}

const AIR_RESIST = 0.0002;

class Explosions extends Array {
	constructor() {
		super();

		this.wind = 0;
	}
	toBase64({ pause, count, dx, dy, spread, area, gravity, homogenity, physical, ttl, custom }) {
		let str = String.fromCharCode(pause * 255, count, dx * 127 + 128, dy * 127 + 128, spread * 255, area * 255, gravity * 127 + 128, homogenity * 255, physical * 255, ttl * 255, custom);
		return btoa(str);
	}
	fromBase64(base64Str) {
		if (typeof(base64Str) !== 'string') debugger;
		let arr = atob(base64Str).split('').map(s => parseFloat(s.charCodeAt(0)));
		let [pause, count, dx, dy, spread, area, gravity, homogenity, physical, ttl, custom] = arr;
		pause /= 255;
		dx -= 128; dx /= 127;
		dy -= 128; dy /= 127;
		spread /= 255;
		area /= 255;
		gravity -= 128; gravity /= 127;
		homogenity /= 255;
		physical /= 255;
		ttl /= 255;
		return { pause, count, dx, dy, spread, area, gravity, homogenity, physical, ttl, custom };
	}
	add(x, y, { pause, count, dx, dy, spread, area, gravity, homogenity, physical, ttl, custom }, commonParams, globalPause = 0, fxScale = 2) {

		if (!(count > 0)) debugger;
		if (typeof(x) !== 'number') debugger;
		if (typeof(y) !== 'number') debugger;
		if (typeof(dx) !== 'number') debugger;
		if (typeof(dy) !== 'number') debugger;
		if (!(spread >= 0 && spread <= 1)) debugger;
		if (!(area >= 0)) debugger;
		if (typeof(gravity) !== 'number') debugger;
		if (!(homogenity >= 0 && homogenity <= 1)) debugger;
		if (!(physical >= 0 && physical <= 1)) debugger;
		if (!(ttl > 0)) debugger;

		let rnd1 = x => -x + Math.random() * x * 2;

		homogenity = Math.max(1 - homogenity, 0);
		count += rnd1(count * 0.5 * homogenity) | 0;

		let sector = Math.PI * 2 * spread / count,
			dirStart = sector * count / 2 - sector / 2,
			dir0 = Math.atan2(dy, dx) - dirStart,
			dir05 = dir0 + sector * count * 0.5,
			force = Math.max(AIR_RESIST, Math.hypot(dx, dy)) * fxScale,
			toShuffle = [];

		for (let i = 0; i < count; i++) {
			let dir = (dir0 + i * sector + rnd1(sector * homogenity)) * (1 - homogenity * 0.5) + (dir05 + rnd1(sector * count * 0.5 * homogenity)) * homogenity * 0.5,
				force0 = (force + rnd1(force * 0.5 * homogenity)),
				sectorMul = Math.max(0, 1 - Math.abs(i - count / 2) * 2 / count * homogenity),
				areaDistRand = Math.random() * area * homogenity,
				areaAngle = Math.random() * Math.PI * 2;
			
			force0 *= sectorMul;
			
			let pt = {
				x: x + Math.cos(areaAngle) * areaDistRand * homogenity * fxScale + Math.cos(dir) * area * (1 - homogenity) * fxScale,
				y: y + Math.sin(areaAngle) * areaDistRand * homogenity * fxScale + Math.sin(dir) * area * (1 - homogenity) * fxScale,
				sx: Math.cos(dir) * force0,
				sy: Math.sin(dir) * force0,
				ttl: (ttl + rnd1(ttl * homogenity)) * (1 + sectorMul * homogenity),
				airResistance: physical * AIR_RESIST * (1 - sectorMul * 0.5) + rnd1(physical * AIR_RESIST * 0.125 * homogenity),
				gravity: gravity * fxScale,
				physical,
				t: 0,
				rnd: Math.random(),
				custom,
				params: commonParams
			};

			pt.weight = pt.ttl / ttl;

			this.push(pt);
			toShuffle.push(pt);
		}

		toShuffle.shuffle(Math.sqrt(homogenity));

		let duration = physical * homogenity * ttl * 0.5;
		
		for (let i = 0; i < count; i++) {
			let delay0 = i / count * duration;
			toShuffle[i].t = -pause + pause * 0.5 * rnd1(homogenity) - globalPause - delay0 + rnd1(duration * homogenity * 0.5);
		}
	}
	update(dt) {
		this.wind = Math.sin(Date.now() / 10000) * 0.25;

		let windy = Math.pow(Math.sin(Date.now() / 1300), 10) * 0.1 + Math.pow(Math.sin(Date.now() / 700), 100) * 0.25;

		for (let i = 0; i < this.length; i++) {
			let pt = this[i];

			pt.t += dt;

			if (pt.t < 0) continue;
			
			pt.x += pt.sx * dt;
			pt.y += pt.sy * dt;

			let v2 = pt.sx * pt.sx + pt.sy * pt.sy;
			let d = Math.sqrt(v2);
			let ax = pt.sx / d * pt.airResistance * v2;
			let ay = pt.sy / d * pt.airResistance * v2;

			if (ax * ax + ay * ay > v2) {
				pt.sx = 0;
				pt.sy = 0;
			} else {
				pt.sx -= ax;
				pt.sy -= ay;
			}

			pt.sx += pt.physical * this.wind * dt / Math.max(0.3, pt.gravity * pt.gravity) * pt.weight;
			pt.sy += pt.physical * windy * dt / Math.max(0.3, pt.gravity * pt.gravity) * pt.weight;
			pt.sy += pt.physical * pt.gravity * dt * pt.weight;

			if (pt.t >= pt.ttl) {
				this[i] = this[this.length - 1];
				this.length--;
			}
		}
	}
}
