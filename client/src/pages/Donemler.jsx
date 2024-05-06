import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";

const Donemler = () => {

  //!VERİ ÇEKME İŞLEMLERİ
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const allSemesters = async () => {
      try {
        const res = await axios.get("http://localhost:8800/donemler");
        setSemesters(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    allSemesters();
  }, []);



  //!GÜNCELLEME İŞLEMLERİ
  const [editMode, setEditMode] = useState(false);
  const [editSemester, setEditSemester] = useState({});
  const handleEdit = (semester) => {
    setEditMode(true);
    setEditSemester(semester);
  }

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:8800/donemler/" + editSemester.semesterID, editSemester);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }


  //!EKLEME İŞLEMİ;
  const [newSemester, setNewSemester] = useState({ semesterName: "" });
  const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni
  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:8800/donemler", newSemester);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }


  //!SİLME İŞLEMİ;
  const handleDelete = async (id) => {
    const userConfirmed = window.confirm("Bu dönemi silmek istediğinize emin misiniz?");
    if (userConfirmed) {
      try {
        await axios.delete("http://localhost:8800/donemler/" + id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }


  return (
    <div className='mt-7'>
      <div className='flex gap-x-10 items-center'>
        <h1 className='font-bold text-2xl'>DÖNEMLER</h1>
        <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Dönem Ekle</button>
      </div>
      <div className='mt-7'>
        <table>
          <thead>
            <tr>
              <th>Dönem Adı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => (
              <tr key={semester.semesterID}>
                <td>{semester.semesterName}</td>
                <td>
                  <div className='flex'>
                    <button onClick={() => handleDelete(semester.semesterID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                    <button onClick={() => handleEdit(semester)} className='text-2xl'> <HiPencilSquare /> </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && (
          <form onSubmit={handleUpdate}>
            <input required className='border border-gray-700 py-2 pl-2' type="text" value={editSemester.semesterName} onChange={(e) => setEditSemester({ ...editSemester, semesterName: e.target.value })} />
            <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
          </form>
        )}

        {showForm && (
          <form onSubmit={handleAdd}>
            <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Dönem Adı" value={newSemester.semesterName} onChange={(e) => setNewSemester({ ...newSemester, semesterName: e.target.value })} />
            <button className='pl-4 font-semibold underline' type="submit">Yeni Dönem Ekle</button>
          </form>
        )}
      </div>
    </div>
  )
}
export default Donemler 