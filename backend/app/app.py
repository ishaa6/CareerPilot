from fastapi import FastAPI

app = FastAPI(title="CareerPilot")

@app.get("/")
def home():
    return {"message": "Welcome to Career Pilot"}