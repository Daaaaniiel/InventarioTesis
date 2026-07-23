import sys
import json
import joblib
import pandas as pd

# =========================
# CARGAR MODELOS Y ENCODERS
# =========================
modelo_ventas  = joblib.load("src/models/modelo_ventas.pkl")
modelo_demanda = joblib.load("src/models/modelo_demanda.pkl")
encoders       = joblib.load("src/models/encoders.pkl")

# =========================
# INPUT
# =========================
input_data = json.loads(sys.argv[1])

# DEBUG — muestra qué llega exactamente (quitar una vez funcione)
print("KEYS RECIBIDAS:", list(input_data.keys()), file=sys.stderr)

# =========================
# CODIFICAR VARIABLES CATEGÓRICAS
# =========================
columnas_categoricas = ["Sub-Category", "Region"]

for col in columnas_categoricas:
    valor = input_data.get(col, "")
    le = encoders[col]
    if valor in le.classes_:
        input_data[col + "_enc"] = int(le.transform([valor])[0])
    else:
        input_data[col + "_enc"] = int(le.transform([le.classes_[0]])[0])

# =========================
# DATAFRAME CON .get() PARA EVITAR KeyError
# =========================
data = pd.DataFrame([{
    "Sub-Category_enc":   input_data.get("Sub-Category_enc", 0),
    "Region_enc":         input_data.get("Region_enc", 0),
    "Year":               input_data.get("Year", 2024),
    "Month":              input_data.get("Month", 1),
    "Quantity_Lag1":      input_data.get("Quantity_Lag1", 0),
    "Quantity_RollMean3": input_data.get("Quantity_RollMean3", 0),
    "Sales_Lag1":         input_data.get("Sales_Lag1", 0),
    "Sales_RollMean3":    input_data.get("Sales_RollMean3", 0),
    "Discount":           input_data.get("Discount", 0),
}])

# =========================
# PREDICCIONES
# =========================
ventas  = modelo_ventas.predict(data)[0]
demanda = modelo_demanda.predict(data)[0]

# =========================
# RESPUESTA
# =========================
resultado = {
    "ventas_predichas": round(float(ventas), 2),
    "demanda_predicha":  round(float(demanda), 2)
}

print(json.dumps(resultado))