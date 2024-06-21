import db from "../db.js";
import ExcelJS from 'exceljs';

export const getExamCalendar = (req, res) => {
  const q = `
        SELECT 
          examcalendar.examCalendarID,
          examcalendar.fk_semesterID,
          examcalendar.fk_branchID,
          examcalendar.fk_invigilatorID,
          examcalendar.examDate,
          examcalendar.startTime,
          branches.branchName,
          branches.fk_instructorID as instructorID,
          branches.fk_educationID,
          courses.courseName,
          courses.courseCode,
          courses.gradeLevel,
          CONCAT(instructors.academicTitle, ' ', instructors.instructorFirstName, ' ', instructors.instructorLastName) AS instructorName,
          CONCAT(invigilators.invigilatorFirstName, ' ', invigilators.invigilatorLastName) AS invigilatorName
        FROM 
          examcalendar
        JOIN 
          branches ON examcalendar.fk_branchID = branches.branchID
        JOIN 
          courses ON branches.fk_courseID = courses.courseID
        JOIN 
          instructors ON branches.fk_instructorID = instructors.instructorID
        JOIN 
          invigilators ON examcalendar.fk_invigilatorID = invigilators.invigilatorID
    `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    // Her bir sınav için derslikleri al
    const promises = data.map(exam => {
      return new Promise((resolve, reject) => {
        const q2 = "SELECT classrooms.classroomName FROM examClassrooms JOIN classrooms ON examClassrooms.fk_classroomID = classrooms.classroomID WHERE examClassrooms.fk_examCalendarID = ?";
        db.query(q2, [exam.examCalendarID], (err2, data2) => {
          if (err2) {
            reject(err2);
          } else {
            // Derslik isimlerini sınav verisine ekle
            exam.classroomNames = data2.map(row => row.classroomName);
            resolve();
          }
        });
      });
    });

    // Tüm derslik sorguları tamamlandığında, sonuçları döndür
    Promise.all(promises)
      .then(() => res.json(data))
      .catch(err => res.status(500).json(err));
  });
};



//! SINAV TAKVİMİ EKLE
export const addExamCalendar = (req, res) => {
  const { fk_semesterID, fk_branchID, fk_classroomIDs, fk_invigilatorID, examDate, startTime } = req.body;

  if (!fk_semesterID || !fk_branchID || !fk_classroomIDs || !fk_invigilatorID || !examDate || !startTime) {
    return res.status(400).json({ message: "Eksik veya hatalı veri gönderildi." });
  }

  // Aynı gün ve saatte aynı gözetmen üyeye sınav vermeme kontrolü.
  const qCheck = "SELECT * FROM examCalendar WHERE fk_invigilatorID = ? AND examDate = ? AND startTime = ?";
  db.query(qCheck, [fk_invigilatorID, examDate, startTime], (errCheck, dataCheck) => {
    if (errCheck) {
      console.error("Veritabanında kontrol sırasında hata:", errCheck);
      return res.status(500).json({ message: "Veritabanında kontrol sırasında hata oluştu." });
    }

    if (dataCheck.length > 0) {
      return res.status(400).json({ message: "Gözetmen üye aynı gün ve saatte başka bir sınavda görevli." });
    }

    // Aynı gün ve saatte aynı dersliklerin kullanılıp kullanılmadığını kontrol et
    const qCheckClassroom = `
      SELECT examCalendar.examCalendarID 
      FROM examCalendar 
      JOIN examClassrooms ON examCalendar.examCalendarID = examClassrooms.fk_examCalendarID 
      WHERE examCalendar.examDate = ? AND examCalendar.startTime = ? AND examClassrooms.fk_classroomID IN (?)`;
    db.query(qCheckClassroom, [examDate, startTime, fk_classroomIDs], (errCheckClassroom, dataCheckClassroom) => {
      if (errCheckClassroom) {
        console.error("Veritabanında kontrol sırasında hata:", errCheckClassroom);
        return res.status(500).json({ message: "Veritabanında kontrol sırasında hata oluştu." });
      }

      if (dataCheckClassroom.length > 0) {
        return res.status(400).json({ message: "Bu derslik(ler) aynı gün ve saatte başka bir sınavda kullanılıyor." });
      }

      // Aynı gün ve saatte aynı şubenin sınavının olup olmadığını kontrol et
      const qCheckBranch = "SELECT * FROM examCalendar WHERE fk_branchID = ? AND examDate = ? AND startTime = ?";
      db.query(qCheckBranch, [fk_branchID, examDate, startTime], (errCheckBranch, dataCheckBranch) => {
        if (errCheckBranch) {
          console.error("Veritabanında kontrol sırasında hata:", errCheckBranch);
          return res.status(500).json({ message: "Veritabanında kontrol sırasında hata oluştu." });
        }

        if (dataCheckBranch.length > 0) {
          return res.status(400).json({ message: "Bu şubenin aynı gün ve saatte başka bir sınavı mevcut" });
        }

        // Sınavı ekle
        const q = "INSERT INTO examCalendar (fk_semesterID, fk_branchID, fk_invigilatorID, examDate, startTime) VALUES (?, ?, ?, ?, ?)";
        db.query(q, [fk_semesterID, fk_branchID, fk_invigilatorID, examDate, startTime], (err, data) => {
          if (err) {
            console.error("Veritabanına ekleme sırasında hata:", err);
            return res.status(500).json({ message: "Veritabanına ekleme sırasında hata oluştu." });
          }

          const examCalendarID = data.insertId;
          fk_classroomIDs.forEach((classroomID) => {
            const q2 = "INSERT INTO examClassrooms (fk_classroomID, fk_examCalendarID) VALUES (?, ?)";
            db.query(q2, [classroomID, examCalendarID], (err2, data2) => {
              if (err2) {
                console.error("Tabloya ekleme sırasında hata:", err2);
                return res.status(500).json({ message: "Tabloya ekleme sırasında hata oluştu." });
              }
            });
          });

          return res.json("Sınav takvimi ve derslikler başarıyla eklendi.");
        });
      });
    });
  });
};



//! SINAV TAKVİMİ SİL;
export const deleteExamCalendar = (req, res) => {
  const examCalendarId = req.params.id;

  // Önce EXAMCLASSROOMS tablosundaki ilgili girişleri sil
  const q1 = "DELETE FROM examClassrooms WHERE fk_examCalendarID = ?";
  db.query(q1, [examCalendarId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Ardından examCalendar tablosundaki ilgili girişi sil
    const q2 = "DELETE FROM examCalendar WHERE examCalendarID = ?";
    db.query(q2, [examCalendarId], (err2, data2) => {
      if (err2) return res.status(500).json(err2);
      return res.json("Sınav Takvimi Silindi");
    });
  });
};


//! SINAV TAKVİMİ GÜNCELLE
export const updateExamCalendar = (req, res) => {
  const examCalendarId = req.params.id;
  const { fk_classroomIDs, examDate, startTime, fk_invigilatorID } = req.body;

  if (!fk_classroomIDs || !examDate || !startTime || !fk_invigilatorID) {
    return res.status(400).json({ message: "Eksik veya hatalı veri gönderildi." });
  }

  // Aynı gün ve saatte başka bir sınavın olup olmadığını kontrol et
  const qCheck = "SELECT * FROM examCalendar WHERE fk_invigilatorID = ? AND examDate = ? AND startTime = ? AND examCalendarID != ?";
  db.query(qCheck, [fk_invigilatorID, examDate, startTime, examCalendarId], (errCheck, dataCheck) => {
    if (errCheck) {
      console.error("Veritabanında kontrol sırasında hata:", errCheck);
      return res.status(500).json({ message: "Veritabanında kontrol sırasında hata oluştu." });
    }

    if (dataCheck.length > 0) {
      return res.status(400).json({ message: "Gözetmen üye aynı gün ve saatte başka bir sınavda görevli." });
    }

    // Aynı gün ve saatte aynı dersliklerin kullanılıp kullanılmadığını kontrol et
    const qCheckClassroom = `
      SELECT examCalendar.examCalendarID 
      FROM examCalendar 
      JOIN examClassrooms ON examCalendar.examCalendarID = examClassrooms.fk_examCalendarID 
      WHERE examCalendar.examDate = ? AND examCalendar.startTime = ? AND examClassrooms.fk_classroomID IN (?) AND examCalendar.examCalendarID != ?`;
    db.query(qCheckClassroom, [examDate, startTime, fk_classroomIDs, examCalendarId], (errCheckClassroom, dataCheckClassroom) => {
      if (errCheckClassroom) {
        console.error("Veritabanında kontrol sırasında hata:", errCheckClassroom);
        return res.status(500).json({ message: "Veritabanında kontrol sırasında hata oluştu." });
      }

      if (dataCheckClassroom.length > 0) {
        return res.status(400).json({ message: "Bu derslik(ler) aynı gün ve saatte başka bir sınavda kullanılıyor." });
      }

      // Sınavı güncelle
      const q = "UPDATE examCalendar SET examDate = ?, startTime = ?, fk_invigilatorID = ? WHERE `examCalendarID` = ?";
      db.query(q, [examDate, startTime, fk_invigilatorID, examCalendarId], (err, data) => {
        if (err) {
          console.error("Error during update:", err);
          return res.status(500).json({ message: "Veritabanı güncelleme sırasında hata oluştu." });
        }

        const q2 = "DELETE FROM examClassrooms WHERE fk_examCalendarID = ?";
        db.query(q2, [examCalendarId], (err2, data2) => {
          if (err2) {
            console.error("Error during examClassrooms deletion:", err2);
            return res.status(500).json({ message: "Sınav dersliklerini silme sırasında hata oluştu." });
          }

          fk_classroomIDs.forEach((classroomID) => {
            const q3 = "INSERT INTO examClassrooms (fk_classroomID, fk_examCalendarID) VALUES (?, ?)";
            db.query(q3, [classroomID, examCalendarId], (err3, data3) => {
              if (err3) {
                console.error("Tabloya ekleme sırasında hata:", err3);
                return res.status(500).json({ message: "Tabloya ekleme sırasında hata oluştu." });
              }
            });
          });

          return res.json("Sınav takvimi güncellendi ve derslikler başarıyla güncellendi.");
        });
      });
    });
  });
};




