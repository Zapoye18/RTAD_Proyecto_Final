const Employee = require("../models/employee.model");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee || employee.password !== password) {
      return res.status(401).json({ mensaje: "Usuario o contraseña inválidos ❌" });
    }
    res.json({ mensaje: "Bienvenido " + employee.username + " ✅" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
