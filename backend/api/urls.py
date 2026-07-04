from django.urls import path
from .views import hello_world, schedule_student_view

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('schedule/', schedule_student_view, name='schedule_student'),
]
