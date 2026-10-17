/* concrete-masonry-formulas — dependency-free volume and unit-count formulas.
 * Imperial base units (feet, inches, cubic feet). Same math as the
 * calculators on https://truetoolcalc.com/ (js/calcs.js).
 * Works in Node (require) and in browsers (window.ConcreteMasonry). MIT. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ConcreteMasonry = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var IN_PER_FT = 12;
  var FT3_PER_YD3 = 27;
  var FT3_TO_M3 = 0.0283168466;

  /* Round purchase quantities up, ignoring floating-point noise only. */
  function ceilQuantity(value) {
    var nearest = Math.round(value);
    var tol = Math.min(8 * Number.EPSILON * Math.abs(value), 1e-7);
    if (nearest !== 0 && Math.abs(value - nearest) <= tol) return nearest;
    return Math.ceil(value);
  }

  function withWaste(value, wastePct) { return value * (1 + (wastePct || 0) / 100); }

  function volumeResult(ft3, wastePct) {
    return {
      cubicFeet: ft3,
      cubicYards: ft3 / FT3_PER_YD3,
      cubicMeters: ft3 * FT3_TO_M3,
      cubicYardsWithWaste: withWaste(ft3 / FT3_PER_YD3, wastePct)
    };
  }

  /* Rectangular slab / pad: L(ft) x W(ft) x T(in)/12 */
  function slabVolume(lengthFt, widthFt, thickIn, wastePct) {
    return volumeResult(lengthFt * widthFt * (thickIn / IN_PER_FT), wastePct);
  }

  /* Round column / pier / tube: pi x (D/2 in -> ft)^2 x H(ft) */
  function columnVolume(diameterIn, heightFt, wastePct) {
    var r = diameterIn / 2 / IN_PER_FT;
    return volumeResult(Math.PI * r * r * heightFt, wastePct);
  }

  /* Continuous footing: L(ft) x W(in)/12 x D(in)/12 */
  function footingVolume(lengthFt, widthIn, depthIn, wastePct) {
    return volumeResult(lengthFt * (widthIn / IN_PER_FT) * (depthIn / IN_PER_FT), wastePct);
  }

  /* Concrete around a square post in a round hole (post volume subtracted). */
  function postHoleVolume(holeDiameterIn, depthIn, postWidthIn, postThickIn) {
    var r = holeDiameterIn / 24;
    var hole = Math.PI * r * r * (depthIn / IN_PER_FT);
    var post = (postWidthIn / IN_PER_FT) * ((postThickIn || postWidthIn) / IN_PER_FT) * (depthIn / IN_PER_FT);
    return { holeFt3: hole, postFt3: post, concreteFt3: hole - post };
  }

  /* Bags of pre-mix for a volume, given the bag's yield in ft^3. */
  function bagsForVolume(cubicFeet, bagYieldFt3, wastePct) {
    var exact = withWaste(cubicFeet / bagYieldFt3, wastePct);
    return { bagsExact: exact, bagsToBuy: ceilQuantity(exact) };
  }

  /* US modular brick, 3/8 in joint: 144 / ((7.625+0.375) x (2.25+0.375)) per ft^2 */
  var BRICKS_PER_FT2 = 144 / ((7.625 + 0.375) * (2.25 + 0.375));
  /* Nominal 8x16 CMU: 144 / 128 per ft^2 */
  var BLOCKS_PER_FT2 = 144 / 128;

  function brickCount(wallLengthFt, wallHeightFt, wastePct) {
    var exact = withWaste(wallLengthFt * wallHeightFt * BRICKS_PER_FT2, wastePct);
    return { unitsExact: exact, unitsToBuy: ceilQuantity(exact) };
  }

  function blockCount(wallLengthFt, wallHeightFt, wastePct) {
    var exact = withWaste(wallLengthFt * wallHeightFt * BLOCKS_PER_FT2, wastePct);
    return { unitsExact: exact, unitsToBuy: ceilQuantity(exact) };
  }

  /* Mortar bags from unit count; rule of thumb: 80 lb bag ~ 35 blocks or ~ 100 bricks. */
  var MORTAR_UNITS_PER_80LB_BAG = { block: 35, brick: 100 };
  function mortarBags(units, unitsPerBag) {
    var exact = units / unitsPerBag;
    return { bagsExact: exact, bagsToBuy: ceilQuantity(exact) };
  }

  return {
    ceilQuantity: ceilQuantity,
    slabVolume: slabVolume,
    columnVolume: columnVolume,
    footingVolume: footingVolume,
    postHoleVolume: postHoleVolume,
    bagsForVolume: bagsForVolume,
    brickCount: brickCount,
    blockCount: blockCount,
    mortarBags: mortarBags,
    BRICKS_PER_FT2: BRICKS_PER_FT2,
    BLOCKS_PER_FT2: BLOCKS_PER_FT2,
    MORTAR_UNITS_PER_80LB_BAG: MORTAR_UNITS_PER_80LB_BAG
  };
}));
