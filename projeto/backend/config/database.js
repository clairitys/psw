
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Falha ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectMongo };