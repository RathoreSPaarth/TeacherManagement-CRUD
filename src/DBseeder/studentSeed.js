const Student = require("../models/studentData");

const newStudent = [
  {
    studentName: "Paarth",
    teacherId: 1
  }
];

const studentSeeder = async () => {
  await Student.sync({ force: true });
  newStudent.forEach(async student => {
    try {
      const result = await Student.create(student);
      console.log(result.get());
    } catch (e) {
      console.error(e);
    }
  });
};

studentSeeder();
