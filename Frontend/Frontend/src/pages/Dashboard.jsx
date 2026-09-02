import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import {
    getGithubProfile,
    getGithubRepositories,
    getGithubEvents,
    connectGithub
} from "../api/githubApi.js";

import WelcomeSection
    from "../components/WelcomeSection.jsx";

import GitHubConnectionCard
    from "../components/GitHubConnectionCard.jsx";

import StatsCards
    from "../components/StatsCards.jsx";

import RecentActivity
    from "../components/RecentActivity.jsx";

import ContributionGraph
    from "../components/ContributionGraph.jsx";


// =====================================
// Dashboard
// =====================================

const Dashboard = () => {

    // =================================
    // Authentication
    // =================================

    const {
        user,
        logout
    } = useAuth();


    // =================================
    // Router
    // =================================

    const location =
        useLocation();

    const navigate =
        useNavigate();


    // =================================
    // GitHub State
    // =================================

    const [
        githubProfile,
        setGithubProfile
    ] = useState(null);


    const [
        repositories,
        setRepositories
    ] = useState([]);


    const [
        events,
        setEvents
    ] = useState([]);


    // =================================
    // UI State
    // =================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        githubLoading,
        setGithubLoading
    ] = useState(false);


    // =====================================
    // Load Dashboard Data
    // =====================================

    const loadDashboardData =
        useCallback(
            async () => {

                setLoading(true);
                setError("");


                try {

                    // =================================
                    // GitHub Profile
                    // =================================

                    let profileResponse;


                    try {

                        profileResponse =
                            await getGithubProfile();

                    } catch (profileError) {

                        console.error(
                            "GitHub profile loading error:",
                            profileError
                        );


                        const status =
                            profileError?.status ??
                            profileError?.response?.status;


                        const message =
                            String(
                                profileError?.message ||
                                profileError?.response?.data?.message ||
                                ""
                            ).toLowerCase();


                        const notConnected =
                            status === 404 ||
                            message.includes(
                                "github account is not connected"
                            ) ||
                            message.includes(
                                "github is not connected"
                            ) ||
                            message.includes(
                                "github account not connected"
                            );


                        if (notConnected) {

                            setGithubProfile(null);
                            setRepositories([]);
                            setEvents([]);
                            setError("");

                            return;

                        }


                        throw profileError;

                    }


                    // =================================
                    // Extract Profile
                    // =================================

                    const profile =
                        profileResponse?.data?.profile ||
                        profileResponse?.profile ||
                        null;


                    if (!profile) {

                        setGithubProfile(null);
                        setRepositories([]);
                        setEvents([]);
                        setError("");

                        return;

                    }


                    setGithubProfile(
                        profile
                    );


                    // =================================
                    // Load Repositories
                    // =================================

                    let repositoriesResponse =
                        null;


                    try {

                        repositoriesResponse =
                            await getGithubRepositories({

                                page:
                                    1,

                                perPage:
                                    30,

                                sort:
                                    "updated",

                                direction:
                                    "desc"

                            });

                    } catch (repositoriesError) {

                        console.error(
                            "Repositories loading error:",
                            repositoriesError
                        );

                    }


                    // =================================
                    // Load GitHub Events
                    // =================================

                    let eventsResponse =
                        null;


                    try {

                        eventsResponse =
                            await getGithubEvents({

                                page:
                                    1,

                                perPage:
                                    30

                            });

                    } catch (eventsError) {

                        console.error(
                            "Events loading error:",
                            eventsError
                        );

                    }


                    // =================================
                    // Extract Repositories
                    // =================================

                    const repos =
                        repositoriesResponse?.data?.repositories ||
                        repositoriesResponse?.repositories ||
                        [];


                    // =================================
                    // Extract Events
                    // =================================

                    const userEvents =
                        eventsResponse?.data?.events ||
                        eventsResponse?.events ||
                        [];


                    // =================================
                    // Save Data
                    // =================================

                    setRepositories(
                        Array.isArray(repos)
                            ? repos
                            : []
                    );


                    setEvents(
                        Array.isArray(userEvents)
                            ? userEvents
                            : []
                    );


                    setError("");


                } catch (dashboardError) {

                    console.error(
                        "Dashboard loading error:",
                        dashboardError
                    );


                    const status =
                        dashboardError?.status ??
                        dashboardError?.response?.status;


                    const message =
                        String(
                            dashboardError?.message ||
                            dashboardError?.response?.data?.message ||
                            ""
                        ).toLowerCase();


                    const notConnected =
                        status === 404 ||
                        message.includes(
                            "github account is not connected"
                        ) ||
                        message.includes(
                            "github is not connected"
                        ) ||
                        message.includes(
                            "github account not connected"
                        );


                    if (notConnected) {

                        setGithubProfile(null);
                        setRepositories([]);
                        setEvents([]);
                        setError("");

                    } else {

                        setGithubProfile(null);
                        setRepositories([]);
                        setEvents([]);


                        setError(
                            dashboardError?.message ||
                            dashboardError?.response?.data?.message ||
                            "Unable to load your GitHub dashboard."
                        );

                    }

                } finally {

                    setLoading(false);

                }

            },
            []
        );


    // =====================================
    // Initial Load
    // =====================================

    useEffect(() => {

        loadDashboardData();

    }, [
        loadDashboardData
    ]);


    // =====================================
    // Handle GitHub OAuth Result
    // =====================================

    useEffect(() => {

        const params =
            new URLSearchParams(
                location.search
            );


        const githubStatus =
            params.get("github");


        if (
            githubStatus === "connected"
        ) {

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        }

    }, [
        location.search,
        navigate
    ]);


    // =====================================
    // Connect GitHub
    // =====================================

    const handleConnectGithub =
        async () => {

            try {

                setGithubLoading(true);

                await connectGithub();

            } catch (connectError) {

                console.error(
                    "GitHub connection error:",
                    connectError
                );

                setGithubLoading(false);

            }

        };


    // =====================================
    // Retry
    // =====================================

    const handleRetry =
        async () => {

            await loadDashboardData();

        };


    // =====================================
    // Loading State
    // =====================================

    if (loading) {

        return (

            <div className="space-y-8">

                <div className="space-y-3">

                    <div className="
                        h-8
                        w-72
                        animate-pulse
                        rounded-lg
                        bg-slate-800
                    " />

                    <div className="
                        h-4
                        w-96
                        max-w-full
                        animate-pulse
                        rounded
                        bg-slate-800
                    " />

                </div>


                <div className="
                    h-40
                    animate-pulse
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-800
                " />


                <div className="
                    grid
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                ">

                    {Array.from({
                        length: 4
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="
                                    h-36
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-800
                                "
                            />

                        )
                    )}

                </div>


                <div className="
                    grid
                    gap-7
                    xl:grid-cols-3
                ">

                    <div className="
                        h-96
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-800
                        xl:col-span-2
                    " />


                    <div className="
                        h-96
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-800
                    " />

                </div>


                <div className="
                    h-72
                    animate-pulse
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-800
                " />

            </div>

        );

    }


    // =====================================
    // Main Render
    // =====================================

    return (

        <div className="space-y-8">


            {/* =================================
                Error
            ================================= */}

            {error && (

                <div className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-red-800/60
                    bg-red-950/40
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <p className="
                            font-medium
                            text-red-200
                        ">

                            Something went wrong

                        </p>


                        <p className="
                            mt-1
                            text-sm
                            text-red-300/80
                        ">

                            {error}

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleRetry}
                        className="
                            shrink-0
                            rounded-lg
                            border
                            border-red-700/70
                            bg-red-900/30
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-red-200
                            transition
                            hover:bg-red-900/50
                        "
                    >

                        Try again

                    </button>

                </div>

            )}


            {/* =================================
                Welcome
            ================================= */}

            <WelcomeSection

                user={
                    user
                }

                githubProfile={
                    githubProfile
                }

            />


            {/* =================================
                GitHub Connection
            ================================= */}

            <section>

                <GitHubConnectionCard

                    connected={
                        Boolean(
                            githubProfile
                        )
                    }

                    profile={
                        githubProfile
                    }

                    loading={
                        githubLoading
                    }

                    error=""

                    onConnect={
                        handleConnectGithub
                    }

                    onRetry={
                        handleRetry
                    }

                />

            </section>


            {/* =================================
                Stats
            ================================= */}

            <section>

                <StatsCards

                    githubProfile={
                        githubProfile
                    }

                    repositories={
                        repositories
                    }

                    events={
                        events
                    }

                />

            </section>


            {/* =================================
                Recent Activity
            ================================= */}

            <section>

                <RecentActivity

                    events={
                        events
                    }

                />

            </section>


            {/* =================================
                Contribution Graph
            ================================= */}

            <section>

                <ContributionGraph

                    githubProfile={
                        githubProfile
                    }

                    events={
                        events
                    }

                />

            </section>


        </div>

    );

};


export default Dashboard;