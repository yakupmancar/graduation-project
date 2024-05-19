import db from "../db.js";

export const getCourseCalendar = (req, res) => {
  const q = `
    SELECT 
      coursecalendar.courseCalendarID,
      coursecalendar.fk_semesterID,
      coursecalendar.fk_branchID,
      coursecalendar.fk_classroomID,
      coursecalendar.courseDay,
      coursecalendar.startTime,
      coursecalendar.endTime,
      branches.branchName,
      courses.courseName,
      courses.gradeLevel,
      classrooms.classroomName,
      CONCAT(instructors.instructorFirstName, ' ', instructors.instructorLastName) AS instructorName
    FROM 
      coursecalendar
    JOIN 
      branches ON coursecalendar.fk_branchID = branches.branchID
    JOIN 
      courses ON branches.fk_courseID = courses.courseID
    JOIN 
      classrooms ON coursecalendar.fk_classroomID = classrooms.classroomID
    JOIN 
      instructors ON branches.fk_instructorID = instructors.instructorID
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

//! DERS TAKVİMİ EKLE
export const addCourseCalendar = (req, res) => {
  const { fk_semesterID, fk_branchID, fk_classroomID, courseDay, startTime, endTime } = req.body;

  if (!fk_semesterID || !fk_branchID || !fk_classroomID || !courseDay || !startTime || !endTime) {
    return res.status(400).json({ message: "Eksik veya hatalı veri gönderildi." });
  }

  const q = "INSERT INTO courseCalendar (fk_semesterID, fk_branchID, fk_classroomID, courseDay, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(q, [fk_semesterID, fk_branchID, fk_classroomID, courseDay, startTime, endTime], (err, data) => {
    if (err) {
      console.error("Veritabanına ekleme sırasında hata:", err);
      return res.status(500).json({ message: "Veritabanına ekleme sırasında hata oluştu." });
    }
    return res.json("Ders takvimi eklendi.");
  });
};


//! DERS TAKVİMİ SİL;
export const deleteCourseCalendar = (req, res) => {
  const courseCalendarId = req.params.id;
  const q = "DELETE FROM courseCalendar WHERE `courseCalendarID` = ?";
  db.query(q, [courseCalendarId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Ders Takvimi Silindi");
  });
};