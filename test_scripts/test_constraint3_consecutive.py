# -*- coding: utf-8 -*-
"""
test_constraint3_consecutive.py
---------------------------------
Unit test for Constraint 3 -- CONSECUTIVE check inside student.can_append().

No more than 3 back-to-back occupied periods may exist on any single day.
A streak of 4 or more (>= 280 min) must be rejected.

The check counts combined occupancy: a period counts toward the streak if
it is occupied by the student's existing schedule OR by the new course being
tested.

Test cases
----------
TC-3A  (Pass): Adding a 3rd consecutive course on Monday (streak = 3) -> True.
TC-3B  (Pass): Adding a 4th consecutive course on Monday (streak = 4) -> False.
TC-3C  (Pass): A new course whose own timeslots have a 1-period break in the
               middle never produces a 4-run on a fresh student's schedule ->
               True (streak resets at the free cell).
TC-3D  (Pass): Streak limit is per-day; adding Wed Period 3 to a student who
               already has Wed P0,P1,P2 creates a 4-run on Wednesday -> False.
               (The gap for Wed P3 from the nearest Wed period P2 is exactly 1
               so Constraint 4 does NOT reject it -- the rejection comes purely
               from Constraint 3.)

Note on isolating Constraint 3 from Constraint 4 (gap):
  Gap only fires on SHARED days. To test the streak-reset in TC-3C without
  interference from the gap constraint we give the student courses only on
  Monday and put the new course only on Wednesday -- no shared day -> gap n/a.
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

# -- Helper --------------------------------------------------------------------
def make_student_with_monday_run(n_periods):
    """
    Return a fresh student with n_periods consecutive courses on Monday
    starting at Period 0, committed directly via append().
    """
    TIMES = [
        "7:00am-8:10am",    # Period 0
        "8:10am-9:20am",    # Period 1
        "9:20am-10:30am",   # Period 2
        "10:30am-11:40am",  # Period 3
        "11:40am-12:50pm",  # Period 4
    ]
    s = student(id=99, name="TestStudent")
    for i in range(n_periods):
        c = course(coursecode="DUMMY%d" % i, section="X",
                   instructor="Prof. Test", units=1)
        c.add_to_schedule(TIMES[i], "Monday")
        s.append(c)
    return s

print("\n" + "=" * 60)
print("CONSTRAINT 3 -- CONSECUTIVE")
print("=" * 60)

# -- TC-3A: streak = 2 already -> add Period 2 -> streak becomes 3 -> OK --------
print("\nTC-3A: student has Mon P0,P1 -- add Mon P2 (streak->3) -> expect True")
alice = make_student_with_monday_run(2)   # Mon P0, P1
c_p2 = course(coursecode="NEW301", section="A", instructor="Dr. A", units=3)
c_p2.add_to_schedule("9:20am-10:30am", "Monday")    # Period 2
run("TC-3A", alice.can_append(c_p2), expected=True)

# -- TC-3B: streak = 3 already -> add Period 3 -> streak becomes 4 -> FAIL ------
print("\nTC-3B: student has Mon P0,P1,P2 -- add Mon P3 (streak->4) -> expect False")
bob = make_student_with_monday_run(3)    # Mon P0, P1, P2
c_p3 = course(coursecode="NEW302", section="A", instructor="Dr. B", units=3)
c_p3.add_to_schedule("10:30am-11:40am", "Monday")   # Period 3
run("TC-3B", bob.can_append(c_p3), expected=False)

# -- TC-3C: Streak resets at a free period -> 3-1-... never hits 4 -> OK --------
# Design: student has Mon P0,P1,P2 (3-run). New course is ONLY on Wednesday
# with slots at Wed P0, P1, P2, P4 (P3 is Free).
#   - No shared day (student=Mon, course=Wed) -> Constraint 4 is skipped.
#   - Consecutive check on Wed: streak 0->1->2->3 (P0-P2), then Free at P3
#     resets to 0, then P4 -> streak = 1. Max streak = 3 < 4 -> OK.
print("\nTC-3C: student Mon P0-P2; new course Wed P0,P1,P2,P4 (P3 free resets streak) -> expect True")
carol = make_student_with_monday_run(3)  # only Monday courses
c_wed_skip = course(coursecode="NEW303", section="A", instructor="Dr. C", units=3)
c_wed_skip.add_to_schedule("7:00am-8:10am",   "Wednesday")  # P0
c_wed_skip.add_to_schedule("8:10am-9:20am",   "Wednesday")  # P1
c_wed_skip.add_to_schedule("9:20am-10:30am",  "Wednesday")  # P2  (streak = 3)
# P3 is Free                                                 # streak resets to 0
c_wed_skip.add_to_schedule("11:40am-12:50pm", "Wednesday")  # P4  (streak = 1)
run("TC-3C", carol.can_append(c_wed_skip), expected=True)

# -- TC-3D: 4-period run on Wednesday while Monday already has 3 -> False -------
# Student: Mon P0,P1,P2 + Wed P0,P1,P2 (3 each).
# New course: Wed P3 -> Wed streak becomes 4 -> rejected by Constraint 3.
# (Gap for Wed P3 from nearest existing Wed P2 = |3-2| = 1 -> Constraint 4 is OK;
#  the failure is purely from Constraint 3.)
print("\nTC-3D: student Mon P0-P2 + Wed P0-P2 -- add Wed P3 (streak->4 on Wed) -> expect False")
dave = make_student_with_monday_run(3)   # Mon P0, P1, P2
WED_TIMES = ["7:00am-8:10am", "8:10am-9:20am", "9:20am-10:30am"]
for i, t in enumerate(WED_TIMES):
    cx = course(coursecode="WED%d" % i, section="A", instructor="Prof. Test", units=1)
    cx.add_to_schedule(t, "Wednesday")
    dave.append(cx)

c_wed_p3 = course(coursecode="NEW304", section="A", instructor="Dr. D", units=3)
c_wed_p3.add_to_schedule("10:30am-11:40am", "Wednesday")   # Wed Period 3 -> streak = 4
run("TC-3D", dave.can_append(c_wed_p3), expected=False)

print("\n" + "=" * 60)
print("ALL CONSTRAINT 3 TESTS PASSED")
print("=" * 60)
