class student:
    def __init__(self,id: int, name:str, schedule: list[list[str]] = None):
        self.id = id
        self.name = name
        self.schedule = schedule

        if schedule is None:
            self.schedule = [["Free" for _ in range(7)] for _ in range(13)]
        else:
            self.schedule = schedule

    def print_schedule(self):
        print(f"--- {self.name}'s Schedule (Rows: Periods, Cols: Days) ---")
        for index, row in enumerate(self.schedule):
            formatted_row = " | ".join(f"{slot:<10}" for slot in row)
            print(f"Period {index + 1}: {formatted_row}")

    def can_append(self, course) -> bool:
        """
        Returns True if the given course can be legally added to the student's
        schedule, based on the following four constraints:

        1. Duplicate   — The course is not already enrolled.
        2. Overlap     — The course does not conflict with any existing course.
        3. Consecutive — Adding the course would not create 4+ consecutive
                         occupied periods on any day.
        4. Gap         — On any day where both the new course and existing
                         courses share periods, no new-course period may be
                         more than 1 period (70 min) away from the nearest
                         existing occupied period on that same day.
        """
        course_id = f"{course.coursecode}-{course.section}"

        # ------------------------------------------------------------------
        # Constraint 1: Duplicate check
        # ------------------------------------------------------------------
        for row in self.schedule:
            for cell in row:
                if course_id in cell:
                    return False

        # ------------------------------------------------------------------
        # Constraint 2: Overlap check
        # ------------------------------------------------------------------
        for period in range(13):
            for day in range(7):
                if course.schedule[period][day] != "Free":
                    if self.schedule[period][day] != "Free":
                        return False

        # ------------------------------------------------------------------
        # Constraint 3: No 4+ consecutive occupied periods on any day
        # ------------------------------------------------------------------
        for day in range(7):
            streak = 0
            for period in range(13):
                student_occupied = self.schedule[period][day] != "Free"
                course_occupied  = course.schedule[period][day] != "Free"
                if student_occupied or course_occupied:
                    streak += 1
                    if streak >= 4:
                        return False
                else:
                    streak = 0

        # ------------------------------------------------------------------
        # Constraint 4: Gap constraint — max 1 period (70 min) apart
        # Only enforced when the student already has at least one course.
        # ------------------------------------------------------------------
        student_has_courses = any(
            self.schedule[p][d] != "Free"
            for p in range(13)
            for d in range(7)
        )

        if student_has_courses:
            for day in range(7):
                course_periods  = [p for p in range(13) if course.schedule[p][day]  != "Free"]
                student_periods = [p for p in range(13) if self.schedule[p][day] != "Free"]

                # Only check days where the new course has periods AND
                # the student already has courses on that same day.
                if course_periods and student_periods:
                    for cp in course_periods:
                        min_gap = min(abs(cp - sp) for sp in student_periods)
                        if min_gap > 1:
                            return False

        return True

    def append(self, course) -> None:
        """
        Appends a course to the student's schedule by copying every occupied
        cell from the course's schedule grid into the student's grid.

        Raises ValueError if the course cannot be added (i.e. can_append
        returns False), so callers cannot bypass the constraint checks.
        """
        if not self.can_append(course):
            raise ValueError(
                f"Cannot add {course.coursecode}-{course.section} to "
                f"{self.name}'s schedule: one or more constraints violated."
            )

        course_id = f"{course.coursecode}-{course.section}"

        for period in range(13):
            for day in range(7):
                if course.schedule[period][day] != "Free":
                    if self.schedule[period][day] == "Free":
                        self.schedule[period][day] = course_id
                    else:
                        # Cell already has content (shouldn't happen after
                        # can_append passes, but handled defensively).
                        self.schedule[period][day] += f", {course_id}"

