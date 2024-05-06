import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';

import { useState } from "react";


const Register = () => {

    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    //! REGİSTER;
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: ''
    })


    //HATA MESAJI;
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8800/auth/register", values);
            if (response.data === "Böyle bir kullanıcı zaten var.") {
                setErrorMessage(response.data);
            } else {
                console.log("Kayıt başarılı.")
                navigate("/login");
            }
        } catch (error) {
            alert("Error");
            console.log(error);
        }
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center h-lvh bg-[url('/images/bg1.png')] bg-cover">
                <div className="bg-[#29323e] flex flex-col items-center w-[440px] py-12 rounded-md opacity-90">
                    <img className=" w-24" src="images/logo2.jpg" />
                    <h1 className='text-2xl font-bold text-gray-200 my-5'>KAYIT</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-y-9'>
                        <div className="flex gap-x-14">
                            <input onChange={e => setValues({ ...values, firstName: e.target.value })} required className='p-[10px] w-[170px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="text" placeholder='isim' />
                            <input onChange={e => setValues({ ...values, lastName: e.target.value })} required className='p-[10px] w-[170px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="text" placeholder='soy isim' />
                        </div>

                        <div className="flex gap-x-14 items-center">
                            <div className="flex flex-col gap-y-9 gap-x-14">
                                <input onChange={e => setValues({ ...values, userName: e.target.value })} required className='p-[10px] w-[170px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="text" placeholder='kullanıcı adı' />
                                <input onChange={e => setValues({ ...values, password: e.target.value })} required className='p-[10px] w-[170px] outline-none text-gray-200 border-b border-gray-200 bg-[#29323e] placeholder:text-gray-50' type="password" placeholder='parola' />
                            </div>

                            <div className="mb-10">
                                <Select className='w-[170px]' id='course' name='course'
                                    // value={courseOptions.find(option => option.value === selectedCourse)}
                                    // onChange={(selectedOption) => setSelectedCourse(selectedOption.value)}
                                    // options={courseOptions}
                                    placeholder="Rol Seçiniz."
                                />
                            </div>
                        </div>


                        {errorMessage && <h1 className=" text-red-500 font-bold text-lg flex mx-auto">{errorMessage}</h1>}
                        <button className='bg-[#385AA6] hover:bg-[#3f38a6] transition-all duration-300 text-lg border-none p-3 text-gray-50 font-semibold rounded-sm'>Kayıt At</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register