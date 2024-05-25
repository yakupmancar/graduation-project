import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../assets/schedule.css';
import { HiPencilSquare } from "react-icons/hi2";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
Modal.setAppElement('#root');

const DersTakvimi2 = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedDay, setSelectedDay] = useState('Pazartesi');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [gradeLevel, setGradeLevel] = useState('all');

  const gradeLevelOptions = [
    { value: 'all', label: 'Tüm sınıflar' },
    { value: 1, label: '1. Sınıf' },
    { value: 2, label: '2. Sınıf' },
    { value: 3, label: '3. Sınıf' },
    { value: 4, label: '4. Sınıf' },
  ];


  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semesterRes = await axios.get('http://localhost:8800/donemler');
        setSemesters(semesterRes.data);

        const branchRes = await axios.get('http://localhost:8800/subeler');
        const filteredBranches = branchRes.data.filter(branch => branch.fk_educationID === 2); // Sadece 1. öğretim olanları filtrele
        setBranches(filteredBranches);

        const classroomRes = await axios.get('http://localhost:8800/derslikler');
        setClassrooms(classroomRes.data);

        const scheduleRes = await axios.get('http://localhost:8800/dersTakvimi2');
        console.log("Backend'den Gelen Program Verisi:", scheduleRes.data);
        setSchedule(scheduleRes.data.map(item => ({ ...item, color: getColorByGrade(item.gradeLevel) })));

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //! SINIF RENGİNE GÖRE;
  const getColorByGrade = (gradeLevel) => {
    switch (gradeLevel) {
      case 1:
        return "green";
      case 2:
        return "#3872d6";
      case 3:
        return "#cb6f24";
      case 4:
        return "#f76c6c";
      default:
        return "yellow";
    }
  };

  const renderSchedule = (day, timeSlot, slotIndex) => {
    const slotStartTime = timeSlot.split(' - ')[0] + ':00';
    const slotEndTime = timeSlot.split(' - ')[1] + ':00';

    const filteredSchedule = schedule.filter(item =>
      item.courseDay === day &&
      item.startTime <= slotEndTime &&
      item.endTime > slotStartTime &&
      item.fk_educationID === 2 &&
      item.fk_semesterID === selectedSemester &&
      (gradeLevel === 'all' || item.gradeLevel === gradeLevel)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (filteredSchedule.length > 0) {
      const scheduleItems = [];
      const processedItems = new Set();

      filteredSchedule.forEach(item => {
        if (!processedItems.has(item.courseCalendarID)) {
          const startHour = parseInt(item.startTime.split(':')[0], 10);
          const endHour = parseInt(item.endTime.split(':')[0], 10);
          const startMinute = parseInt(item.startTime.split(':')[1], 10);
          const endMinute = parseInt(item.endTime.split(':')[1], 10);

          // Calculate the number of rows to span
          const totalStartMinutes = startHour * 60 + startMinute;
          const totalEndMinutes = endHour * 60 + endMinute;
          const rowSpan = Math.ceil((totalEndMinutes - totalStartMinutes) / 60);

          // Only add the item if it starts in the current time slot
          if (item.startTime === slotStartTime) {
            scheduleItems.push(
              <td key={item.courseCalendarID} rowSpan={rowSpan} className=' rounded-xl' style={{ backgroundColor: item.color || 'black' }}>
                <div className="flex text-gray-50 text-[14px]">
                  <section className='flex flex-col gap-y-1'>
                    <div className='font-semibold'> {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}</div>
                    <div className='border my-2 mr-7'></div>
                    <div><strong>Şube:</strong> {item.branchName}</div>
                    <div><strong>Ders:</strong> {item.courseName}</div>
                    <div><strong>Öğretim Üyesi:</strong> {item.instructorName}</div>
                    <div><strong>Derslik:</strong> {item.classroomName}</div>
                  </section>
                  <section className='flex flex-col'>
                    <button onClick={() => handleDelete(item.courseCalendarID)} className='font-semibold text-black'>X</button>
                    <button onClick={() => openEditModal(item)} className=' text-black'> <HiPencilSquare /> </button>
                  </section>
                </div>
              </td>
            );
            // Mark the time slots covered by this item as processed
            for (let i = 0; i < rowSpan; i++) {
              processedItems.add(item.courseCalendarID + '_' + (slotIndex + i));
            }
          }
        }
      });

      return scheduleItems.length > 0 ? scheduleItems : <td></td>;
    }

    return <td></td>;
  };



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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const timeSlots = [
    '15:00 - 15:50',
    '16:00 - 16:50',
    '17:00 - 17:50',
    '18:00 - 18:50',
    '19:00 - 19:50',
    '20:00 - 20:50',
    '21:00 - 21:50',
  ];

  const dayOptions = [
    { value: 'Pazartesi', label: 'Pazartesi' },
    { value: 'Salı', label: 'Salı' },
    { value: 'Çarşamba', label: 'Çarşamba' },
    { value: 'Perşembe', label: 'Perşembe' },
    { value: 'Cuma', label: 'Cuma' },
    { value: 'Cumartesi', label: 'Cumartesi' },
  ];

  const openModal = (day) => {
    setSelectedDay(day); // Tıklanan günü state'e yaz
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  //! EKLEME İŞLEMİ;
  const handleAddSchedule = async (e) => {
    const newCourseData = {
      fk_semesterID: selectedSemester,
      fk_branchID: selectedBranch,
      fk_classroomID: selectedClassroom,
      courseDay: selectedDay,
      startTime: startTime,
      endTime: endTime,
    };

    // Saat Kontrolü
    const earliestTime = '15:00';
    const latestTime = '21:50';
    if (startTime < earliestTime || endTime > latestTime) {
      toast.error("Ders saatleri, belirlenen saat aralığının dışında olamaz!");
      e.preventDefault();
      return;
    }

    //! Çakışma Kontrolleri;
    const isClassroomConflict = schedule.some(item =>
      item.courseDay === selectedDay &&
      item.fk_semesterID === selectedSemester &&

      item.fk_classroomID === selectedClassroom &&
      (
        (startTime < item.endTime && endTime > item.startTime) ||
        (startTime === item.startTime && endTime > item.startTime) ||
        (startTime < item.endTime && endTime === item.endTime)
      )
    );

    if (isClassroomConflict) {
      toast.error("Derslik Çakışması Tespit Edidi!");
      e.preventDefault();
      return;
    }
    // Öğretim Üyesi Çakışma Kontrolü
    const selectedInstructorID = branches.find(branch => branch.branchID === selectedBranch).fk_instructorID;
    const isInstructorConflict = schedule.some(item =>
      item.courseDay === selectedDay &&
      item.fk_semesterID === selectedSemester &&
      item.instructorID === selectedInstructorID &&
      (
        (startTime < item.endTime && endTime > item.startTime) ||
        (startTime === item.startTime && endTime > item.startTime) ||
        (startTime < item.endTime && endTime === item.endTime)
      )
    );

    if (isInstructorConflict) {
      toast.error("Öğretim Üyesi Çakışması Tespit Edildi!");
      e.preventDefault();
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/dersTakvimi2', newCourseData);
      if (response.status === 200) {
        console.log("Ders başarıyla eklendi!");
        closeModal();
        window.location.reload();
      } else {
        console.error("Ders eklemede hata oluştu:", response.data);
      }
    } catch (error) {
      console.error("Ders eklemede hata oluştu:", error);
    }
  };

  //! SİLME İŞLEMİ;
  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Onay',
      message: 'Bu dersi takvimden silmek istediğinize emin misiniz?',
      buttons: [
        {
          label: 'Evet',
          onClick: async () => {
            try {
              await axios.delete('http://localhost:8800/dersTakvimi2/' + id);
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
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setSelectedBranch(course.fk_branchID);
    setSelectedClassroom(course.fk_classroomID);
    setSelectedDay(course.courseDay); // Gün seçeneği
    setStartTime(course.startTime);
    setEndTime(course.endTime);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setCurrentCourse(null);
  };

  const handleUpdateSchedule = async (e) => {
    const updatedCourseData = {
      fk_classroomID: selectedClassroom,
      courseDay: selectedDay,
      startTime: startTime,
      endTime: endTime,
    };

    // Saat Kontrolü
    const earliestTime = '15:00';
    const latestTime = '21:50';
    if (startTime < earliestTime || endTime > latestTime) {
      toast.error("Ders saatleri, belirlenen saat aralığının dışında olamaz!");
      e.preventDefault();
      return;
    }

    //! Çakışma Kontrolleri;
    const isClassroomConflictUpdate = schedule.some(item =>
      item.courseDay === selectedDay &&
      item.fk_semesterID === selectedSemester &&
      item.courseCalendarID !== currentCourse.courseCalendarID &&
      item.fk_classroomID === selectedClassroom &&
      (
        (startTime < item.endTime && endTime > item.startTime) ||
        (startTime === item.startTime && endTime > item.startTime) ||
        (startTime < item.endTime && endTime === item.endTime)
      )
    );

    if (isClassroomConflictUpdate) {
      toast.error("Derslik Çakışması tesbit edildi!");
      e.preventDefault();
      return;
    }

    // Öğretim Üyesi Çakışma Kontrolü
    const selectedInstructorID = branches.find(branch => branch.branchID === selectedBranch).fk_instructorID;
    const isInstructorConflictUpdate = schedule.some(item =>
      item.courseDay === selectedDay &&
      item.fk_semesterID === selectedSemester &&
      item.instructorID === selectedInstructorID &&
      item.courseCalendarID !== currentCourse.courseCalendarID &&
      (
        (startTime < item.endTime && endTime > item.startTime) ||
        (startTime === item.startTime && endTime > item.startTime) ||
        (startTime < item.endTime && endTime === item.endTime)
      )
    );

    if (isInstructorConflictUpdate) {
      toast.error("Öğretim Üyesi Çakışması Tespit Edildi!");
      e.preventDefault();
      return;
    }

    try {
      const response = await axios.put("http://localhost:8800/dersTakvimi2/" + currentCourse.courseCalendarID, updatedCourseData);
      if (response.status === 200) {
        console.log("Ders başarıyla güncellendi!");
        closeEditModal();
        window.location.reload();
      } else {
        console.error("Ders güncellemede hata oluştu:", response.data);
      }
    } catch (error) {
      console.error("Ders güncellemede hata oluştu:", error);
    }
  };

  return (
    <div className="schedule-container my-6 ml-[-10px] mr-2">

      <div className='flex gap-x-10 pb-5'>
        <Select className='border border-gray-400 rounded'
          placeholder="Dönem bilgisi seçiniz..."
          value={semesterOptions.find(option => option.value === selectedSemester)}
          onChange={(selectedOption) => setSelectedSemester(selectedOption.value)}
          options={semesterOptions}
        />
        <Select className='border border-gray-400 rounded'
          placeholder="Sınıf seçiniz..."
          value={gradeLevelOptions.find(option => option.value === gradeLevel)}
          onChange={(selectedOption) => setGradeLevel(selectedOption.value)}
          options={gradeLevelOptions}
        />
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th></th>
            {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'].map(day => (
              <th key={day} className='cursor-pointer' onClick={() => openModal(day)}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, i) => (
            <tr key={i}>
              <td>{slot}</td>
              {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'].map(day => (
                renderSchedule(day, slot, i)
              ))}
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
        <h2 className='text-lg font-semibold text-gray-800'>Ders Ekle</h2>
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
              placeholder="Derslik bilgisi seçiniz..." required
              value={classroomOptions.find(option => option.value === selectedClassroom)}
              onChange={(selectedOption) => setSelectedClassroom(selectedOption.value)}
              options={classroomOptions} />

            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Gün:</label> <br />
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                value={selectedDay}
                type='text'
                required
                readOnly
              />
            </div>
            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Başlangıç Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time'
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Bitiş Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time'
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <button type='submit' className='border py-2 mx-20 mt-4 bg-green-600 text-gray-50 font-bold rounded-md' onClick={handleAddSchedule}>Kaydet</button>
          </div>
        </form>
      </Modal>


      {/* //! GÜNCELLEME MODALI; */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Ders Güncelle Modal"
        className="shadow-2xl border-2 border-gray-400 modal-update modal-overlay">
        <h2 className='text-lg font-semibold text-gray-800'>Ders Güncelle</h2>
        <form>
          <div className='flex flex-col gap-y-7 p-4'>
            <button onClick={closeEditModal} className="close-button"> X </button>
            <Select
              value={classroomOptions.find(option => option.value === selectedClassroom)}
              onChange={option => setSelectedClassroom(option.value)}
              options={classroomOptions}
              placeholder="Derslik Seçin" />

            <Select options={dayOptions}
              onChange={(selectedOption) => setSelectedDay(selectedOption.value)}
              value={dayOptions.find(option => option.value === selectedDay)}
              placeholder="Gün Seçin" />

            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Başlangıç Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time' required
                value={startTime} onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='flex items-center'>
              <label className='pr-2 text-gray-600 font-bold text-[17px]'>Bitiş Saati: </label>
              <input
                className='outline-blue-500 border border-gray-300 py-1 rounded-md pl-2'
                type='time' required
                value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <button type='submit' className='border py-2 mx-20 mt-4 bg-green-600 text-gray-50 font-bold rounded-md' onClick={handleUpdateSchedule}>Güncelle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default DersTakvimi2;