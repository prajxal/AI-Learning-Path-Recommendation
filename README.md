# Adaptive Learning System with Integrated Analytics Pipeline

This system provides personalized learning paths using roadmap-based course structures, adaptive trust-score progression, and integrated analytics tracking. It dynamically adjusts course recommendations based on user progress, trust score, and learning history.

---

## Key Features

- **Adaptive Learning Path Generation**: Uses a trust-score system to tailor content difficulty.
- **Roadmap-Based Learning**: structured learning paths based on industry standards (roadmap.sh data).
- **Dynamic Difficulty Calculation**: Computes course difficulty based on prerequisite graph depth.
- **Progress Tracking**: Tracks user progress per roadmap with granular metrics.
- **User Skill Tracking**: maintains `trust_score` and `proficiency_level` for each skill area.
- **Learning Analytics Pipeline**: Event-driven tracking of user interactions and achievements.
- **Skill Dashboard**: Visual interface for users to monitor their skills and progress.
- **Modern Tech Stack**: Built with FastAPI (Backend) and React + Vite (Frontend).

---

## System Architecture

```mermaid
graph TD
    Client[Frontend (React + Vite)] -->|REST API| API[Backend API (FastAPI)]
    API -->|Read/Write| DB[(SQLite Database)]
    DB -->|Seed Data| RoadmapData[Roadmap.sh Extracted Data]
    API -->|Analytics Events| DB
```

- **Frontend**: Handles the user interface, routing, and visualization of roadmaps and dashboards.
- **Backend API**: Manages adaptive logic, processes events, serves course data, and handles user authentication.
- **Database**: Stores users, courses, prerequisites, events, and skill profiles.

---

## Database Schema Explanation

- **users**: Stores user credentials and profile information.
- **courses**: detailed information about each course node in a roadmap, including `difficulty_level`.
- **course_prerequisites**: Defines the dependency graph between courses (DAG structure).
- **events**: Logs all user actions (e.g., `course_completed`, `started_path`) for analytics.
- **user_skills**: Tracks the user's `trust_score` and `proficiency_level` for specific roadmaps/skills.

**Relationships**:
- Users have many Skills and Events.
- Courses have many Prerequisites.
- Events link Users to Courses and Roadmaps.

---

## Backend API Overview

The backend is structured into modular routers:

- **/courses**: Endpoints to fetch course details and verify IDs.
- **/roadmaps**: retrieval of roadmap structures and metadata.
- **/learning-path**: Core adaptive logic to generate personalized course sequences.
- **/events**: Receives analytics events (e.g., course completion) and updates user state.
- **/progress**: Aggregates progress metrics for specific roadmaps.
- **/users**: User profile and comprehensive skill data retrieval.

---

## Adaptive Learning Logic

The system adapts to the user through two main mechanisms:

1.  **Difficulty Calculation**:
    - `difficulty_level` is derived from the depth of the course in the prerequisite graph.
    - Deeper nodes (more dependencies) have higher difficulty scores.

2.  **Trust Score Progression**:
    - Users start with a baseline `trust_score` (default: 800).
    - When a `course_completed` event is received, the system increases the user's `trust_score` for that roadmap.
    - The learning path generator uses this score to recommend courses that match the user's current ability.

---

## Analytics Pipeline

The system uses an event-based approach for analytics:

1.  **Event Ingestion**: The `events` table captures granular actions.
2.  **Real-time Updates**:
    - A `course_completed` event triggers an immediate update to the user's `trust_score` and `proficiency_level` in `user_skills`.
    - It also updates the calculated `progress_percent` exposed via the API.
3.  **Future Capability**: The schema supports extending this to track engagement scores and detailed learning velocity.

---

## Project Folder Structure

```
.
├── backend/
│   ├── db/                 # Database connection and session management
│   ├── models/             # SQLAlchemy ORM models
│   ├── routers/            # FastAPI route handlers
│   ├── scripts/            # Data extraction and setup scripts
│   └── main.py             # Application entry point
├── src/                    # Frontend source code
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   └── pages/          # Application pages (Dashboard, Roadmap, etc.)
│   ├── hooks/              # Custom React hooks (useProgress, useUserSkills)
│   └── services/           # API client services
└── README.md
```

---

## Backend Setup Instructions

1.  **Install Dependencies**:
    ```bash
    pip install fastapi uvicorn sqlalchemy
    ```

2.  **Initialize Database**:
    ```bash
    python create_tables.py
    ```

3.  **Seed Data**:
    ```bash
    python scripts/extract_roadmaps.py
    python scripts/compute_difficulty.py
    ```

4.  **Run Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

---

## Frontend Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Example API Requests

**Get User Progress**:
```bash
curl http://localhost:8000/progress/1/ai-agents
```

**Get Learning Path**:
```bash
curl "http://localhost:8000/learning-path/generate?user_id=1&goal=ai-agents"
```

**Log Event**:
```bash
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{"user_id": "1", "event_type": "course_completed", "course_id": "ai-agents:101", "payload": {}}'
```

**Get User Skills**:
```bash
curl http://localhost:8000/users/1/skills
```

---

## Skill Dashboard Explanation

The frontend includes a **Skill Dashboard** accessible at `/dashboard`. It visualizes:
- **Active Roadmaps**: Shows all roadmaps the user has started.
- **Progress Bars**: Displays percentage completion based on total vs. completed courses.
- **Skill Levels**: Shows the current `trust_score` for each area.
- **Quick Links**: "Continue" buttons to jump back into the roadmap.

---

## Contribution Guide

1.  **Setup Locally**: Follow the backend and frontend setup instructions above.
2.  **Modify Backend**: Add new routers in `backend/routers/` and register them in `main.py`. Ensure you don't break existing models.
3.  **Modify Frontend**: Add components in `src/app/components/` or pages in `src/app/pages/`. Use existing hooks for data fetching.
4.  **Submit Pull Requests**: Ensure your code passes any linting checks and includes verification steps for new features.

---

## Current Implementation Status

- [x] Roadmap extraction logic
- [x] Adaptive learning path generation
- [x] Trust score progression system
- [x] Progress tracking (per roadmap)
- [x] Skill dashboard implementation
- [x] Analytics event pipeline
- [ ] GitHub integration (Planned)
- [ ] Resume parser (Planned)
- [ ] Engagement score system (Planned)

---

## Troubleshooting

- **Database Errors**: Ensure you have run `python create_tables.py` and the seed scripts in the correct order.
- **CORS Issues**: The backend is configured to allow all origins (`*`) for development. Check `main.py` if you encounter restrictions.
- **Missing Data**: If the dashboard is empty, ensure you have logged some `course_completed` events for the user.

---

## License

MIT License
