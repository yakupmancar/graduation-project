import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../assets/schedule.css';
import { HiPencilSquare } from "react-icons/hi2";
import Select from 'react-select';
Modal.setAppElement('#root');

const DersTakvimi = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedDay, setSelectedDay] = useState('Pazartesi'); // Gün seçimi için state
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [gradeLevel, setGradeLevel] = useState('all'); // Varsayılan olarak "Tüm sınıflar"

  const gradeLevelOptions = [
    { value: 'all', label: 'Tüm sınıflar' },
    { value: 1, label: '1. Sınıf' },
    { value: 2, label: '2. Sınıf' },
    { value: 3, label: '3. Sınıf' },
    { value: 4, label: '4. Sınıf' },
  ];


  const [schedule, setSchedule] = useState([]); // Initialize as an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semesterRes = await axios.get('http://localhost:8800/donemler');
        setSemesters(semesterRes.data);

        const branchRes = await axios.get('http://localhost:8800/subeler');
        const filteredBranches = branchRes.data.filter(branch => branch.fk_educationID === 1); // Sadece 1. öğretim olanları filtrele
        setBranches(filteredBranches);

        const classroomRes = await axios.get('http://localhost:8800/derslikler');
        setClassrooms(classroomRes.data);

        const scheduleRes = await axios.get('http://localhost:8800/dersTakvimi');
        console.log("Backend'den Gelen Program Verisi:", scheduleRes.data); // Veriyi kontrol edin
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

  const renderSchedule = (day, timeSlot) => {
    const slotStartTime = timeSlot.split(' - ')[0] + ':00';
    const slotEndTime = timeSlot.split(' - ')[1] + ':00';

    const filteredSchedule = schedule.filter(item =>
      item.courseDay === day &&
      item.startTime <= slotEndTime &&
      item.endTime >= slotStartTime &&
      item.fk_semesterID === selectedSemester &&
      (gradeLevel === 'all' || item.gradeLevel === gradeLevel)
    ).sort((a, b) => a.startTime - b.startTime);

    if (filteredSchedule.length > 0) {
      return filteredSchedule.map(item => (
        <div key={item.courseCalendarID} className="flex schedule-item text-[14px]" style={{ backgroundColor: item.color || 'white' }}>
          <section className='flex flex-col gap-y-1'>
            <div className='font-semibold'> {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}</div>
            <div className='border my-2 mr-7'></div>
            <div><strong>Şube:</strong> {item.branchName}</div>
            <div><strong>Ders:</strong> {item.courseName}</div>
            <div><strong>Öğretim Üyesi:</strong> {item.instructorName}</div>
            <div><strong>Derslik:</strong> {item.classroomName}</div>
          </section>
          <section className='ml-auto text-[15px] flex flex-col gap-y-[1px] items-center'>
            <button onClick={() => handleDelete(item.courseCalendarID)} className='font-semibold text-black'>X</button>
            <button className=' text-black'> <HiPencilSquare /> </button>
          </section>
        </div>
      ));
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
    '09:00 - 09:50',
    '10:00 - 10:50',
    '11:00 - 11:50',
    '12:00 - 12:50',
    '13:00 - 13:50',
    '14:00 - 14:50',
    '15:00 - 15:50',
    '16:00 - 16:50',
  ];

  const openModal = (day) => {
    setSelectedDay(day); // Tıklanan günü state'e yaz
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  //! EKLEME İŞLEMİ;
  const handleAddSchedule = async () => {
    const newCourseData = {
      fk_semesterID: selectedSemester,
      fk_branchID: selectedBranch,
      fk_classroomID: selectedClassroom,
      courseDay: selectedDay,
      startTime: startTime,
      endTime: endTime,
    };

    try {
      const response = await axios.post('http://localhost:8800/dersTakvimi', newCourseData);
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
    const userConfirmed = window.confirm('Bu dersi takvimden silmek istediğinize emin misiniz?');
    if (userConfirmed) {
      try {
        await axios.delete('http://localhost:8800/dersTakvimi/' + id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };


  return (
    <div className="schedule-container my-6">

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
          {timeSlots.map((slot, index) => (
            <tr key={index}>
              <td>{slot}</td>
              {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'].map(day => (
                renderSchedule(day, slot)
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ders Ekle"
        className="shadow-2xl border-2 border-gray-400 modal modal-overlay">
        <button onClick={closeModal} className="close-button"> X </button>

        <div className='flex flex-col gap-y-7 p-4'>
          <Select
            placeholder="Dönem bilgisi seçiniz..."
            value={semesterOptions.find(option => option.value === selectedSemester)}
            onChange={(selectedOption) => setSelectedSemester(selectedOption.value)}
            options={semesterOptions} />

          <Select
            placeholder="Şube bilgisi seçiniz..."
            value={branchOptions.find(option => option.value === selectedBranch)}
            onChange={(selectedOption) => setSelectedBranch(selectedOption.value)}
            options={branchOptions} />

          <Select
            placeholder="Derslik bilgisi seçiniz..."
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
          <button className='border py-2 mx-20 mt-4 bg-green-600 text-gray-50 font-bold rounded-md' onClick={handleAddSchedule}>Kaydet</button>
        </div>
      </Modal>
    </div>
  );
};
export default DersTakvimi;
