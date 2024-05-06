import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";


const Login = () => {

    //! REGİSTER;
    const [values, setValues] = useState({
        userName: '',
        password: ''
    });


    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const response = await login(values);
        if (response.Error) {
            setErrorMessage(response.Error);
        } else {
            navigate("/");
        }
    };

    // HATA MESAJI YAZDIRMA
    const [errorMessage, setErrorMessage] = useState(null);

    // ANASAYFAYA DÖNDÜRME;
    const navigate = useNavigate();


    return (
        <div>
            <div className="flex flex-col items-center justify-center h-lvh bg-[url('/images/bg1.png')] bg-cover">
                <div className="bg-[#29323e] flex flex-col items-center w-[400px] py-12 rounded-md opacity-90">
                    <img className=" w-24" src="images/logo2.jpg" />
                    <h1 className='text-2xl font-bold text-gray-200 my-5'>GİRİŞ</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-9'>
                        <input onChange={e => setValues({ ...values, userName: e.target.value })} required className='p-[10px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="text" placeholder='kullanıcı adı' />
                        <input onChange={e => setValues({ ...values, password: e.target.value })} required className='p-[10px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="password" placeholder='parola' />
                        {errorMessage && <h1 className=" text-red-500 font-bold text-lg flex mx-auto">{errorMessage}</h1>}
                        <button className='bg-[#385AA6] hover:bg-[#3f38a6] transition-all duration-300 text-lg border-none p-3 text-gray-50 font-semibold rounded-sm'>Giriş Yap</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login