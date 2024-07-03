import db from "../db.js";
import ExcelJS from 'exceljs';

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
  branches.fk_instructorID as instructorID,
  branches.fk_educationID,
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


//! DERS TAKVİMİ GÜNCELLE
export const updateCourseCalendar = (req, res) => {
  const courseCalendarId = req.params.id;
  const { fk_classroomID, courseDay, startTime, endTime } = req.body;
  const q = "UPDATE courseCalendar SET fk_classroomID = ?, courseDay = ?, startTime = ?, endTime = ? WHERE `courseCalendarID` = ?";
  db.query(q, [fk_classroomID, courseDay, startTime, endTime, courseCalendarId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Ders Takvimi güncellendi.");
  });
};


//! EXCEL ÇIKTI
export const exportExcel = async (req, res) => {
  const educationID = req.params.educationID;
  try {
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
        branches.fk_instructorID as instructorID,
        branches.fk_educationID,
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
      WHERE 
        branches.fk_educationID = ?
    `;
    db.query(q, [educationID], (err, schedule) => {
      if (err) {
        console.error('Veritabanından veri çekerken bir hata oluştu:', err);
        return res.status(500).json({ message: 'Veritabanından veri çekerken bir hata oluştu' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ders Programı');

      // Verileri Excel dosyasına ekleme
      worksheet.columns = [
        { header: 'Ders Adı', key: 'courseName', width: 20 },
        { header: 'Öğretim Görevlisi', key: 'instructorName', width: 20 },
        { header: 'Derslik', key: 'classroomName', width: 20 },
        { header: 'Gün', key: 'courseDay', width: 10 },
        { header: 'Başlangıç Saati', key: 'startTime', width: 15 },
        { header: 'Bitiş Saati', key: 'endTime', width: 15 },
      ];

      schedule.forEach(item => {
        worksheet.addRow({
          courseName: item.courseName,
          instructorName: item.instructorName,
          classroomName: item.classroomName,
          courseDay: item.courseDay,
          startTime: item.startTime,
          endTime: item.endTime,
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=ders_programi.xlsx');

      workbook.xlsx.write(res)
        .then(() => {
          res.end();
        })
        .catch(error => {
          console.error('Excel dosyası oluşturulurken bir hata oluştu:', error);
          res.status(500).json({ message: 'Excel dosyası oluşturulurken bir hata oluştu' });
        });
    });
  } catch (error) {
    console.error('Excel dosyası oluşturulurken bir hata oluştu:', error);
    res.status(500).json({ message: 'Excel dosyası oluşturulurken bir hata oluştu' });
  }
};