import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Home = () => {

    const navigate = useNavigate();

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser]);
    return (
        <div className="flex bg-[url('/images/bg1.png')] bg-cover w-full ml-[-70px]">

            <div className='mt-10 text-2xl font-semibold ml-14'>
                <h1>Merhaba {currentUser?.firstName + " " + currentUser?.lastName}, Ders ve Sınav Programı Takvimine hoş geldiniz.</h1> <br />
                <h1>-{currentUser?.role}- olarak giriş yaptınız.</h1>
            </div>
        </div>
    )
}

export default Home