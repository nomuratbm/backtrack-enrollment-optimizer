"""
test_success.py
---------------
Tests schedule_student with a set of courses that CAN all be legally enrolled.

Course layout:
  Course A  -  Monday    Period 0  (7:00am  - 8:10am)
  Course B  -  Monday    Period 1  (8:10am  - 9:20am)   <- adjacent to A
  Course C  -  Monday    Period 2  (9:20am  - 10:30am)  <- adjacent to B
  Course D  -  Wednesday Period 0  (7:00am  - 8:10am)   <- separate day

Why this should succeed
-----------------------
  Constraint 1 (duplicate)   : all courses are distinct.
  Constraint 2 (overlap)     : no two courses share a (period, day) cell.
  Constraint 3 (consecutive) : Monday streak after A+B+C = 3; never hits 4.
  Constraint 4 (gap)         : A->B gap=1, B->C gap=1, D is on Wednesday
                                where no student course exists (gap check skipped).

NOTE: courseclass.py runs demo code at module level so you will see some
extra printed output from that import before the test results.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', 'backend', 'api', 'utils'))

from studentclass import student
from courseclass import course
from schedulerfunction import schedulerfunction as schedule_student

# --- Build courses ------------------------------------------------------------

# Course A  -  Monday Period 0
course_a = course(coursecode="MATH101", section="A", instructor="Dr. Reyes", units=3)
course_a.add_to_schedule("7:00am-8:10am", "Monday")

# Course B  -  Monday Period 1  (adjacent to A)
course_b = course(coursecode="ENG101", section="A", instructor="Dr. Cruz", units=3)
course_b.add_to_schedule("8:10am-9:20am", "Monday")

# Course C  -  Monday Period 2  (adjacent to B)
course_c = course(coursecode="SCI101", section="A", instructor="Dr. Lim", units=3)
course_c.add_to_schedule("9:20am-10:30am", "Monday")

# Course D  -  Wednesday Period 0  (different day, no gap conflict)
course_d = course(coursecode="HIS101", section="A", instructor="Dr. Santos", units=3)
course_d.add_to_schedule("7:00am-8:10am", "Wednesday")

courses = [course_a, course_b, course_c, course_d]

# --- Run test -----------------------------------------------------------------

print("\n" + "=" * 60)
print("TEST: SUCCESS CASE")
print("Expected result: True (all courses enrolled)")
print("=" * 60)

alice = student(id=1, name="Alice")
result = schedule_student(alice, courses)

print(f"\nschedule_student returned: {result}")
assert result is True, "FAILED: expected True but got False"

print("\n--- Final schedule ---")
alice.print_schedule()
print("\nTEST PASSED")
