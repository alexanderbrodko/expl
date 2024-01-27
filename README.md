# expl
Super simple and lightweight particles imitating explosion. Editor included

Demo: https://alexanderbrodko.github.io/expl/

![image](https://github.com/alexanderbrodko/expl/assets/57812581/7fad6981-8050-40d6-b1db-512e6b9edbb6)

## Usage

```
// create
let expl = new Explosions();

// add
expl.add({
	"x": 500,
	"y": 250,
	"dx": 0,
	"dy": -350,
	"count": 28,
	"spread": 0.2,
	"gravity": 500,
	"ttl": 0.55,
	"homogenity": 0.2,
	"physical": 0.000085,
	"params": {
		// here can be any param that you need; maybe extra update function?
		"size": 10
	}
});

// update
expl.update(dt);

// draw
for (let e of expl) if (e.t > 0) { // avoid particles waiting to start
	let progress = e.t / e. ttl; // can animate opacity or any other propery you need; DIY thing
	e.x, e.y, e.params; // use this to draw

	// Make sure that your virtual space is 1000x1000
	// If you use OpenGL, revert Y axis
	// And draw in any way possible
}

```
