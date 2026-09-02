
    import {
        BookOpen,
        GitCommitHorizontal,
        GitFork,
        Star,
        Users,
        Activity
    } from "lucide-react";


    // =====================================
    // Stats Cards
    // =====================================

    const StatsCards = ({
        githubProfile = null,
        repositories = [],
        events = []
    }) => {


        // =================================
        // Repository Statistics
        // =================================

        const repositoryCount =
            Array.isArray(repositories)
                ? repositories.length
                : 0;


        const totalStars =
            Array.isArray(repositories)
                ? repositories.reduce(
                    (total, repository) =>
                        total +
                        Number(
                            repository?.stargazers_count || 0
                        ),
                    0
                )
                : 0;


        const totalForks =
            Array.isArray(repositories)
                ? repositories.reduce(
                    (total, repository) =>
                        total +
                        Number(
                            repository?.forks_count || 0
                        ),
                    0
                )
                : 0;


        // =================================
        // Profile Statistics
        // =================================

        const followers =
            Number(
                githubProfile?.followers || 0
            );


        // =================================
        // Events Statistics
        // =================================

        const activityCount =
            Array.isArray(events)
                ? events.length
                : 0;


        // =================================
        // Format Number
        // =================================

        const formatNumber = (number) => {

            if (number >= 1000000) {

                return `${(
                    number / 1000000
                ).toFixed(1)}M`;

            }


            if (number >= 1000) {

                return `${(
                    number / 1000
                ).toFixed(1)}K`;

            }


            return number.toLocaleString();

        };


        // =================================
        // Statistics
        // =================================

        const stats = [

            {
                title: "Repositories",

                value:
                    formatNumber(
                        repositoryCount
                    ),

                description:
                    "GitHub repositories",

                icon:
                    BookOpen

            },


            {
                title: "Stars",

                value:
                    formatNumber(
                        totalStars
                    ),

                description:
                    "Total repository stars",

                icon:
                    Star

            },


            {
                title: "Forks",

                value:
                    formatNumber(
                        totalForks
                    ),

                description:
                    "Total repository forks",

                icon:
                    GitFork

            },


            {
                title: "Followers",

                value:
                    formatNumber(
                        followers
                    ),

                description:
                    "GitHub followers",

                icon:
                    Users

            }

        ];


        // =================================
        // Render
        // =================================

        return (

            <div className="
                grid
                gap-5
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                {stats.map(
                    (stat) => {

                        const Icon =
                            stat.icon;


                        return (

                            <div
                                key={stat.title}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-700/70
                                    bg-slate-800/60
                                    p-5
                                    shadow-xl
                                    shadow-black/10
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:border-slate-600
                                "
                            >

                                {/* =============================
                                    Background Decoration
                                ============================== */}

                                <div className="
                                    pointer-events-none
                                    absolute
                                    -right-8
                                    -top-8
                                    h-24
                                    w-24
                                    rounded-full
                                    bg-slate-700/20
                                    blur-2xl
                                " />


                                {/* =============================
                                    Header
                                ============================== */}

                                <div className="
                                    relative
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-slate-700
                                        bg-slate-900/70
                                        text-slate-300
                                        transition
                                        group-hover:text-slate-100
                                    ">

                                        <Icon
                                            size={21}
                                            strokeWidth={1.8}
                                        />

                                    </div>


                                    <span className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        border-slate-700
                                        bg-slate-900/50
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-medium
                                        text-slate-500
                                    ">

                                        <Activity
                                            size={12}
                                        />

                                        GitHub

                                    </span>

                                </div>


                                {/* =============================
                                    Value
                                ============================== */}

                                <div className="
                                    relative
                                    mt-5
                                ">

                                    <p className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-slate-100
                                    ">

                                        {stat.value}

                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-slate-300
                                    ">

                                        {stat.title}

                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    ">

                                        {stat.description}

                                    </p>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        );

    };


    export default StatsCards;

