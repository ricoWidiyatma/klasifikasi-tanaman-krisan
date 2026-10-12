from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from pathlib import Path
import uuid

from backend.app.database.connection import get_db
from backend.app.models.prediction import Prediction
from backend.app.services.prediction_service import predict_image
from backend.app.services.websocket_manager import manager


router = APIRouter()


# =========================================================
# FOLDER UPLOAD
# =========================================================

UPLOAD_DIR = Path("backend/app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# =========================================================
# POST /predict
# ESP32-CAM mengirim foto ke endpoint ini
# =========================================================

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # =====================================================
    # VALIDASI FILE
    # =====================================================

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File harus berupa gambar!"
        )

    # =====================================================
    # BACA GAMBAR
    # =====================================================

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="File gambar kosong!"
        )

    # =====================================================
    # BUAT NAMA FILE UNIK
    # =====================================================

    extension = Path(file.filename).suffix.lower()

    if not extension:
        extension = ".jpg"

    filename = f"{uuid.uuid4()}{extension}"

    file_path = UPLOAD_DIR / filename

    # =====================================================
    # SIMPAN GAMBAR
    # =====================================================

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    # =====================================================
    # PREDIKSI CNN
    # =====================================================

    result = predict_image(contents)

    prediction = result["class"]
    confidence = float(result["confidence"])

    # =====================================================
    # SIMPAN KE DATABASE
    # =====================================================

    new_prediction = Prediction(
        image_path=str(file_path),
        prediction=prediction,
        confidence=confidence
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    # =====================================================
    # DATA REALTIME
    # =====================================================

    realtime_data = {
        "id": new_prediction.id,
        "filename": filename,
        "image_path": new_prediction.image_path,
        "image_url": f"/uploads/{filename}",
        "prediction": new_prediction.prediction,
        "confidence": new_prediction.confidence,
        "created_at": (
            new_prediction.created_at.isoformat()
            if new_prediction.created_at
            else None
        )
    }

    # =====================================================
    # BROADCAST KE SEMUA CLIENT WEBSOCKET
    # =====================================================

    await manager.broadcast(realtime_data)

    # =====================================================
    # RESPONSE
    # =====================================================

    return realtime_data


# =========================================================
# GET /predict
# Dashboard mengambil riwayat hasil monitoring
# =========================================================

@router.get("/predict")
def get_predictions(
    db: Session = Depends(get_db)
):

    predictions = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return [
        {
            "id": prediction.id,
            "image_path": prediction.image_path,
            "prediction": prediction.prediction,
            "confidence": prediction.confidence,
            "created_at": prediction.created_at
        }
        for prediction in predictions
    ]