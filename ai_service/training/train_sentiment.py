import pandas as pd
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import re

# --------------------------
# 0️⃣ Initialize global lists
epoch_settings = [10.00,12.00]
final_val_accuracies = [.8245,0.82]
final_val_losses = [0.5678,0.7]

# 1️⃣ Load dataset
df = pd.read_csv('/content/sample_data/datasets/sentiment_dataset.csv')

# 2️⃣ Encode sentiment labels
label_encoder = LabelEncoder()
df['sentiment'] = label_encoder.fit_transform(df['sentiment'])

# 3️⃣ Preprocess text
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.lower().strip()

df['review'] = df['review'].apply(clean_text)

# 4️⃣ Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    df['review'], df['sentiment'], test_size=0.2, random_state=42, stratify=df['sentiment']
)

# 5️⃣ Convert to NumPy arrays for tf.data.Dataset
X_train = X_train.astype(str).to_numpy()
X_test = X_test.astype(str).to_numpy()
y_train = y_train.astype(np.float32).to_numpy()
y_test = y_test.astype(np.float32).to_numpy()

# 6️⃣ Text vectorization
vocab_size = 10000
max_len = 200
vectorizer = layers.TextVectorization(
    max_tokens=vocab_size,
    output_mode='int',
    output_sequence_length=max_len
)
vectorizer.adapt(X_train)

# 7️⃣ Create tf.data.Dataset
batch_size = 32
train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train))
train_ds = train_ds.shuffle(buffer_size=10000).batch(batch_size).prefetch(tf.data.AUTOTUNE)

val_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test))
val_ds = val_ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)

# 8️⃣ Build the model
model = models.Sequential([
    vectorizer,
    layers.Embedding(input_dim=vocab_size, output_dim=200, mask_zero=True),
    layers.Bidirectional(layers.LSTM(64, dropout=0.4, recurrent_dropout=0.3, return_sequences= True)),
    layers.Bidirectional(layers.LSTM(32, dropout=0.4, recurrent_dropout=0.3)),
    layers.Dense(64, activation='relu', kernel_regularizer = tf.keras.regularizers.L2(0.01)),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

# 9️⃣ Compile
optimizer = tf.keras.optimizers.Adam(learning_rate= 1e-4)
model.compile(loss='binary_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# 🔟 Train
model_epochs_size = 20
early_stops = EarlyStopping(monitor='val_loss', patience=2, restore_best_weights=True)

history = model.fit(train_ds, validation_data=val_ds, epochs=model_epochs_size, callbacks=[early_stops])

# 1️⃣1️⃣ Evaluate
loss, accuracy = model.evaluate(val_ds)
print(f"Test Accuracy: {accuracy:.2f}")

# 1️⃣2️⃣ Predict
sample_text = tf.data.Dataset.from_tensor_slices(["This movie was fantastic!"]).batch(1)
prediction = model.predict(sample_text)
print("Positive" if prediction[0][0] > 0.5 else "Negative")

# 1️⃣3️⃣ Append history globally
# final_val_accuracies.extend(history.history['val_accuracy'])
# final_val_losses.extend(history.history['val_loss'])
# epoch_settings.extend(range(1, model_epochs_size + 1))

# # 1️⃣4️⃣ Plot Accuracy
# plt.plot(epoch_settings, final_val_accuracies, marker='o')
# plt.xlabel("Epochs")
# plt.ylabel("Validation Accuracy")
# plt.title("Validation Accuracy vs Epochs")
# plt.grid(True)
# plt.show()

# # 1️⃣5️⃣ Plot Loss
# plt.plot(epoch_settings, final_val_losses, marker='x')
# plt.xlabel("Epochs")
# plt.ylabel("Validation Loss")
# plt.title("Validation Loss vs Epochs")
# plt.grid(True)
# plt.show()

# --------------------------
# 1️⃣6️⃣ Save the trained model for deployment
# This saves: model architecture, weights, optimizer state, AND the vectorizer inside
model.save("sentiment_analysis_model.keras")

# --------------------------
# 1️⃣7️⃣ Save the LabelEncoder (needed to decode labels if multiclass later)
import joblib
joblib.dump(label_encoder, "label_encoder.pkl")

# --------------------------
# 1️⃣8️⃣ Save training history (optional but useful for monitoring)
import json
with open("training_history.json", "w") as f:
    json.dump(history.history, f)

print("✅ Model, label encoder, and training history saved successfully!")