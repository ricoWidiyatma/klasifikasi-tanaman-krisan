import os
import numpy as np
import tensorflow as tf

from io import BytesIO
from PIL import Image


# =========================
# CONFIG
# =========================

IMG_SIZE = (224, 224)

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../../model/model_hama_krisan.keras"
    )
)

CLASS_NAMES = ["hama", "sehat"]


# =========================
# LOAD MODEL
# =========================

model = tf.keras.models.load_model(MODEL_PATH)

print(f"Model berhasil dimuat dari: {MODEL_PATH}")


# =========================
# PREDICTION
# =========================

def predict_image(image_bytes: bytes):

    # Baca gambar dari bytes
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Resize sesuai input model
    image = image.resize(IMG_SIZE)

    # Convert ke numpy
    image_array = np.array(image, dtype=np.float32)

    # Normalisasi sesuai proses training
    image_array = image_array / 255.0

    # Tambahkan batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    # Prediksi
    prediction = model.predict(image_array, verbose=0)

    probability = float(prediction[0][0])

    # Mapping class
    if probability >= 0.5:
        predicted_class = "sehat"
        confidence = probability
    else:
        predicted_class = "hama"
        confidence = 1 - probability

    return {
        "class": predicted_class,
        "confidence": round(confidence * 100, 2)
    }