# -*- coding: utf-8 -*-
"""
test_mico_joel.py
-----------------
Tests the scheduler function with the custom success/failure cases:
1. Mico Tazarte (7 courses, complex MWF/TTh schedules) -> Expected output: True
2. Joel Balagot (7 courses, Monday gap deadlock) -> Expected output: False
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', 'backend', 'api', 'utils'))

from studentclass import student
from courseclass import course
from schedulerfunction import schedulerfunction as schedule_student

# ─── Mico Tazarte Setup ───────────────────────────────────────────────────────
mico_courses = [
    # MWF Cluster
    course(coursecode="MATH301", section="A", instructor="Dr. Santos", units=3),
    course(coursecode="PHYS301", section="A", instructor="Dr. Lim", units=3),
    course(coursecode="FIL301", section="A", instructor="Dr. Garcia", units=3),
    # TTh Cluster
    course(coursecode="CS301", section="A", instructor="Dr. Cruz", units=3),
    course(coursecode="ENG301", section="A", instructor="Dr. Reyes", units=3),
    course(coursecode="HIS301", section="A", instructor="Dr. Bautista", units=3),
    # Saturday Standalone
    course(coursecode="PE301", section="A", instructor="Coach Dela Cruz", units=2),
]

# Set up schedules (MWF Cluster)
mico_courses[0].add_to_schedule("7:00am-8:10am", "Monday")
mico_courses[0].add_to_schedule("7:00am-8:10am", "Wednesday")
mico_courses[0].add_to_schedule("7:00am-8:10am", "Friday")

mico_courses[1].add_to_schedule("8:10am-9:20am", "Monday")
mico_courses[1].add_to_schedule("8:10am-9:20am", "Wednesday")
mico_courses[1].add_to_schedule("8:10am-9:20am", "Friday")

mico_courses[2].add_to_schedule("9:20am-10:30am", "Monday")
mico_courses[2].add_to_schedule("9:20am-10:30am", "Wednesday")

# Set up schedules (TTh Cluster)
mico_courses[3].add_to_schedule("7:00am-8:10am", "Tuesday")
mico_courses[3].add_to_schedule("7:00am-8:10am", "Thursday")

mico_courses[4].add_to_schedule("8:10am-9:20am", "Tuesday")
mico_courses[4].add_to_schedule("8:10am-9:20am", "Thursday")

mico_courses[5].add_to_schedule("9:20am-10:30am", "Tuesday")
mico_courses[5].add_to_schedule("9:20am-10:30am", "Thursday")

# PE
mico_courses[6].add_to_schedule("7:00am-8:10am", "Saturday")


# ─── Joel Balagot Setup ───────────────────────────────────────────────────────
joel_courses = [
    # Monday Deadlock
    course(coursecode="MATH302", section="B", instructor="Dr. Santos", units=3),
    course(coursecode="ENG302", section="B", instructor="Dr. Reyes", units=3),
    course(coursecode="SCI302", section="B", instructor="Dr. Lim", units=3),
    # Other valid fillers
    course(coursecode="CS302", section="B", instructor="Dr. Cruz", units=3),
    course(coursecode="FIL302", section="B", instructor="Dr. Garcia", units=3),
    course(coursecode="HIS302", section="B", instructor="Dr. Bautista", units=3),
    course(coursecode="PE302", section="B", instructor="Coach Dela Cruz", units=2),
]

# Set up schedules (Monday Deadlock)
joel_courses[0].add_to_schedule("7:00am-8:10am", "Monday")
joel_courses[1].add_to_schedule("11:40am-12:50pm", "Monday")
joel_courses[2].add_to_schedule("4:20pm-5:30pm", "Monday")

# Fillers
joel_courses[3].add_to_schedule("7:00am-8:10am", "Tuesday")
joel_courses[3].add_to_schedule("7:00am-8:10am", "Wednesday")

joel_courses[4].add_to_schedule("8:10am-9:20am", "Tuesday")
joel_courses[4].add_to_schedule("8:10am-9:20am", "Thursday")

joel_courses[5].add_to_schedule("8:10am-9:20am", "Wednesday")
joel_courses[5].add_to_schedule("8:10am-9:20am", "Friday")

joel_courses[6].add_to_schedule("7:00am-8:10am", "Saturday")


# ─── Run Tests ────────────────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("TEST: MICO TAZARTE (SUCCESS CASE)")
print("=" * 60)
mico = student(id=3, name="Mico Tazarte")
result_mico = schedule_student(mico, mico_courses)
print(f"schedule_student returned: {result_mico}")
assert result_mico is True, "FAILED: Mico Tazarte should succeed!"

print("\n" + "=" * 60)
print("TEST: JOEL BALAGOT (FAILURE CASE)")
print("=" * 60)
joel = student(id=4, name="Joel Balagot")
result_joel = schedule_student(joel, joel_courses)
print(f"schedule_student returned: {result_joel}")
assert result_joel is False, "FAILED: Joel Balagot should fail!"

print("\n" + "=" * 60)
print("ALL MICO AND JOEL TESTS PASSED")
print("=" * 60)
