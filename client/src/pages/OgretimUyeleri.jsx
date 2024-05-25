import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { AuthContext } from '../context/authContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const OgretimUyeleri = () => {

    //!VERİ ÇEKME İŞLEMLERİ
    const [instructors, setInstructor] = useState([]);

    const { currentUser } = useContext(AuthContext);


    useEffect(() => {
        const allInstructors = async () => {
            try {
                const res = await axios.get("http://localhost:8800/ogretimUyeleri");
                setInstructor(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        allInstructors();
    }, []);



    //!GÜNCELLEME İŞLEMLERİ
    const [editMode, setEditMode] = useState(false);
    const [editInstructor, setEditInstructor] = useState({});
    const handleEdit = (instructor) => {
        setEditMode(true);
        setEditInstructor(instructor);
    }

    const handleUpdate = async () => {
        try {
            await axios.put("http://localhost:8800/ogretimUyeleri/" + editInstructor.insturctorID, editInstructor);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!EKLEME İŞLEMİ;
    const [newInstructor, setNewInstructor] = useState({ academicTitle: "", instructorFirstName: "", instructorLastName: "" });
    const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni
    const handleAdd = async () => {
        try {
            await axios.post("http://localhost:8800/ogretimUyeleri", newInstructor);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!SİLME İŞLEMİ;
    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Onay',
            message: 'Bu Öğretim Üyesini silmek istediğinize emin misiniz?',
            buttons: [
                {
                    label: 'Evet',
                    onClick: async () => {
                        try {
                            await axios.delete('http://localhost:8800/ogretimUyeleri/' + id);
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
                <h1 className='font-bold text-2xl'>ÖĞRETİM ÜYELERİ</h1>
                {currentUser.role == "Admin" && (
                    <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Öğretim Üyesi Ekle</button>
                )}
            </div>
            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>Akademik Ünvan</th>
                            <th>Öğretim Üyesi Adı</th>
                            <th>Öğretim Üyesi Soyadı</th>
                            {currentUser.role == "Admin" && (
                                <th>İşlemler</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.map((instructor) => (
                            <tr key={instructor.instructorID}>
                                <td>{instructor.academicTitle}</td>
                                <td>{instructor.instructorFirstName}</td>
                                <td>{instructor.instructorLastName}</td>
                                {currentUser.role == "Admin" && (
                                    <td>
                                        <div className='flex'>
                                            <button onClick={() => handleDelete(instructor.instructorID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                            <button onClick={() => handleEdit(instructor)} className='text-2xl'> <HiPencilSquare /> </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMode && (
                    <form onSubmit={handleUpdate}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editInstructor.academicTitle} onChange={(e) => setEditInstructor({ ...editInstructor, academicTitle: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editInstructor.instructorFirstName} onChange={(e) => setEditInstructor({ ...editInstructor, instructorFirstName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editInstructor.instructorLastName} onChange={(e) => setEditInstructor({ ...editInstructor, instructorLastName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
                    </form>
                )}

                {showForm && (
                    <form onSubmit={handleAdd}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Akademik Unvan" value={newInstructor.academicTitle} onChange={(e) => setNewInstructor({ ...newInstructor, academicTitle: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Isim" value={newInstructor.instructorFirstName} onChange={(e) => setNewInstructor({ ...newInstructor, instructorFirstName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Soyisim" value={newInstructor.instructorLastName} onChange={(e) => setNewInstructor({ ...newInstructor, instructorLastName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Yeni Öğretim Üyesi Ekle</button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default OgretimUyeleri 