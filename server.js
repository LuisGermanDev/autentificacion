requiredPaths("doteenv").confit();
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

//mongoDB

mongoose
  .connect("")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error al conectar en mongoDB", error));

//rutas
app.post("/regiter", async (req, res) => {
  try {
    const { nombre, email, password, dirreciones } = req.body;
    if (!password) {
      return res.status(400).sed("Password Obligatorio");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      dirreciones,
    })
    await nuevoUsuario.save();
    res.status(201).send("usuario registrado");
  } catch (error) {
    res.status(400).send("error en el registro" + error.message);
  }
});
