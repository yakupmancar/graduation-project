import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { AuthContext } from '../context/authContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Derslikler = () => {

    //! VERİ ÇEKME İŞLEMİ;
    const [classrooms, setClassrooms] = useState([]);

    const { currentUser } = useContext(AuthContext);


    useEffect(() => {
        const allClassrooms = async () => {
            try {
                const res = await axios.get("http://localhost:8800/derslikler");
                setClassrooms(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        allClassrooms();
    }, []);


    //! SİLME İŞLEMİ;
    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Onay',
            message: 'Bu dersliği silmek istediğinize emin misiniz?',
            buttons: [
                {
                    label: 'Evet',
                    onClick: async () => {
                        try {
                            await axios.delete('http://localhost:8800/derslikler/' + id);
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


    //! EKLEME İŞLEMİ;
    const [newRoom, setNewRoom] = useState({ classroomName: "", classroomType: "", classCapacity: "", examCapacity: "" });
    const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni

    const handleAdd = async () => {
        try {
            const room = {
                ...newRoom,
                classCapacity: newRoom.classCapacity ? parseInt(newRoom.classCapacity) : null,
                examCapacity: newRoom.examCapacity ? parseInt(newRoom.examCapacity) : null
            };
            await axios.post("http://localhost:8800/derslikler", room);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //! GÜNCELLEME İŞLEMLERİ;
    const [editMode, setEditMode] = useState(false);
    const [editRoom, setEditRoom] = useState({});
    const handleEdit = (room) => {
        setEditMode(true);
        setEditRoom(room);
    }

    const handleUpdate = async () => {
        try {
            await axios.put("http://localhost:8800/derslikler/" + editRoom.classroomID, editRoom);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='mt-7'>
            <div className='flex gap-x-10 items-center'>
                <h1 className='font-bold text-2xl'>DERSLİKLER</h1>
                {currentUser.role == "Admin" && (
                    <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Derslik Ekle</button>
                )}
            </div>

            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>DerslikAdı</th>
                            <th>Derslik Tipi</th>
                            <th>Kapasite(Ders)</th>
                            <th>Kapasite(Sınav)</th>
                            {currentUser.role == "Admin" && (
                                <th>İşlemler</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map((room) => (
                            <tr key={room.classroomID}>
                                <td>{room.classroomName}</td>
                                <td>{room.classroomType}</td>
                                <td>{room.classCapacity}</td>
                                <td>{room.examCapacity}</td>
                                {currentUser.role == "Admin" && (
                                    <td>
                                        <div className='flex'>
                                            <button onClick={() => handleDelete(room.classroomID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                            <button onClick={() => handleEdit(room)} className='text-2xl'> <HiPencilSquare /> </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMode && (
                    <form onSubmit={handleUpdate}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editRoom.classroomName} onChange={(e) => setEditRoom({ ...editRoom, classroomName: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" value={editRoom.classroomType} onChange={(e) => setEditRoom({ ...editRoom, classroomType: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" value={editRoom.classCapacity} onChange={(e) => setEditRoom({ ...editRoom, classCapacity: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" value={editRoom.examCapacity} onChange={(e) => setEditRoom({ ...editRoom, examCapacity: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
                    </form>
                )}
                {showForm && (
                    <form onSubmit={handleAdd}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Derslik Adı" value={newRoom.classroomName} onChange={(e) => setNewRoom({ ...newRoom, classroomName: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" placeholder="Derslik Tipi" value={newRoom.classroomType} onChange={(e) => setNewRoom({ ...newRoom, classroomType: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" placeholder="Ders Kapasitesi" value={newRoom.classCapacity} onChange={(e) => setNewRoom({ ...newRoom, classCapacity: e.target.value })} />
                        <input className='border border-gray-700 py-2 pl-2' type="text" placeholder="Sınav Kapasitesi" value={newRoom.examCapacity} onChange={(e) => setNewRoom({ ...newRoom, examCapacity: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Yeni Derslik Ekle</button>
                    </form>
                )}
            </div>

        </div>
    )
}
export default Derslikler 