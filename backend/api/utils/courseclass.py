class course:
    def __init__(self, coursecode:str, section:str, instructor:str, schedule:list[list[str]] = None,  units:int):
        self.coursecode = coursecode
        self.section = section
        self.instructor = instructor
        self.units = units
        if schedule is None:
            self.schedule = [["Free" for _ in range(7)] for _ in range(9)]
        else:
            self.schedule = schedule

    def print_schedule(self):
        print(f"--- {self.name}'s Schedule (Rows: Periods, Cols: Days) ---")
        for index, row in enumerate(self.schedule):
            formatted_row = " | ".join(f"{slot:<10}" for slot in row)
            print(f"Period {index + 1}: {formatted_row}")       
        