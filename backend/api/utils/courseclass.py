class course:
    def __init__(self, coursecode:str, section:str, instructor:str, schedule:list[list[str]] = None,  units:int = 3):
        self.coursecode = coursecode
        self.section = section
        self.instructor = instructor
        self.units = units
        if schedule is None:
            # 13 rows cover 7:00 am to 10:10 pm (covering up to 9:30 pm) in 1h 10m intervals.
            self.schedule = [["Free" for _ in range(7)] for _ in range(13)]
        else:
            self.schedule = schedule
    def print_schedule(self):
        print(f"--- {self.coursecode} ({self.section}) Schedule (Rows: Periods, Cols: Days) ---")
        for index, row in enumerate(self.schedule):
            formatted_row = " | ".join(f"{slot:<15}" for slot in row)
            print(f"Period {index + 1}: {formatted_row}")
    def add_to_schedule(self, timeslot_str: str, day_str: str):
        days_map = {
            "monday": 0, "mon": 0,
            "tuesday": 1, "tue": 1, "tues": 1,
            "wednesday": 2, "wed": 2,
            "thursday": 3, "thu": 3, "thur": 3, "thurs": 3,
            "friday": 4, "fri": 4,
            "saturday": 5, "sat": 5,
            "sunday": 6, "sun": 6
        }
        day_idx = days_map.get(day_str.strip().lower())
        if day_idx is None:
            raise ValueError(f"Invalid day string: {day_str}")
        def time_to_minutes(t_str):
            t_str = t_str.strip().lower()
            is_pm = "pm" in t_str
            t_str = t_str.replace("am", "").replace("pm", "").strip()
            parts = t_str.split(":")
            hour = int(parts[0])
            minute = int(parts[1]) if len(parts) > 1 else 0
            
            if is_pm and hour != 12:
                hour += 12
            elif not is_pm and hour == 12:
                hour = 0
                
            return hour * 60 + minute
        try:
            start_str, end_str = timeslot_str.split("-")
        except ValueError:
            raise ValueError(f"Invalid timeslot format: {timeslot_str}")
        start_min = time_to_minutes(start_str)
        end_min = time_to_minutes(end_str)
        ref_min = 7 * 60 # 7:00 am reference
        start_rel = start_min - ref_min
        end_rel = end_min - ref_min
        course_info = f"{self.coursecode}-{self.section}"
        for i in range(len(self.schedule)):
            row_start = i * 70
            row_end = (i + 1) * 70
            if max(start_rel, row_start) < min(end_rel, row_end):
                if self.schedule[i][day_idx] == "Free":
                    self.schedule[i][day_idx] = course_info
                else:
                    self.schedule[i][day_idx] += f", {course_info}"

my_course = course(coursecode="CS101", section="A", instructor="Dr. Smith", units=3)
# 2. Add timeslots to the schedule
# Monday 7:00am - 8:10am (should occupy Period 1 / Row 0)
my_course.add_to_schedule("7:00am-8:10am", "Monday")
# Wednesday 8:10am - 10:30am (should occupy Period 2 & 3 / Row 1 & 2)
my_course.add_to_schedule("8:10am-10:30am", "Wednesday")
# Friday 7:50pm - 9:00pm (should occupy Period 12 / Row 11)
my_course.add_to_schedule("7:50pm-9:00pm", "Friday")
# 3. Print the schedule (Columns are Mon, Tue, Wed, Thu, Fri, Sat, Sun)
my_course.print_schedule()