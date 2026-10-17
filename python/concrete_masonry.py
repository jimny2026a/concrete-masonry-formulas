"""concrete-masonry-formulas: dependency-free volume and unit-count formulas.

Imperial base units (feet, inches, cubic feet). Same math as the calculators
on https://truetoolcalc.com/ and as js/concrete-masonry.js. MIT licensed.
"""
import math
import sys

IN_PER_FT = 12
FT3_PER_YD3 = 27
FT3_TO_M3 = 0.0283168466
BRICKS_PER_FT2 = 144 / ((7.625 + 0.375) * (2.25 + 0.375))  # US modular brick, 3/8 in joint
BLOCKS_PER_FT2 = 144 / 128                                   # nominal 8x16 CMU
MORTAR_UNITS_PER_80LB_BAG = {"block": 35, "brick": 100}      # rule of thumb


def ceil_quantity(value):
    """Round a purchase quantity up, ignoring floating-point noise only."""
    nearest = round(value)
    tol = min(8 * sys.float_info.epsilon * abs(value), 1e-7)
    if nearest != 0 and abs(value - nearest) <= tol:
        return int(nearest)
    return math.ceil(value)


def _with_waste(value, waste_pct=0):
    return value * (1 + (waste_pct or 0) / 100)


def _volume(ft3, waste_pct=0):
    return {
        "cubic_feet": ft3,
        "cubic_yards": ft3 / FT3_PER_YD3,
        "cubic_meters": ft3 * FT3_TO_M3,
        "cubic_yards_with_waste": _with_waste(ft3 / FT3_PER_YD3, waste_pct),
    }


def slab_volume(length_ft, width_ft, thick_in, waste_pct=0):
    return _volume(length_ft * width_ft * thick_in / IN_PER_FT, waste_pct)


def column_volume(diameter_in, height_ft, waste_pct=0):
    r = diameter_in / 2 / IN_PER_FT
    return _volume(math.pi * r * r * height_ft, waste_pct)


def footing_volume(length_ft, width_in, depth_in, waste_pct=0):
    return _volume(length_ft * (width_in / IN_PER_FT) * (depth_in / IN_PER_FT), waste_pct)


def post_hole_volume(hole_diameter_in, depth_in, post_width_in, post_thick_in=None):
    r = hole_diameter_in / 24
    hole = math.pi * r * r * depth_in / IN_PER_FT
    t = post_thick_in if post_thick_in is not None else post_width_in
    post = (post_width_in / IN_PER_FT) * (t / IN_PER_FT) * (depth_in / IN_PER_FT)
    return {"hole_ft3": hole, "post_ft3": post, "concrete_ft3": hole - post}


def bags_for_volume(cubic_feet, bag_yield_ft3, waste_pct=0):
    exact = _with_waste(cubic_feet / bag_yield_ft3, waste_pct)
    return {"bags_exact": exact, "bags_to_buy": ceil_quantity(exact)}


def brick_count(wall_length_ft, wall_height_ft, waste_pct=0):
    exact = _with_waste(wall_length_ft * wall_height_ft * BRICKS_PER_FT2, waste_pct)
    return {"units_exact": exact, "units_to_buy": ceil_quantity(exact)}


def block_count(wall_length_ft, wall_height_ft, waste_pct=0):
    exact = _with_waste(wall_length_ft * wall_height_ft * BLOCKS_PER_FT2, waste_pct)
    return {"units_exact": exact, "units_to_buy": ceil_quantity(exact)}


def mortar_bags(units, units_per_bag):
    exact = units / units_per_bag
    return {"bags_exact": exact, "bags_to_buy": ceil_quantity(exact)}
