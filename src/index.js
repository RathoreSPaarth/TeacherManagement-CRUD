const express = require("express");
const app = express();
const teachers = require("./data.js");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

const getTeachers = function() {
  return teachers;
};

const getTeachersStudents = function(id) {
  return teachers[id].students;
};

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

//GET methods

//Home page using HBS
app.get("/", (req, res) => {
  res.status(200).render("home", {
    layout: "hero.hbs"
  });
});

//GET request to show teachers data on button click
app.get("/teachers", (req, res) => {
  res.status(200).render("teacher", {
    layout: "hero.hbs",
    data: getTeachers()
  });
});

//GET request for students to appear when teacher's name is clicked

app.get("/teachers/:id", (req, res) => {
  const id = req.params.id;
  const teacherId = parseInt(id);
  const requiredTeacher = teachers.find(each => each.id == teacherId);

  if (requiredTeacher) {
    res.status(200).render("students", {
      layout: "hero",
      data: getTeachersStudents(teacherId),
      searchid: teacherId
    });
  } else {
    res.status(200).render("addStudentsToNewTeacher", {
      layout: "hero.hbs",
      searchid: teacherId
    });
  }
});

app.get("/teachers/:tid/students/:sid", (req, res) => {
  const tid = req.params.tid;
  const sid = req.params.sid;
  const teacherId = parseInt(tid);
  const studentId = parseInt(sid);

  const requiredTeacher = teachers.find(each => each.id === teacherId);

  if (requiredTeacher) {
    res.status(200).json({ data: requiredTeacher.students[studentId] });
  } else {
    res.status(400).send("unavailable");
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

app.put("/add-teachers/:tid", (req, res) => {
  const tid = req.params.tid;

  const teachersId = parseInt(tid);
  let requiredTeachersIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].id == teachersId) {
      requiredTeachersIndex = i;
      break;
    }
  }
  if (requiredTeachersIndex != undefined) {
    const originalTeacher = teachers[requiredTeachersIndex];
    const newTeacher = {
      ...originalTeacher,
      ...req.body
    };
    teachers.splice(requiredTeachersIndex, 1, newTeacher);
    res.status(200).render("teacher", {
      layout: "hero.hbs",
      data: getTeachers()
    });
  } else {
    res.status(400).send("Invalid Teacher");
  }
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

app.post("/teachers", (req, res) => {
  let students = [];
  let id = teachers.length;
  if (req.body.firstName && req.body.age) {
    teachers.push({
      id,
      ...req.body
    });
    teachers[teachers.length - 1].students = [];
    res.status(200).render("teacher", {
      layout: "hero.hbs",
      data: getTeachers()
    });
  } else {
    res.status(400).send("Invalid Teacher");
  }
});

//DELETE method

app.delete("/teachers/:id", (req, res) => {
  const id = req.params.id;
  const teacherId = parseInt(id);

  let requiredTeacherIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].id === teacherId) {
      requiredTeacherIndex = i;
      break;
    }
  }

  if (requiredTeacherIndex != undefined) {
    teachers.splice(requiredTeacherIndex, 1);
    res.status(200).render("teacher", {
      layout: "hero.hbs",
      data: getTeachers()
    });
  } else {
    res.status(400).send("Teacher unavailable");
  }
});

// PUT METHODS

app.put("/add-students/:tid", (req, res) => {
  const tid = req.params.tid;
  const teachersId = parseInt(tid);

  let requiredTeachersIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].id == teachersId) {
      requiredTeachersIndex = i;
      break;
    }
  }

  if (requiredTeachersIndex != undefined) {
    teachers[requiredTeachersIndex].students.push(req.body.name);
    res.status(200).render("students.hbs", {
      layout: "hero",
      data: getTeachersStudents(requiredTeachersIndex),
      searchid: requiredTeachersIndex
    });
  } else {
    res.status(400).send("Invalid");
  }
});

app.put("/teachers:id", (req, res) => {
  const tid = req.params.id;
  const teachersId = parseInt(tid);
  let requiredTeachersIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].id === teachersId) {
      requiredTeachersIndex = i;
      break;
    }
  }
  if (requiredTeachersIndex != undefined) {
    const originalTeacher = teachers[requiredTeachersIndex];
    const newTeacher = {
      ...originalTeacher,
      ...req.body
    };
    teachers.splice(requiredTeachersIndex, 1, newTeacher);
    res.status(200).json({
      message: "Teacher details updated!",
      data: newTeacher
    });
  } else {
    res.status(400).send("Invalid Teacher");
  }
});

app.listen(5000);
