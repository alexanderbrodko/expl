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

let packParams = [
	[1, 0, 10],
	[1, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[511, 512, 32],
	[1, 0, 32],
	[1023, 0, 32],
	[1023, 0, 32],
	[511, 512, 32],
	[511, 512, 32]
];

function to2Base(n, base) {
	let str = n.toString(base);
	if (str.length === 1) {
		str = '0' + str;
	}
	if (str.length !== 2) debugger;
	return str;
}

function getCellSize(width, height, count) {
	let maxSide = Math.max(width, height),
		minSide = Math.min(width, height),
		maxc = count;

	if (!maxc) return 0;

	let cell = maxSide / maxc;
	for (let minc = 1; minc < 100; minc++) {
		let oldcell = cell;
		maxc = Math.floor(count / minc);
		cell = maxSide / (maxc + 1);
		if (cell * minc >= minSide) {
			cell = oldcell;
			break;
		}
	}
	return cell;
}

class Explosions extends Array {
	constructor() {
		super();

		this.wind = 0;
	}
	pack({ custom, dir, force, spread, radius, width, homogenity, physical, gravity, count, pause, ttl, dx, dy }) {
		let arr = [ custom, dir, force, spread, radius, width, homogenity, physical, gravity, count, pause, ttl, dx, dy ],
			str = '';
		for (let i = 0; i < packParams.length; i++) {
			let n = Math.floor(arr[i] * packParams[i][0] + packParams[i][1]);
			str += to2Base(n, packParams[i][2]);
		}
		return str;
	}
	unpack(str) {
		if (!str || typeof(str) !== 'string') debugger;
		let arr = [];
		for (let i = 0; i < packParams.length; i++) {
			let sub = str.substr(i * 2, 2),
				n = parseInt(sub, packParams[i][2]);
			if (isNaN(n)) debugger;
			n -= packParams[i][1];
			n /= packParams[i][0];
			arr.push(n);
		}
		let [ custom, dir, force, spread, radius, width, homogenity, physical, gravity, count, pause, ttl, dx, dy ] = arr;
		return { custom, dir, force, spread, radius, width, homogenity, physical, gravity, count, pause, ttl, dx, dy };
	}
	spawnFromString(x, y, str, commonParams, globalPause, forceMul) {
		let arr = str.split(',');
		for (let fxStr of arr) if (fxStr) {
			this.add(x, y, this.unpack(fxStr), commonParams, globalPause, forceMul);
		}
	}
	add(x, y, { custom, dir, force, spread, radius, width, homogenity, physical, gravity, count, pause, ttl, dx, dy }, commonParams, globalPause = 0, forceMul = 3) {

		if (!(count > 0)) debugger;
		if (typeof(x) !== 'number') debugger;
		if (typeof(y) !== 'number') debugger;
		if (typeof(dir) !== 'number') debugger;
		if (typeof(force) !== 'number') debugger;
		if (!(spread >= 0 && spread <= 1)) debugger;
		if (!(radius >= 0)) debugger;
		if (typeof(gravity) !== 'number') debugger;
		if (!(homogenity >= 0 && homogenity <= 1)) debugger;
		if (!(physical >= 0 && physical <= 1)) debugger;
		if (!(ttl > 0)) debugger;
		if (!(width >= 0)) debugger;
		if (typeof(dx) !== 'number') debugger;
		if (typeof(dy) !== 'number') debugger;

		let rnd1 = x => -x + Math.random() * x * 2;

		homogenity = Math.max(1 - homogenity, 0);
		count += rnd1(count * 0.5 * homogenity) | 0;

		let sector = Math.PI * 2 * spread / count,
			dirStart = sector * count / 2 - sector / 2,
			dir0 = (dir / 180 * Math.PI) - dirStart,
			dir05 = dir0 + sector * count * 0.5,
			toShuffle = [],
			normx = Math.cos((dir - 90) / 180 * Math.PI),
			normy = Math.sin((dir - 90) / 180 * Math.PI);

		for (let i = 0; i < count; i++) {
			let dirHomogenous = (dir0 + i * sector + rnd1(sector * homogenity)) * (1 - homogenity * 0.5) + (dir05 + rnd1(sector * count * 0.5 * homogenity)) * homogenity * 0.5,
				force0 = force + rnd1(force * 0.5 * homogenity),
				sectorMul = Math.max(0, 1 - Math.abs(i - count / 2) * 2 / count * homogenity),
				radiusDistRand = Math.random() * radius * homogenity,
				radiusAngle = Math.random() * Math.PI * 2;
			
			force0 *= sectorMul;

			let si = Math.sin(dirHomogenous),
				co = Math.cos(dirHomogenous);


			let radx = Math.cos(radiusAngle) * radiusDistRand * homogenity + co * radius * (1 - homogenity),
				rady = Math.sin(radiusAngle) * radiusDistRand * homogenity + si * radius * (1 - homogenity);

			let normMulHom = -(i - count / 2) / count * width - 0.5 / count * width,
				normMulRand = (-0.5 + Math.random()) * width;

			let pt = {
				x: x + dx + radx + normx * normMulHom * (1 - homogenity) + normx * normMulRand * homogenity,
				y: y + dy + rady + normy * normMulHom * (1 - homogenity) + normy * normMulRand * homogenity,
				sx: co * force0 * forceMul,
				sy: si * force0 * forceMul,
				ttl: (ttl + rnd1(ttl * homogenity)) * (1 + sectorMul * homogenity),
				airResistance: physical * AIR_RESIST * (1 - sectorMul * 0.5) + rnd1(physical * AIR_RESIST * 0.125 * homogenity) * forceMul,
				gravity: gravity * forceMul,
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

			let v2 = pt.sx * pt.sx + pt.sy * pt.sy,
				d = Math.sqrt(v2);
			if (d) {
				let ax = pt.sx / d * pt.airResistance * v2,
					ay = pt.sy / d * pt.airResistance * v2;

				if (ax * ax + ay * ay > v2) {
					pt.sx = 0;
					pt.sy = 0;
				} else {
					pt.sx -= ax;
					pt.sy -= ay;
				}
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
