# expl
Single file JS particles imitating explosion. Editor included


Demo: https://alexanderbrodko.github.io/expl/?DBmA/1kFAX//ZgU=,AAeAv/8UYOUAPws=,,,GQSAplkreZn/WRM=

![image](https://github.com/alexanderbrodko/expl/assets/57812581/a27dc10e-6166-492c-809c-d89e1de86822)

Use `homogenity` to see what is going on:

![ezgif-1-e01af0b34d](https://github.com/alexanderbrodko/expl/assets/57812581/140d3b0e-a307-4b97-b10e-e48369c09c39)


## Usage

**Important note:** draw is your own business. For a draw example, see [draw using Canvas](https://github.com/alexanderbrodko/expl/blob/main/index.html#L145) in editor or [PixiJS integration](https://www.pixiplayground.com/#/edit/zbOl38iaDnyNFfPJ3qqJK).

Copy **expl.js** to your working dir and place `<script src="expl.js"></script>` in head of your document

``` js
// You have some code from editor URL
let str = 'DBmA/1kFAX//ZgU=';

// create manager
let expl = new Explosions();

// add fx
expl.add(x, y, expl.fromBase64(str));

// dont forget to update
expl.update(dt);

// draw in any way possible
for (let e of expl) if (e.t > 0) { // avoid particles waiting to start
	let progress = e.t / e. ttl; // can animate opacity or any other propery you need; DIY

	// Virtual space is GL like: -1 to 1. Screen center is (0, 0). Y axis is directed to bottom
	e.x, e.y, e.rnd, e.custom, e.params; // use this to draw
}
```

### Optional
You can spawn particles from an object with params:
``` js
let fx = {
	"pause": 0,
	"dx": 0, // direction and force of an explosion
	"dy": -350, // direction and force of an explosion
	"count": 28,
	"spread": 0.2, // how wide sector emitter have
	"area", // radius of the emitter
	"gravity": 500,
	"ttl": 0.55, // time to live
	"homogenity": 0.2,
	"physical": 0.000085,
	"custom": 10 // custom param; preview size in editor
};
expl.add(x, y, fx, yourParams); // every particle will have .params === yourParams

```

