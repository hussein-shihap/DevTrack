import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Star,
    Heart,
    ExternalLink,
    Search,
    RefreshCw,
    AlertCircle,
    Code2,
    ArrowUpRight,
    Loader2,
    X
} from "lucide-react";

import {
    getFavoriteRepositories,
    removeFavoriteRepository
} from "../api/favoriteApi.js";


// Helpers


const formatRelativeDate = (date) => {
    if (!date) {
        return "Unknown";
    }

    const target = new Date(date);

    if (Number.isNaN(target.getTime())) {
        return "Unknown";
    }

    const difference = Math.floor(
        (Date.now() - target.getTime()) / 1000
    );

    if (difference < 60) return "just now";
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


// Normalize Favorite


const normalizeFavoriteRepository = (repository) => {
    return {
        github_repo_id:
            repository?.github_repo_id ??
            repository?.githubRepositoryId ??
            repository?.github_repository_id ??
            null,

        name:
            repository?.repo_name ??
            repository?.repository_name ??
            repository?.name ??
            "Unnamed repository",

        full_name:
            repository?.full_name ??
            repository?.repo_name ??
            repository?.repository_name ??
            repository?.name ??
            "Unnamed repository",

        html_url:
            repository?.repo_url ??
            repository?.repository_url ??
            repository?.html_url ??
            repository?.url ??
            null,

        created_at:
            repository?.created_at ??
            null
    };
};


// Favorites Page


const Favorites = () => {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [removingId, setRemovingId] = useState(null);

    // =================================
    // Load Favorites
    // =================================

    const loadFavorites = useCallback(async () => {

        setLoading(true);
        setError("");

        try {
            const response =
                await getFavoriteRepositories();

            const data =
                response?.data?.repositories ??
                response?.data?.favorites ??
                response?.repositories ??
                response?.favorites ??
                response?.data ??
                [];

            const normalized =
                Array.isArray(data)
                    ? data.map(normalizeFavoriteRepository)
                    : [];

            setFavorites(normalized);

        } catch (requestError) {

            console.error(
                "Favorites loading error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to load your favorite repositories."
            );

        } finally {
            setLoading(false);
        }

    }, []);

    // =================================
    // Initial Load
    // =================================

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    // =================================
    // Remove Favorite
    // =================================

    const handleRemoveFavorite = async (repository) => {

        const repositoryId =
            repository?.github_repo_id;

        if (!repositoryId) {
            setError(
                "Unable to remove this repository because its GitHub ID is missing."
            );
            return;
        }

        const normalizedId =
            Number(repositoryId);

        setRemovingId(normalizedId);
        setError("");

        try {

            await removeFavoriteRepository(
                normalizedId
            );

            setFavorites((current) =>
                current.filter(
                    (favorite) =>
                        Number(
                            favorite?.github_repo_id
                        ) !== normalizedId
                )
            );

        } catch (requestError) {

            console.error(
                "Remove favorite error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to remove this repository from favorites."
            );

        } finally {
            setRemovingId(null);
        }
    };

    // =================================
    // Search
    // =================================

    const filteredFavorites = useMemo(() => {

        const query =
            search.trim().toLowerCase();

        if (!query) {
            return favorites;
        }

        return favorites.filter((repository) => {

            const name =
                repository?.name?.toLowerCase() || "";

            const fullName =
                repository?.full_name?.toLowerCase() || "";

            return (
                name.includes(query) ||
                fullName.includes(query)
            );
        });

    }, [favorites, search]);

    // =================================
    // Loading
    // =================================

    if (loading) {
        return (
            <FavoritesSkeleton />
        );
    }

    // =================================
    // Render
    // =================================

    return (
        <div className="space-y-7">

            {/* Header */}

            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/[0.08] text-amber-400">
                        <Star
                            size={21}
                            fill="currentColor"
                        />
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Favorites
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Your saved GitHub repositories.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={loadFavorites}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </header>

            {/* Error */}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">

                    <AlertCircle
                        size={16}
                        className="shrink-0"
                    />

                    <span className="flex-1">
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={loadFavorites}
                        className="text-red-200 hover:text-white"
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* Toolbar */}

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="relative w-full sm:max-w-md">

                    <Search
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search favorites..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-600"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}

                </div>

                <div className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-300">
                        {filteredFavorites.length}
                    </span>{" "}
                    favorite
                    {filteredFavorites.length !== 1
                        ? "s"
                        : ""}
                </div>

            </div>

            {/* Empty */}

            {filteredFavorites.length === 0 ? (
                <EmptyFavorites
                    searching={Boolean(search)}
                />
            ) : (

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {filteredFavorites.map(
                        (repository) => (
                            <FavoriteCard
                                key={
                                    repository.github_repo_id
                                }
                                repository={repository}
                                removingId={removingId}
                                onRemove={
                                    handleRemoveFavorite
                                }
                            />
                        )
                    )}

                </div>

            )}

        </div>
    );
};


// Favorite Card


const FavoriteCard = ({
    repository,
    removingId,
    onRemove
}) => {

    const repositoryId =
        repository?.github_repo_id;

    const repositoryName =
        repository?.name ||
        "Unnamed repository";

    const fullName =
        repository?.full_name ||
        repositoryName;

    const htmlUrl =
        repository?.html_url;

    const isRemoving =
        removingId === Number(repositoryId);

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-700 sm:p-6">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-400/[0.04] blur-3xl" />

            <div className="relative">

                {/* Top */}

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500">
                            <Code2 size={19} />
                        </div>

                        <div className="min-w-0">

                            {htmlUrl ? (
                                <a
                                    href={htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-400"
                                >
                                    <span className="truncate">
                                        {repositoryName}
                                    </span>

                                    <ArrowUpRight
                                        size={14}
                                        className="shrink-0"
                                    />
                                </a>
                            ) : (
                                <h2 className="truncate text-sm font-semibold text-white">
                                    {repositoryName}
                                </h2>
                            )}

                            <p className="mt-1 truncate text-[11px] text-slate-600">
                                {fullName}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onRemove(repository)
                        }
                        disabled={isRemoving}
                        title="Remove from favorites"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isRemoving ? (
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                        ) : (
                            <Heart
                                size={16}
                                fill="currentColor"
                            />
                        )}
                    </button>

                </div>

                {/* Repository ID */}

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                    <div className="flex items-center justify-between gap-3">

                        <div>

                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                GitHub Repository ID
                            </p>

                            <p className="mt-1 font-mono text-xs text-slate-400">
                                {repositoryId || "Unknown"}
                            </p>

                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-500">
                            <Star size={15} />
                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-5 flex items-center justify-between gap-3">

                    <span className="text-[10px] uppercase tracking-wide text-slate-600">
                        Saved
                    </span>

                    <span className="text-[11px] text-slate-500">
                        {formatRelativeDate(
                            repository?.created_at
                        )}
                    </span>

                </div>

                {/* GitHub */}

                {htmlUrl && (
                    <a
                        href={htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                        View repository on GitHub
                        <ExternalLink size={14} />
                    </a>
                )}

            </div>

        </article>
    );
};


// Empty Favorites


const EmptyFavorites = ({ searching }) => {
    return (
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
                <Heart size={28} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
                {searching
                    ? "No favorites found"
                    : "No favorite repositories"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {searching
                    ? "Try another search term."
                    : "Repositories you save with the heart button will appear here."}
            </p>

        </section>
    );
};


// Skeleton


const FavoritesSkeleton = () => {
    return (
        <div className="space-y-6">

            <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />
                <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-800" />
            </div>

            <div className="h-16 animate-pulse rounded-2xl bg-slate-800" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {Array.from({ length: 4 }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                        />
                    )
                )}
            </div>

        </div>
    );
};

export default Favorites;