// Regenerates data/block-count-table.csv and data/slab-bags-table.csv from the module.
// Run: node scripts/generate-tables.js
const fs = require('fs');
const path = require('path');
const C = require('../js/concrete-masonry.js');
const out = (f, rows) => fs.writeFileSync(path.join(__dirname, '..', 'data', f), rows.map(r => r.join(',')).join('\n') + '\n');

const blocks = [['wall_length_ft', 'wall_height_ft', 'wall_area_ft2', 'cmu_8x16_blocks_0pct', 'cmu_8x16_blocks_10pct', 'mortar_80lb_bags_10pct', 'modular_bricks_0pct', 'modular_bricks_10pct']];
for (const L of [10, 20, 30, 40, 50]) for (const H of [2, 4, 6, 8]) {
  const b10 = C.blockCount(L, H, 10).unitsToBuy;
  blocks.push([L, H, L * H, C.blockCount(L, H, 0).unitsToBuy, b10,
    C.mortarBags(b10, C.MORTAR_UNITS_PER_80LB_BAG.block).bagsToBuy,
    C.brickCount(L, H, 0).unitsToBuy, C.brickCount(L, H, 10).unitsToBuy]);
}
out('block-count-table.csv', blocks);

const slabs = [['length_ft', 'width_ft', 'thickness_in', 'cubic_feet', 'cubic_yards', 'bags_40lb_0.30ft3', 'bags_60lb_0.45ft3', 'bags_80lb_0.60ft3', 'bags_80lb_10pct_waste']];
for (const [L, W] of [[4, 4], [8, 8], [10, 10], [10, 12], [10, 20], [12, 12], [12, 24], [20, 20]]) for (const T of [4, 6]) {
  const v = C.slabVolume(L, W, T);
  slabs.push([L, W, T, v.cubicFeet.toFixed(2), v.cubicYards.toFixed(3),
    C.bagsForVolume(v.cubicFeet, 0.30).bagsToBuy, C.bagsForVolume(v.cubicFeet, 0.45).bagsToBuy,
    C.bagsForVolume(v.cubicFeet, 0.60).bagsToBuy, C.bagsForVolume(v.cubicFeet, 0.60, 10).bagsToBuy]);
}
out('slab-bags-table.csv', slabs);
console.log('wrote data/block-count-table.csv and data/slab-bags-table.csv');
