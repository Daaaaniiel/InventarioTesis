import { PythonShell } from "python-shell";

export const predecirIA = async (req, res) => {

  try {

    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: "./src/utils",
      args: [JSON.stringify(req.body)]
    };

    const results = await PythonShell.run(
      "predict.py",
      options
    );

    const resultado = JSON.parse(results[0]);

    res.json(resultado);

  } catch (error) {

    console.error("Error IA:", error.message);

    res.status(500).json({
      message: "Error en predicción IA",
      detalle: error.message
    });
  }
};