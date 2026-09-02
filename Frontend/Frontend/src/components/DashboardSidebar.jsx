
import {
    LayoutDashboard,
    GitBranch,
    Star,
    Activity,
    LogOut,
    X,
    GitFork,
    ChevronRight
} from "lucide-react";

import {
    useLocation
} from "react-router-dom";


// =====================================
// Navigation Items
// =====================================

const navigationItems = [

    {
        label: "Overview",
        path: "/dashboard",
        icon: LayoutDashboard
    },

    {
        label: "Repositories",
        path: "/repositories",
        icon: GitBranch
    },

    {
        label: "Favorites",
        path: "/favorites",
        icon: Star
    },

    {
        label: "Activity",
        path: "/activity",
        icon: Activity
    }

];


// =====================================
// Dashboard Sidebar
// =====================================

const DashboardSidebar = ({

    mobileOpen = false,

    onClose,

    githubProfile,

    onLogout,

    onNavigate

}) => {

    const location =
        useLocation();


    // =====================================
    // Navigation
    // =====================================

    const handleNavigation = (path) => {

        onNavigate?.(path);

    };


    // =====================================
    // Active Route
    // =====================================

    const isActive = (path) => {

        if (path === "/dashboard") {

            return location.pathname === "/dashboard";

        }

        return location.pathname.startsWith(path);

    };


    // =====================================
    // Sidebar Content
    // =====================================

    const sidebarContent = (

        <div className="
            flex
            h-full
            flex-col
            bg-[#0b0f14]
        ">


            {/* =================================
                Brand
            ================================= */}

            <div className="
                flex
                h-[76px]
                shrink-0
                items-center
                justify-between
                border-b
                border-white/[0.06]
                px-5
            ">

                <button

                    type="button"

                    onClick={() =>
                        handleNavigation("/dashboard")
                    }

                    className="
                        group
                        flex
                        items-center
                        gap-3
                        text-left
                    "
                >

                    {/* Logo */}

                    <div className="
                        relative
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-[#0b0f14]
                        shadow-[0_0_25px_rgba(255,255,255,0.08)]
                        transition
                        duration-300
                        group-hover:scale-105
                    ">

                        <GitFork
                            size={20}
                            strokeWidth={2.2}
                        />

                    </div>


                    {/* Brand */}

                    <div>

                        <p className="
                            text-[15px]
                            font-bold
                            tracking-tight
                            text-white
                        ">

                            DevTrack

                        </p>


                        <p className="
                            mt-0.5
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-slate-600
                        ">

                            Developer OS

                        </p>

                    </div>

                </button>


                {/* Mobile Close */}

                <button

                    type="button"

                    onClick={onClose}

                    className="
                        rounded-lg
                        p-2
                        text-slate-500
                        transition
                        hover:bg-white/[0.05]
                        hover:text-white
                        lg:hidden
                    "

                    aria-label="Close sidebar"
                >

                    <X size={19} />

                </button>

            </div>


            {/* =================================
                Navigation
            ================================= */}

            <nav className="
                flex-1
                overflow-y-auto
                px-3
                py-7
            ">


                {/* Section Label */}

                <p className="
                    mb-3
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                ">

                    Workspace

                </p>


                {/* Navigation */}

                <div className="
                    space-y-1
                ">

                    {navigationItems.map(
                        ({
                            label,
                            path,
                            icon: Icon
                        }) => {

                            const active =
                                isActive(path);


                            return (

                                <button

                                    key={path}

                                    type="button"

                                    onClick={() =>
                                        handleNavigation(path)
                                    }

                                    className={`

                                        group
                                        relative
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        py-2.5
                                        text-left
                                        text-[13px]
                                        font-medium
                                        transition-all
                                        duration-200

                                        ${
                                            active

                                                ? `
                                                    bg-white/[0.07]
                                                    text-white
                                                `

                                                : `
                                                    text-slate-500
                                                    hover:bg-white/[0.04]
                                                    hover:text-slate-200
                                                `
                                        }

                                    `}
                                >


                                    {/* Active Indicator */}

                                    {active && (

                                        <span className="
                                            absolute
                                            left-0
                                            top-1/2
                                            h-5
                                            w-[2px]
                                            -translate-y-1/2
                                            rounded-full
                                            bg-emerald-400
                                            shadow-[0_0_10px_rgba(52,211,153,0.6)]
                                        " />

                                    )}


                                    {/* Icon */}

                                    <Icon

                                        size={17}

                                        strokeWidth={
                                            active
                                                ? 2
                                                : 1.7
                                        }

                                        className={`

                                            shrink-0
                                            transition-colors

                                            ${
                                                active

                                                    ? `
                                                        text-emerald-400
                                                    `

                                                    : `
                                                        text-slate-600
                                                        group-hover:text-slate-300
                                                    `
                                            }

                                        `}
                                    />


                                    {/* Label */}

                                    <span className="
                                        flex-1
                                    ">

                                        {label}

                                    </span>


                                    {/* Arrow */}

                                    {active && (

                                        <ChevronRight

                                            size={14}

                                            className="
                                                text-slate-600
                                            "
                                        />

                                    )}

                                </button>

                            );

                        }
                    )}

                </div>

            </nav>


            {/* =================================
                GitHub Connection
            ================================= */}

            <div className="
                mx-4
                mb-4
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                px-3
                py-2.5
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-2
                ">


                    {/* Left */}

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    ">

                        <GitFork

                            size={14}

                            className="
                                shrink-0
                                text-slate-500
                            "

                        />


                        <span className="
                            truncate
                            text-[10px]
                            font-medium
                            text-slate-500
                        ">

                            GitHub

                        </span>

                    </div>


                    {/* Status */}

                    <div className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                    ">

                        <span
                            className={`

                                h-1.5
                                w-1.5
                                rounded-full

                                ${
                                    githubProfile

                                        ? `
                                            bg-emerald-400
                                            shadow-[0_0_7px_rgba(52,211,153,0.7)]
                                        `

                                        : `
                                            bg-slate-600
                                        `
                                }

                            `}
                        />


                        <span className="
                            text-[10px]
                            font-medium
                            text-slate-600
                        ">

                            {githubProfile
                                ? "Connected"
                                : "Offline"
                            }

                        </span>

                    </div>

                </div>

            </div>


            {/* =================================
                Logout
            ================================= */}

            <div className="
                shrink-0
                border-t
                border-white/[0.06]
                p-3
            ">

                <button

                    type="button"

                    onClick={onLogout}

                    className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-[13px]
                        font-medium
                        text-slate-500
                        transition
                        hover:bg-red-500/[0.06]
                        hover:text-red-300
                    "
                >

                    <LogOut

                        size={17}

                        strokeWidth={1.7}

                        className="
                            transition
                            group-hover:text-red-400
                        "

                    />


                    <span>

                        Sign out

                    </span>

                </button>


                <p className="
                    mt-3
                    px-3
                    text-[9px]
                    font-medium
                    tracking-wide
                    text-slate-700
                ">

                    DevTrack · Developer OS

                </p>

            </div>

        </div>

    );


    // =====================================
    // Render
    // =====================================

    return (

        <>


            {/* =================================
                Desktop Sidebar
            ================================= */}

            <aside className="
                hidden
                w-[260px]
                shrink-0
                border-r
                border-white/[0.06]
                bg-[#0b0f14]
                lg:block
            ">

                <div className="
                    sticky
                    top-0
                    h-screen
                ">

                    {sidebarContent}

                </div>

            </aside>


            {/* =================================
                Mobile Sidebar
            ================================= */}

            {mobileOpen && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    lg:hidden
                ">


                    {/* Overlay */}

                    <button

                        type="button"

                        aria-label="Close sidebar"

                        onClick={onClose}

                        className="
                            absolute
                            inset-0
                            bg-black/70
                            backdrop-blur-sm
                        "

                    />


                    {/* Drawer */}

                    <aside className="
                        relative
                        z-10
                        h-full
                        w-[260px]
                        max-w-[85vw]
                        border-r
                        border-white/[0.06]
                        bg-[#0b0f14]
                        shadow-2xl
                    ">

                        {sidebarContent}

                    </aside>

                </div>

            )}

        </>

    );

};


export default DashboardSidebar;

