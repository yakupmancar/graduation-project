import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/table.css';
import { HiPencilSquare } from 'react-icons/hi2';
import { TiDeleteOutline } from 'react-icons/ti';
import Select from 'react-select';


const Subeler = () => {
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [educationTypes, setEducationTypes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedEducationType, setSelectedEducationType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await axios.get('http://localhost:8800/subeler');
        setBranches(branchRes.data);

        const courseRes = await axios.get('http://localhost:8800/dersler'); // Replace with your course endpoint
        setCourses(courseRes.data);

        const instructorRes = await axios.get('http://localhost:8800/ogretimUyeleri'); // Replace with your instructor endpoint
        setInstructors(instructorRes.data);

        const educationTypeRes = await axios.get('http://localhost:8800/ogretimler'); // Replace with your education type endpoint
        setEducationTypes(educationTypeRes.data);

        const semesterRes = await axios.get('http://localhost:8800/donemler'); // Replace with your semester endpoint
        setSemesters(semesterRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  //! ŞUBE EKLEME
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBranch = {
      branchName: e.target.branchName.value,
      fk_courseID: selectedCourse,
      fk_instructorID: selectedInstructor,
      studentCount: e.target.studentCount.value,
      fk_educationID: selectedEducationType,
      fk_semesterID: selectedSemester,
    };

    try {
      const res = await axios.post('http://localhost:8800/subeler', newBranch);
      console.log(res.data); // Handle success message or redirect
      window.location.reload(); // Reload to reflect changes (consider optimistic UI updates for better UX)
    } catch (error) {
      console.error(error); // Handle error message
    }
  };


  //DERS SELECT KISMI;
  const courseOptions = courses.map((course) => ({
    value: course.courseID,
    label: course.courseName,
  }));

  //ÖĞRETİM ÜYESİ SELECT KISMI;
  const instructorOptions = instructors.map((instructor) => ({
    value: instructor.instructorID,
    label: `${instructor.instructorFirstName} ${instructor.instructorLastName}`,
  }));

  //ÖĞRETİM BİLGİSİ SELECT KISMI;
  const educationTypeOptions = educationTypes.map((educationType) => ({
    value: educationType.educationID,
    label: educationType.educationType,
  }));

  //DÖNEM BİLGİSİ SELECT KISMI;
  const semesterOptions = semesters.map((semester) => ({
    value: semester.semesterID,
    label: semester.semesterName,
  }));


  //! SİLME İŞLEMİ;
  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Bu şubeyi silmek istediğinize emin misiniz?');
    if (userConfirmed) {
      try {
        await axios.delete('http://localhost:8800/subeler/' + id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };


  //!GÜNCELLEME İŞLEMLERİ
  const [editMode, setEditMode] = useState(false);
  const [editBranch, setEditBranch] = useState({});
  const handleEdit = (branch) => {
    setEditMode(true);
    setEditBranch(branch);
  }

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:8800/subeler/" + editBranch.branchID, editBranch);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='mt-7 mb-12'>
      <div className='flex gap-x-10 items-center'>
        <h1 className='font-bold text-2xl'>ŞUBELER</h1>
      </div>

      <div className='mt-5'>
        <form className='bg-[#e1e1e1] py-5 px-7 rounded-xl' onSubmit={handleSubmit}>
          <div className='flex gap-x-28'>
            <div className='flex flex-col gap-y-5 '>
              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='branchName'>Şube Adı:</label> <br />
                <input type='text' id='branchName' name='branchName' required className=' outline-blue-500 border border-gray-300 py-1 rounded-md pl-2' />
              </div>

              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='course'>Ders Bilgisi:</label>
                <Select className='w-72' id='course' name='course'
                  value={courseOptions.find(option => option.value === selectedCourse)}
                  onChange={(selectedOption) => setSelectedCourse(selectedOption.value)}
                  options={courseOptions}
                  placeholder="Ders bilgisi seçiniz..."
                />
              </div>

              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='instructor'>Öğretim Üyesi:</label>
                <Select className='w-72'
                  options={instructorOptions}
                  value={instructorOptions.find((option) => option.value === selectedInstructor)}
                  onChange={(selectedOption) => setSelectedInstructor(selectedOption.value)}
                  placeholder="Öğretim üyesi seçiniz..."
                  isSearchable={true}
                />
              </div>
            </div>

            <div className='flex flex-col gap-y-5'>
              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='studentCount'>Öğrenci Sayısı:</label> <br />
                <input className=' outline-blue-500 border border-gray-300 py-1 rounded-md pl-2' type='number' id='studentCount' name='studentCount' required />
              </div>

              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='educationType'>Öğretim Bilgisi:</label>
                <Select className='w-64'
                  options={educationTypeOptions}
                  value={educationTypeOptions.find((option) => option.value === selectedEducationType)}
                  onChange={(selectedOption) => setSelectedEducationType(selectedOption.value)}
                  placeholder="Öğretim bilgisi seçiniz..."
                  isSearchable={true}
                />
              </div>

              <div className='flex items-center'>
                <label className='pr-2 text-gray-600 font-bold text-[17px]' htmlFor='semester'>Dönem Bilgisi:</label> <br />
                <Select className='w-64'
                  options={semesterOptions}
                  value={semesterOptions.find((option) => option.value === selectedSemester)}
                  onChange={(selectedOption) => setSelectedSemester(selectedOption.value)}
                  placeholder="Dönem bilgisi seçiniz..."
                  isSearchable={true}
                />
              </div>
            </div>

          </div>
          <button type='submit' className='border px-3 py-1 mt-4 bg-green-600 text-gray-50 font-bold rounded-md'>
            Ekle
          </button>
        </form>

        <table className='mt-7'>
          <thead>
            <tr>
              <th>Şube Adı</th>
              <th>Ders Adı</th>
              <th>Öğretim Üyesi</th>
              <th>Öğrenci Sayısı</th>
              <th>Öğretim Bilgisi</th>
              <th>Dönem Bilgisi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.branchID}>
                <td>{branch.branchName}</td>
                <td>{branch.courseName}</td>
                <td>{branch.instructorFirstName} {branch.instructorLastName}</td>
                <td>{branch.studentCount}</td>
                <td>{branch.educationType}</td>
                <td>{branch.semesterName}</td>
                <td>
                  <div className='flex'>
                    <button onClick={() => handleDelete(branch.branchID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                    <button onClick={() => handleEdit(branch)} className='text-2xl'> <HiPencilSquare /> </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && (
          <form onSubmit={handleUpdate}>
            <input required placeholder='Şube Adı' className='border border-gray-700 py-2 pl-2' type="text" value={editBranch.branchName} onChange={(e) => setEditBranch({ ...editBranch, branchName: e.target.value })} />
            <input required placeholder='Öğrenci Sayısı' className='border border-gray-700 py-2 pl-2' type="text" value={editBranch.studentCount} onChange={(e) => setEditBranch({ ...editBranch, studentCount: e.target.value })} />
            <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
          </form>
        )}
      </div>
    </div >
  );
};

export default Subeler;