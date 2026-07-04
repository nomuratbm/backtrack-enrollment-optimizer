from rest_framework import serializers


class TimeslotSerializer(serializers.Serializer):
    time = serializers.CharField(
        help_text="Time range string, e.g. '7:00am-8:10am'"
    )
    day = serializers.CharField(
        help_text="Day string, e.g. 'Monday'"
    )


class CourseInputSerializer(serializers.Serializer):
    coursecode  = serializers.CharField()
    section     = serializers.CharField()
    instructor  = serializers.CharField()
    units       = serializers.IntegerField(default=3)
    timeslots   = TimeslotSerializer(many=True)


class StudentInputSerializer(serializers.Serializer):
    id   = serializers.IntegerField()
    name = serializers.CharField()


class ScheduleRequestSerializer(serializers.Serializer):
    student = StudentInputSerializer()
    courses = CourseInputSerializer(many=True)
