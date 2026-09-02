
import { useMemo } from "react";

import {
    Activity,
    CalendarDays,
    TrendingUp
} from "lucide-react";


// =====================================
// Constants
// =====================================

const WEEKS_TO_SHOW = 15;
const DAYS_IN_WEEK = 7;


// =====================================
// Helpers
// =====================================

const formatDateKey = (date) => {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

};


// =====================================
// Get Activity Level
// =====================================

const getActivityLevel = (count) => {

    if (count === 0) {
        return 0;
    }

    if (count <= 2) {
        return 1;
    }

    if (count <= 5) {
        return 2;
    }

    if (count <= 9) {
        return 3;
    }

    return 4;

};


// =====================================
// Get Level Class
// =====================================

const getLevelClass = (level) => {

    switch (level) {

        case 1:
            return "bg-emerald-950/80 border-emerald-900/60";

        case 2:
            return "bg-emerald-800/80 border-emerald-700/60";

        case 3:
            return "bg-emerald-600 border-emerald-500/70";

        case 4:
            return "bg-emerald-400 border-emerald-300/80";

        default:
            return "bg-slate-800/70 border-slate-700/70";

    }

};


// =====================================
// Start Of Week
// =====================================

const getStartOfWeek = (date) => {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    const day =
        result.getDay();

    /*
     * JavaScript:
     * Sunday = 0
     * Monday = 1
     * ...
     * Saturday = 6
     *
     * Convert week to Monday -> Sunday.
     */

    const daysFromMonday =
        day === 0
            ? 6
            : day - 1;

    result.setDate(
        result.getDate() - daysFromMonday
    );

    return result;

};


// =====================================
// Contribution Graph
// =====================================

const ContributionGraph = ({
    events = []
}) => {

    // =================================
    // Activity Map
    // =================================

    const activityMap = useMemo(() => {

        const map = new Map();

        if (!Array.isArray(events)) {
            return map;
        }


        events.forEach((event) => {

            if (!event?.created_at) {
                return;
            }


            const date =
                new Date(
                    event.created_at
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return;
            }


            const key =
                formatDateKey(date);


            map.set(
                key,
                (map.get(key) || 0) + 1
            );

        });


        return map;

    }, [events]);


    // =================================
    // Build Weeks
    // =================================

    const weeks = useMemo(() => {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const currentWeekStart =
            getStartOfWeek(today);


        const firstWeekStart =
            new Date(
                currentWeekStart
            );


        firstWeekStart.setDate(
            firstWeekStart.getDate() -
            ((WEEKS_TO_SHOW - 1) * DAYS_IN_WEEK)
        );


        const result = [];


        for (
            let weekIndex = 0;
            weekIndex < WEEKS_TO_SHOW;
            weekIndex++
        ) {

            const weekStart =
                new Date(
                    firstWeekStart
                );


            weekStart.setDate(
                weekStart.getDate() +
                (weekIndex * DAYS_IN_WEEK)
            );


            const week = [];


            for (
                let dayIndex = 0;
                dayIndex < DAYS_IN_WEEK;
                dayIndex++
            ) {

                const date =
                    new Date(
                        weekStart
                    );


                date.setDate(
                    date.getDate() +
                    dayIndex
                );


                const key =
                    formatDateKey(date);


                const count =
                    activityMap.get(key) || 0;


                /*
                 * Hide future days from the
                 * current week.
                 */

                const isFuture =
                    date > today;


                week.push({

                    date,

                    key,

                    count:
                        isFuture
                            ? 0
                            : count,

                    level:
                        isFuture
                            ? 0
                            : getActivityLevel(
                                count
                            ),

                    isFuture

                });

            }


            result.push(
                week
            );

        }


        return result;

    }, [activityMap]);


    // =================================
    // Flatten Days
    // =================================

    const days = useMemo(() => {

        return weeks.flat();

    }, [weeks]);


    // =================================
    // Statistics
    // =================================

    const totalActivity =
        useMemo(() => {

            return days.reduce(
                (total, day) =>
                    total + day.count,
                0
            );

        }, [days]);


    const activeDays =
        useMemo(() => {

            return days.filter(
                (day) =>
                    day.count > 0
            ).length;

        }, [days]);


    const averageActivity =
        useMemo(() => {

            if (
                activeDays === 0
            ) {
                return "0";
            }


            return (
                totalActivity /
                activeDays
            ).toFixed(1);

        }, [
            totalActivity,
            activeDays
        ]);


    const maxActivity =
        useMemo(() => {

            return days.reduce(
                (max, day) =>
                    Math.max(
                        max,
                        day.count
                    ),
                0
            );

        }, [days]);


    // =================================
    // Current Streak
    // =================================

    const currentStreak =
        useMemo(() => {

            let streak = 0;


            /*
             * Start from today and walk
             * backwards.
             */

            for (
                let i = days.length - 1;
                i >= 0;
                i--
            ) {

                const day =
                    days[i];


                if (
                    day.isFuture
                ) {
                    continue;
                }


                if (
                    day.count > 0
                ) {

                    streak++;

                } else {

                    break;

                }

            }


            return streak;

        }, [days]);


    // =================================
    // Month Labels
    // =================================

    const monthLabels =
        useMemo(() => {

            const labels = [];

            let previousMonthKey =
                null;


            weeks.forEach(
                (week, index) => {

                    const firstDay =
                        week[0]?.date;


                    if (!firstDay) {
                        return;
                    }


                    const monthKey =
                        `${firstDay.getFullYear()}-${firstDay.getMonth()}`;


                    if (
                        monthKey !==
                        previousMonthKey
                    ) {

                        labels.push({

                            index,

                            label:
                                firstDay.toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short"
                                    }
                                )

                        });


                        previousMonthKey =
                            monthKey;

                    }

                }
            );


            return labels;

        }, [weeks]);


    // =================================
    // Empty State
    // =================================

    const hasActivity =
        totalActivity > 0;


    // =================================
    // Render
    // =================================

    return (

        <section className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            shadow-xl
            shadow-black/10
        ">


            {/* =================================
                Background Glow
            ================================= */}

            <div className="
                pointer-events-none
                absolute
                -right-32
                -top-32
                h-72
                w-72
                rounded-full
                bg-emerald-500/[0.035]
                blur-3xl
            " />


            <div className="
                pointer-events-none
                bottom-0
                left-1/3
                h-56
                w-56
                rounded-full
                bg-blue-500/[0.025]
                blur-3xl
            " />


            <div className="
                relative
                z-10
                p-5
                sm:p-6
                lg:p-7
            ">


                {/* =================================
                    Header
                ================================= */}

                <div className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                ">


                    {/* Title */}

                    <div>

                        <div className="
                            flex
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
                                border
                                border-slate-800
                                bg-slate-950
                            ">

                                <Activity
                                    className="
                                        h-5
                                        w-5
                                        text-emerald-400
                                    "
                                    strokeWidth={1.8}
                                />

                            </div>


                            <div>

                                <h2 className="
                                    text-base
                                    font-semibold
                                    tracking-tight
                                    text-white
                                    sm:text-lg
                                ">

                                    Development activity

                                </h2>


                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    sm:text-sm
                                ">

                                    Your GitHub activity over the last 15 weeks

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Mini Stats */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    ">


                        {/* Total */}

                        <div className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950/70
                            px-3
                            py-2
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <CalendarDays
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-slate-500
                                    "
                                />

                                <span className="
                                    text-xs
                                    text-slate-500
                                ">

                                    Activities

                                </span>


                                <span className="
                                    text-xs
                                    font-semibold
                                    text-slate-200
                                ">

                                    {totalActivity}

                                </span>

                            </div>

                        </div>


                        {/* Streak */}

                        <div className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950/70
                            px-3
                            py-2
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <TrendingUp
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-emerald-400
                                    "
                                />

                                <span className="
                                    text-xs
                                    text-slate-500
                                ">

                                    Streak

                                </span>


                                <span className="
                                    text-xs
                                    font-semibold
                                    text-emerald-400
                                ">

                                    {currentStreak}d

                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================
                    Divider
                ================================= */}

                <div className="
                    my-6
                    h-px
                    bg-slate-800/80
                " />


                {/* =================================
                    Graph Area
                ================================= */}

                <div className="
                    overflow-x-auto
                    pb-2
                    scrollbar-thin
                    scrollbar-track-transparent
                    scrollbar-thumb-slate-700
                ">

                    <div className="
                        min-w-[720px]
                    ">


                        {/* =================================
                            Month Labels
                        ================================= */}

                        <div className="
                            mb-3
                            flex
                            h-4
                            gap-[4px]
                            pl-8
                        ">

                            {weeks.map(
                                (_, weekIndex) => {

                                    const month =
                                        monthLabels.find(
                                            (item) =>
                                                item.index ===
                                                weekIndex
                                        );


                                    return (

                                        <div
                                            key={weekIndex}
                                            className="
                                                w-[13px]
                                                shrink-0
                                            "
                                        >

                                            {month && (

                                                <span className="
                                                    block
                                                    whitespace-nowrap
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-600
                                                ">

                                                    {month.label}

                                                </span>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>


                        {/* =================================
                            Graph
                        ================================= */}

                        <div className="
                            flex
                            gap-2
                        ">


                            {/* Weekday Labels */}

                            <div className="
                                flex
                                w-6
                                shrink-0
                                flex-col
                                justify-between
                                py-[1px]
                            ">

                                <span className="
                                    text-[9px]
                                    text-slate-600
                                ">

                                    Mon

                                </span>


                                <span className="
                                    text-[9px]
                                    text-slate-600
                                ">

                                    Wed

                                </span>


                                <span className="
                                    text-[9px]
                                    text-slate-600
                                ">

                                    Fri

                                </span>


                                <span className="
                                    text-[9px]
                                    text-slate-600
                                ">

                                    Sun

                                </span>

                            </div>


                            {/* Weeks */}

                            <div className="
                                flex
                                gap-[4px]
                            ">

                                {weeks.map(
                                    (
                                        week,
                                        weekIndex
                                    ) => (

                                        <div
                                            key={`week-${weekIndex}`}
                                            className="
                                                flex
                                                w-[13px]
                                                shrink-0
                                                flex-col
                                                gap-[4px]
                                            "
                                        >

                                            {week.map(
                                                (day) => (

                                                    <div
                                                        key={day.key}
                                                        title={
                                                            day.isFuture
                                                                ? "Future"
                                                                : `${day.count} ${day.count === 1
                                                                    ? "activity"
                                                                    : "activities"
                                                                } on ${day.date.toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric"
                                                                    }
                                                                )}`
                                                        }
                                                        className={`
                                                            h-[13px]
                                                            w-[13px]
                                                            rounded-[3px]
                                                            border
                                                            transition-all
                                                            duration-150
                                                            ${day.isFuture
                                                                ? "cursor-default opacity-40"
                                                                : "cursor-pointer hover:scale-125 hover:ring-2 hover:ring-emerald-400/20"
                                                            }
                                                            ${getLevelClass(
                                                                day.level
                                                            )}
                                                        `}
                                                    />

                                                )
                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================
                    No Activity Notice
                ================================= */}

                {!hasActivity && (

                    <div className="
                        mt-5
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-950/40
                        px-4
                        py-3
                    ">

                        <p className="
                            text-xs
                            text-slate-500
                        ">

                            No GitHub activity was found in the last 15 weeks.

                        </p>

                    </div>

                )}


                {/* =================================
                    Bottom Information
                ================================= */}

                <div className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-slate-800/80
                    pt-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">


                    {/* Stats */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-x-6
                        gap-y-2
                    ">

                        <div>

                            <span className="
                                text-xs
                                text-slate-600
                            ">

                                Active days

                            </span>

                            <span className="
                                ml-2
                                text-xs
                                font-semibold
                                text-slate-300
                            ">

                                {activeDays}

                            </span>

                        </div>


                        <div>

                            <span className="
                                text-xs
                                text-slate-600
                            ">

                                Avg / active day

                            </span>

                            <span className="
                                ml-2
                                text-xs
                                font-semibold
                                text-slate-300
                            ">

                                {averageActivity}

                            </span>

                        </div>


                        <div>

                            <span className="
                                text-xs
                                text-slate-600
                            ">

                                Best day

                            </span>

                            <span className="
                                ml-2
                                text-xs
                                font-semibold
                                text-slate-300
                            ">

                                {maxActivity}

                            </span>

                        </div>

                    </div>


                    {/* Legend */}

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            text-[10px]
                            text-slate-600
                        ">

                            Less

                        </span>


                        {[0, 1, 2, 3, 4].map(
                            (level) => (

                                <span
                                    key={level}
                                    className={`
                                        h-3
                                        w-3
                                        rounded-[3px]
                                        border
                                        ${getLevelClass(
                                            level
                                        )}
                                    `}
                                />

                            )
                        )}


                        <span className="
                            text-[10px]
                            text-slate-600
                        ">

                            More

                        </span>

                    </div>

                </div>


                {/* =================================
                    Footer
                ================================= */}

                <p className="
                    mt-4
                    text-[11px]
                    text-slate-600
                ">

                    Activity is calculated from your recent GitHub events.

                </p>

            </div>

        </section>

    );

};


export default ContributionGraph;
