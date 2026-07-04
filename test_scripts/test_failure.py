"""
test_failure.py
---------------
Tests schedule_student with a set of courses that CANNOT all be legally enrolled.

Course layout (all on Monday):
  Course X  -  Monday Period 0  (7:00am  - 8:10am)
  Course Y  -  Monday Period 5  (12:50pm - 2:00pm)
  Course Z  -  Monday Period 3  (10:30am - 11:40am)

Why this should fail (gap constraint)
--------------------------------------
  No matter which course is placed first, every remaining course will be
  more than 1 period away from it on the same day:

    Try X first (P0) -> Y gap=5, Z gap=3  -> both fail -> backtrack
    Try Y first (P5) -> X gap=5, Z gap=2  -> both fail -> backtrack
    Try Z first (P3) -> X gap=3, Y gap=2  -> both fail -> backtrack

  Stack exhausted -> no solution. schedule_student returns False and
  resets the student's schedule to all Free.

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

# Course X  -  Monday Period 0
course_x = course(coursecode="MATH201", section="B", instructor="Dr. Reyes", units=3)
course_x.add_to_schedule("7:00am-8:10am", "Monday")

# Course Y  -  Monday Period 5  (5 periods away from X)
course_y = course(coursecode="ENG201", section="B", instructor="Dr. Cruz", units=3)
course_y.add_to_schedule("12:50pm-2:00pm", "Monday")

# Course Z  -  Monday Period 3  (3 periods from X, 2 periods from Y)
course_z = course(coursecode="SCI201", section="B", instructor="Dr. Lim", units=3)
course_z.add_to_schedule("10:30am-11:40am", "Monday")

courses = [course_x, course_y, course_z]

# --- Run test -----------------------------------------------------------------

print("\n" + "=" * 60)
print("TEST: FAILURE CASE")
print("Expected result: False (no valid schedule exists)")
print("=" * 60)

bob = student(id=2, name="Bob")
result = schedule_student(bob, courses)

print(f"\nschedule_student returned: {result}")
assert result is False, "FAILED: expected False but got True"

# Verify the schedule was reset to all Free
is_reset = all(
    bob.schedule[p][d] == "Free"
    for p in range(13)
    for d in range(7)
)
assert is_reset, "FAILED: schedule was not reset to all Free after failure"

print("\n--- Schedule after failure (should be all Free) ---")
bob.print_schedule()
print("\nTEST PASSED")
