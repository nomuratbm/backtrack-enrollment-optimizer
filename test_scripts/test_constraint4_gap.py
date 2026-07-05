# -*- coding: utf-8 -*-
"""
test_constraint4_gap.py
------------------------
Unit test for Constraint 4 -- GAP check inside student.can_append().

On any day where both the incoming course and the student's existing schedule
have periods, every period of the new course must be at most 1 period (70 min)
away from the nearest occupied period on that same day.

Key nuances tested
------------------
  * Gap is only checked on SHARED days (days where both student and course
    have at least one period).
  * The constraint is skipped entirely when the student has NO courses yet.
  * A gap of exactly 1 is allowed; a gap of 2 or more is rejected.
  * Courses on a day the student has no existing periods are always gap-free.

Test cases
----------
TC-4A  (Pass): Student is empty -- gap constraint is skipped -> True.
TC-4B  (Pass): New course is on a day the student has no existing periods
               (different day) -> gap check skipped for that day -> True.
TC-4C  (Pass): Gap = 1 (adjacent period on the same day) -> True.
TC-4D  (Pass): Gap = 2 on a shared day -> False.
TC-4E  (Pass): Gap = 5 on a shared day (far apart) -> False.
TC-4F  (Pass): Multi-slot course -- one slot is gap=1 (OK) but another slot
               on the same day is gap=3 -> whole course rejected -> False.
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
print("CONSTRAINT 4 -- GAP")
print("=" * 60)

# -- TC-4A: Empty student -> gap constraint not triggered ----------------------
print("\nTC-4A: completely empty student -- gap check is skipped -> expect True")
empty_student = student(id=1, name="Empty")
c_any = course(coursecode="MATH401", section="A", instructor="Dr. Reyes", units=3)
c_any.add_to_schedule("7:00am-8:10am", "Monday")
run("TC-4A", empty_student.can_append(c_any), expected=True)

# -- Shared base: student has MATH401-A at Monday Period 0 ---------------------
math401 = course(coursecode="MATH401", section="A", instructor="Dr. Reyes", units=3)
math401.add_to_schedule("7:00am-8:10am", "Monday")   # Period 0

base = student(id=2, name="Base")
base.append(math401)

# -- TC-4B: Different day entirely -> gap check skipped for that day -----------
print("\nTC-4B: new course on Wednesday only (student has only Monday) -> expect True")
c_wed = course(coursecode="ENG401", section="A", instructor="Dr. Cruz", units=3)
c_wed.add_to_schedule("9:20am-10:30am", "Wednesday")  # Period 2 on Wednesday -- no shared day
run("TC-4B", base.can_append(c_wed), expected=True)

# -- TC-4C: Same day, gap = 1 (Period 1, one step from Period 0) ---------------
print("\nTC-4C: new course at Mon Period 1 (gap=1 from existing P0) -> expect True")
c_gap1 = course(coursecode="SCI401", section="A", instructor="Dr. Lim", units=3)
c_gap1.add_to_schedule("8:10am-9:20am", "Monday")    # Period 1 -- gap = |1-0| = 1
run("TC-4C", base.can_append(c_gap1), expected=True)

# -- TC-4D: Same day, gap = 2 (Period 2, two steps from Period 0) --------------
print("\nTC-4D: new course at Mon Period 2 (gap=2 from existing P0) -> expect False")
c_gap2 = course(coursecode="HIS401", section="A", instructor="Dr. Santos", units=3)
c_gap2.add_to_schedule("9:20am-10:30am", "Monday")   # Period 2 -- gap = |2-0| = 2
run("TC-4D", base.can_append(c_gap2), expected=False)

# -- TC-4E: Same day, gap = 5 (Period 5, far from Period 0) -------------------
print("\nTC-4E: new course at Mon Period 5 (gap=5 from existing P0) -> expect False")
c_gap5 = course(coursecode="FIL401", section="A", instructor="Dr. Garcia", units=3)
c_gap5.add_to_schedule("12:50pm-2:00pm", "Monday")   # Period 5 -- gap = |5-0| = 5
run("TC-4E", base.can_append(c_gap5), expected=False)

# -- TC-4F: Multi-slot -- mixed gaps on same day -> rejected by worst slot -----
# New course: Mon P1 (gap=1, OK) AND Mon P3 (gap=3, FAIL).
# Because P3 violates gap > 1, the whole course is rejected.
print("\nTC-4F: new course at Mon P1 (gap=1) AND Mon P3 (gap=3) -> expect False")
c_mixed = course(coursecode="CS401", section="A", instructor="Dr. Cruz", units=3)
c_mixed.add_to_schedule("8:10am-9:20am",  "Monday")  # Period 1 -- gap = 1
c_mixed.add_to_schedule("10:30am-11:40am", "Monday") # Period 3 -- gap = 3
run("TC-4F", base.can_append(c_mixed), expected=False)

print("\n" + "=" * 60)
print("ALL CONSTRAINT 4 TESTS PASSED")
print("=" * 60)
