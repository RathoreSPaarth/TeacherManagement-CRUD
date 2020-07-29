const { DataTypes } = require("sequelize");
const teacherDB = require("../config/teacherDB");
const Teacher = require("./teacherData");

const Student = teacherDB.define("student", {
  serial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "student_name"
  }
});

Student.belongsTo(Teacher);

module.exports = Student;
