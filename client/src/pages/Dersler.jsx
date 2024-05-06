import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";

const Dersler = () => {

    //!VERİ ÇEKME İŞLEMLERİ
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const allCourses = async () => {
            try {
                const res = await axios.get("http://localhost:8800/dersler");
                setCourses(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        allCourses();
    }, []);



    //!GÜNCELLEME İŞLEMLERİ
    const [editMode, setEditMode] = useState(false);
    const [editCourse, setEditCourse] = useState({});
    const handleEdit = (course) => {
        setEditMode(true);
        setEditCourse(course);
    }

    const handleUpdate = async () => {
        try {
            await axios.put("http://localhost:8800/dersler/" + editCourse.courseID, editCourse);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!EKLEME İŞLEMİ;
    const [newCourse, setNewCourse] = useState({ courseCode: "", courseName: "", gradeLevel: "" });
    const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni
    const handleAdd = async () => {
        try {
            await axios.post("http://localhost:8800/dersler", newCourse);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!SİLME İŞLEMİ;
    const handleDelete = async (id) => {
        const userConfirmed = window.confirm("Bu dersi silmek istediğinize emin misiniz?");
        if (userConfirmed) {
            try {
                await axios.delete("http://localhost:8800/dersler/" + id);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className='mt-7'>
            <div className='flex gap-x-10 items-center'>
                <h1 className='font-bold text-2xl'>DERSLER</h1>
                <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Ders Ekle</button>
            </div>
            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>Ders Kodu</th>
                            <th>Ders Adı</th>
                            <th>Sınıf</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseID}>
                                <td>{course.courseCode}</td>
                                <td>{course.courseName}</td>
                                <td>{course.gradeLevel}</td>
                                <td>
                                    <div className='flex'>
                                        <button onClick={() => handleDelete(course.courseID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                        <button onClick={() => handleEdit(course)} className='text-2xl'> <HiPencilSquare /> </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMode && (
                    <form onSubmit={handleUpdate}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editCourse.courseCode} onChange={(e) => setEditCourse({ ...editCourse, courseCode: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editCourse.courseName} onChange={(e) => setEditCourse({ ...editCourse, courseName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editCourse.gradeLevel} onChange={(e) => setEditCourse({ ...editCourse, gradeLevel: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
                    </form>
                )}

                {showForm && (
                    <form onSubmit={handleAdd}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Ders Kodu" value={newCourse.courseCode} onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Ders Adı" value={newCourse.courseName} onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Sınıf" value={newCourse.gradeLevel} onChange={(e) => setNewCourse({ ...newCourse, gradeLevel: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Yeni Ders Ekle</button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default Dersler 