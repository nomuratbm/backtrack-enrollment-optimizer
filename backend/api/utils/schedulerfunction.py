import copy


def schedulerfunction(student: object, courses: list) -> bool:
    """
    Attempts to enroll all courses in the student's schedule using an
    iterative stack-based backtracking search.

    The function tries every possible ordering of the given courses, using
    the student's can_append / append methods to enforce constraints. When a
    dead-end is reached (no remaining course can be appended), it pops back
    to the previous state and tries the next candidate.

    Parameters
    ----------
    student : student
        The student object whose schedule will be mutated on success.
    courses : list[course]
        The list of course objects to enrol.

    Returns
    -------
    bool
        True  — all courses were successfully enrolled (student.schedule is
                 updated in-place with the final solution).
        False — no valid ordering exists; student.schedule is reset to all
                 "Free" and a message is printed.
    """

    # ------------------------------------------------------------------
    # Each stack frame is a dict:
    #   snapshot         – deep copy of student.schedule at this level
    #   enrolled         – courses committed so far (in order)
    #   remaining        – courses still to be placed
    #   candidate_index  – which index in `remaining` to try next
    # ------------------------------------------------------------------
    initial_state = {
        "snapshot":        copy.deepcopy(student.schedule),
        "enrolled":        [],
        "remaining":       list(courses),
        "candidate_index": 0,
    }

    stack = [initial_state]

    while stack:
        state = stack[-1]  # peek at the top

        # All courses placed — we found a solution.
        if not state["remaining"]:
            return True

        remaining        = state["remaining"]
        candidate_index  = state["candidate_index"]

        # All candidates at this level have been tried — backtrack.
        if candidate_index >= len(remaining):
            stack.pop()
            if stack:
                # Restore the schedule to the parent state's snapshot and
                # advance its candidate pointer so it tries the next course.
                student.schedule = copy.deepcopy(stack[-1]["snapshot"])
                stack[-1]["candidate_index"] += 1
            continue

        candidate = remaining[candidate_index]

        if student.can_append(candidate):
            # Commit: append the course and push a new state.
            student.append(candidate)

            new_remaining = [c for c in remaining if c is not candidate]

            stack.append({
                "snapshot":        copy.deepcopy(student.schedule),
                "enrolled":        state["enrolled"] + [candidate],
                "remaining":       new_remaining,
                "candidate_index": 0,
            })
        else:
            # This candidate failed — try the next one at the same level.
            state["candidate_index"] += 1

    # ------------------------------------------------------------------
    # Stack exhausted without a solution.
    # ------------------------------------------------------------------
    print(
        f"No valid schedule found for {student.name}: "
        "no ordering of the given courses satisfies all constraints."
    )
    student.schedule = [["Free" for _ in range(7)] for _ in range(13)]
    return False
