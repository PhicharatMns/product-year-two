import { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "@/components/theme-provider";
import axios from "axios";

interface SidebarItem {
    text: string;
    icon: React.ComponentType<{ size?: number }>;
    link?: string;
    onClick?: () => void;
}

export default function SidebarChief() {
    const [open, setOpen] = useState(false); // sidebar มือถือ
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [Message, setMessage] = useState("");

    //ออกระบบ
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/logins");
    };

    const items: SidebarItem[] = [
        { text: "Dashboard", icon: MdDashboard, link: "/chief/Dashboardchief" },
        { text: "ออกจากระบบ", icon: IoLogOutOutline, onClick: handleLogout },
    ];

    //ดึงข้อมูลมาเเสดงใน sidebar user
    useEffect(() => {
        if (!token) {
            navigate("/logins");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/login/dashboardUser",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log("Sidebar response:", response.data); // <-- เพิ่มบรรทัดนี้
                setMessage(response.data.Name);
            } catch (err) {
                console.error("Fetch sidebar message error:", err); // <-- เพิ่มบรรทัดนี้
            }
        };

        fetchData();
    }, [navigate, token]);
    const { theme } = useTheme();

    const bg = theme === "dark" ? "bg-gray-900" : "bg-blue-100";
    const text = theme === "dark" ? "text-black" : "text-gray-500";
    return (
        <>
            {/* ปุ่มเปิดเมนูมือถือ เเหะๆ */}
            <button
                className="md:hidden fixed top-4 left-4 z-30 text-3xl bg-blue-500 p-2 text-white rounded-lg"
                onClick={() => setOpen(!open)}
            >
                {open ? <IoClose /> : <GiHamburgerMenu />}
            </button>

            {/* Sidebar หลัก */}
            <div
                className={`  ${text} ${bg}  fixed z-20 flex flex-col justify-between h-screen w-64 bg-blue-500 text-white font-bold border-r transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex flex-col">
                    <div className="flex items-center  py-3 p-4 mt-5">
                        <Link
                            to="/user/dashboard"
                            className={`max-w-380 mx-auto text-3xl `}
                        >
                            Tech
                            <span
                                className={` ${theme === "dark" ? "text-yellow-500" : "text-yellow-500"
                                    }`}
                            >
                                Job
                            </span>
                        </Link>
                    </div>

                    {/* Sidebar Items */}
                    <div className="flex flex-col mt-5">
                        {items.map((item, index) => {
                            const Icon = item.icon;

                            if (item.link) {
                                return (
                                    <NavLink
                                        to={item.link}
                                        key={index}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 my-2 pl-5 py-3 cursor-pointer hover:bg-yellow-500 dark:hover:bg-yellow-600 duration-300 ${isActive ? "bg-yellow-500" : ""
                                            }`
                                        }
                                        onClick={() => setOpen(false)}
                                    >
                                        <Icon size={24} />
                                        <span>{item.text}</span>
                                    </NavLink>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setOpen(false);
                                        item.onClick?.();
                                    }}
                                    className={`flex items-center gap-2 my-2 pl-5 py-3 w-full text-left cursor-pointer  duration-300 hover `}
                                >
                                    <Icon size={24} />
                                    <span>{item.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Profile + Theme */}
                <div>
                    <ThemeSwitcher />
                    <Link to="Profile" className="mt-auto">
                        <div className="border-t border-blue-600 bg-blue-900 h-20 flex items-center gap-4 cursor-pointer px-2 hover:bg-blue-700 duration-300">
                            <img
                                src="https://i.pinimg.com/736x/f7/94/54/f79454c439ea58e65d2bb675a1faf77b.jpg"
                                className="object-cover w-10 rounded-full"
                                alt="profile"
                            />
                            <div className="text-lg font-semibold">
                                คุณ <span className="text-yellow-500">{Message}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Overlay มือถือ */}
            {open && (
                <div
                    className="fixed inset-0 bg-black opacity-40 md:hidden z-10"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
}
