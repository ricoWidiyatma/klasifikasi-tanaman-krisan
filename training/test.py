import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import time

# ==========================
# LOAD MODEL
# ==========================
model = tf.keras.models.load_model("model_hama_krisan.keras")

# ==========================
# NAMA KELAS
# Urutannya HARUS sama dengan saat training
# ==========================
class_names = [
    "Hama",
    "Sehat"
]

# ==========================
# GAMBAR YANG AKAN DIUJI
# ==========================
img_path = "dataset/test/Hama/hama_095.jpeg"

img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

# ==========================
# PREDIKSI
# ==========================
start = time.time()

prediction = model.predict(img_array, verbose=0)

end = time.time()

score = prediction[0][0]

if score >= 0.5:
    label = class_names[1]      # Sehat
    confidence = score * 100
else:
    label = class_names[0]      # Hama
    confidence = (1 - score) * 100

print("="*40)
print("HASIL KLASIFIKASI")
print("="*40)
print(f"Prediksi   : {label}")
print(f"Confidence : {confidence:.2f}%")
print(f"Waktu      : {(end-start):.4f} detik")
print("="*40)