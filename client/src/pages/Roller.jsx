import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import '../assets/table.css'
import { HiPencilSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Roller = () => {

    //!VERİ ÇEKME İŞLEMLERİ
    const [roles, setRoles] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const isAdmin = () => {
        return currentUser && currentUser.role === "Admin";
    };
    const navigate = useNavigate();

    useEffect(() => {
        const allRoles = async () => {
            try {
                const res = await axios.get("http://localhost:8800/roller");
                setRoles(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        allRoles();

        if (!isAdmin()) {
            navigate('/');
        }

    }, []);



    //!GÜNCELLEME İŞLEMLERİ
    const [editMode, setEditMode] = useState(false);
    const [editRole, setEditRole] = useState({});
    const handleEdit = (role) => {
        setEditMode(true);
        setEditRole(role);
    }

    const handleUpdate = async () => {
        try {
            await axios.put("http://localhost:8800/roller/" + editRole.roleID, editRole);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!EKLEME İŞLEMİ;
    const [newRole, setNewRole] = useState({ roleName: "" });
    const [showForm, setShowForm] = useState(false); // Yeni durum değişkeni
    const handleAdd = async () => {
        try {
            await axios.post("http://localhost:8800/roller", newRole);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    //!SİLME İŞLEMİ;
    const handleDelete = async (id) => {
        const userConfirmed = window.confirm("Bu Rolü silmek istediğinize emin misiniz?");
        if (userConfirmed) {
            try {
                await axios.delete("http://localhost:8800/roller/" + id);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className='mt-7'>
            <div className='flex gap-x-10 items-center'>
                <h1 className='font-bold text-2xl'>Roller</h1>
                <button onClick={() => setShowForm(!showForm)} className='border px-3 py-1 bg-green-600 text-gray-50 font-bold rounded-md'>Rol Ekle</button>
            </div>
            <div className='mt-7'>
                <table>
                    <thead>
                        <tr>
                            <th>Rol Kodu</th>
                            <th>Rol Adı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.roleID}>
                                <td>{role.roleID}</td>
                                <td>{role.roleName}</td>
                                <td>
                                    <div className='flex'>
                                        <button onClick={() => handleDelete(role.roleID)} className='pr-4 text-2xl'><TiDeleteOutline /></button>
                                        <button onClick={() => handleEdit(role)} className='text-2xl'> <HiPencilSquare /> </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editMode && (
                    <form onSubmit={handleUpdate}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" value={editRole.roleName} onChange={(e) => setEditRole({ ...editRole, roleName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Güncelle</button>
                    </form>
                )}

                {showForm && (
                    <form onSubmit={handleAdd}>
                        <input required className='border border-gray-700 py-2 pl-2' type="text" placeholder="Rol Adı" value={newRole.roleName} onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })} />
                        <button className='pl-4 font-semibold underline' type="submit">Yeni Rol Ekle</button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default Roller 