const studentController = require("../controllers").student;
const adminController = require("../controllers").admin;
const questionController = require("../controllers").question;
const timerController = require("../controllers").timer;
const examsController = require("../controllers").exams;

module.exports = (app) => {
  app.get("/api/", (req, res) =>
    res.status(200).send({
      errored: false,
      message: {},
    })
  );
  // ###################################################
  // #           Student/Students endpoints            #
  // #       (Actions by teachers/principal)           #
  // ###################################################
  app.get("/api/v1/student/:id?", studentController.getsingle);
  app.post("/api/v1/student/", studentController.single);
  app.put("/api/v1/student/:id", studentController.update);
  app.delete("/api/v1/student/:id?", studentController.remove);
  app.get("/api/v1/students/", studentController.getmultiple);
  app.get("/api/v1/students/search", studentController.search); // search students by name
  app.get("/api/v1/students/count", studentController.count);
  app.post("/api/v1/students/", studentController.bulk);
  // ###################################################
  // #           Admin endpoints                       #
  // #         (Staff management)                      #
  // ###################################################
  app.get("/api/v1/me", adminController.self);
  app.get("/api/v1/classes", adminController.getclasses);
  app.get("/api/v1/teacher/:id?", adminController.getsingle);
  app.post("/api/v1/teacher/", adminController.single);
  app.put("/api/v1/teacher/:id?", adminController.update);
  app.delete("/api/v1/teacher/:id?", adminController.remove);
  app.get("/api/v1/teachers/", adminController.getmultiple); // changed to GET for listing/search
  app.get("/api/v1/teachers/count", adminController.countTeachers); // count teachers
  app.post("/api/v1/teachers/bulk", adminController.bulk); // bulk upload of teachers now on /bulk
  app.put("/api/v1/super/", adminController.changeSuperAdminData);
  // ###################################################
  // #           Admin endpoints                       #
  // #         (Login and logout)                      #
  // ###################################################
  app.post("/api/v1/teacher/login/", adminController.login);
  app.post("/api/v1/teacher/logout/", adminController.logout);
  // ###################################################
  // #           Question endpoints                    #
  // #          (By teachers and principal)            #
  // ###################################################
  app.get("/api/v1/question/:id?", questionController.getsingle);
  app.post("/api/v1/question/", questionController.single);
  app.put("/api/v1/question/:id?", questionController.update);
  app.delete("/api/v1/question/:id?", questionController.remove);
  app.get("/api/v1/questions/", questionController.getmultiple);
  app.post("/api/v1/questions/", questionController.bulk);
  // ###################################################
  // #                Timer endpoints                  #
  // #              (By principals only)               #
  // ###################################################
  app.get("/api/v1/timers/", timerController.get);
  app.post("/api/v1/timer/", timerController.add);
  app.delete("/api/v1/timer/:id?", timerController.remove);
  // ###################################################
  // #              Exams endpoints                    #
  // #             (By students only)                  #
  // ###################################################
  app.post("/api/v1/exams/login", examsController.login);
  app.get("/api/v1/exams/student/", examsController.self);
  app.get("/api/v1/exams/subjects/", examsController.subjects);
  app.get("/api/v1/exams/questions/", examsController.questions);
  app.get("/api/v1/exams/results", examsController.results);
  app.post("/api/v1/exams/results/:ans?", examsController.submitAnswer);
  // requries admin access -- add/remove students to take exams
  app.post("/api/v1/exams/students", examsController.addStudents); // get all results for a class (admin only)
  app.get("/api/v1/exams/results/class/:class", examsController.classResults); // -- list questions for that subject, student info, list of subjects due
};
