
import {
    Menu,
    ChevronDown,
    LogOut,
    CircleCheck
} from "lucide-react";

import {
    useState,
    useRef,
    useEffect
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";


// =====================================
// Dashboard Header
// =====================================

const DashboardHeader = ({
    user,
    githubProfile,
    onLogout,
    onMenuClick
}) => {

    // =================================
    // Router
    // =================================

    const location = useLocation();

    const navigate = useNavigate();


    // =================================
    // State
    // =================================

    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);


    const menuRef =
        useRef(null);


    // =================================
    // User Information
    // =================================

    const userName =
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "User";


    const userEmail =
        user?.email ||
        "";


    const githubUsername =
        githubProfile?.login ||
        "";


    const avatarUrl =
        githubProfile?.avatar_url ||
        user?.avatar ||
        null;


    // =================================
    // Current Page
    // =================================

    const getPageInfo = () => {

        const path =
            location.pathname;


        if (path.startsWith("/repositories")) {

            return {
                section: "Workspace",
                title: "Repositories"
            };

        }


        if (path.startsWith("/favorites")) {

            return {
                section: "Workspace",
                title: "Favorites"
            };

        }


        if (path.startsWith("/activity")) {

            return {
                section: "Workspace",
                title: "Activity"
            };

        }


        return {
            section: "Workspace",
            title: "Dashboard"
        };

    };


    const pageInfo =
        getPageInfo();


    // =================================
    // Close Menu When Clicking Outside
    // =================================

    useEffect(() => {

        const handleClickOutside =
            (event) => {

                if (
                    menuRef.current &&
                    !menuRef.current.contains(
                        event.target
                    )
                ) {

                    setMenuOpen(false);

                }

            };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =================================
    // Close Menu On Route Change
    // =================================

    useEffect(() => {

        setMenuOpen(false);

    }, [
        location.pathname
    ]);


    // =================================
    // Logout
    // =================================

    const handleLogout = () => {

        setMenuOpen(false);

        onLogout?.();

    };


    // =================================
    // Navigation
    // =================================

    const handleNavigation =
        (path) => {

            setMenuOpen(false);

            navigate(path);

        };


    // =================================
    // Render
    // =================================

    return (

        <header className="
            sticky
            top-0
            z-40
            border-b
            border-white/[0.06]
            bg-[#0b0f14]/90
            backdrop-blur-2xl
        ">

            <div className="
                flex
                h-[72px]
                items-center
                justify-between
                gap-4
                px-4
                sm:px-6
                lg:px-8
            ">


                {/* =================================
                    Left Side
                ================================= */}

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                ">


                    {/* =================================
                        Mobile Menu
                    ================================= */}

                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open sidebar"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-slate-400
                            transition-all
                            duration-200
                            hover:border-white/[0.10]
                            hover:bg-white/[0.06]
                            hover:text-white
                            lg:hidden
                        "
                    >

                        <Menu
                            size={19}
                            strokeWidth={2}
                        />

                    </button>


                    {/* =================================
                        Page Context
                    ================================= */}

                    <div className="
                        min-w-0
                    ">


                        {/* Breadcrumb */}

                        <div className="
                            hidden
                            items-center
                            gap-2
                            sm:flex
                        ">

                            <span className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-slate-600
                            ">

                                {pageInfo.section}

                            </span>


                            <span className="
                                text-slate-700
                            ">

                                /

                            </span>


                            <span className="
                                text-[11px]
                                font-medium
                                text-slate-500
                            ">

                                {pageInfo.title}

                            </span>

                        </div>


                        {/* Title */}

                        <h1 className="
                            mt-0.5
                            truncate
                            text-base
                            font-semibold
                            tracking-tight
                            text-white
                            sm:text-lg
                        ">

                            {pageInfo.title}

                        </h1>

                    </div>

                </div>


                {/* =================================
                    Right Side
                ================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    sm:gap-3
                ">


                    {/* =================================
                        GitHub Status
                    ================================= */}

                    <div className="
                        hidden
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        px-3
                        py-2
                        md:flex
                    ">

                        <div className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/[0.05]
                        ">

                            <CircleCheck
                                size={14}
                                className={
                                    githubProfile
                                        ? "text-emerald-400"
                                        : "text-slate-600"
                                }
                            />

                        </div>


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <span className="
                                max-w-28
                                truncate
                                text-xs
                                font-medium
                                text-slate-400
                            ">

                                {githubUsername
                                    ? `@${githubUsername}`
                                    : "GitHub"
                                }

                            </span>


                            <span
                                className={`
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    ${
                                        githubProfile
                                            ? "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.6)]"
                                            : "bg-slate-600"
                                    }
                                `}
                            />

                        </div>

                    </div>


                    {/* =================================
                        Divider
                    ================================= */}

                    <div className="
                        hidden
                        h-7
                        w-px
                        bg-white/[0.06]
                        md:block
                    " />


                    {/* =================================
                        User Menu
                    ================================= */}

                    <div
                        ref={menuRef}
                        className="
                            relative
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen(
                                    (current) =>
                                        !current
                                )
                            }
                            aria-expanded={
                                menuOpen
                            }
                            aria-label="Open user menu"
                            className={`
                                flex
                                items-center
                                gap-2.5
                                rounded-xl
                                border
                                p-1.5
                                transition-all
                                duration-200
                                ${
                                    menuOpen
                                        ? "border-white/[0.12] bg-white/[0.06]"
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.05]"
                                }
                            `}
                        >


                            {/* Avatar */}

                            {avatarUrl ? (

                                <img
                                    src={avatarUrl}
                                    alt={userName}
                                    className="
                                        h-8
                                        w-8
                                        rounded-lg
                                        object-cover
                                        ring-1
                                        ring-white/[0.10]
                                    "
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-slate-800
                                    text-xs
                                    font-semibold
                                    text-slate-200
                                ">

                                    {userName
                                        .charAt(0)
                                        .toUpperCase()
                                    }

                                </div>

                            )}


                            {/* User Details */}

                            <div className="
                                hidden
                                max-w-32
                                text-left
                                lg:block
                            ">

                                <p className="
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-slate-200
                                ">

                                    {userName}

                                </p>


                                <p className="
                                    mt-0.5
                                    truncate
                                    text-[10px]
                                    text-slate-600
                                ">

                                    {githubUsername
                                        ? `@${githubUsername}`
                                        : userEmail
                                    }

                                </p>

                            </div>


                            <ChevronDown
                                size={14}
                                className={`
                                    hidden
                                    text-slate-600
                                    transition-transform
                                    duration-200
                                    lg:block
                                    ${
                                        menuOpen
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </button>


                        {/* =================================
                            Dropdown
                        ================================= */}

                        {menuOpen && (

                            <div className="
                                absolute
                                right-0
                                top-[calc(100%+10px)]
                                z-50
                                w-64
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.08]
                                bg-[#10151c]
                                shadow-2xl
                                shadow-black/40
                            ">


                                {/* =================================
                                    Dropdown Header
                                ================================= */}

                                <div className="
                                    border-b
                                    border-white/[0.06]
                                    bg-white/[0.015]
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">


                                        {/* Avatar */}

                                        {avatarUrl ? (

                                            <img
                                                src={avatarUrl}
                                                alt={userName}
                                                className="
                                                    h-10
                                                    w-10
                                                    rounded-xl
                                                    object-cover
                                                    ring-1
                                                    ring-white/[0.10]
                                                "
                                            />

                                        ) : (

                                            <div className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-slate-800
                                                text-sm
                                                font-semibold
                                                text-slate-200
                                            ">

                                                {userName
                                                    .charAt(0)
                                                    .toUpperCase()
                                                }

                                            </div>

                                        )}


                                        <div className="
                                            min-w-0
                                        ">

                                            <p className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-white
                                            ">

                                                {userName}

                                            </p>


                                            <p className="
                                                mt-0.5
                                                truncate
                                                text-xs
                                                text-slate-500
                                            ">

                                                {userEmail}

                                            </p>

                                        </div>

                                    </div>


                                    {/* GitHub Connection */}

                                    <div className="
                                        mt-3
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-[#0b0f14]
                                        px-3
                                        py-2
                                    ">

                                        <CircleCheck
                                            size={14}
                                            className={
                                                githubProfile
                                                    ? "text-emerald-400"
                                                    : "text-slate-600"
                                            }
                                        />


                                        <span className="
                                            text-[11px]
                                            font-medium
                                            text-slate-400
                                        ">

                                            {githubProfile
                                                ? "GitHub connected"
                                                : "GitHub not connected"
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* =================================
                                    Navigation Menu
                                ================================= */}

                                <div className="p-2">


                                    {/* Dashboard */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(
                                                "/dashboard"
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            text-slate-400
                                            transition
                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                    >

                                        <span>
                                            Dashboard
                                        </span>

                                    </button>


                                    {/* Repositories */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(
                                                "/repositories"
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            text-slate-400
                                            transition
                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                    >

                                        <span>
                                            Repositories
                                        </span>

                                    </button>


                                    {/* Favorites */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(
                                                "/favorites"
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            text-slate-400
                                            transition
                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                    >

                                        <span>
                                            Favorites
                                        </span>

                                    </button>


                                    {/* Activity */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(
                                                "/activity"
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            text-slate-400
                                            transition
                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                    >

                                        <span>
                                            Activity
                                        </span>

                                    </button>


                                    {/* Divider */}

                                    <div className="
                                        my-2
                                        h-px
                                        bg-white/[0.06]
                                    " />


                                    {/* Logout */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            text-red-400
                                            transition
                                            hover:bg-red-950/30
                                            hover:text-red-300
                                        "
                                    >

                                        <LogOut
                                            size={16}
                                            strokeWidth={1.8}
                                        />

                                        <span>
                                            Sign out
                                        </span>

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>

    );

};


export default DashboardHeader;

