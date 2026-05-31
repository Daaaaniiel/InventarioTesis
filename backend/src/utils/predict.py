import sys
import json
import joblib
import pandas as pd

# =========================
# CARGAR MODELOS Y ENCODERS
# =========================
modelo_ventas = joblib.load("src/models/modelo_ventas.pkl")
modelo_demanda = joblib.load("src/models/modelo_demanda.pkl")
encoders = joblib.load("src/models/encoders.pkl")

# =========================
# INPUT
# =========================
input_data = json.loads(sys.argv[1])

# =========================
# ENCODIFICAR CON LOS MISMOS ENCODERS DEL ENTRENAMIENTO
# =========================
columnas_categoricas = [
    "Ship Mode", "Segment", "City", "State",
    "Region", "Category", "Sub-Category"
]

for col in columnas_categoricas:
    valor = input_data[col]
    input_data[col] = encoders[col].transform([valor])[0]

# =========================
# DATAFRAME CON EL ORDEN EXACTO DEL ENTRENAMIENTO
# =========================
data = pd.DataFrame([{
    "Ship Mode":     input_data["Ship Mode"],
    "Segment":       input_data["Segment"],
    "City":          input_data["City"],
    "State":         input_data["State"],
    "Region":        input_data["Region"],
    "Category":      input_data["Category"],
    "Sub-Category":  input_data["Sub-Category"],
    "Discount":      input_data["Discount"],
    "Year":          input_data["Year"],
    "Month":         input_data["Month"],
    "Day":           input_data["Day"],
    "WeekDay":       input_data["WeekDay"],
    "Weekend":       input_data["Weekend"],
    "Shipping Days": input_data["Shipping Days"]
}])

# =========================
# PREDICCIONES
# =========================
ventas = modelo_ventas.predict(data)[0]
demanda = modelo_demanda.predict(data)[0]

# =========================
# RESPUESTA
# =========================
resultado = {
    "ventas_predichas": round(float(ventas), 2),
    "demanda_predicha": round(float(demanda), 2)
}

print(json.dumps(resultado))