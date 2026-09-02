import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    RefreshCw,
    GitBranch,
    AlertCircle,
    BookOpen,
    X
} from "lucide-react";

import RepositoryList from "../components/RepositoryList.jsx";
import { getRepositories } from "../api/githubApi.js";


// Repositories Page


const Repositories = () => {

    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");


    // Load Repositories


    const loadRepositories = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getRepositories();

            const data =
                response?.data?.repositories ??
                response?.repositories ??
                response?.data ??
                [];

            setRepositories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (requestError) {
            console.error(
                "Repositories loading error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to load your GitHub repositories."
            );

        } finally {
            setLoading(false);
        }
    }, []);


    // Initial Load


    useEffect(() => {
        loadRepositories();
    }, [loadRepositories]);


    // Filter


    const filteredRepositories = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return repositories;
        }

        return repositories.filter((repository) => {

            const name =
                repository?.name?.toLowerCase() || "";

            const fullName =
                repository?.full_name?.toLowerCase() || "";

            const description =
                repository?.description?.toLowerCase() || "";

            const language =
                repository?.language?.toLowerCase() || "";

            return (
                name.includes(query) ||
                fullName.includes(query) ||
                description.includes(query) ||
                language.includes(query)
            );
        });

    }, [repositories, search]);


    // Statistics


    const publicRepositories = useMemo(
        () =>
            repositories.filter(
                (repository) => !repository?.private
            ).length,
        [repositories]
    );

    const privateRepositories = useMemo(
        () =>
            repositories.filter(
                (repository) => repository?.private
            ).length,
        [repositories]
    );


    // Loading State


    if (loading) {
        return (
            <div className="space-y-6">

                <div className="space-y-3">
                    <div className="h-9 w-56 animate-pulse rounded-xl bg-slate-800" />
                    <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-800" />
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                        />
                    ))}
                </div>

                <div className="h-16 animate-pulse rounded-2xl bg-slate-900" />

                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                        />
                    ))}
                </div>

            </div>
        );
    }


    // Error State


    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/30 text-red-400">
                        <AlertCircle size={25} />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        Unable to load repositories
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadRepositories}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                </div>

            </div>
        );
    }


    // Render


    return (
        <div className="space-y-7">

            {/* Header */}

            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-emerald-400">
                        <GitBranch size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Repositories
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Explore all your GitHub projects and repository details.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={loadRepositories}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </header>

            {/* Statistics */}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <StatCard
                    label="Total repositories"
                    value={repositories.length}
                />

                <StatCard
                    label="Public"
                    value={publicRepositories}
                />

                <StatCard
                    label="Private"
                    value={privateRepositories}
                />

                <StatCard
                    label="Results"
                    value={filteredRepositories.length}
                    highlight
                />

            </div>

            {/* Search */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full">

                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search repositories..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-10 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-slate-600"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}

                    </div>

                    <div className="shrink-0 text-xs text-slate-600">
                        Showing{" "}
                        <span className="font-semibold text-slate-300">
                            {filteredRepositories.length}
                        </span>{" "}
                        repositories
                    </div>

                </div>

            </div>

            {/* Repository List */}

            {filteredRepositories.length === 0 ? (
                <EmptyRepositories search={search} />
            ) : (
                <RepositoryList
                    repositories={filteredRepositories}
                />
            )}

        </div>
    );
};


// Stat Card


const StatCard = ({
    label,
    value,
    highlight = false
}) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
                {label}
            </p>

            <p
                className={`mt-2 text-2xl font-bold ${
                    highlight
                        ? "text-emerald-400"
                        : "text-white"
                }`}
            >
                {value}
            </p>

        </div>
    );
};



const EmptyRepositories = ({ search }) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
                <BookOpen size={24} />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-200">
                {search
                    ? "No repositories found"
                    : "No repositories available"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                    ? "Try changing your search query."
                    : "No GitHub repositories were found for your account."}
            </p>

        </div>
    );
};

export default Repositories;