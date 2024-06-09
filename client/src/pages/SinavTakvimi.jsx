import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/exam.css";
import Select from 'react-select';
import { AuthContext } from '../context/authContext';
import Modal from 'react-modal';
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const SinavTakvimi = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [invigilators, setInvigilators] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedInvigilator, setSelectedInvigilator] = useState('');
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [examDate, setExamDate] = useState('');


  // Veri çekme işlemleri
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("http://localhost:8800/sinavTakvimi");
        setExams(res.data);

        const classroomRes = await axios.get('http://localhost:8800/derslikler');
        setClassrooms(classroomRes.data);

        const semesterRes = await axios.get('http://localhost:8800/donemler');
        setSemesters(semesterRes.data);

        const branchRes = await axios.get('http://localhost:8800/subeler');
        setBranches(branchRes.data);

        const invigilatorsRes = await axios.get('http://localhost:8800/gozetmenUyeler');
        setInvigilators(invigilatorsRes.data);

      } catch (error) {
        console.log(error);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      const filtered = exams
        .filter(exam => exam.fk_semesterID === selectedSemester)
        .sort((a, b) => {
          const dateComparison = new Date(a.examDate) - new Date(b.examDate);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // Tarihler eşitse saatleri karşılaştır
          const timeA = a.startTime.split(":");
          const timeB = b.startTime.split(":");
          const hourComparison = parseInt(timeA[0], 10) - parseInt(timeB[0], 10);
          if (hourComparison !== 0) {
            return hourComparison;
          }
          return parseInt(timeA[1], 10) - parseInt(timeB[1], 10);
        });
      setFilteredExams(filtered);
    } else {
      setFilteredExams([]);
    }
  }, [selectedSemester, exams]);




  const semesterOptions = semesters.map((semester) => ({
    value: semester.semesterID,
    label: semester.semesterName,
  }));

  const branchOptions = branches.map((branch) => ({
    value: branch.branchID,
    label: `${branch.branchName} (${branch.courseName} - ${branch.instructorFirstName} ${branch.instructorLastName})`,
  }));

  const classroomOptions = classrooms.map((classroom) => ({
    value: classroom.classroomID,
    label: classroom.classroomName,
  }));

  const invigilatorOptions = invigilators.map((invigilator) => ({
    value: invigilator.invigilatorID,
    label: `${invigilator.invigilatorFirstName} ${invigilator.invigilatorLastName}`
  }));

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  //! EKLEME İŞLEMİ;
  const handleAddExam = async (e) => {
    e.preventDefault();

    if (!selectedSemester || !selectedBranch || !selectedClassrooms.length || !examDate || !startTime || !selectedInvigilator) {
      toast.warning("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const newExamData = {
      fk_semesterID: selectedSemester,
      fk_branchID: selectedBranch,
      fk_classroomIDs: selectedClassrooms,
      examDate: examDate,
      startTime: startTime,
      fk_invigilatorID: selectedInvigilator
    };

    try {
      const response = await axios.post('http://localhost:8800/sinavTakvimi', newExamData);
      if (response.status === 200) {
        toast.success("Sınav başarıyla eklendi!");
        closeModal();
        window.location.reload();
      } else {
        console.error("Sınav eklemede hata oluştu:", response.data);
      }
    } catch (error) {
      console.error("Sınav eklemede hata oluştu:", error);
    }
  };


  //! SİLME İŞLEMİ;
  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Onay',
      message: 'Bu sınavı takvimden silmek istediğinize emin misiniz?',
      buttons: [
        {
          label: 'Evet',
          onClick: async () => {
            try {
              await axios.delete('http://localhost:8800/sinavTakvimi/' + id);
              window.location.reload();
            } catch (error) {
              console.log(error);
            }
          }
        },
        {
          label: 'Hayır',
          onClick: () => { }
        }
      ]
    });
  };


  //! GÜNCELLEME İŞLEMİ;
  const [editExamModalIsOpen, setEditExamModalIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const openEditExamModal = (exam) => {
    const formattedDate = format(new Date(exam.examDate), 'yyyy-MM-dd');
    setSelectedExam({
      ...exam,
      examDate: formattedDate,
    });

    const classroomIDs = exam.classroomNames.map(name => {
      const classroom = classrooms.find(c => c.classroomName === name);
      return classroom ? classroom.classroomID : null;
    });
    setSelectedClassrooms(classroomIDs);
    setSelectedInvigilator(exam.fk_invigilatorID);
    setStartTime(exam.startTime);
    setEditExamModalIsOpen(true);
  };

  const closeEditExamModal = () => {
    setSelectedExam(null);
    setEditExamModalIsOpen(false);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();


    if (!selectedClassrooms.length || !selectedExam?.examDate || !selectedExam?.startTime || !selectedExam?.fk_invigilatorID) {
      toast.warning("Lütfen tüm alanları doldurunuz.");
      return;
    }

    console.log(selectedClassrooms, examDate, startTime, selectedInvigilator);

    const updatedExamData = {
      fk_classroomIDs: selectedClassrooms,
      examDate: selectedExam?.examDate,
      startTime: selectedExam?.startTime,
      fk_invigilatorID: selectedExam?.fk_invigilatorID,
    };


    console.log("Güncellenen sınav verileri:", updatedExamData);

    try {
      const response = await axios.put("http://localhost:8800/sinavTakvimi/" + selectedExam.examCalendarID, updatedExamData);
      if (response.status === 200) {
        console.log("Sınav başarıyla güncellendi!");
        toast.success("Sınav başarıyla güncellendi!");
        closeEditExamModal();
        window.location.reload();
      } else {
        console.error("Sınav güncellemede hata oluştu:", response.data);
      }
    } catch (error) {
      console.error("Sınav güncellemede hata oluştu:", error);
    }
  }


  return (
    <div className='mt-7 exam-container ml-[-10px]'>
      <div className='flex gap-x-10 pb-5'>
        <Select className='border border-gray-400 rounded'
          placeholder="Dönem bilgisi seçiniz..."
          value={semesterOptions.find(option => option.value === selectedSemester)}
          onChange={(selectedOption) => setSelectedSemester(selectedOption.value)}
          options={semesterOptions}
        />

        {currentUser.role === "Admin" && (
          <button onClick={openModal} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Sınav Ekle</button>
        )}

        <button className='flex gap-x-2 items-center border-2 px-2 rounded border-[#A8AEB8] ml-auto mr-10'>
          <i className="fa-solid fa-download"></i>
          <span>Sınav Programını İndir (.xlsx)</span>
        </button>
      </div>

      <table className='exam-table'>
        <thead>
          <tr>
            <th>Ders Kodu</th>
            <th>Ders Adı</th>
            <th>Öğretim Üyesi</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Sınav Yerleri</th>
            <th>Gözetmen Üye</th>
            {currentUser.role == "Admin" && (
              <th>İşlemler</th>
            )}
          </tr>
        </thead>
        <tbody className='text-sm'>
          {filteredExams.map((exam) => (
            <tr key={exam.examCalendarID}>
              <td>{exam.courseCode}</td>
              <td>{exam.courseName}</td>
              <td>{exam.instructorName}</td>
              <td>{format(new Date(exam.examDate), 'dd MMMM yyyy eeee', { locale: tr })}</td>
              <td>{exam.startTime.substring(0, 5)}</td>
              <td>{exam.classroomNames.join(", ")}</td>
              <td>{exam.invigilatorName}</td>
              {currentUser.role == "Admin" && (
                <td>
                  <div className='flex'>
                    <button onClick={() => handleDelete(exam.examCalendarID)} className='pr-4 text-2xl'> <TiDeleteOutline /></button>
                    <button onClick={() => openEditExamModal(exam)} className='text-2xl'> <HiPencilSquare /> </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>


      {/* //! EKLEME MODALI; */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ders Ekle"
        className="shadow-2xl border-2 border-gray-400 modal modal-overlay">
        <h2 className='text-lg font-semibold text-gray-800'>Sınav Ekle</h2>
        <form>
          <button onClick={closeModal} className="close-button"> X </button>
          <div className='flex flex-col gap-y-7 p-4'>
            <Select
              placeholder="Dönem bilgisi seçiniz..." required
              value={semesterOptions.find(option => option.value === selectedSemester)}
              onChange={(selectedOption) => setSelectedSemester(selectedOption.value)}
              options={semesterOptions} />

            <Select
              placeholder="Şube bilgisi seçiniz..." required
              value={branchOptions.find(option => option.value === selectedBranch)}
              onChange={(selectedOption) => setSelectedBranch(selectedOption.value)}
              options={branchOptions} />

            <Select
              isMulti
              placeholder="Derslik bilgisi seçiniz..." required
              value={classroomOptions.filter(option => selectedClassrooms.includes(option.value))}
              onChange={(selectedOptions) => setSelectedClassrooms(selectedOptions.map(option => option.value))}
              options={classroomOptions} />

            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Tarih:</label> <br />
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='date'
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required />
            </div>
            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Başlangıç Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time'
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)} />
            </div>

            <Select
              placeholder="Gözetmen Üye seçiniz..." required
              value={invigilatorOptions.find(option => option.value === selectedInvigilator)}
              onChange={(selectedOption) => setSelectedInvigilator(selectedOption.value)}
              options={invigilatorOptions} />

            <button type='submit' className='border py-2 mx-20 mt-4 bg-green-600 text-gray-50 font-bold rounded-md' onClick={handleAddExam}>Kaydet</button>
          </div>
        </form>
      </Modal>


      {/* //! GÜNCELLEME MODALI; */}
      <Modal
        isOpen={editExamModalIsOpen}
        onRequestClose={() => setEditExamModalIsOpen(false)}
        contentLabel="Sınav Güncelle"
        className="shadow-2xl border-2 border-gray-400 modal modal-overlay">
        <h2 className='text-lg font-semibold text-gray-800'>Sınav Güncelle</h2>
        <form>
          <button onClick={closeEditExamModal} className="close-button"> X </button>
          <div className='flex flex-col gap-y-7 p-4'>

            <Select
              isMulti
              placeholder="Derslik bilgisi seçiniz..." required
              value={classroomOptions.filter(option => selectedClassrooms.includes(option.value))}
              onChange={(selectedOptions) => setSelectedClassrooms(selectedOptions.map(option => option.value))}
              options={classroomOptions} />

            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Tarih:</label> <br />
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='date'
                value={selectedExam?.examDate}
                onChange={(e) => setSelectedExam(prev => ({ ...prev, examDate: e.target.value }))}
                required />
            </div>

            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Başlangıç Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time'
                required
                value={selectedExam?.startTime}
                onChange={(e) => setSelectedExam(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>

            <Select
              placeholder="Gözetmen Üye seçiniz..." required
              value={invigilatorOptions.find(option => option.value === selectedExam?.fk_invigilatorID)}
              onChange={(selectedOption) => setSelectedExam(prev => ({ ...prev, fk_invigilatorID: selectedOption.value }))}
              options={invigilatorOptions} />

            <button type='submit' className='border py-2 mx-20 mt-4 bg-green-600 text-gray-50 font-bold rounded-md' onClick={handleUpdateExam}>Güncelle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default SinavTakvimi;