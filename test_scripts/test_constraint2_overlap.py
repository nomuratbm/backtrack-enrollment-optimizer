# -*- coding: utf-8 -*-
"""
test_constraint2_overlap.py
----------------------------
Unit test for Constraint 2 -- OVERLAP check inside student.can_append().

Two courses overlap when both occupy the same (period, day) cell.
The check is independent of course ID -- even two different courses conflict
if they share a period on the same day.

Test cases
----------
TC-2A  (Pass): can_append returns True when the new course is on a completely
               different day (no cell collision possible).
TC-2B  (Pass): can_append returns True when the new course is on the same day
               but a DIFFERENT period (adjacent, no overlap).
TC-2C  (Pass): can_append returns False when the new course occupies the
               exact same (period, day) cell as an already-enrolled course.
TC-2D  (Pass): can_append returns False for a multi-slot course that partially
               overlaps -- one of its timeslots collides, which is enough to fail.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', 'backend', 'api', 'utils'))

from studentclass import student
from courseclass import course

PASS = "PASS"
FAIL = "FAIL"

def run(label, condition, expected):
    status = PASS if condition == expected else FAIL
    tag    = "[PASS]" if status == PASS else "[FAIL]"
    print("  %s  %s  |  expected=%s  got=%s  -> %s" % (tag, label, expected, condition, status))
    assert condition == expected, "Assertion failed: " + label

print("\n" + "=" * 60)
print("CONSTRAINT 2 -- OVERLAP")
print("=" * 60)

# -- Shared setup ---------------------------------------------------------------
# MATH101-A occupies Monday Period 0 (7:00am-8:10am).
math101_a = course(coursecode="MATH101", section="A", instructor="Dr. Reyes", units=3)
math101_a.add_to_schedule("7:00am-8:10am", "Monday")

alice = student(id=1, name="Alice")
alice.append(math101_a)

# -- TC-2A: Different day entirely -> no overlap possible -----------------------
print("\nTC-2A: ENG101-A on Wednesday Period 0 (different day) -> expect True")
eng_wed = course(coursecode="ENG101", section="A", instructor="Dr. Cruz", units=3)
eng_wed.add_to_schedule("7:00am-8:10am", "Wednesday")
run("TC-2A", alice.can_append(eng_wed), expected=True)

# -- TC-2B: Same day, different period -> adjacent, no overlap ------------------
print("\nTC-2B: SCI101-A on Monday Period 1 (same day, next period) -> expect True")
sci_mon1 = course(coursecode="SCI101", section="A", instructor="Dr. Lim", units=3)
sci_mon1.add_to_schedule("8:10am-9:20am", "Monday")
run("TC-2B", alice.can_append(sci_mon1), expected=True)

# -- TC-2C: Exact same (period, day) collision -> overlap -> rejected -----------
print("\nTC-2C: HIS101-A on Monday Period 0 (same cell as MATH101-A) -> expect False")
his_mon0 = course(coursecode="HIS101", section="A", instructor="Dr. Santos", units=3)
his_mon0.add_to_schedule("7:00am-8:10am", "Monday")   # Period 0, Monday -- already taken
run("TC-2C", alice.can_append(his_mon0), expected=False)

# -- TC-2D: Multi-slot course -- one slot collides -> whole course rejected ------
print("\nTC-2D: PE101-A meets Mon P1 AND Mon P0 (partial overlap with MATH101-A) -> expect False")
pe_multi = course(coursecode="PE101", section="A", instructor="Coach Rivera", units=2)
pe_multi.add_to_schedule("8:10am-9:20am", "Monday")   # Period 1 -- free
pe_multi.add_to_schedule("7:00am-8:10am", "Monday")   # Period 0 -- COLLISION
run("TC-2D", alice.can_append(pe_multi), expected=False)

print("\n" + "=" * 60)
print("ALL CONSTRAINT 2 TESTS PASSED")
print("=" * 60)
