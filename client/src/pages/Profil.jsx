import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/authContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({});

  const navigate = useNavigate();


  //! Kullanıcı Bilgilerini çekme;
  useEffect(() => {
    const getUser = async () => {
      try {
        if (currentUser && currentUser.userID) {
          const response = await axios.get("http://localhost:8800/profil/" + currentUser.userID);
          setUserProfile(response.data);
          setUpdatedProfile(response.data); // set updatedProfile to the current user data
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [currentUser]);


  //! Input Value Güncellemesi;
  const handleInputChange = (event) => {
    setUpdatedProfile({
      ...updatedProfile,
      [event.target.name]: event.target.value,
    });
  };


  //!Güncelleme işlemi;
  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:8800/profil/" + currentUser.userID, updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.log(error);
    }
  };


  //! Silme İşlemi;
  const handleDelete = async () => {
    const userConfirmed = window.confirm("Hesabınızı silmek istediğinize emin misiniz?");

    if (userConfirmed) {
      try {
        await axios.delete("http://localhost:8800/profil/" + currentUser.userID);
        navigate("/login")
      } catch (error) {
        console.log(error);
      }
    }
  };

  //! BUTON GÖRÜNÜMÜ İŞLEMİ;
  const isUpdated = JSON.stringify(userProfile) !== JSON.stringify(updatedProfile);


  return (
    <div className='mt-7 mb-12'>
      {userProfile && (
        <div>
          <h1 className='font-bold text-2xl'>KULLANICI BİLGİLERİM</h1>

          <div className='flex gap-x-32'>

            <section className='mt-6 flex flex-col gap-y-5'>
              <div>
                <label className='pr-2 text-gray-600 font-bold text-[17px]'>İsim:</label>
                <input name="firstName" value={updatedProfile.firstName} onChange={handleInputChange} type='text' required className=' outline-blue-500 border border-gray-300 py-1 mt-1 rounded-md pl-2' />
              </div>

              <div>
                <label className='pr-2 text-gray-600 font-bold text-[17px]'>Soyisim:</label>
                <input name="lastName" value={updatedProfile.lastName} onChange={handleInputChange} type='text' required className=' outline-blue-500 border border-gray-300 py-1 mt-1 rounded-md pl-2' />
              </div>

              <div>
                <label className='pr-2 text-gray-600 font-bold text-[17px]'>Kullanıcı Adı:</label>
                <input name="userName" value={updatedProfile.userName} onChange={handleInputChange} type='text' required className=' outline-blue-500 border border-gray-300 py-1 mt-1 rounded-md pl-2' />
              </div>

              {/* <div>
                <label className='pr-2 text-gray-600 font-bold text-[17px]'>Şifre:</label>
                <input value="*****" onChange={handleInputChange} type='text' required className=' outline-blue-500 border border-gray-300 py-1 mt-1 rounded-md pl-2' />
              </div>

              <div>
                <label className='pr-2 text-gray-600 font-bold text-[17px]'>Şifre(Tekrar):</label>
                <input value="*****" onChange={handleInputChange} type='text' required className=' outline-blue-500 border border-gray-300 py-1 mt-1 rounded-md pl-2' />
              </div> */}

              <div className='flex gap-x-5'>
                <button onClick={handleUpdate} disabled={!isUpdated} className={`border px-3 py-1 mt-4 ${isUpdated ? 'bg-green-600' : 'bg-gray-400'} text-gray-50 font-bold rounded-md`}>Güncelle</button>
                <button onClick={handleDelete} className='border px-3 py-1 mt-4 bg-red-600 text-gray-50 font-bold rounded-md'>Hesabı Sil</button>              </div>
            </section>

          </div>
        </div>

      )}
    </div>
  )
}
export default Profile;