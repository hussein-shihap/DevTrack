
import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Activity as ActivityIcon,
    GitCommit,
    GitPullRequest,
    GitMerge,
    GitBranch,
    Star,
    GitFork,
    CircleDot,
    MessageSquare,
    ExternalLink,
    RefreshCw,
    AlertCircle,
    Loader2
} from "lucide-react";

import {
    getGithubEvents
} from "../api/githubApi.js";


// =====================================
// Helpers
// =====================================

const formatRelativeDate = (date) => {

    if (!date) {
        return "Unknown";
    }

    const target = new Date(date);

    if (Number.isNaN(target.getTime())) {
        return "Unknown";
    }

    const now = new Date();

    const difference = Math.floor(
        (now.getTime() - target.getTime()) / 1000
    );

    if (difference < 60) {
        return "just now";
    }

    if (difference < 3600) {
        return `${Math.floor(difference / 60)}m ago`;
    }

    if (difference < 86400) {
        return `${Math.floor(difference / 3600)}h ago`;
    }

    if (difference < 2592000) {
        return `${Math.floor(difference / 86400)}d ago`;
    }

    if (difference < 31536000) {
        return `${Math.floor(difference / 2592000)}mo ago`;
    }

    return `${Math.floor(difference / 31536000)}y ago`;

};


// =====================================
// Event Configuration
// =====================================

const getEventInfo = (event) => {

    const type = event?.type || "";

    switch (type) {

        case "PushEvent":
            return {
                label: "Pushed commits",
                icon: GitCommit,
                description: "pushed new commits to",
                style: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            };

        case "PullRequestEvent":
            return {
                label: "Pull request",
                icon: GitPullRequest,
                description: "updated a pull request in",
                style: "text-blue-400 bg-blue-400/10 border-blue-400/20"
            };

        case "PullRequestReviewEvent":
            return {
                label: "Pull request review",
                icon: MessageSquare,
                description: "reviewed a pull request in",
                style: "text-purple-400 bg-purple-400/10 border-purple-400/20"
            };

        case "IssuesEvent":
            return {
                label: "Issue",
                icon: CircleDot,
                description: "updated an issue in",
                style: "text-orange-400 bg-orange-400/10 border-orange-400/20"
            };

        case "IssueCommentEvent":
            return {
                label: "Comment",
                icon: MessageSquare,
                description: "commented on an issue in",
                style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            };

        case "CreateEvent":
            return {
                label: "Created",
                icon: GitBranch,
                description: "created something in",
                style: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
            };

        case "ForkEvent":
            return {
                label: "Forked",
                icon: GitFork,
                description: "forked",
                style: "text-pink-400 bg-pink-400/10 border-pink-400/20"
            };

        case "WatchEvent":
            return {
                label: "Starred",
                icon: Star,
                description: "starred",
                style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            };

        case "DeleteEvent":
            return {
                label: "Deleted",
                icon: GitBranch,
                description: "deleted something from",
                style: "text-red-400 bg-red-400/10 border-red-400/20"
            };

        case "ReleaseEvent":
            return {
                label: "Release",
                icon: GitMerge,
                description: "published a release in",
                style: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
            };

        default:
            return {
                label: type.replace("Event", "") || "Activity",
                icon: ActivityIcon,
                description: "performed an activity in",
                style: "text-slate-400 bg-slate-400/10 border-slate-400/20"
            };

    }

};


// =====================================
// Event Description
// =====================================

const getEventDescription = (event) => {

    const type = event?.type || "";
    const repoName =
        event?.repo?.name ||
        "repository";

    const payload = event?.payload || {};

    switch (type) {

        case "PushEvent": {

            const commits =
                payload?.commits || [];

            const count =
                commits.length;

            return count > 0
                ? `Pushed ${count} commit${count > 1 ? "s" : ""} to`
                : "Pushed commits to";

        }

        case "PullRequestEvent": {

            const action =
                payload?.action || "updated";

            return `${action.charAt(0).toUpperCase()}${action.slice(1)} pull request in`;

        }

        case "IssuesEvent": {

            const action =
                payload?.action || "updated";

            return `${action.charAt(0).toUpperCase()}${action.slice(1)} issue in`;

        }

        case "ForkEvent":
            return "Forked";

        case "WatchEvent":
            return "Starred";

        case "CreateEvent":
            return "Created something in";

        case "DeleteEvent":
            return "Deleted something from";

        case "ReleaseEvent":
            return "Published a release in";

        case "IssueCommentEvent":
            return "Commented on an issue in";

        default:
            return `Performed an activity in`;

    }

};


// =====================================
// Activity Page
// =====================================

const Activity = () => {

    const [
        events,
        setEvents
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    // =================================
    // Load Activity
    // =================================

    const loadActivity = useCallback(
        async (isRefresh = false) => {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {

                const response =
                    await getGithubEvents({
                        page: 1,
                        perPage: 50
                    });

                const data =
                    response?.data?.events ||
                    response?.events ||
                    [];

                setEvents(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (activityError) {

                console.error(
                    "Activity loading error:",
                    activityError
                );

                setError(
                    activityError?.message ||
                    "Unable to load GitHub activity."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);

            }

        },
        []
    );


    // =================================
    // Initial Load
    // =================================

    useEffect(() => {

        loadActivity();

    }, [loadActivity]);


    // =================================
    // Loading
    // =================================

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="flex items-center justify-between">

                    <div>

                        <div className="
                            h-8
                            w-40
                            animate-pulse
                            rounded-lg
                            bg-slate-800
                        " />

                        <div className="
                            mt-3
                            h-4
                            w-72
                            animate-pulse
                            rounded
                            bg-slate-800
                        " />

                    </div>

                </div>


                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                ">

                    {Array.from({
                        length: 7
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="
                                flex
                                gap-4
                                border-b
                                border-slate-800
                                p-5
                                last:border-b-0
                            "
                        >

                            <div className="
                                h-11
                                w-11
                                shrink-0
                                animate-pulse
                                rounded-xl
                                bg-slate-800
                            " />

                            <div className="flex-1">

                                <div className="
                                    h-4
                                    w-64
                                    max-w-full
                                    animate-pulse
                                    rounded
                                    bg-slate-800
                                " />

                                <div className="
                                    mt-3
                                    h-3
                                    w-40
                                    animate-pulse
                                    rounded
                                    bg-slate-800
                                " />

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        );

    }


    // =================================
    // Error
    // =================================

    if (error) {

        return (

            <div className="
                flex
                min-h-[60vh]
                items-center
                justify-center
            ">

                <div className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-8
                    text-center
                ">

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-red-900/50
                        bg-red-950/30
                        text-red-400
                    ">

                        <AlertCircle size={25} />

                    </div>


                    <h2 className="
                        mt-5
                        text-lg
                        font-semibold
                        text-white
                    ">

                        Unable to load activity

                    </h2>


                    <p className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                    ">

                        {error}

                    </p>


                    <button
                        type="button"
                        onClick={() => loadActivity()}
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-200
                            transition
                            hover:bg-slate-700
                        "
                    >

                        <RefreshCw size={16} />

                        Try again

                    </button>

                </div>

            </div>

        );

    }


    // =================================
    // Empty
    // =================================

    if (events.length === 0) {

        return (

            <div className="space-y-6">

                <div>

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-900
                            text-slate-300
                        ">

                            <ActivityIcon size={21} />

                        </div>


                        <div>

                            <h1 className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                            ">

                                Activity

                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">

                                Your recent GitHub activity will appear here.

                            </p>

                        </div>

                    </div>

                </div>


                <div className="
                    flex
                    min-h-[350px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
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

                        <ActivityIcon size={28} />

                    </div>


                    <h2 className="
                        mt-5
                        text-base
                        font-semibold
                        text-slate-200
                    ">

                        No recent activity

                    </h2>


                    <p className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-500
                    ">

                        We couldn't find any recent GitHub activity
                        for your connected account.

                    </p>

                </div>

            </div>

        );

    }


    // =================================
    // Render
    // =================================

    return (

        <div className="space-y-6">

            {/* =================================
                Header
            ================================= */}

            <div className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-end
                sm:justify-between
            ">

                <div>

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-900
                            text-slate-300
                        ">

                            <ActivityIcon size={21} />

                        </div>


                        <div>

                            <h1 className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                            ">

                                Activity

                            </h1>


                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">

                                Track your recent GitHub activity.

                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() => loadActivity(true)}
                    disabled={refreshing}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-300
                        transition
                        hover:border-slate-700
                        hover:bg-slate-800
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {refreshing ? (
                        <Loader2
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <RefreshCw size={16} />
                    )}

                    Refresh

                </button>

            </div>


            {/* =================================
                Stats
            ================================= */}

            <div className="
                grid
                gap-4
                sm:grid-cols-3
            ">

                <div className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <span className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-600
                        ">

                            Events

                        </span>

                        <ActivityIcon
                            size={17}
                            className="text-slate-600"
                        />

                    </div>


                    <p className="
                        mt-3
                        text-2xl
                        font-bold
                        text-white
                    ">

                        {events.length}

                    </p>

                </div>


                <div className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <span className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-600
                        ">

                            Commits

                        </span>

                        <GitCommit
                            size={17}
                            className="text-slate-600"
                        />

                    </div>


                    <p className="
                        mt-3
                        text-2xl
                        font-bold
                        text-white
                    ">

                        {events.filter(
                            (event) =>
                                event?.type === "PushEvent"
                        ).reduce(
                            (total, event) =>
                                total +
                                (
                                    event?.payload?.commits?.length ||
                                    0
                                ),
                            0
                        )}

                    </p>

                </div>


                <div className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <span className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-600
                        ">

                            Repositories

                        </span>

                        <GitBranch
                            size={17}
                            className="text-slate-600"
                        />

                    </div>


                    <p className="
                        mt-3
                        text-2xl
                        font-bold
                        text-white
                    ">

                        {new Set(
                            events
                                .map(
                                    (event) =>
                                        event?.repo?.name
                                )
                                .filter(Boolean)
                        ).size}

                    </p>

                </div>

            </div>


            {/* =================================
                Activity List
            ================================= */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
            ">

                <div className="
                    border-b
                    border-slate-800
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-sm
                                font-semibold
                                text-white
                            ">

                                Recent Activity

                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-600
                            ">

                                Latest events from GitHub

                            </p>

                        </div>


                        <span className="
                            rounded-full
                            border
                            border-slate-800
                            bg-slate-950
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-slate-500
                        ">

                            {events.length} events

                        </span>

                    </div>

                </div>


                <div>

                    {events.map(
                        (event, index) => {

                            const eventInfo =
                                getEventInfo(event);

                            const Icon =
                                eventInfo.icon;

                            const repositoryName =
                                event?.repo?.name ||
                                "Unknown repository";

                            const repositoryUrl =
                                event?.repo?.name
                                    ? `https://github.com/${event.repo.name}`
                                    : null;

                            const description =
                                getEventDescription(event);


                            return (

                                <article
                                    key={
                                        event?.id ||
                                        `${event?.type}-${index}`
                                    }
                                    className="
                                        group
                                        relative
                                        border-b
                                        border-slate-800
                                        p-5
                                        transition
                                        last:border-b-0
                                        hover:bg-white/[0.015]
                                        sm:p-6
                                    "
                                >

                                    <div className="
                                        flex
                                        gap-4
                                    ">

                                        {/* Icon */}

                                        <div className={`
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            ${eventInfo.style}
                                        `}>

                                            <Icon
                                                size={18}
                                                strokeWidth={1.8}
                                            />

                                        </div>


                                        {/* Content */}

                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">

                                            <div className="
                                                flex
                                                flex-col
                                                gap-2
                                                sm:flex-row
                                                sm:items-start
                                                sm:justify-between
                                            ">

                                                <div className="min-w-0">

                                                    <div className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <span className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-200
                                                        ">

                                                            {eventInfo.label}

                                                        </span>


                                                        <span className="
                                                            text-[10px]
                                                            text-slate-700
                                                        ">

                                                            •

                                                        </span>


                                                        <span className="
                                                            text-xs
                                                            text-slate-500
                                                        ">

                                                            {formatRelativeDate(
                                                                event?.created_at
                                                            )}

                                                        </span>

                                                    </div>


                                                    <p className="
                                                        mt-2
                                                        text-sm
                                                        leading-6
                                                        text-slate-500
                                                    ">

                                                        {description}{" "}

                                                        {repositoryUrl ? (

                                                            <a
                                                                href={repositoryUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="
                                                                    font-medium
                                                                    text-slate-300
                                                                    transition
                                                                    hover:text-emerald-400
                                                                "
                                                            >

                                                                {repositoryName}

                                                            </a>

                                                        ) : (

                                                            <span className="
                                                                text-slate-400
                                                            ">

                                                                {repositoryName}

                                                            </span>

                                                        )}

                                                    </p>


                                                    {/* Commit Details */}

                                                    {event?.type === "PushEvent" &&
                                                        Array.isArray(
                                                            event?.payload?.commits
                                                        ) &&
                                                        event.payload.commits.length > 0 && (

                                                            <div className="
                                                                mt-4
                                                                space-y-2
                                                            ">

                                                                {event.payload.commits
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            commit,
                                                                            commitIndex
                                                                        ) => (

                                                                            <div
                                                                                key={
                                                                                    commit?.sha ||
                                                                                    commitIndex
                                                                                }
                                                                                className="
                                                                                    rounded-xl
                                                                                    border
                                                                                    border-slate-800
                                                                                    bg-slate-950/60
                                                                                    px-3
                                                                                    py-2.5
                                                                                "
                                                                            >

                                                                                <div className="
                                                                                    flex
                                                                                    items-start
                                                                                    gap-2
                                                                                ">

                                                                                    <GitCommit
                                                                                        size={14}
                                                                                        className="
                                                                                            mt-0.5
                                                                                            shrink-0
                                                                                            text-emerald-500
                                                                                        "
                                                                                    />


                                                                                    <div className="min-w-0">

                                                                                        <p className="
                                                                                            truncate
                                                                                            text-xs
                                                                                            font-medium
                                                                                            text-slate-300
                                                                                        ">

                                                                                            {commit?.message ||
                                                                                                "Commit"
                                                                                            }

                                                                                        </p>


                                                                                        {commit?.sha && (

                                                                                            <p className="
                                                                                                mt-1
                                                                                                font-mono
                                                                                                text-[10px]
                                                                                                text-slate-700
                                                                                            ">

                                                                                                {commit.sha.slice(
                                                                                                    0,
                                                                                                    7
                                                                                                )}

                                                                                            </p>

                                                                                        )}

                                                                                    </div>

                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )}

                                                                {event.payload.commits.length > 3 && (

                                                                    <p className="
                                                                        text-[10px]
                                                                        text-slate-600
                                                                    ">

                                                                        +
                                                                        {event.payload.commits.length - 3}
                                                                        {" "}
                                                                        more commits

                                                                    </p>

                                                                )}

                                                            </div>

                                                        )}

                                                </div>


                                                {/* GitHub */}

                                                {repositoryUrl && (

                                                    <a
                                                        href={repositoryUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="
                                                            inline-flex
                                                            shrink-0
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            border
                                                            border-slate-800
                                                            bg-slate-950
                                                            px-2.5
                                                            py-1.5
                                                            text-[10px]
                                                            font-medium
                                                            text-slate-600
                                                            transition
                                                            hover:border-slate-700
                                                            hover:text-slate-300
                                                        "
                                                    >

                                                        View repo

                                                        <ExternalLink
                                                            size={11}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </article>

                            );

                        }
                    )}

                </div>

            </section>

        </div>

    );

};


export default Activity;

