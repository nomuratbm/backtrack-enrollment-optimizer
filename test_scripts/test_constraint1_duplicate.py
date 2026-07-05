# -*- coding: utf-8 -*-
"""
test_constraint1_duplicate.py
------------------------------
Unit test for Constraint 1 -- DUPLICATE check inside student.can_append().

A course already present in the student's schedule must be rejected even if
its timeslots would not cause any overlap, consecutive-run, or gap violation.

Test cases
----------
TC-1A  (Pass): can_append returns True for a brand-new course not yet enrolled.
TC-1B  (Pass): can_append returns False when the exact same course (same
               coursecode + section = same course_id) is offered again.
TC-1C  (Pass): can_append returns True for a course with the same coursecode
               but a DIFFERENT section -- different course_id, not a duplicate.
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
print("CONSTRAINT 1 -- DUPLICATE")
print("=" * 60)

# -- Shared setup ---------------------------------------------------------------
# MATH101-A is enrolled in the student's schedule at Monday Period 0.
math101_a = course(coursecode="MATH101", section="A", instructor="Dr. Reyes", units=3)
math101_a.add_to_schedule("7:00am-8:10am", "Monday")

alice = student(id=1, name="Alice")
alice.append(math101_a)   # directly commit; constraint is already satisfied here

# -- TC-1A: A brand-new course (different code) should be accepted ---------------
print("\nTC-1A: brand-new course (ENG101-A) -> expect True")
eng101_a = course(coursecode="ENG101", section="A", instructor="Dr. Cruz", units=3)
eng101_a.add_to_schedule("8:10am-9:20am", "Monday")   # period 1, adjacent -> all constraints OK
run("TC-1A", alice.can_append(eng101_a), expected=True)

# -- TC-1B: Same course already enrolled -> duplicate -> must be rejected --------
print("\nTC-1B: same course MATH101-A already enrolled -> expect False")
math101_a_dup = course(coursecode="MATH101", section="A", instructor="Dr. Reyes", units=3)
math101_a_dup.add_to_schedule("7:00am-8:10am", "Monday")   # identical timeslot
run("TC-1B", alice.can_append(math101_a_dup), expected=False)

# -- TC-1C: Same coursecode but different section -> NOT a duplicate -------------
print("\nTC-1C: MATH101-B (same code, different section) -> expect True")
math101_b = course(coursecode="MATH101", section="B", instructor="Dr. Santos", units=3)
math101_b.add_to_schedule("8:10am-9:20am", "Monday")   # period 1, different section
run("TC-1C", alice.can_append(math101_b), expected=True)

print("\n" + "=" * 60)
print("ALL CONSTRAINT 1 TESTS PASSED")
print("=" * 60)
