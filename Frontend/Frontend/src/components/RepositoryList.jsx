
import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    BookOpen,
    ExternalLink,
    GitFork,
    Star,
    Heart,
    Loader2,
    AlertCircle,
    RefreshCw,
    CircleDot,
    Lock,
    Globe2,
    ArrowUpRight,
    Code2,
    GitCommitHorizontal
} from "lucide-react";

import {
    getFavoriteRepositories,
    addFavoriteRepository,
    removeFavoriteRepository
} from "../api/favoriteApi.js";

import {
    getGithubRepositoryCommits
} from "../api/githubApi.js";


// =====================================
// Helpers
// =====================================

const formatNumber = (value) => {

    const number =
        Number(value || 0);

    if (number >= 1000000) {

        return `${(
            number / 1000000
        ).toFixed(1)}M`;

    }

    if (number >= 1000) {

        return `${(
            number / 1000
        ).toFixed(1)}k`;

    }

    return number.toLocaleString();

};


// =====================================
// Relative Date
// =====================================

const formatRelativeDate = (date) => {

    if (!date) {

        return "Unknown";

    }

    const target =
        new Date(date);

    if (
        Number.isNaN(
            target.getTime()
        )
    ) {

        return "Unknown";

    }

    const now =
        new Date();

    const difference =
        Math.floor(
            (
                now.getTime() -
                target.getTime()
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

    if (difference < 31536000) {

        return `${Math.floor(
            difference / 2592000
        )}mo ago`;

    }

    return `${Math.floor(
        difference / 31536000
    )}y ago`;

};


// =====================================
// Get Commit Data
// =====================================

const normalizeCommits = (response) => {

    const data =
        response?.data?.data ??
        response?.data ??
        response ??
        null;

    if (Array.isArray(data)) {

        return data;

    }

    if (
        Array.isArray(
            data?.commits
        )
    ) {

        return data.commits;

    }

    if (
        Array.isArray(
            data?.data
        )
    ) {

        return data.data;

    }

    return [];

};


// =====================================
// Repository List
// =====================================

const RepositoryList = ({
    repositories = []
}) => {


    // =================================
    // Favorites
    // =================================

    const [
        favoriteRepositories,
        setFavoriteRepositories
    ] = useState([]);


    // =================================
    // Favorites Loading
    // =================================

    const [
        favoritesLoading,
        setFavoritesLoading
    ] = useState(true);


    // =================================
    // Favorites Error
    // =================================

    const [
        favoritesError,
        setFavoritesError
    ] = useState("");


    // =================================
    // Current Favorite Action
    // =================================

    const [
        favoriteActionId,
        setFavoriteActionId
    ] = useState(null);


    // =================================
    // Commits
    // =================================

    const [
        repositoryCommits,
        setRepositoryCommits
    ] = useState({});


    // =================================
    // Commits Loading
    // =================================

    const [
        commitsLoading,
        setCommitsLoading
    ] = useState({});


    // =================================
    // Commits Error
    // =================================

    const [
        commitsErrors,
        setCommitsErrors
    ] = useState({});


    // =================================
    // Load Favorites
    // =================================

    const loadFavorites =
        useCallback(
            async () => {

                setFavoritesLoading(true);
                setFavoritesError("");

                try {

                    const response =
                        await getFavoriteRepositories();

                    const favorites =
                        response?.data?.repositories ||
                        response?.repositories ||
                        [];

                    setFavoriteRepositories(
                        Array.isArray(favorites)
                            ? favorites
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Favorites loading error:",
                        error
                    );

                    setFavoritesError(
                        error?.message ||
                        "Unable to load your favorite repositories."
                    );

                } finally {

                    setFavoritesLoading(false);

                }

            },
            []
        );


    // =================================
    // Initial Favorites Load
    // =================================

    useEffect(() => {

        loadFavorites();

    }, [loadFavorites]);


    // =================================
    // Load Repository Commits
    // =================================

    const loadRepositoryCommits =
        useCallback(
            async (
                repository
            ) => {

                if (
                    !repository?.name
                ) {

                    return;

                }


                const owner =
                    repository?.owner?.login ||
                    repository?.owner?.name ||
                    repository?.full_name?.split("/")[0] ||
                    "";


                const repositoryName =
                    repository?.name;


                if (
                    !owner ||
                    !repositoryName
                ) {

                    console.warn(
                        "Unable to load commits. Repository owner/name missing.",
                        repository
                    );

                    return;

                }


                const repositoryKey =
                    `${owner}/${repositoryName}`;


                setCommitsLoading(
                    (current) => ({
                        ...current,
                        [repositoryKey]: true
                    })
                );


                setCommitsErrors(
                    (current) => ({
                        ...current,
                        [repositoryKey]: ""
                    })
                );


                try {

                    const response =
                        await getGithubRepositoryCommits(
                            owner,
                            repositoryName,
                            {
                                page: 1,
                                perPage: 5
                            }
                        );


                    const commits =
                        normalizeCommits(
                            response
                        );


                    setRepositoryCommits(
                        (current) => ({
                            ...current,
                            [repositoryKey]: commits
                        })
                    );


                } catch (error) {

                    console.error(
                        `Commits loading error for ${repositoryKey}:`,
                        error
                    );


                    setCommitsErrors(
                        (current) => ({
                            ...current,
                            [repositoryKey]:
                                error?.message ||
                                "Unable to load commits."
                        })
                    );


                    setRepositoryCommits(
                        (current) => ({
                            ...current,
                            [repositoryKey]: []
                        })
                    );


                } finally {

                    setCommitsLoading(
                        (current) => ({
                            ...current,
                            [repositoryKey]: false
                        })
                    );

                }

            },
            []
        );


    // =================================
    // Load Commits For Repositories
    // =================================

    useEffect(() => {

        if (
            !Array.isArray(repositories) ||
            repositories.length === 0
        ) {

            return;

        }


        repositories.forEach(
            (repository) => {

                loadRepositoryCommits(
                    repository
                );

            }
        );

    }, [
        repositories,
        loadRepositoryCommits
    ]);


    // =================================
    // Check Favorite
    // =================================

    const isFavorite =
        useCallback(
            (repositoryId) => {

                const numericRepositoryId =
                    Number(repositoryId);

                return favoriteRepositories.some(
                    (favorite) =>
                        Number(
                            favorite?.github_repo_id
                        ) === numericRepositoryId
                );

            },
            [
                favoriteRepositories
            ]
        );


    // =================================
    // Toggle Favorite
    // =================================

    const handleToggleFavorite =
        async (
            repository
        ) => {

            if (!repository?.id) {

                setFavoritesError(
                    "Invalid repository."
                );

                return;

            }


            const numericRepositoryId =
                Number(repository.id);


            if (
                !Number.isSafeInteger(
                    numericRepositoryId
                ) ||
                numericRepositoryId <= 0
            ) {

                setFavoritesError(
                    "Invalid GitHub repository ID."
                );

                return;

            }


            const repositoryName =
                typeof repository.name === "string"
                    ? repository.name.trim()
                    : "";


            const repositoryUrl =
                typeof repository.html_url === "string"
                    ? repository.html_url.trim()
                    : "";


            if (!repositoryName) {

                setFavoritesError(
                    "Repository name is missing."
                );

                return;

            }


            if (!repositoryUrl) {

                setFavoritesError(
                    "Repository URL is missing."
                );

                return;

            }


            const currentlyFavorite =
                isFavorite(
                    numericRepositoryId
                );


            setFavoriteActionId(
                numericRepositoryId
            );

            setFavoritesError("");


            try {

                // =================================
                // REMOVE FAVORITE
                // =================================

                if (currentlyFavorite) {

                    await removeFavoriteRepository(
                        numericRepositoryId
                    );


                    setFavoriteRepositories(
                        (current) =>
                            current.filter(
                                (favorite) =>
                                    Number(
                                        favorite?.github_repo_id
                                    ) !==
                                    numericRepositoryId
                            )
                    );

                }

                // =================================
                // ADD FAVORITE
                // =================================

                else {

                    const response =
                        await addFavoriteRepository({

                            githubRepositoryId:
                                numericRepositoryId,

                            repositoryName:
                                repositoryName,

                            repositoryUrl:
                                repositoryUrl

                        });


                    const favorite =
                        response?.data?.repository ||
                        response?.repository ||
                        null;


                    if (favorite) {

                        setFavoriteRepositories(
                            (current) => {

                                const alreadyExists =
                                    current.some(
                                        (item) =>
                                            Number(
                                                item?.github_repo_id
                                            ) ===
                                            numericRepositoryId
                                    );


                                if (
                                    alreadyExists
                                ) {

                                    return current;

                                }


                                return [
                                    favorite,
                                    ...current
                                ];

                            }
                        );

                    } else {

                        await loadFavorites();

                    }

                }

            } catch (error) {

                console.error(
                    "Favorite action error:",
                    error
                );


                setFavoritesError(
                    error?.message ||
                    "Unable to update favorite repository."
                );

            } finally {

                setFavoriteActionId(null);

            }

        };


    // =================================
    // Empty State
    // =================================

    if (
        !Array.isArray(repositories) ||
        repositories.length === 0
    ) {

        return (

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-800
                    bg-slate-900
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-emerald-500/[0.04]
                        blur-3xl
                    "
                />


                <div
                    className="
                        relative
                        flex
                        min-h-[360px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-14
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-950
                            text-slate-500
                            shadow-xl
                        "
                    >

                        <BookOpen
                            size={27}
                            strokeWidth={1.7}
                        />

                    </div>


                    <h3
                        className="
                            mt-5
                            text-base
                            font-semibold
                            text-slate-200
                        "
                    >

                        No repositories found

                    </h3>


                    <p
                        className="
                            mt-2
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >

                        Your GitHub repositories will appear
                        here once your account is connected
                        and repositories are available.

                    </p>

                </div>

            </section>

        );

    }


    // =================================
    // Render
    // =================================

    return (

        <section
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                shadow-2xl
                shadow-black/10
            "
        >

            {/* =================================
                Header
            ================================= */}

            <div
                className="
                    relative
                    border-b
                    border-slate-800
                    px-5
                    py-5
                    sm:px-6
                    sm:py-6
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-950
                                text-slate-300
                            "
                        >

                            <Code2 size={19} />

                        </div>


                        <div className="min-w-0">

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <h2
                                    className="
                                        text-base
                                        font-semibold
                                        tracking-tight
                                        text-white
                                    "
                                >

                                    Repositories

                                </h2>


                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-slate-800
                                        bg-slate-950
                                        px-2
                                        py-0.5
                                        text-[10px]
                                        font-semibold
                                        text-slate-500
                                    "
                                >

                                    {repositories.length}

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >

                                Explore and manage your GitHub projects

                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950/70
                            px-3
                            py-2
                            sm:flex
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-400
                                shadow-lg
                                shadow-emerald-400/30
                            "
                        />

                        <span
                            className="
                                text-[11px]
                                font-medium
                                text-slate-500
                            "
                        >

                            GitHub synced

                        </span>

                    </div>

                </div>

            </div>


            {/* =================================
                Favorites Error
            ================================= */}

            {favoritesError && (

                <div
                    className="
                        border-b
                        border-red-900/40
                        bg-red-950/20
                        px-5
                        py-3
                        sm:px-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <AlertCircle
                            size={16}
                            className="
                                shrink-0
                                text-red-400
                            "
                        />


                        <p
                            className="
                                min-w-0
                                flex-1
                                text-xs
                                text-red-300
                            "
                        >

                            {favoritesError}

                        </p>


                        <button
                            type="button"
                            onClick={loadFavorites}
                            disabled={
                                favoritesLoading
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-xs
                                font-medium
                                text-red-300
                                transition
                                hover:text-red-200
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={13}
                            />

                            Retry

                        </button>

                    </div>

                </div>

            )}


            {/* =================================
                Repository Grid
            ================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-px
                    bg-slate-800
                    md:grid-cols-2
                "
            >

                {repositories.map(
                    (repository) => {

                        const repositoryId =
                            repository?.id;


                        const numericRepositoryId =
                            Number(repositoryId);


                        const favorite =
                            isFavorite(
                                numericRepositoryId
                            );


                        const actionLoading =
                            favoriteActionId ===
                            numericRepositoryId;


                        const repositoryName =
                            repository?.name ||
                            "Unnamed repository";


                        const fullName =
                            repository?.full_name ||
                            repositoryName;


                        const language =
                            repository?.language;


                        const topics =
                            Array.isArray(
                                repository?.topics
                            )
                                ? repository.topics
                                : [];


                        const owner =
                            repository?.owner?.login ||
                            repository?.owner?.name ||
                            repository?.full_name?.split("/")[0] ||
                            "";


                        const repositoryKey =
                            owner &&
                            repositoryName
                                ? `${owner}/${repositoryName}`
                                : repositoryName;


                        const commits =
                            repositoryCommits[
                                repositoryKey
                            ] || [];


                        const commitsAreLoading =
                            Boolean(
                                commitsLoading[
                                    repositoryKey
                                ]
                            );


                        const commitsError =
                            commitsErrors[
                                repositoryKey
                            ] || "";


                        return (

                            <article
                                key={
                                    repositoryId ||
                                    fullName
                                }
                                className="
                                    group
                                    relative
                                    bg-slate-900
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:bg-slate-900/80
                                    sm:p-6
                                "
                            >

                                {/* Hover Glow */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        bg-[radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.07),transparent_35%)]
                                        opacity-0
                                        transition
                                        duration-300
                                        group-hover:opacity-100
                                    "
                                />


                                <div
                                    className="
                                        relative
                                        flex
                                        h-full
                                        flex-col
                                    "
                                >

                                    {/* ==========================
                                        Top Row
                                    ========================== */}

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                items-start
                                                gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-950
                                                    text-slate-500
                                                    transition
                                                    duration-300
                                                    group-hover:border-slate-700
                                                    group-hover:text-slate-300
                                                "
                                            >

                                                <Code2
                                                    size={18}
                                                    strokeWidth={1.8}
                                                />

                                            </div>


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >

                                                <a
                                                    href={
                                                        repository?.html_url ||
                                                        "#"
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                        flex
                                                        max-w-full
                                                        items-center
                                                        gap-1.5
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-slate-100
                                                            transition
                                                            group-hover:text-white
                                                        "
                                                    >

                                                        {
                                                            repositoryName
                                                        }

                                                    </span>


                                                    <ArrowUpRight
                                                        size={14}
                                                        className="
                                                            shrink-0
                                                            text-slate-600
                                                            transition
                                                            group-hover:text-emerald-400
                                                        "
                                                    />

                                                </a>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[11px]
                                                        text-slate-600
                                                    "
                                                >

                                                    {fullName}

                                                </p>

                                            </div>

                                        </div>


                                        {/* Favorite */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleFavorite(
                                                    repository
                                                )
                                            }
                                            disabled={
                                                actionLoading ||
                                                favoritesLoading
                                            }
                                            aria-label={
                                                favorite
                                                    ? "Remove from favorites"
                                                    : "Add to favorites"
                                            }
                                            title={
                                                favorite
                                                    ? "Remove from favorites"
                                                    : "Add to favorites"
                                            }
                                            className={`
                                                relative
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                transition-all
                                                duration-200
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                                ${
                                                    favorite
                                                        ? `
                                                            border-emerald-500/20
                                                            bg-emerald-500/10
                                                            text-emerald-400
                                                        `
                                                        : `
                                                            border-slate-800
                                                            bg-slate-950
                                                            text-slate-600
                                                            hover:border-slate-700
                                                            hover:bg-slate-800
                                                            hover:text-slate-300
                                                        `
                                                }
                                            `}
                                        >

                                            {actionLoading ? (

                                                <Loader2
                                                    size={16}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                            ) : (

                                                <Heart
                                                    size={16}
                                                    fill={
                                                        favorite
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                            )}

                                        </button>

                                    </div>


                                    {/* ==========================
                                        Description
                                    ========================== */}

                                    <div
                                        className="
                                            mt-4
                                            min-h-[48px]
                                        "
                                    >

                                        <p
                                            className="
                                                line-clamp-2
                                                text-xs
                                                leading-5
                                                text-slate-500
                                            "
                                        >

                                            {
                                                repository?.description ||
                                                "No description provided for this repository."
                                            }

                                        </p>

                                    </div>


                                    {/* ==========================
                                        Topics
                                    ========================== */}

                                    {topics.length > 0 && (

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-wrap
                                                gap-1.5
                                            "
                                        >

                                            {topics
                                                .slice(0, 3)
                                                .map(
                                                    (topic) => (

                                                        <span
                                                            key={topic}
                                                            className="
                                                                rounded-md
                                                                border
                                                                border-slate-800
                                                                bg-slate-950
                                                                px-2
                                                                py-1
                                                                text-[10px]
                                                                font-medium
                                                                text-slate-500
                                                            "
                                                        >

                                                            #{topic}

                                                        </span>

                                                    )
                                                )}


                                            {topics.length > 3 && (

                                                <span
                                                    className="
                                                        rounded-md
                                                        border
                                                        border-slate-800
                                                        bg-slate-950
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-slate-600
                                                    "
                                                >

                                                    +{topics.length - 3}

                                                </span>

                                            )}

                                        </div>

                                    )}


                                    {/* ==========================
                                        Divider
                                    ========================== */}

                                    <div
                                        className="
                                            my-5
                                            h-px
                                            bg-slate-800
                                        "
                                    />


                                    {/* ==========================
                                        Metadata
                                    ========================== */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-x-4
                                            gap-y-3
                                        "
                                    >

                                        {/* Stars */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-slate-500
                                            "
                                        >

                                            <Star
                                                size={14}
                                                strokeWidth={1.8}
                                            />

                                            <span>

                                                {
                                                    formatNumber(
                                                        repository?.stargazers_count
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* Forks */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-slate-500
                                            "
                                        >

                                            <GitFork
                                                size={14}
                                                strokeWidth={1.8}
                                            />

                                            <span>

                                                {
                                                    formatNumber(
                                                        repository?.forks_count
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* Issues */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-slate-500
                                            "
                                        >

                                            <CircleDot
                                                size={13}
                                                strokeWidth={1.8}
                                            />

                                            <span>

                                                {
                                                    formatNumber(
                                                        repository?.open_issues_count
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* Language */}

                                        {language && (

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-xs
                                                    text-slate-500
                                                "
                                            >

                                                <span
                                                    className="
                                                        h-2
                                                        w-2
                                                        rounded-full
                                                        bg-emerald-400
                                                    "
                                                />

                                                <span>

                                                    {language}

                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* ==========================
                                        Commits
                                    ========================== */}

                                    <div
                                        className="
                                            mt-5
                                            rounded-2xl
                                            border
                                            border-slate-800
                                            bg-slate-950/50
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                mb-3
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <GitCommitHorizontal
                                                    size={15}
                                                    className="
                                                        text-slate-500
                                                    "
                                                />

                                                <span
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-slate-300
                                                    "
                                                >

                                                    Recent Commits

                                                </span>

                                            </div>


                                            {!commitsAreLoading &&
                                                !commitsError &&
                                                commits.length > 0 && (

                                                    <span
                                                        className="
                                                            text-[10px]
                                                            text-slate-600
                                                        "
                                                    >

                                                        {commits.length}

                                                    </span>

                                                )}

                                        </div>


                                        {/* Loading */}

                                        {commitsAreLoading && (

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    py-3
                                                    text-xs
                                                    text-slate-600
                                                "
                                            >

                                                <Loader2
                                                    size={14}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                                Loading commits...

                                            </div>

                                        )}


                                        {/* Error */}

                                        {!commitsAreLoading &&
                                            commitsError && (

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        py-2
                                                        text-xs
                                                        text-red-400
                                                    "
                                                >

                                                    <AlertCircle
                                                        size={14}
                                                    />

                                                    <span>

                                                        Unable to load commits

                                                    </span>

                                                </div>

                                            )}


                                        {/* Empty */}

                                        {!commitsAreLoading &&
                                            !commitsError &&
                                            commits.length === 0 && (

                                                <p
                                                    className="
                                                        py-2
                                                        text-xs
                                                        text-slate-600
                                                    "
                                                >

                                                    No commits found.

                                                </p>

                                            )}


                                        {/* Commit List */}

                                        {!commitsAreLoading &&
                                            !commitsError &&
                                            commits.length > 0 && (

                                                <div
                                                    className="
                                                        space-y-3
                                                    "
                                                >

                                                    {commits.map(
                                                        (
                                                            commit,
                                                            index
                                                        ) => {

                                                            const sha =
                                                                commit?.sha ||
                                                                commit?.id ||
                                                                index;


                                                            const message =
                                                                commit?.commit?.message ||
                                                                commit?.message ||
                                                                "No commit message";


                                                            const authorName =
                                                                commit?.commit?.author?.name ||
                                                                commit?.author?.login ||
                                                                commit?.author?.name ||
                                                                "Unknown";


                                                            const commitDate =
                                                                commit?.commit?.author?.date ||
                                                                commit?.commit?.committer?.date ||
                                                                commit?.created_at ||
                                                                null;


                                                            const commitUrl =
                                                                commit?.html_url ||
                                                                commit?.url ||
                                                                "#";


                                                            return (

                                                                <div
                                                                    key={sha}
                                                                    className="
                                                                        border-b
                                                                        border-slate-800/70
                                                                        pb-3
                                                                        last:border-0
                                                                        last:pb-0
                                                                    "
                                                                >

                                                                    <a
                                                                        href={
                                                                            commitUrl
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="
                                                                            block
                                                                            transition
                                                                            hover:opacity-80
                                                                        "
                                                                    >

                                                                        <p
                                                                            className="
                                                                                line-clamp-2
                                                                                text-xs
                                                                                font-medium
                                                                                leading-5
                                                                                text-slate-400
                                                                            "
                                                                        >

                                                                            {
                                                                                message
                                                                            }

                                                                        </p>


                                                                        <div
                                                                            className="
                                                                                mt-1.5
                                                                                flex
                                                                                items-center
                                                                                justify-between
                                                                                gap-3
                                                                            "
                                                                        >

                                                                            <span
                                                                                className="
                                                                                    truncate
                                                                                    text-[10px]
                                                                                    text-slate-600
                                                                                "
                                                                            >

                                                                                {authorName}

                                                                            </span>


                                                                            <span
                                                                                className="
                                                                                    shrink-0
                                                                                    text-[10px]
                                                                                    text-slate-600
                                                                                "
                                                                            >

                                                                                {
                                                                                    formatRelativeDate(
                                                                                        commitDate
                                                                                    )
                                                                                }

                                                                            </span>

                                                                        </div>

                                                                    </a>

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            )}

                                    </div>


                                    {/* ==========================
                                        Bottom
                                    ========================== */}

                                    <div
                                        className="
                                            mt-auto
                                            pt-5
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            {/* Visibility */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-[10px]
                                                    font-medium
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-600
                                                "
                                            >

                                                {repository?.private ? (

                                                    <>

                                                        <Lock
                                                            size={12}
                                                        />

                                                        Private

                                                    </>

                                                ) : (

                                                    <>

                                                        <Globe2
                                                            size={12}
                                                        />

                                                        Public

                                                    </>

                                                )}

                                            </div>


                                            {/* Updated */}

                                            <span
                                                className="
                                                    text-[10px]
                                                    text-slate-600
                                                "
                                            >

                                                Updated{" "}

                                                {
                                                    formatRelativeDate(
                                                        repository?.updated_at
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* GitHub */}

                                        {repository?.html_url && (

                                            <a
                                                href={
                                                    repository.html_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    mt-4
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-950
                                                    px-3
                                                    py-2.5
                                                    text-xs
                                                    font-medium
                                                    text-slate-400
                                                    transition
                                                    hover:border-slate-700
                                                    hover:bg-slate-800
                                                    hover:text-white
                                                "
                                            >

                                                View on GitHub

                                                <ExternalLink
                                                    size={13}
                                                />

                                            </a>

                                        )}

                                    </div>

                                </div>

                            </article>

                        );

                    }
                )}

            </div>


            {/* =================================
                Footer
            ================================= */}

            {repositories.length > 6 && (

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        border-t
                        border-slate-800
                        px-5
                        py-4
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-600
                        "
                    >

                        Showing{" "}

                        <span
                            className="
                                font-medium
                                text-slate-400
                            "
                        >

                            {repositories.length}

                        </span>

                        {" "}repositories

                    </p>

                </div>

            )}

        </section>

    );

};


export default RepositoryList;

