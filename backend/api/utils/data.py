from studentclass import student
from courseclass import course

# STUDENTS ARRAY
students = [
    student(id=1, name="Aviel Abella"),
    student(id=2, name="Enegue Apacible"),
    student(id=3, name="Joel Balagot"),
    student(id=4, name="Beatriz Baltazar"),
    student(id=5, name="Raphael Bautista"),
    student(id=6, name="Karina Castro"),
    student(id=7, name="Nicole Cloa"),
    student(id=8, name="David Cutchon"),
    student(id=9, name="Garreth DelosSantos"),
    student(id=10, name="Brian Dionisio"),
    student(id=11, name="Adison Halanes"),
    student(id=12, name="Ryan Layno"),
    student(id=13, name="Jedrick Ocenar"),
    student(id=14, name="Agatha Pelayo"),
    student(id=15, name="Leanna Roque"),
    student(id=16, name="Ricuel Santos"),
    student(id=17, name="Robin Soliman"),
    student(id=18, name="Mico Tazarte"),
    student(id=19, name="John Vida"),
    student(id=20, name="Nigel Zomil"),
    student(id=21, name="Lebbeus Santos"),
    student(id=22, name="Kuya Axel"),
]

# COURSES ARRAY
courses = [
    course(coursecode="CSS133-1", section="BM1", instructor="Dr. DeGoma", units=3), # 0
    course(coursecode="CSS133-1", section="BM17", instructor="Dr. DeGoma", units=3), # 1
    course(coursecode="CSS133-1", section="BM2", instructor="Dr. DeGoma", units=3), # 2
    course(coursecode="CSS133-1", section="BM3", instructor="Dr. Monreal", units=3), # 3
    course(coursecode="CSS133-1", section="BM4", instructor="Dr. DeGoma", units=3), # 4
    course(coursecode="CSS133-1", section="BM5", instructor="Dr. DeGoma", units=3), # 5
    course(coursecode="CSS133-1", section="BM6", instructor="Dr. Monreal", units=3), # 6
    course(coursecode="CSS134-1", section="BM1", instructor="Dr. Dadigan", units=3), # 7
    course(coursecode="CSS134-1", section="BM2", instructor="Dr. Dadigan", units=3), # 8
    course(coursecode="CSS134-1", section="BM3", instructor="Prof. Castillo", units=3), # 9
    course(coursecode="CSS134-1", section="BM5", instructor="Dr. Dadigan", units=3), # 10
    course(coursecode="CSS134-1", section="BM6", instructor="Dr. Dadigan", units=3), # 11
    course(coursecode="CSS134-1", section="BM7", instructor="Prof. Castillo", units=3), # 12
    course(coursecode="CSS134-1", section="BM8", instructor="Prof. Castillo", units=3), # 13
    course(coursecode="CSS152P", section="BM1", instructor="Dr. Serrano", units=3), # 14
    course(coursecode="CSS152P", section="BM2", instructor="Dr. Serrano", units=3), # 15
    course(coursecode="CSS152P", section="BM3", instructor="Dr. Serrano", units=3), # 16
    course(coursecode="CSS152P", section="BM5", instructor="Prof. Gamboa", units=3), # 17
    course(coursecode="CSS152P", section="BM6", instructor="Dr. Serrano", units=3), # 18
    course(coursecode="CSS152P", section="BM7", instructor="Prof. Reyes", units=3), # 19
    course(coursecode="CSS152P", section="BM8", instructor="Prof. Reyes", units=3), # 20
    course(coursecode="ITS150P", section="BM1", instructor="Prof. Genidina", units=3), # 21
    course(coursecode="ITS150P", section="BM2", instructor="Prof. Mazo", units=3), # 22
    course(coursecode="ITS150P", section="BM3", instructor="Prof. Mazo", units=3), # 23
    course(coursecode="ITS150P", section="BM4", instructor="Dr. Lopez", units=3), # 24
    course(coursecode="ITS150P", section="BM5", instructor="Prof. Genidina", units=3), # 25
    course(coursecode="ITS150P", section="BM7", instructor="Prof. PrimoJr", units=3), # 26
    course(coursecode="ITS150P", section="BM8", instructor="Prof. Morla", units=3), # 27
    course(coursecode="CSS182-01", section="BM1", instructor="Prof. Costales", units=3), # 28
    course(coursecode="CSS182-01", section="BM2", instructor="Prof. Costales", units=3), # 29
    # course(coursecode="...", section="...", instructor="...", units=3),
]

# SECTION SCHEDULES

# CSS133-1
courses[0].add_to_schedule("11:40am-12:50pm", "Monday")
courses[0].add_to_schedule("11:40am-12:50pm", "Wednesday")
courses[0].add_to_schedule("11:40am-12:50pm", "Friday")

courses[1].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[1].add_to_schedule("12:50pm-2:00pm", "Wednesday")
courses[1].add_to_schedule("12:50pm-2:00pm", "Friday")

courses[2].add_to_schedule("10:30am-11:40am", "Monday")
courses[2].add_to_schedule("10:30am-11:40am", "Wednesday")
courses[2].add_to_schedule("10:30am-11:40am", "Friday")

courses[3].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[3].add_to_schedule("12:50pm-2:00pm", "Wednesday")
courses[3].add_to_schedule("12:50pm-2:00pm", "Friday")

courses[4].add_to_schedule("11:40am-12:50pm", "Monday")
courses[4].add_to_schedule("11:40am-12:50pm", "Wednesday")
courses[4].add_to_schedule("11:40am-12:50pm", "Friday")

courses[5].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[5].add_to_schedule("12:50pm-2:00pm", "Wednesday")
courses[5].add_to_schedule("12:50pm-2:00pm", "Friday")

courses[6].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[6].add_to_schedule("2:00pm-3:10pm", "Wednesday")
courses[6].add_to_schedule("2:00pm-3:10pm", "Friday")

# CSS134-1
courses[7].add_to_schedule("10:30am-11:40am", "Monday")
courses[7].add_to_schedule("10:30am-11:40am", "Wednesday")
courses[7].add_to_schedule("10:30am-11:40am", "Friday")

courses[8].add_to_schedule("11:40am-12:50pm", "Monday")
courses[8].add_to_schedule("11:40am-12:50pm", "Wednesday")
courses[8].add_to_schedule("11:40am-12:50pm", "Friday")

courses[9].add_to_schedule("3:10pm-4:20pm", "Monday")
courses[9].add_to_schedule("3:10pm-4:20pm", "Wednesday")
courses[9].add_to_schedule("3:10pm-4:20pm", "Friday")

courses[10].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[10].add_to_schedule("12:50pm-2:00pm", "Wednesday")
courses[10].add_to_schedule("12:50pm-2:00pm", "Friday")

courses[11].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[11].add_to_schedule("2:00pm-3:10pm", "Wednesday")
courses[11].add_to_schedule("2:00pm-3:10pm", "Friday")

courses[12].add_to_schedule("4:20pm-5:30pm", "Monday")
courses[12].add_to_schedule("4:20pm-5:30pm", "Wednesday")
courses[12].add_to_schedule("4:20pm-5:30pm", "Friday")

courses[13].add_to_schedule("5:30pm-6:40pm", "Monday")
courses[13].add_to_schedule("5:30pm-6:40pm", "Wednesday")
courses[13].add_to_schedule("5:30pm-6:40pm", "Friday")

# CSS152P
courses[14].add_to_schedule("3:10pm-4:20pm", "Monday")
courses[14].add_to_schedule("7:00am-10:30am", "Tuesday")
courses[14].add_to_schedule("3:10pm-4:20pm", "Wednesday")

courses[15].add_to_schedule("4:20pm-5:30pm", "Monday")
courses[15].add_to_schedule("10:30am-2:00pm", "Tuesday")
courses[15].add_to_schedule("4:20pm-5:30pm", "Wednesday")

courses[16].add_to_schedule("5:30pm-6:40pm", "Monday")
courses[16].add_to_schedule("7:00am-10:30am", "Thursday")
courses[16].add_to_schedule("5:30pm-6:40pm", "Wednesday")

courses[17].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[17].add_to_schedule("7:00am-10:30am", "Tuesday")
courses[17].add_to_schedule("2:00pm-3:10pm", "Wednesday")

courses[18].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[18].add_to_schedule("10:30am-2:00pm", "Thursday")
courses[18].add_to_schedule("2:00pm-3:10pm", "Wednesday")

courses[19].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[19].add_to_schedule("10:30am-2:00pm", "Tuesday")
courses[19].add_to_schedule("2:00pm-3:10pm", "Wednesday")

courses[20].add_to_schedule("3:10pm-4:20pm", "Monday")
courses[20].add_to_schedule("2:00pm-5:30pm", "Tuesday")
courses[20].add_to_schedule("3:10pm-4:20pm", "Wednesday")

# ITS150P
courses[21].add_to_schedule("2:00pm-3:10pm", "Monday")
courses[21].add_to_schedule("10:30am-2:00pm", "Tuesday")
courses[21].add_to_schedule("2:00pm-3:10pm", "Wednesday")

courses[22].add_to_schedule("3:10pm-4:20pm", "Monday")
courses[22].add_to_schedule("7:00am-10:30am", "Tuesday")
courses[22].add_to_schedule("3:10pm-4:20pm", "Wednesday")

courses[23].add_to_schedule("10:30am-11:40am", "Monday")
courses[23].add_to_schedule("3:10pm-6:40pm", "Tuesday")
courses[23].add_to_schedule("10:30am-11:40am", "Wednesday")

courses[24].add_to_schedule("11:40am-12:50pm", "Monday")
courses[24].add_to_schedule("7:00am-10:30am", "Saturday")
courses[24].add_to_schedule("11:40am-12:50pm", "Wednesday")

courses[25].add_to_schedule("4:20pm-5:30pm", "Monday")
courses[25].add_to_schedule("10:30am-2:00pm", "Saturday")
courses[25].add_to_schedule("4:20pm-5:30pm", "Wednesday")

courses[26].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[26].add_to_schedule("2:00pm-5:30pm", "Saturday")
courses[26].add_to_schedule("12:50pm-2:00pm", "Wednesday")

courses[27].add_to_schedule("12:50pm-2:00pm", "Monday")
courses[27].add_to_schedule("10:30am-2:00pm", "Tuesday")
courses[27].add_to_schedule("12:50pm-2:00pm", "Wednesday")

# CSS182-01
courses[28].add_to_schedule("7:00am-10:30am", "Saturday")
courses[29].add_to_schedule("10:30am-2:00pm", "Saturday")

if __name__ == "__main__":
    for s in students:
        s.print_schedule()
    for c in courses:
        c.print_schedule()