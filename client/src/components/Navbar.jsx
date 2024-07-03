import React, { useContext, useEffect, useRef, useState } from 'react'
import logo1 from "../../images/logo1.png";
import logo2 from "../../images/logo2.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUser } from "react-icons/fa";


const Navbar = () => {

    const { currentUser, logout } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const node = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (node.current.contains(e.target)) {
                return;
            }
            setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='bg-[#29323e] py-3' ref={node}>
            <nav className='flex items-center justify-between max-w-7xl mx-auto'>
                <section className='flex items-center gap-x-10'>
                    <div className='flex gap-x-2'>
                        <img className='w-16 h-16' src={logo1} />
                        <img className='w-16 h-16' src={logo2} />
                    </div>
                </section>

                <section className='flex gap-x- items-center'>
                    <h1 className='text-xl text-gray-300 font-bold'>AKADEMİK TAKVİM YÖNETİM PLATFORMU</h1>
                    <img className='w-20' src="../../images/schedule2.png" alt="" />
                </section>

                <section className='flex gap-x-8 items-center'>

                    {currentUser?.role == "Admin" && (
                        <Link to="/register">
                            <button className='font-semibold px-3 py-1 text-gray-300 border-l border-b rounded-md'>Kullanıcı Kaydı</button>
                        </Link>
                    )}

                    <div className='text-gray-300 relative border-l border-b rounded-md px-3 py-1'>
                        <button onClick={toggleOpen}>
                            <div className='flex items-center gap-x-1'>
                                <FaUser />
                                <span>{currentUser?.userName}</span>
                                <IoMdArrowDropdown />
                            </div>
                        </button>

                        {isOpen && (
                            <div className='flex flex-col bg-[#29323e] rounded-md shadow-xl px-2 py-2 gap-y-2 mt-3 absolute min-w-40 border border-gray-400'>
                                <span className='px-1 font-semibold'>{currentUser?.firstName + " " + currentUser?.lastName}</span>
                                <div className='border border-gray-400 my-1 mx-1'></div>
                                <Link to={`/profil/${currentUser?.userID}`} className='hover:bg-gray-600 px-2 py-1 rounded-md w-full'>Profilim</Link>
                                <Link className='flex items-center gap-x-2 hover:bg-gray-600 px-1 py-1 rounded-md w-full' to="/login">
                                    <button onClick={logout}>Çıkış Yap</button>
                                    <i class="fa-solid fa-arrow-right-to-bracket pt-1"></i>
                                </Link>
                            </div>
                        )}
                    </div>

                </section>
            </nav>

        </div>
    )
}

export default Navbar

