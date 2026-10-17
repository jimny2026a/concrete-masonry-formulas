# concrete-masonry-formulas

Open data and small, dependency-free formulas for estimating concrete and masonry materials: slab, pier and footing volumes, pre-mixed concrete bag counts by manufacturer yield, and brick / CMU block / mortar counts for a wall.

The formulas and tables here are the same ones behind the free calculators at [TrueToolCalc](https://truetoolcalc.com/), published separately so anyone can reuse, check or improve them.

## What's inside

| Path | What it is |
|---|---|
| `data/bag-yields.csv` | Yield (ft³, and liters where the maker lists it) of pre-mixed concrete bags by brand, product and bag size, each row tagged with its source |
| `data/masonry-constants.csv` | Bricks and blocks per square foot, mortar rule of thumb, unit conversions, with derivations |
| `data/slab-bags-table.csv` | Volume and 40/60/80 lb bag counts for common slab sizes at 4 in and 6 in (generated) |
| `data/block-count-table.csv` | CMU block, mortar bag and modular brick counts for common wall sizes (generated) |
| `js/concrete-masonry.js` | Formula module for Node and the browser (UMD, no dependencies) |
| `python/concrete_masonry.py` | The same formulas in Python (standard library only) |
| `scripts/generate-tables.js` | Rebuilds the two generated CSV tables from the JS module |
| `tests/` | `node tests/test.js` and `python3 -m unittest discover -s tests` |

## Formulas

All inputs are imperial: feet for length, inches for thickness, diameter and depth. 1 yd³ = 27 ft³ and 1 ft³ = 0.0283168466 m³.

- **Slab / pad:** ft³ = length (ft) × width (ft) × thickness (in) ÷ 12
- **Round column, pier or form tube:** ft³ = π × (diameter (in) ÷ 24)² × height (ft)
- **Continuous footing:** ft³ = length (ft) × width (in) ÷ 12 × depth (in) ÷ 12
- **Post hole:** concrete ft³ = π × (hole diameter (in) ÷ 24)² × depth (in) ÷ 12 − post width × post thickness × depth (all converted to ft)
- **Bags:** bags = ft³ ÷ bag yield (ft³) × (1 + waste % ÷ 100), rounded up once for the whole job
- **Modular brick (3/8 in joint):** bricks per ft² = 144 ÷ ((7.625 + 0.375) × (2.25 + 0.375)) = 6.857
- **8×16 CMU block:** blocks per ft² = 144 ÷ 128 = 1.125
- **Mortar:** 80 lb bag ≈ 35 blocks or ≈ 100 bricks (rule of thumb, adjust for your joint and mix)

## Usage

```js
const C = require('./js/concrete-masonry.js');
const v = C.slabVolume(10, 10, 4);           // { cubicFeet: 33.33, cubicYards: 1.235, ... }
C.bagsForVolume(v.cubicFeet, 0.60, 10);      // 80 lb bags with 10% waste -> bagsToBuy: 62
C.blockCount(20, 8, 5);                      // 8x16 CMU for a 20 x 8 ft wall -> unitsToBuy: 189
```

```python
import concrete_masonry as C   # from the python/ folder
C.bags_for_volume(C.slab_volume(10, 10, 4)["cubic_feet"], 0.60)["bags_to_buy"]  # 56
```

## Limits

These are material estimates, not structural design. Thickness, reinforcement, footing size and frost depth are set by your local building code and, where needed, an engineer. Always check the yield printed on your bag; manufacturers revise data sheets.

## SOURCES

| ID | Source | Used for |
|---|---|---|
| TTC-CALCS | TrueToolCalc calculation code (`js/calcs.js`, functions concreteSlab, concreteColumn, concreteFooting, concreteBag, brick, concreteBlock, mortarBags) and the calculator pages at https://truetoolcalc.com/ (concrete-bag, brick, concrete-block, mortar) | Generic 40/60/80 lb yields; all formulas; brick, block and mortar constants. The module reproduces the site's results exactly for the cases in the parity check. |
| QUIKRETE-1101 | QUIKRETE Concrete Mix No. 1101 data sheet, revised October 2022: https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf (fetched 2026-10-15) | Quikrete yields for 40, 50, 60, 80 and 90 lb bags |
| SAKRETE-HS | Sakrete High-Strength Concrete Mix TDS: https://www.sakrete.com/wp-content/uploads/2024/01/Sakrete-High-Strength-Concrete-Mix-TDS.pdf (fetched 2026-10-17) | 40, 60, 80, 90 lb and 25 kg yields |
| SAKRETE-5000 | Sakrete 5000 Plus TDS: https://www.sakrete.com/wp-content/uploads/2021/07/Sakrete-5000-Plus-TDS.pdf (fetched 2026-10-17) | 50, 60, 80 lb yields. The TDS lists 0.47 ft³ for the 60 lb bag; the product web page lists 0.45 ft³. This repo uses the TDS value. |
| SAKRETE-FAST | Sakrete Fast Setting Concrete Mix TDS: https://www.sakrete.com/wp-content/uploads/2021/07/Fast-Setting-Concrete.pdf (fetched 2026-10-17) | 50 lb yield |
| SAKRETE-CRACK | Sakrete Crack Resistant Concrete TDS: https://www.sakrete.com/wp-content/uploads/2021/07/Sakrete-Crack-Resistant-Concrete-TDS.pdf (fetched 2026-10-17) | 50 and 80 lb yields |
| SAKRETE-MAX | Sakrete Maximizer Concrete Mix TDS (rev 04-24): https://www.sakrete.com/wp-content/uploads/2024/09/Sakrete-Maximizer-Concrete-Mix-TDS-04-24.pdf (fetched 2026-10-17) | 40 and 80 lb yields (lightweight mix) |
| DEFINITION | Exact unit definitions (1 yd = 3 ft; 1 ft = 0.3048 m) | 27 ft³ per yd³; 0.0283168466 m³ per ft³ |

Brand names are trademarks of their owners. This repo has no affiliation with any manufacturer.

## Contributing

Spotted a revised data sheet or a product that's missing? Open an issue or a pull request with a link to the manufacturer's current data sheet.

## License

MIT, see [LICENSE](LICENSE).
