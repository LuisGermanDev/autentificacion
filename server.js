require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Usuario = require("./models/Usuario");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/UsuarioDB")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error al conectar en MongoDB:", error));

// Rutas
app.post("/register", async (req, res) => { 
  try {
    const { nombre, email, password, direcciones } = req.body; 
    if (!password) {
      return res.status(400).send("Password Obligatorio");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      direcciones, 
    });
    await nuevoUsuario.save();
    res.status(201).send("Usuario registrado");
  } catch (error) {
    res.status(400).send("Error en el registro: " + error.message);
  }
});

app.post("/login", async (req, res) => { 
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).send("Usuario no encontrado");
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(400).send("Contraseña incorrecta");
    
    const token = jwt.sign({ id: usuario._id }, SECRET_KEY, { expiresIn: '1h' }); 
    res.status(200).json({ token }); 
  } catch (error) {
    res.status(500).send("Error al iniciar sesión: " + error.message);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
