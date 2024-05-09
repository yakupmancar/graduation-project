
import { useState } from 'react';
import '../assets/sidebar.css';
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { VscCalendar } from "react-icons/vsc";
import { FaCodeBranch } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import { TfiAgenda } from "react-icons/tfi";
import { FaLandmark } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoPeopleOutline } from "react-icons/io5";
import { FaCriticalRole } from "react-icons/fa";




const Sidebar = () => {

    const [isChecked, setIsChecked] = useState(false);
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const [activeLink, setActiveLink] = useState(""); // State for active link
    const handleActiveLink = (path) => {
        setActiveLink(path); // Update active link on click
    };

    return (
        <aside className="sidebar flex flex-col px-1">
            <input type="checkbox" name="yakup" id="yakup" onChange={handleToggle} />

            <label htmlFor="yakup" className="toggle cursor-pointer">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
                </svg>
            </label>

            <nav className="menu flex flex-col mt-3 mb-6 gap-y-3">

                <Link to="/" className={`flex gap-x-2 px-3 mb-6 ${activeLink === "/" ? "active" : ""}`} onClick={() => handleActiveLink("/")}>
                    <span className="text-2xl">
                        <FaHome />
                    </span>
                    <span className={`text-xl ${isChecked ? 'hidden' : ''}`}>Anasayfa</span>
                </Link>


                <Link to="/donemler" className={`flex gap-x-2 px-3 ${activeLink === "/donemler" ? "active" : ""}`} onClick={() => handleActiveLink("/donemler")} >
                    <span className='text-xl'>
                        <TfiAgenda />
                    </span>
                    <span className={`duration-150 ${isChecked ? 'hidden' : ''}`}>Dönemler</span>
                </Link>

                <Link to="/dersler" className={`flex gap-x-2 px-3 ${activeLink === "/dersler" ? "active" : ""}`} onClick={() => handleActiveLink("/dersler")} >
                    <span className='text-xl'>
                        <SiBookstack />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Dersler</span>
                </Link>

                <Link to="/derslikler" className={`flex gap-x-2 px-3 ${activeLink === "/derslikler" ? "active" : ""}`} onClick={() => handleActiveLink("/derslikler")}>
                    <span className='text-xl'>
                        <FaLandmark />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Derslikler</span>
                </Link>

                <Link to="/subeler" className={`flex gap-x-2 px-3 ${activeLink === "/subeler" ? "active" : ""}`} onClick={() => handleActiveLink("/subeler")}>
                    <span className='text-xl'>
                        <FaCodeBranch />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Şubeler</span>
                </Link>

                <Link to="/dersTakvimi" className={`flex gap-x-2 px-3 ${activeLink === "/dersTakvimi" ? "active" : ""}`} onClick={() => handleActiveLink("/dersTakvimi")}>
                    <span className='text-xl'>
                        <VscCalendar />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Ders Takvimi</span>
                </Link>
                <Link to="/sinavTakvimi" className={`flex gap-x-2 px-3 ${activeLink === "/sinavTakvimi" ? "active" : ""}`} onClick={() => handleActiveLink("/sinavTakvimi")}>
                    <span className='text-xl'>
                        <MdOutlineCalendarMonth />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Sınav Takvimi</span>
                </Link>

                <div className='border border-gray-300 mr-5 ml-3 my-3'></div>

                <Link to="/ogretimUyeleri" className={`flex gap-x-2 px-3 ${activeLink === "/ogretimUyeleri" ? "active" : ""}`} onClick={() => handleActiveLink("/ogretimUyeleri")}>
                    <span className='text-xl'>
                        <BsFillPeopleFill />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Öğretim Üyeleri</span>
                </Link>

                <Link to="/gozetmenUyeler" className={`flex gap-x-2 px-3 ${activeLink === "/gozetmenUyeler" ? "active" : ""}`} onClick={() => handleActiveLink("/gozetmenUyeler")}>
                    <span className='text-xl'>
                        <IoPeopleOutline />
                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Gözetmen Üyeler</span>
                </Link>

                <Link to="/roller" className={`flex gap-x-2 px-3 ${activeLink === "/roller" ? "active" : ""}`} onClick={() => handleActiveLink("/roller")}>
                    <span className='text-xl'>
                        <FaCriticalRole />

                    </span>
                    <span className={`${isChecked ? 'hidden' : ''}`}>Roller</span>
                </Link>

            </nav>
        </aside>
    )
}

export default Sidebar


