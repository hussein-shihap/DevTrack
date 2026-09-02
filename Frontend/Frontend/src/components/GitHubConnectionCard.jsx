
import {
   
    CheckCircle2,
    ExternalLink,
    Loader2,
    RefreshCw,
    AlertCircle
} from "lucide-react";


// =====================================
// GitHub Connection Card
// =====================================

const GitHubConnectionCard = ({
    connected = false,
    profile = null,
    loading = false,
    error = "",
    onConnect,
    onRetry
}) => {


    // =================================
    // GitHub Profile Data
    // =================================

    const username =
        profile?.login ||
        profile?.name ||
        "GitHub User";


    const avatarUrl =
        profile?.avatar_url ||
        null;


    const githubUrl =
        profile?.html_url ||
        (
            profile?.login
                ? `https://github.com/${profile.login}`
                : null
        );


    // =================================
    // Connected State
    // =================================

    if (connected) {

        return (

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-700/70
                bg-slate-800/60
                shadow-xl
                shadow-black/10
            ">

                {/* =============================
                    Header
                ============================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-slate-700/70
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-700/70
                            text-slate-200
                        ">

                       
                        </div>


                        <div className="min-w-0">

                            <h2 className="
                                font-semibold
                                text-slate-100
                            ">

                                GitHub

                            </h2>


                            <p className="
                                text-xs
                                text-slate-500
                            ">

                                Account connected

                            </p>

                        </div>

                    </div>


                    <div className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-slate-600
                        bg-slate-700/50
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-slate-300
                    ">

                        <CheckCircle2
                            size={13}
                        />

                        Connected

                    </div>

                </div>


                {/* =============================
                    Profile
                ============================== */}

                <div className="
                    flex
                    flex-col
                    gap-5
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                    ">

                        {/* Avatar */}

                        {avatarUrl ? (

                            <img
                                src={avatarUrl}
                                alt={username}
                                className="
                                    h-14
                                    w-14
                                    shrink-0
                                    rounded-2xl
                                    border
                                    border-slate-700
                                    object-cover
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
                                border
                                border-slate-700
                                bg-slate-900
                                text-slate-300
                            ">

                                <Github
                                    size={25}
                                />

                            </div>

                        )}


                        <div className="
                            min-w-0
                        ">

                            <p className="
                                truncate
                                text-base
                                font-semibold
                                text-slate-100
                            ">

                                {profile?.name ||
                                    username}

                            </p>


                            {profile?.login && (

                                <p className="
                                    mt-0.5
                                    truncate
                                    text-sm
                                    text-slate-500
                                ">

                                    @{profile.login}

                                </p>

                            )}


                            {profile?.bio && (

                                <p className="
                                    mt-2
                                    line-clamp-2
                                    max-w-xl
                                    text-xs
                                    leading-5
                                    text-slate-400
                                ">

                                    {profile.bio}

                                </p>

                            )}

                        </div>

                    </div>


                    {/* GitHub Profile */}

                    {githubUrl && (

                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900/50
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-slate-300
                                transition
                                hover:border-slate-600
                                hover:bg-slate-900
                                hover:text-white
                            "
                        >

                            View GitHub

                            <ExternalLink
                                size={15}
                            />

                        </a>

                    )}

                </div>

            </div>

        );

    }


    // =================================
    // Not Connected State
    // =================================

    return (

        <div className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-700/70
            bg-slate-800/60
            shadow-xl
            shadow-black/10
        ">

            {/* =============================
                Content
            ============================== */}

            <div className="
                flex
                flex-col
                gap-6
                p-6
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">

                <div className="
                    flex
                    min-w-0
                    items-start
                    gap-4
                ">

                    <div className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900/70
                        text-slate-200
                    ">

                      
                    </div>


                    <div>

                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">

                            <h2 className="
                                text-base
                                font-semibold
                                text-slate-100
                            ">

                                Connect GitHub

                            </h2>


                            <span className="
                                rounded-full
                                border
                                border-slate-700
                                bg-slate-900/60
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                                text-slate-500
                            ">

                                Optional

                            </span>

                        </div>


                        <p className="
                            mt-1.5
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-400
                        ">

                            Connect your GitHub account to
                            view repositories, recent activity,
                            commits, and contribution data
                            directly inside DevTrack.

                        </p>


                        {/* =============================
                            Error
                        ============================== */}

                        {error && (

                            <div className="
                                mt-4
                                flex
                                items-start
                                gap-2
                                rounded-lg
                                border
                                border-red-900/50
                                bg-red-950/30
                                px-3
                                py-2.5
                            ">

                                <AlertCircle
                                    size={16}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-red-400
                                    "
                                />


                                <p className="
                                    text-xs
                                    leading-5
                                    text-red-300
                                ">

                                    {error}

                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* =============================
                    Action
                ============================== */}

                <div className="
                    flex
                    shrink-0
                    flex-col
                    gap-2
                    sm:flex-row
                ">

                    {error && onRetry && (

                        <button
                            type="button"
                            onClick={onRetry}
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900/50
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-300
                                transition
                                hover:bg-slate-900
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={15}
                            />

                            Retry

                        </button>

                    )}


                    <button
                        type="button"
                        onClick={onConnect}
                        disabled={
                            loading ||
                            typeof onConnect !== "function"
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-slate-100
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-900
                            shadow-lg
                            shadow-black/10
                            transition
                            hover:bg-white
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                                Connecting...

                            </>

                        ) : (

                            <>
                                Connect GitHub

                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>

    );

};


export default GitHubConnectionCard;

