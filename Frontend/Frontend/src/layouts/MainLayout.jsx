
import {
    useState
} from "react";

import {
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import DashboardSidebar
    from "../components/DashboardSidebar.jsx";

import DashboardHeader
    from "../components/DashboardHeader.jsx";


const MainLayout = () => {

    const {
        user,
        logout
    } = useAuth();


    const navigate =
        useNavigate();


    const [
        mobileSidebarOpen,
        setMobileSidebarOpen
    ] = useState(false);




    const githubProfile =
        user?.githubProfile ||
        user?.github_profile ||
        null;


 
    const handleSidebarNavigate =
        (path) => {

            setMobileSidebarOpen(false);

            navigate(path);

        };


 

    const handleLogout =
        () => {

            logout();

            navigate(
                "/login",
                {
                    replace: true
                }
            );

        };


    return (

        <div className="
            min-h-screen
            bg-[#0b0f14]
            text-slate-100
        ">

            <div className="
                flex
                min-h-screen
            ">


              

                <DashboardSidebar

                    mobileOpen={
                        mobileSidebarOpen
                    }

                    onClose={() =>
                        setMobileSidebarOpen(false)
                    }

                    user={
                        user
                    }

                    githubProfile={
                        githubProfile
                    }

                    onLogout={
                        handleLogout
                    }

                    onNavigate={
                        handleSidebarNavigate
                    }

                />


                {/* =================================
                    MAIN AREA
                ================================= */}

                <div className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    bg-[#0b0f14]
                ">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <DashboardHeader

                        user={
                            user
                        }

                        githubProfile={
                            githubProfile
                        }

                        onLogout={
                            handleLogout
                        }

                        onMenuClick={() =>
                            setMobileSidebarOpen(true)
                        }

                    />


                    {/* =================================
                        PAGE CONTENT
                    ================================= */}

                    <main className="
                        min-w-0
                        flex-1
                    ">

                        <div className="
                            mx-auto
                            w-full
                            max-w-7xl
                            px-4
                            py-7
                            sm:px-6
                            lg:px-8
                            lg:py-8
                        ">

                            <Outlet />

                        </div>

                    </main>

                </div>

            </div>

        </div>

    );

};


export default MainLayout;

