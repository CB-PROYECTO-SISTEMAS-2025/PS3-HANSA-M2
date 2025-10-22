
import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  try {
    const uri = "mongodb+srv://Daril:7aA8hQlwI7pQW25y@cluster0.b381kks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    console.log("Intentando conectar a:", uri.replace(/\/\/.*@/, "//<hidden>@")); // oculta credenciales en log

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 } as any);
    console.log("✅ Conectado OK a Mongo");
    await mongoose.disconnect();
    console.log("🔌 Desconectado");
  } catch (err: any) {
    console.error("❌ Error conectando a Mongo:", err?.message || err);
  }
})();
