# Backtrack Enrollment Optimizer

A full-stack application designed to resolve scheduling conflicts for student courses using a stack-based backtracking search algorithm. It enforces structural scheduling constraints to construct conflict-free schedule grids.

## Project Structure

```text
backtrack-enrollment-optimizer/
├── backend/            # Django REST Framework backend API
│   ├── api/            # App endpoints, models, serializers, and backtracking logic
│   └── backend/        # Project settings & URL configuration
├── frontend/           # Vite + React + TypeScript single-page application
│   ├── src/            # Components, views, types, and API connection service
│   └── package.json
└── test_scripts/       # Standalone Python scripts for unit & system verification
```

---

## Scheduling Constraints

The algorithm enforces four key constraints (implemented in `backend/api/utils/studentclass.py`):
1. **Duplicate Constraint**: A student cannot enroll in the same course code more than once (regardless of section).
2. **Overlap Constraint**: Two courses cannot occupy the same day-time slot.
3. **Consecutive Constraint**: A student cannot have more than 3 consecutive periods occupied on any given day.
4. **Gap Constraint**: On any day where the student has classes, a new course period can be at most 1 period (70 min) away from the nearest existing period.

---

## Getting Started

### 1. Prerequisites
- **Python** (version 3.10 or higher)
- **Node.js** (version 18 or higher) with `npm`

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows (Command Prompt / PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations (if applicable)**:
   ```bash
   python manage.py migrate
   ```

5. **Start the Django REST API server**:
   ```bash
   python manage.py runserver
   ```
   *The API will run locally at `http://127.0.0.1:8000/`.*

---

### 3. Frontend Setup

1. **Open a new terminal session and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   *The frontend client will run locally at `http://localhost:5173/`.*

---

## Running the Verification Tests

A suite of standalone verification scripts is provided in the `test_scripts/` directory to run automated checks directly in the terminal.

Ensure your virtual environment is active in the project root:

1. **Verify individual constraints (Unit Tests)**:
   ```bash
   # Test Constraint 1: Duplicate check
   python test_scripts/test_constraint1_duplicate.py

   # Test Constraint 2: Overlap check
   python test_scripts/test_constraint2_overlap.py

   # Test Constraint 3: Consecutive run check
   python test_scripts/test_constraint3_consecutive.py

   # Test Constraint 4: Gap distance check
   python test_scripts/test_constraint4_gap.py
   ```

2. **Verify complex user profiles (System Tests)**:
   ```bash
   # Test Mico Tazarte (7 courses, success) & Joel Balagot (7 courses, failure deadlock)
   python test_scripts/test_mico_joel.py

   # Run legacy success case (Alice)
   python test_scripts/test_success.py

   # Run legacy failure case (Bob)
   python test_scripts/test_failure.py
   ```
