import os
import sys

# Supaya Python bisa menemukan package app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.prediction_service import predict_image


image_path = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../dataset/test/hama/hama_092.jpeg"
    )
)

result = predict_image(image_path)

print("\n==============================")
print("HASIL PREDIKSI")
print("==============================")
print(f"Gambar     : {image_path}")
print(f"Prediksi   : {result['prediction']}")
print(f"Confidence : {result['confidence']}%")
print("==============================")