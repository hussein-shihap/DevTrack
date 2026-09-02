import {
    Activity,
    GitCommitHorizontal,
    GitBranch,
    GitPullRequest,
    CircleDot,
    Star,
    GitFork,
    Plus,
    Trash2,
    ExternalLink,
    MessageSquare,
    Clock,
    ArrowUpRight
} from "lucide-react";


// =====================================
// Helpers
// =====================================

const capitalize = (value) => {

    if (!value) {
        return "";
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

};


const formatEventType = (value) => {

    if (!value) {
        return "Activity";
    }

    return value
        .replace(/Event$/, "")
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        );

};


const formatRelativeTime = (date) => {

    if (!date) {
        return "";
    }

    const eventDate =
        new Date(date);

    if (
        Number.isNaN(
            eventDate.getTime()
        )
    ) {
        return "";
    }

    const now =
        new Date();

    const difference =
        Math.floor(
            (
                now.getTime() -
                eventDate.getTime()
            ) / 1000
        );


    if (difference < 60) {
        return "just now";
    }


    if (difference < 3600) {

        return `${Math.floor(
            difference / 60
        )}m ago`;

    }


    if (difference < 86400) {

        return `${Math.floor(
            difference / 3600
        )}h ago`;

    }


    if (difference < 2592000) {

        return `${Math.floor(
            difference / 86400
        )}d ago`;

    }


    return eventDate.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );

};


const getRepositoryName = (event) => {

    return (
        event?.repo?.name ||
        "Unknown repository"
    );

};


const getRepositoryUrl = (event) => {

    const repositoryName =
        event?.repo?.name;

    if (!repositoryName) {
        return null;
    }

    return `https://github.com/${repositoryName}`;

};


// =====================================
// Event Information
// =====================================

const getEventInfo = (event) => {

    const type =
        event?.type;


    switch (type) {

        case "PushEvent": {

            const commitCount =
                event?.payload?.commits?.length || 0;

            return {

                icon: GitCommitHorizontal,

                title:
                    commitCount === 1
                        ? "Pushed 1 commit"
                        : `Pushed ${commitCount} commits`,

                color:
                    "text-emerald-400",

                bg:
                    "bg-emerald-500/10"

            };

        }


        case "CreateEvent": {

            const refType =
                event?.payload?.ref_type ||
                "resource";

            return {

                icon: Plus,

                title:
                    `Created ${refType}`,

                color:
                    "text-blue-400",

                bg:
                    "bg-blue-500/10"

            };

        }


        case "DeleteEvent": {

            const refType =
                event?.payload?.ref_type ||
                "resource";

            return {

                icon: Trash2,

                title:
                    `Deleted ${refType}`,

                color:
                    "text-red-400",

                bg:
                    "bg-red-500/10"

            };

        }


        case "PullRequestEvent": {

            const action =
                event?.payload?.action ||
                "updated";

            return {

                icon: GitPullRequest,

                title:
                    `${capitalize(action)} pull request`,

                color:
                    "text-purple-400",

                bg:
                    "bg-purple-500/10"

            };

        }


        case "IssuesEvent": {

            const action =
                event?.payload?.action ||
                "updated";

            return {

                icon: CircleDot,

                title:
                    `${capitalize(action)} issue`,

                color:
                    "text-orange-400",

                bg:
                    "bg-orange-500/10"

            };

        }


        case "IssueCommentEvent":

            return {

                icon: MessageSquare,

                title:
                    "Commented on an issue",

                color:
                    "text-cyan-400",

                bg:
                    "bg-cyan-500/10"

            };


        case "WatchEvent":

            return {

                icon: Star,

                title:
                    "Starred a repository",

                color:
                    "text-yellow-400",

                bg:
                    "bg-yellow-500/10"

            };


        case "ForkEvent":

            return {

                icon: GitFork,

                title:
                    "Forked a repository",

                color:
                    "text-indigo-400",

                bg:
                    "bg-indigo-500/10"

            };


        case "ReleaseEvent": {

            const action =
                event?.payload?.action ||
                "published";

            return {

                icon: GitBranch,

                title:
                    `${capitalize(action)} a release`,

                color:
                    "text-pink-400",

                bg:
                    "bg-pink-500/10"

            };

        }


        default:

            return {

                icon: Activity,

                title:
                    formatEventType(type),

                color:
                    "text-slate-400",

                bg:
                    "bg-slate-800"

            };

    }

};


// =====================================
// Recent Activity
// =====================================

const RecentActivity = ({
    events = []
}) => {


    // =================================
    // Empty State
    // =================================

    if (
        !Array.isArray(events) ||
        events.length === 0
    ) {

        return (

            <section className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                shadow-xl
                shadow-black/10
            ">

                {/* Header */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-800
                    px-5
                    py-5
                    sm:px-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950
                            text-slate-400
                        ">

                            <Activity
                                size={18}
                            />

                        </div>


                        <div>

                            <h2 className="
                                text-sm
                                font-semibold
                                text-white
                            ">

                                Recent activity

                            </h2>


                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            ">

                                Your latest GitHub events

                            </p>

                        </div>

                    </div>

                </div>


                {/* Empty */}

                <div className="
                    flex
                    min-h-72
                    flex-col
                    items-center
                    justify-center
                    px-6
                    text-center
                ">

                    <div className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-950
                        text-slate-600
                    ">

                        <Clock
                            size={26}
                        />

                    </div>


                    <h3 className="
                        mt-5
                        text-sm
                        font-semibold
                        text-slate-300
                    ">

                        No activity yet

                    </h3>


                    <p className="
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-slate-500
                    ">

                        Your GitHub activity will appear
                        here when you start creating,
                        committing, or interacting with
                        repositories.

                    </p>

                </div>

            </section>

        );

    }


    // =================================
    // Activity List
    // =================================

    return (

        <section className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            shadow-xl
            shadow-black/10
        ">


            {/* =================================
                Header
            ================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
                px-5
                py-5
                sm:px-6
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-950
                        text-slate-300
                    ">

                        <Activity
                            size={18}
                        />

                    </div>


                    <div>

                        <h2 className="
                            text-sm
                            font-semibold
                            text-white
                        ">

                            Recent activity

                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        ">

                            Latest GitHub events

                        </p>

                    </div>

                </div>


                <div className="
                    rounded-full
                    border
                    border-slate-800
                    bg-slate-950
                    px-3
                    py-1.5
                ">

                    <span className="
                        text-xs
                        font-medium
                        text-slate-400
                    ">

                        {events.length} events

                    </span>

                </div>

            </div>


            {/* =================================
                Timeline
            ================================= */}

            <div className="
                relative
                px-5
                py-3
                sm:px-6
            ">


                {/* Timeline Line */}

                <div className="
                    absolute
                    bottom-8
                    left-[39px]
                    top-8
                    w-px
                    bg-slate-800
                    sm:left-[43px]
                " />


                {events.map(
                    (
                        event,
                        index
                    ) => {

                        const {

                            icon: Icon,

                            title,

                            color,

                            bg

                        } =
                            getEventInfo(
                                event
                            );


                        const repositoryName =
                            getRepositoryName(
                                event
                            );


                        const repositoryUrl =
                            getRepositoryUrl(
                                event
                            );


                        const branch =
                            event?.payload?.ref;


                        const commit =
                            event?.payload?.commits?.[0];


                        return (

                            <article
                                key={
                                    event?.id ||
                                    `${event?.type}-${index}`
                                }
                                className="
                                    group
                                    relative
                                    flex
                                    gap-4
                                    rounded-2xl
                                    py-4
                                    transition
                                    hover:bg-slate-950/60
                                "
                            >


                                {/* =================================
                                    Icon
                                ================================= */}

                                <div className="
                                    relative
                                    z-10
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-slate-800
                                    bg-slate-950
                                ">

                                    <div className={`
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-lg
                                        ${bg}
                                    `}>

                                        <Icon
                                            size={15}
                                            className={color}
                                            strokeWidth={2}
                                        />

                                    </div>

                                </div>


                                {/* =================================
                                    Content
                                ================================= */}

                                <div className="
                                    min-w-0
                                    flex-1
                                    pr-2
                                ">


                                    {/* Top Row */}

                                    <div className="
                                        flex
                                        flex-col
                                        gap-1
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    ">


                                        {/* Activity */}

                                        <div className="
                                            min-w-0
                                            text-sm
                                            leading-6
                                        ">

                                            <span className="
                                                font-medium
                                                text-slate-200
                                            ">

                                                {title}

                                            </span>


                                            <span className="
                                                mx-1.5
                                                text-slate-600
                                            ">

                                                in

                                            </span>


                                            {repositoryUrl ? (

                                                <a
                                                    href={
                                                        repositoryUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                        inline-flex
                                                        max-w-full
                                                        items-center
                                                        gap-1
                                                        font-semibold
                                                        text-slate-300
                                                        transition
                                                        hover:text-emerald-400
                                                    "
                                                >

                                                    <span className="
                                                        truncate
                                                    ">

                                                        {repositoryName}

                                                    </span>


                                                    <ArrowUpRight
                                                        size={13}
                                                        className="
                                                            shrink-0
                                                        "
                                                    />

                                                </a>

                                            ) : (

                                                <span className="
                                                    font-semibold
                                                    text-slate-300
                                                ">

                                                    {repositoryName}

                                                </span>

                                            )}

                                        </div>


                                        {/* Time */}

                                        <span className="
                                            shrink-0
                                            text-[11px]
                                            font-medium
                                            text-slate-600
                                        ">

                                            {formatRelativeTime(
                                                event?.created_at
                                            )}

                                        </span>

                                    </div>


                                    {/* =================================
                                        Metadata
                                    ================================= */}

                                    {(branch || commit) && (

                                        <div className="
                                            mt-2.5
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        ">


                                            {/* Branch */}

                                            {branch && (

                                                <div className="
                                                    inline-flex
                                                    max-w-full
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-slate-800
                                                    bg-slate-950
                                                    px-2
                                                    py-1
                                                ">

                                                    <GitBranch
                                                        size={12}
                                                        className="
                                                            shrink-0
                                                            text-slate-600
                                                        "
                                                    />


                                                    <span className="
                                                        max-w-40
                                                        truncate
                                                        text-[11px]
                                                        font-medium
                                                        text-slate-500
                                                    ">

                                                        {branch}

                                                    </span>

                                                </div>

                                            )}


                                            {/* Commit */}

                                            {commit?.message && (

                                                <div className="
                                                    inline-flex
                                                    min-w-0
                                                    max-w-full
                                                    items-center
                                                    gap-1.5
                                                    rounded-lg
                                                    border
                                                    border-slate-800
                                                    bg-slate-950
                                                    px-2
                                                    py-1
                                                ">

                                                    <GitCommitHorizontal
                                                        size={12}
                                                        className="
                                                            shrink-0
                                                            text-emerald-500/70
                                                        "
                                                    />


                                                    <span className="
                                                        max-w-64
                                                        truncate
                                                        text-[11px]
                                                        text-slate-500
                                                    ">

                                                        {commit.message}

                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    )}

                                </div>

                            </article>

                        );

                    }
                )}

            </div>


            {/* =================================
                Footer
            ================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-t
                border-slate-800
                px-5
                py-4
                sm:px-6
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <span className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-400
                    " />


                    <span className="
                        text-xs
                        text-slate-500
                    ">

                        GitHub activity

                    </span>

                </div>


                <span className="
                    text-xs
                    text-slate-600
                ">

                    {events.length} loaded

                </span>

            </div>

        </section>

    );

};


export default RecentActivity;