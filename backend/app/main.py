from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.predict import router as predict_router
from backend.app.services.websocket_manager import manager


app = FastAPI(
    title="Monitoring Hama Krisan API"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# STATIC FILES
# =========================================================

app.mount(
    "/uploads",
    StaticFiles(directory="backend/app/uploads"),
    name="uploads"
)


# =========================================================
# ROUTER
# =========================================================

app.include_router(
    predict_router,
    prefix="/api"
)


# =========================================================
# WEBSOCKET MONITORING
# =========================================================

@app.websocket("/ws/monitoring")
async def monitoring_websocket(websocket: WebSocket):



    await websocket.accept()

    print(">>> WEBSOCKET BERHASIL CONNECT")

    try:
        while True:
            message = await websocket.receive_text()
            print(">>> PESAN:", message)

    except WebSocketDisconnect:
        print(">>> CLIENT DISCONNECT")

    except Exception as e:
        print(">>> ERROR:", e)
# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "API Monitoring Hama Krisan Berjalan"
    }