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
  .connect("mongodb://localhost:27017/Usuario")
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
    });
    await nuevoUsuario.save();
    res.status(201).send("usuario registrado");
  } catch (error) {
    res.status(400).send("error en el registro" + error.message);
  }
});
app.post('./login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        const usuario = await Usuario.findOne({email});
        if (!usuario) return res.status(400).send('Usuario no encontrado');
        const passwordCorrecta = await bcrypt.compare(password,usuario.password);
        if(!passwordCorrecta) return res.status(400).send('contrasena incorrecta');//no es recomendable avisar si la contra o elusuario es incorrecto, solo con fine academicos
        const token = jwt.sign({id:usuario._id},SECRET_KEY,{expireIn:'1h'});
        re.status(200).json({token})// estamos cacturando el token aqui pero en otros casos lo deberiamos guardar enotro lugar seguro
    } catch (error) {
        res.status(500).send('Error al inicio de sesion'+error.message);
    }
})