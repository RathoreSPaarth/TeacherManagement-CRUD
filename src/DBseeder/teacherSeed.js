const Teacher = require("../models/teacherData");

const newTeacher = [
  {
    id: 0,
    firstName: "Ankur",
    lastName: "Narayan",
    email: "ankur@gmail.com",
    age: 25,
    class: 5,
    students: ["shubham", "varun", "mathews", "sunil", "test case"]
  },
  {
    id: 1,
    firstName: "Raman",
    lastName: "Negi",
    email: "negir@gmail.com",
    age: 35,
    class: 3,
    students: ["shubh", "arun", "mathews", "sunil pal"]
  },
  {
    id: 2,
    firstName: "Swati",
    lastName: "Narayan",
    email: "swati@gmail.com",
    age: 20,
    class: 1,
    students: ["shubham", "varun", "mathews", "sunil"]
  },
  {
    id: 3,
    firstName: "Ankit",
    lastName: "chauhan",
    email: "ankit@gmail.com",
    age: 25,
    class: 5,
    students: ["ashish", "vaibhav", "matt", "sunny"]
  }
];

const teacherSeeder = async () => {
  await Teacher.sync({ force: true });
  newTeacher.forEach(async teachers => {
    try {
      const result = await Teacher.create(teachers);
      console.log(result.get());
    } catch (e) {
      console.error(e);
    }
  });
};

teacherSeeder();
