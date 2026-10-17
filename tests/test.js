// Run: node tests/test.js  (no dependencies)
const assert = require('assert');
const C = require('../js/concrete-masonry.js');
const near = (a, b, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

// 10x10 slab, 4 in: 33.33 ft3 = 1.235 yd3
near(C.slabVolume(10, 10, 4).cubicFeet, 33.3333);
near(C.slabVolume(10, 10, 4).cubicYards, 1.2346);
// 27 ft3 is exactly 1 yd3
near(C.slabVolume(9, 9, 4).cubicYards, 1);
// 80 lb bags (0.60 ft3) for 10x10x4: 55.56 -> 56
assert.strictEqual(C.bagsForVolume(C.slabVolume(10, 10, 4).cubicFeet, 0.6).bagsToBuy, 56);
// exact multiples are not bumped by float noise: 0.6*3 ft3 -> 3 bags
assert.strictEqual(C.bagsForVolume(1.8, 0.6).bagsToBuy, 3);
// 12 in tube, 4 ft: pi*0.25*4 = 3.1416 ft3
near(C.columnVolume(12, 4).cubicFeet, Math.PI);
// footing 20 ft x 16 in x 8 in = 17.78 ft3
near(C.footingVolume(20, 16, 8).cubicFeet, 17.7778);
// 4x4 post (3.5 in) in 10 in hole 24 in deep: 0.92 ft3 (truetoolcalc fence-post guide)
const p = C.postHoleVolume(10, 24, 3.5);
near(p.holeFt3, 1.0908); near(p.postFt3, 0.1701); near(p.concreteFt3, 0.9207);
// masonry constants
near(C.BRICKS_PER_FT2, 6.857); near(C.BLOCKS_PER_FT2, 1.125);
assert.strictEqual(C.blockCount(20, 8).unitsToBuy, 180);
assert.strictEqual(C.blockCount(20, 8, 5).unitsToBuy, 189);
assert.strictEqual(C.brickCount(10, 8).unitsToBuy, 549);
assert.strictEqual(C.mortarBags(180, 35).bagsToBuy, 6);
console.log('all JS tests passed');
