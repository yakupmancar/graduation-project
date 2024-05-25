import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { AuthContext } from '../context/authContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Invigilators = () => {

    //!VERİ ÇEKME İŞLEMLERİ
    const [invigilators, setInvigilators] = useState([]);

    const { currentUser } = useContext(AuthContext);


    useEffect(() => {
        const allInvigilators = async () => {
            try {
                const res = await axios.get("http://localhost:8800/gozetmenUyeler");
                setInvigilators(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        allInvigilators();
    }, []);



    //!GÜNCELLEME İŞLEMLERİ
    const [editMode, setEditMode] = useState(false);
    const [editInvigilator, setEditInvigilator] = useState({});
    const handleEdit = (invigilator) => {
        setEditMode(true);
        setEditInvigilator(invigilator);
    }

    const handleUpdate = async () => {
        try {
            await axios.put("http://localhost:8800/gozetmenUyeler/" + editInvigilator.invigilatorID, editInvigilator);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!EKLEME İŞLEMİ;
    const [newInvigilator, setNewInvigilator] = useState({ invigilatorFirstName: "", invigilatorLastName: "" });
    const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni
    const handleAdd = async () => {
        try {
            await axios.post("http://localhost:8800/gozetmenUyeler", newInvigilator);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!SİLME İŞLEMİ;
    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Onay',
            message: 'Bu Gözetmen Üyeyi silmek istediğinize emin misiniz?',
            buttons: [
                {
                    label: 'Evet',
                    onClick: async () => {
                        try {
                            await axios.delete('http://localhost:8800/gozetmenUyeler/' + id);
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
                <h1 className='font-bold text-2xl'>GÖZETMEN ÜYELER</h1>
                {currentUser.role == "Admin" && (
                    <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Gözetmen Üye Ekle</button>
                )}
            </div>
            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>Gözetmen Üye Adı</th>
                            <th>Gözetmen Üye Soyadı</th>
                            <th>Görev Sayısı</th>
                            {currentUser.role == "Admin" && (
                                <th>İşlemler</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {invigilators.map((invigilator) => (
                            <tr key={invigilator.invigilatorID}>
                                <td>{invigilator.invigilatorFirstName}</td>
                                <td>{invigilator.invigilatorLastName}</td>
                                <td>{invigilator.dutyCount}</td>
                                {currentUser.role == "Admin" && (
                                    <td>
                                        <div className='flex'>
                                            <button onClick={() => handleDelete(invigilator.invigilatorID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                            <button onClick={() => handleEdit(invigilator)} className='text-2xl'> <HiPencilSquare /> </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMode && (
                    <form onSubmit={handleUpdate}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editInvigilator.invigilatorFirstName} onChange={(e) => setEditInvigilator({ ...editInvigilator, invigilatorFirstName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editInvigilator.invigilatorLastName} onChange={(e) => setEditInvigilator({ ...editInvigilator, invigilatorLastName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
                    </form>
                )}

                {showForm && (
                    <form onSubmit={handleAdd}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Isim" value={newInvigilator.invigilatorFirstName} onChange={(e) => setNewInvigilator({ ...newInvigilator, invigilatorFirstName: e.target.value })} />
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Soyisim" value={newInvigilator.invigilatorLastName} onChange={(e) => setNewInvigilator({ ...newInvigilator, invigilatorLastName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Yeni Gözetmen Üye Ekle</button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default Invigilators