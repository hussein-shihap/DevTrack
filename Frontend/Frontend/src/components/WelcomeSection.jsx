
import {
    ArrowUpRight,
   
    Sparkles
} from "lucide-react";


// =====================================
// Welcome Section
// =====================================

const WelcomeSection = ({
    user,
    githubProfile
}) => {

    // =================================
    // User Name
    // =================================

    const userName =
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "Developer";


    // =================================
    // GitHub Username
    // =================================

    const githubUsername =
        githubProfile?.login ||
        null;


    // =================================
    // Current Hour
    // =================================

    const currentHour =
        new Date().getHours();


    let greeting = "Good evening";


    if (currentHour < 12) {

        greeting = "Good morning";

    } else if (currentHour < 18) {

        greeting = "Good afternoon";

    }


    // =================================
    // Description
    // =================================

    const description =
        githubUsername
            ? "Track your repositories, commits, activity and development progress from one place."
            : "Connect your GitHub account and turn your development activity into useful insights.";


    return (

        <section className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            shadow-2xl
            shadow-black/10
        ">


            {/* =================================
                Background
            ================================= */}

            <div className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.10),transparent_30%)]
            " />

            <div className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-emerald-500/[0.04]
                blur-3xl
            " />

            <div className="
                pointer-events-none
                absolute
                -bottom-32
                left-1/3
                h-64
                w-64
                rounded-full
                bg-blue-500/[0.03]
                blur-3xl
            " />


            {/* =================================
                Top Accent
            ================================= */}

            <div className="
                absolute
                left-0
                right-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-emerald-500/50
                to-transparent
            " />


            {/* =================================
                Content
            ================================= */}

            <div className="
                relative
                z-10
                flex
                flex-col
                gap-8
                px-6
                py-7
                sm:px-8
                sm:py-8
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">


                {/* =================================
                    Left Content
                ================================= */}

                <div className="
                    min-w-0
                    max-w-3xl
                ">


                    {/* Status */}

                    <div className="
                        mb-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-slate-800
                        bg-slate-950/60
                        px-3
                        py-1.5
                    ">

                        <span className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-500/10
                        ">

                            <Sparkles
                                className="
                                    h-3
                                    w-3
                                    text-emerald-400
                                "
                            />

                        </span>


                        <span className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-slate-400
                        ">

                            {githubUsername
                                ? "Developer Overview"
                                : "Welcome to DevTrack"
                            }

                        </span>


                        {githubUsername && (

                            <span className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-400
                                shadow-lg
                                shadow-emerald-400/40
                            " />

                        )}

                    </div>


                    {/* Heading */}

                    <h1 className="
                        text-3xl
                        font-bold
                        leading-tight
                        tracking-tight
                        text-white
                        sm:text-4xl
                        lg:text-[2.65rem]
                    ">

                        {greeting},{" "}

                        <span className="
                            bg-gradient-to-r
                            from-emerald-400
                            to-teal-300
                            bg-clip-text
                            text-transparent
                        ">

                            {userName}

                        </span>

                        <span className="ml-2">
                            👋
                        </span>

                    </h1>


                    {/* Description */}

                    <p className="
                        mt-3
                        max-w-2xl
                        text-sm
                        leading-6
                        text-slate-400
                        sm:text-base
                    ">

                        {description}

                    </p>


                    {/* Quick Status */}

                    <div className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">


                        {/* GitHub status */}

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950/50
                            px-3
                            py-2
                        ">



                            <span className="
                                text-xs
                                font-medium
                                text-slate-300
                            ">

                                {githubUsername
                                    ? `@${githubUsername}`
                                    : "GitHub not connected"
                                }

                            </span>


                            {githubUsername && (

                                <span className="
                                    ml-1
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-400
                                " />

                            )}

                        </div>


                        {/* Tracking status */}

                        {githubUsername && (

                            <div className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-800
                                bg-slate-950/50
                                px-3
                                py-2
                            ">

                                <span className="
                                    text-xs
                                    text-slate-500
                                ">

                                    Tracking

                                </span>


                                <span className="
                                    text-xs
                                    font-semibold
                                    text-emerald-400
                                ">

                                    Active

                                </span>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================
                    GitHub Profile Card
                ================================= */}

                {githubProfile ? (

                    <div className="
                        w-full
                        shrink-0
                        lg:w-[300px]
                    ">


                        <div className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-950/70
                            p-4
                            transition
                            duration-300
                            hover:border-slate-700
                            hover:bg-slate-950
                        ">


                            {/* Card glow */}

                            <div className="
                                pointer-events-none
                                absolute
                                -right-10
                                -top-10
                                h-28
                                w-28
                                rounded-full
                                bg-emerald-500/10
                                blur-2xl
                            " />


                            <div className="
                                relative
                                flex
                                items-center
                                gap-4
                            ">


                                {/* Avatar */}

                                {githubProfile.avatar_url ? (

                                    <img
                                        src={
                                            githubProfile.avatar_url
                                        }
                                        alt={
                                            githubProfile.login ||
                                            "GitHub profile"
                                        }
                                        className="
                                            h-14
                                            w-14
                                            rounded-2xl
                                            object-cover
                                            ring-1
                                            ring-slate-700
                                            transition
                                            duration-300
                                            group-hover:ring-emerald-500/30
                                        "
                                    />

                                ) : (

                                    <div className="
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-slate-800
                                        text-lg
                                        font-bold
                                        text-slate-300
                                    ">

                                        {(
                                            githubProfile.login ||
                                            "G"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                        }

                                    </div>

                                )}


                                {/* User Info */}

                                <div className="
                                    min-w-0
                                    flex-1
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-2
                                    ">

                                        <p className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-white
                                        ">

                                            {githubProfile.name ||
                                                githubProfile.login ||
                                                "GitHub User"
                                            }

                                        </p>


                                        <ArrowUpRight
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-slate-600
                                                transition
                                                group-hover:text-emerald-400
                                            "
                                        />

                                    </div>


                                    <p className="
                                        mt-1
                                        truncate
                                        text-xs
                                        text-slate-500
                                    ">

                                        @{githubProfile.login}

                                    </p>

                                </div>

                            </div>


                            {/* Divider */}

                            <div className="
                                my-4
                                h-px
                                bg-slate-800
                            " />


                            {/* Profile Stats */}

                            <div className="
                                grid
                                grid-cols-3
                                gap-2
                            ">


                                <div>

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-200
                                    ">

                                        {githubProfile.public_repos ?? 0}

                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                    ">

                                        Repos

                                    </p>

                                </div>


                                <div>

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-200
                                    ">

                                        {githubProfile.followers ?? 0}

                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                    ">

                                        Followers

                                    </p>

                                </div>


                                <div>

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-200
                                    ">

                                        {githubProfile.following ?? 0}

                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                    ">

                                        Following

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                ) : (

                    /* =================================
                       Not Connected
                    ================================= */

                    <div className="
                        hidden
                        shrink-0
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-700
                        bg-slate-950/40
                        px-5
                        py-4
                        lg:flex
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-800
                        ">

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-slate-300
                            ">

                                Connect GitHub

                            </p>


                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-600
                            ">

                                Start tracking your activity

                            </p>

                        </div>

                    </div>

                )}

            </div>

        </section>

    );

};


export default WelcomeSection;

