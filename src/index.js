const express = require("express");
const app = express();
// const teachers = require("./data.js");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
var methodOverride = require("method-override");
const Teacher = require("./models/teacherData.js");
const e = require("express");
const Student = require("./models/studentData.js");
app.use(methodOverride("_method"));

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials")
});

// Let express know to use handlebars
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Home page using HBS
app.get("/", (req, res) => {
  res.status(200).render("home", {
    layout: "hero.hbs"
  });
});

//SQL methods -->

const getAllTeachers = async () => {
  const result = await Teacher.findAll();
  //console.log(JSON.parse(JSON.stringify(result)))
  return JSON.parse(JSON.stringify(result));
};

const getAllStudents = async tid => {
  const result = await Student.findAll({
    where: {
      teacherId: tid
    }
  });
  return JSON.parse(JSON.stringify(result));
};

//GET request to show teachers data on button click
app.get("/teachers", async (req, res) => {
  res.status(200).render("teacher", {
    layout: "hero.hbs",
    data: await getAllTeachers()
  });
});

//GET request for students to appear when teacher's name is clicked

app.get("/teachers/:id", async (req, res) => {
  const id = req.params.id;
  const teacherId = parseInt(id);
  try {
    if (teacherId) {
      res.status(200).render("students", {
        layout: "hero",
        data: await getAllStudents(teacherId),
        searchid: teacherId
      });
    } else {
      res.status(200).render("addStudentsToNewTeacher", {
        layout: "hero.hbs",
        searchid: teacherId
      });
    }
  } catch (e) {
    res.status(404).send("Student data not found!");
  }
});

//add-teachers button
app.get("/add-teachers", (req, res) => {
  res.status(200).render("addTeachers", {
    layout: "hero.hbs"
  });
});

//edit-teachers button
app.get("/add-teachers/:tid", (req, res) => {
  let tid = req.params.tid;
  tid = parseInt(tid);
  res.status(200).render("editTeachers", {
    layout: "hero.hbs",
    searchid: tid
  });
});

//add-students button

app.get("/add-students/:tid", (req, res) => {
  const tid = req.params.tid;
  const teachersId = parseInt(tid);
  res.status(200).render("addStudent", {
    layout: "hero.hbs",
    searchid: teachersId
  });
});

//POST methods adds teachers

app.post("/teachers", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.firstName && req.body.email) {
      const rr = await Teacher.create(req.body);
      res.status(200).render("teacher", {
        layout: "hero.hbs",
        data: await getAllTeachers()
      });
    } else {
      res.status(400).send("Invalid Teacher");
    }
  } catch (e) {
    console.log("error: " + e);
  }
});

app.post("/add-students/:tid", async (req, res) => {
  const tid = req.params.tid;
  const teachersId = parseInt(tid);
  console.log(req.body);
  if (req.body) {
    req.body.teacherId = teachersId;
    const rr = await Student.create(req.body);
    res.status(200).render("students.hbs", {
      layout: "hero",
      data: await getAllStudents(teachersId),
      searchid: teachersId
    });
  } else {
    res.status(400).send("Invalid");
  }
});

//DELETE method To delete teachers

app.delete("/teachers/:id", async (req, res) => {
  const id = req.params.id;
  const teacherId = parseInt(id);

  const validTeacher = await Teacher.findByPk(teacherId);
  if (validTeacher) {
    await validTeacher.destroy();
    res.status(200).render("teacher", {
      layout: "hero.hbs",
      data: await getAllTeachers()
    });
  } else {
    res.status(400).send("Teacher unavailable");
  }
});

// PUT METHODS

//edit teachers

app.put("/add-teachers/:tid", async (req, res) => {
  try {
    const tid = req.params.tid;

    const teachersId = parseInt(tid);

    const result = await Teacher.update(req.body, {
      where: {
        id: teachersId
      }
    });

    if (result.length) {
      res.status(200).render("teacher", {
        layout: "hero.hbs",
        data: await getAllTeachers()
      });
    } else {
      res.status(400).send("Invalid Teacher");
    }
  } catch (e) {
    console.log(e);
  }
});

app.listen(5000);

//PUT method to add students

// app.put("/add-students/:tid", (req, res) => {
//   const tid = req.params.tid;
//   const teachersId = parseInt(tid);

//   let requiredTeachersIndex;
//   for (let i = 0; i < teachers.length; i++) {
//     if (teachers[i].id == teachersId) {
//       requiredTeachersIndex = i;
//       break;
//     }
//   }

//   if (requiredTeachersIndex != undefined) {
//     teachers[requiredTeachersIndex].students.push(req.body.name);
//     res.status(200).render("students.hbs", {
//       layout: "hero",
//       data: getTeachersStudents(requiredTeachersIndex),
//       searchid: requiredTeachersIndex
//     });
//   } else {
//     res.status(400).send("Invalid");
//   }
// });
// app.get("/teachers/:tid/students/:sid", (req, res) => {
//   const tid = req.params.tid;
//   const sid = req.params.sid;
//   const teacherId = parseInt(tid);
//   const studentId = parseInt(sid);

//   const requiredTeacher = teachers.find(each => each.id === teacherId);

//   if (requiredTeacher) {
//     res.status(200).json({ data: requiredTeacher.students[studentId] });
//   } else {
//     res.status(400).send("unavailable");
//   }
// });
