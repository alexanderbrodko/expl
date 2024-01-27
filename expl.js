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

class Explosions extends Array {
	constructor() {
		super();

		this.wind = 0;
		this.cid = 1;
	}
	add({ count, x, y, dx, dy, spread, gravity, homogenity, physical, ttl, params }) {

		if (!(count > 0)) debugger;
		if (typeof(x) !== 'number') debugger;
		if (typeof(y) !== 'number') debugger;
		if (typeof(dx) !== 'number') debugger;
		if (typeof(dy) !== 'number') debugger;
		if (!(spread >= 0 && spread <= 1)) debugger;
		if (typeof(gravity) !== 'number') debugger;
		if (!(homogenity >= 0 && homogenity <= 1)) debugger;
		if (!(physical >= 0 && physical <= 0.0001)) debugger;
		if (!(ttl > 0)) debugger;

		let rnd1 = x => -x + Math.random() * x * 2;

		homogenity = Math.max(1 - homogenity, 0);
		count += rnd1(count * 0.5 * homogenity) | 0;

		let sector = Math.PI * 2 * spread / count,
			dirStart = sector * count / 2 - sector / 2,
			dir0 = Math.atan2(dy, dx) - dirStart,
			dir05 = dir0 + sector * count * 0.5,
			force = Math.max(0.001, Math.hypot(dx, dy)),
			toShuffle = [];

		for (let i = 0; i < count; i++) {
			let dir = (dir0 + i * sector + rnd1(sector * homogenity)) * (1 - homogenity * 0.5) + (dir05 + rnd1(sector * count * 0.5 * homogenity)) * homogenity * 0.5,
				co = Math.cos(dir),
				si = Math.sin(dir),
				force0 = force + rnd1(force * 0.5 * homogenity),
				sectorMul = Math.max(0, 1 - Math.abs(i - count / 2) * 2 / count * homogenity);
			
			force0 *= sectorMul;
			
			let pt = {
					x,
					y,
					sx: co * force0,
					sy: si * force0,
					ttl: (ttl + rnd1(ttl * homogenity)) * (1 + sectorMul * homogenity),
					stopk: physical * (1 - sectorMul * 0.5) + rnd1(physical * 0.125 * homogenity),
					gravity,
					physical: physical / 0.0001,
					t: 0,
					id: this.cid++,
					params
				};

				if (force < 0) debugger;

			this.push(pt);
			toShuffle.push(pt);
		}

		toShuffle.shuffle(Math.sqrt(homogenity));

		let duration = physical / 0.0001 * 0.1;
		
		for (let i = 0; i < count; i++) {
			let delay0 = i / count * duration;
			toShuffle[i].t = -delay0 + rnd1(duration * homogenity);
		}
	}
	update(dt) {
		this.wind = Math.sin(Date.now() / 10000) * 5;

		for (let i = 0; i < this.length; i++) {
			let pt = this[i];

			pt.t += dt;

			if (pt.t < 0) continue;
			
			pt.x += pt.sx * dt;
			pt.y += pt.sy * dt;

			let v2 = pt.sx * pt.sx + pt.sy * pt.sy;
			let d = Math.sqrt(v2);
			let ax = pt.sx / d * pt.stopk * v2;
			let ay = pt.sy / d * pt.stopk * v2;

			if (ax * ax + ay * ay > v2) {
				pt.sx = 0;
				pt.sy = 0;
			} else {
				pt.sx -= ax;
				pt.sy -= ay;
			}

			pt.sx += pt.physical * 10000 * this.wind * dt / Math.max(100, pt.gravity * pt.gravity);
			pt.sy += pt.physical * pt.gravity * dt;

			if (pt.t >= pt.ttl) {
				this[i] = this[this.length - 1];
				this.length--;
			}
		}
	}
}
