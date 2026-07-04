from studentclass import student
from courseclass import course

TOTAL_PERIODS = 13
SCHOOL_HOURS_LAST_VALID_PERIOD = 11   # periods 0-11 = 7:00am-9:00pm; period 12 spills past 9pm
MAX_SECTION_SIZE = 40
MAX_GAP_PERIODS = 1            # 1 period = 1h10m
MAX_CONSECUTIVE_PERIODS = 3    # 3 periods = 3h30m
MAX_DAILY_PERIODS = 4          # 4 periods = 4h40m


def _occupied_periods_per_day(schedule):
    """For each day (0-6), list the period indices that are occupied (not 'Free')."""
    occupied = [[] for _ in range(7)]
    for period_idx, row in enumerate(schedule):
        for day_idx, cell in enumerate(row):
            if cell != "Free":
                occupied[day_idx].append(period_idx)
    return occupied


def _violates_school_hours(candidate: course) -> bool:
    """Constraint: sections must fall within 7:00am - 9:00pm."""
    for day_idx in range(7):
        if candidate.schedule[SCHOOL_HOURS_LAST_VALID_PERIOD + 1][day_idx] != "Free":
            return True
    return False


def _violates_overlap(stu: student, candidate: course) -> bool:
    """Constraint: no two classes may occupy the same period/day."""
    for period_idx in range(TOTAL_PERIODS):
        for day_idx in range(7):
            if candidate.schedule[period_idx][day_idx] != "Free" and stu.schedule[period_idx][day_idx] != "Free":
                return True
    return False


def _violates_gap_consecutive_daily(stu: student, candidate: course) -> bool:
    """Checks gap, consecutive-block, and daily-total constraints against
    the student's schedule AFTER tentatively merging in the candidate section."""
    merged = [row[:] for row in stu.schedule]
    for period_idx in range(TOTAL_PERIODS):
        for day_idx in range(7):
            if candidate.schedule[period_idx][day_idx] != "Free":
                merged[period_idx][day_idx] = candidate.schedule[period_idx][day_idx]

    occupied = _occupied_periods_per_day(merged)

    for periods in occupied:
        if not periods:
            continue

        if len(periods) > MAX_DAILY_PERIODS:
            return True

        consecutive_run = 1
        for i in range(1, len(periods)):
            gap = periods[i] - periods[i - 1] - 1
            if gap > MAX_GAP_PERIODS:
                return True
            if gap == 0:
                consecutive_run += 1
                if consecutive_run > MAX_CONSECUTIVE_PERIODS:
                    return True
            else:
                consecutive_run = 1

    return False


def _section_key(candidate: course) -> str:
    return f"{candidate.coursecode}-{candidate.section}"


def _is_valid_assignment(stu: student, candidate: course, enrolled_counts: dict) -> bool:
    if enrolled_counts.get(_section_key(candidate), 0) >= MAX_SECTION_SIZE:
        return False
    if _violates_school_hours(candidate):
        return False
    if _violates_overlap(stu, candidate):
        return False
    if _violates_gap_consecutive_daily(stu, candidate):
        return False
    return True


def _apply_assignment(stu: student, candidate: course, enrolled_counts: dict):
    for period_idx in range(TOTAL_PERIODS):
        for day_idx in range(7):
            if candidate.schedule[period_idx][day_idx] != "Free":
                stu.schedule[period_idx][day_idx] = candidate.schedule[period_idx][day_idx]
    enrolled_counts[_section_key(candidate)] = enrolled_counts.get(_section_key(candidate), 0) + 1


def _undo_assignment(stu: student, candidate: course, enrolled_counts: dict):
    for period_idx in range(TOTAL_PERIODS):
        for day_idx in range(7):
            if candidate.schedule[period_idx][day_idx] != "Free":
                stu.schedule[period_idx][day_idx] = "Free"
    enrolled_counts[_section_key(candidate)] -= 1


def schedulerfunction(students: list, courses: list, student_requirements: dict):
    """
    students: list of `student` objects
    courses: list of `course` objects (each = one section)
    student_requirements: dict mapping student.id -> list of required coursecodes
        e.g. {1: ["CS101", "MATH201"], 2: ["CS101"]}

    Returns: (success, assignments, stats)
        assignments maps student.id -> {coursecode: course_object}
        stats maps "nodes_explored" / "nodes_pruned" -> counts
    """
    stats = {"nodes_explored": 0, "nodes_pruned": 0}

    sections_by_course = {}
    for c in courses:
        sections_by_course.setdefault(c.coursecode, []).append(c)

    slots = []
    for stu in students:
        for coursecode in student_requirements.get(stu.id, []):
            slots.append((stu, coursecode))

    enrolled_counts = {}
    assignments = {stu.id: {} for stu in students}

    def backtrack(slot_index: int) -> bool:
        if slot_index == len(slots):
            return True  # every (student, course) slot filled = complete valid schedule

        stu, coursecode = slots[slot_index]
        candidates = sections_by_course.get(coursecode, [])

        for candidate in candidates:
            stats["nodes_explored"] += 1

            if not _is_valid_assignment(stu, candidate, enrolled_counts):
                stats["nodes_pruned"] += 1
                continue

            _apply_assignment(stu, candidate, enrolled_counts)
            assignments[stu.id][coursecode] = candidate

            if backtrack(slot_index + 1):
                return True

            _undo_assignment(stu, candidate, enrolled_counts)
            del assignments[stu.id][coursecode]

        return False

    success = backtrack(0)
    return success, assignments, stats


if __name__ == "__main__":
    from data import students, courses

    requirements = {
        1: ["CS101", "MATH201"],
        2: ["CS101"],
        3: ["MATH201"],
    }

    success, result, run_stats = schedulerfunction(students, courses, requirements)

    print(f"Scheduling {'SUCCEEDED' if success else 'FAILED'}")
    print(f"Nodes explored: {run_stats['nodes_explored']}")
    print(f"Nodes pruned:   {run_stats['nodes_pruned']}")

    if success:
        for stu in students:
            stu.print_schedule()