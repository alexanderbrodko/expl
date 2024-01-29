# expl
Single file JS particles imitating explosion. Editor included



Demo: https://alexanderbrodko.github.io/expl/

Usage example: [PixiJS integration](https://www.pixiplayground.com/#/edit/zbOl38iaDnyNFfPJ3qqJK)

![image](https://github.com/alexanderbrodko/expl/assets/57812581/7fad6981-8050-40d6-b1db-512e6b9edbb6)


Use `homogenity` to see what is going on:

![ezgif-1-e01af0b34d](https://github.com/alexanderbrodko/expl/assets/57812581/140d3b0e-a307-4b97-b10e-e48369c09c39)


## Usage

Copy **expl.js** to your working dir and place `<script src="expl.js"></script>` in head of your document

``` js
// You have some JSON from editor
let fx = {
	"x": 500,
	"y": 250,
	"dx": 0, // direction and force of an explosion
	"dy": -350, // direction and force of an explosion
	"count": 28,
	"spread": 0.2, // how wide sector emitter have
	"area", // radius of the emitter
	"gravity": 500,
	"ttl": 0.55, // time to live
	"homogenity": 0.2,
	"physical": 0.000085,
	"params": {
		// here can be any param that you need; maybe color or extra update function?
		"size": 10
	}
};

// create manager
let expl = new Explosions();

// add fx
expl.add(fx, pause); // optional delay

// dont forget to update
expl.update(dt);

// draw in any way possible
for (let e of expl) if (e.t > 0) { // avoid particles waiting to start
	let progress = e.t / e. ttl; // can animate opacity or any other propery you need; DIY

	// Virtual space is GL like: -1 to 1. Screen center is (0, 0). Y axis id directed to bottom.
	e.x, e.y, e.params; // use this to draw
}

```

