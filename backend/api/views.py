import sys
import os

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import ScheduleRequestSerializer

# Make the utils package importable from this view
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'utils'))

from studentclass import student as Student          # noqa: E402
from courseclass import course as Course            # noqa: E402
from schedulerfunction import schedulerfunction     # noqa: E402


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from your first Django REST API!"})


@api_view(['POST'])
def schedule_student_view(request):
    """
    POST /api/schedule/

    Accepts a student (id, name) and a list of courses (each with timeslots),
    runs the backtracking scheduler, and returns the resulting schedule grid.

    Request body:
    {
        "student": { "id": 1, "name": "Alice" },
        "courses": [
            {
                "coursecode": "MATH101",
                "section": "A",
                "instructor": "Dr. Reyes",
                "units": 3,
                "timeslots": [
                    { "time": "7:00am-8:10am", "day": "Monday" }
                ]
            }
        ]
    }

    Response (success):
    { "success": true, "schedule": [[...], ...] }

    Response (failure):
    { "success": false, "message": "..." }
    """
    # ── Validate input ────────────────────────────────────────────────────────
    serializer = ScheduleRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    # ── Build student object (always starts with an empty schedule) ───────────
    student_data = data["student"]
    student = Student(id=student_data["id"], name=student_data["name"])

    # ── Build course objects from timeslot descriptors ────────────────────────
    courses = []
    for course_data in data["courses"]:
        c = Course(
            coursecode  = course_data["coursecode"],
            section     = course_data["section"],
            instructor  = course_data["instructor"],
            units       = course_data["units"],
        )
        for slot in course_data["timeslots"]:
            try:
                c.add_to_schedule(slot["time"], slot["day"])
            except ValueError as e:
                return Response(
                    {"error": f"Invalid timeslot for {course_data['coursecode']}: {e}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        courses.append(c)

    # ── Run backtracking scheduler ────────────────────────────────────────────
    success = schedulerfunction(student, courses)

    if success:
        student.print_schedule()
        return Response({
            "success": True,
            "schedule": student.schedule,
        }, status=status.HTTP_200_OK)
    else:
        print(f"[schedule_student] No valid schedule found for {student.name}.")
        return Response({
            "success": False,
            "message": (
                f"No valid schedule found for {student.name}: "
                "no ordering of the given courses satisfies all constraints."
            ),
        }, status=status.HTTP_200_OK)
