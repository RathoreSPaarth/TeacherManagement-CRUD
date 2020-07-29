const { DataTypes } = require("sequelize");
const teacherDB = require("../config/teacherDB");

const Teacher = teacherDB.define("teacher", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name"
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "last_name"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "email"
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "age"
  },
  class: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "class"
  },
  studentsArray: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    field: "students"
  }
});

module.exports = Teacher;
