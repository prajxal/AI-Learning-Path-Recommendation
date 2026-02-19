from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.events import router as events_router
from routers.recommend import router as recommend_router
from routers.users import router as users_router
from routers import auth
from routers import courses

app = FastAPI(title="AI Learning Path Recommendation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router, prefix="/recommend", tags=["recommend"])
app.include_router(events_router, prefix="/events", tags=["events"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "backend running"}
