import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { AuthContext } from '../context/authContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Dersler = () => {

    //! PAGINATION
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePagination = (data) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };
    const displayedCourses = handlePagination(courses);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(courses.length / pageSize)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const totalPages = Math.ceil(courses.length / pageSize);


    const { currentUser } = useContext(AuthContext);


    //!VERİ ÇEKME İŞLEMLERİ
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
        confirmAlert({
            title: 'Onay',
            message: 'Bu dersi silmek istediğinize emin misiniz?',
            buttons: [
                {
                    label: 'Evet',
                    onClick: async () => {
                        try {
                            await axios.delete('http://localhost:8800/dersler/' + id);
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

    return (
        <div className='mt-7'>
            <div className='flex gap-x-10 items-center'>
                <h1 className='font-bold text-2xl'>DERSLER</h1>
                {currentUser.role == "Admin" && (
                    <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Ders Ekle</button>
                )}
            </div>
            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>Ders Kodu</th>
                            <th>Ders Adı</th>
                            <th>Sınıf</th>
                            {currentUser.role == "Admin" && (
                                <th>İşlemler</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>

                        {displayedCourses.map((course) => (
                            <tr key={course.courseID}>
                                <td>{course.courseCode}</td>
                                <td>{course.courseName}</td>
                                <td>{course.gradeLevel}</td>
                                {currentUser.role == "Admin" && (
                                    <td>
                                        <div className='flex'>
                                            <button onClick={() => handleDelete(course.courseID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                            <button onClick={() => handleEdit(course)} className='text-2xl'> <HiPencilSquare /> </button>
                                        </div>
                                    </td>
                                )}
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

            <div className="flex justify-center">
                {currentPage > 1 && <button className='pt-5 mr-auto text-lg font-semibold' onClick={handlePreviousPage}><i class="fa-solid fa-angles-left"></i></button>}
                {currentPage < totalPages && <button className='pt-5 ml-auto text-lg font-semibold' onClick={handleNextPage}><i class="fa-solid fa-angles-right"></i></button>}
            </div>

        </div>

    )
}
export default Dersler 