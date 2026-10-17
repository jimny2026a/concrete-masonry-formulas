# Run: python3 -m unittest discover -s tests  (no dependencies)
import math, os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "python"))
import concrete_masonry as C


class T(unittest.TestCase):
    def test_slab(self):
        self.assertAlmostEqual(C.slab_volume(10, 10, 4)["cubic_feet"], 33.3333, 3)
        self.assertAlmostEqual(C.slab_volume(9, 9, 4)["cubic_yards"], 1.0, 9)

    def test_bags(self):
        self.assertEqual(C.bags_for_volume(C.slab_volume(10, 10, 4)["cubic_feet"], 0.6)["bags_to_buy"], 56)
        self.assertEqual(C.bags_for_volume(1.8, 0.6)["bags_to_buy"], 3)

    def test_column_footing(self):
        self.assertAlmostEqual(C.column_volume(12, 4)["cubic_feet"], math.pi, 9)
        self.assertAlmostEqual(C.footing_volume(20, 16, 8)["cubic_feet"], 17.7778, 3)

    def test_post(self):
        p = C.post_hole_volume(10, 24, 3.5)
        self.assertAlmostEqual(p["concrete_ft3"], 0.9207, 3)

    def test_masonry(self):
        self.assertAlmostEqual(C.BRICKS_PER_FT2, 6.857, 3)
        self.assertEqual(C.block_count(20, 8)["units_to_buy"], 180)
        self.assertEqual(C.block_count(20, 8, 5)["units_to_buy"], 189)
        self.assertEqual(C.brick_count(10, 8)["units_to_buy"], 549)
        self.assertEqual(C.mortar_bags(180, 35)["bags_to_buy"], 6)


if __name__ == "__main__":
    unittest.main()
