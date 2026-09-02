
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi.js";
import { loginWithGoogle } from "../api/googleApi.js";

import { useAuth } from "../context/AuthContext.jsx";


const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================
    // Handle Login
    // =====================================

const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

        const response = await loginUser(
            email,
            password
        );

        console.log("LOGIN RESPONSE:", response);

        const user =
            response?.data?.user;

        const token =
            response?.data?.token;

        console.log("USER:", user);
        console.log("TOKEN:", token);

        if (!token) {

            throw new Error(
                "Authentication token was not returned by the server"
            );

        }

        const loginSuccess =
            login(token);

        if (!loginSuccess) {

            throw new Error(
                "Unable to save authentication token"
            );

        }

        navigate("/dashboard");

    } catch (error) {

        console.error(
            "Login failed:",
            error
        );

        setError(
            error.message ||
            "Unable to sign in. Please try again."
        );

    } finally {

        setLoading(false);

    }

};


    return (

        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">

            <div className="w-full max-w-md">


                {/* =================================
                    Brand
                ================================= */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-slate-950 font-bold text-xl mb-4 shadow-lg">
                        D
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Welcome to DevTrack
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Track your GitHub activity in one place.
                    </p>

                </div>


                {/* =================================
                    Login Card
                ================================= */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">


                    <div className="mb-6">

                        <h2 className="text-xl font-semibold text-white">
                            Sign in
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Enter your account details below.
                        </p>

                    </div>


                    {/* =================================
                        Error
                    ================================= */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3">

                            <p className="text-sm text-red-400">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================
                        Login Form
                    ================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-slate-200"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-xs text-slate-400 transition hover:text-white"
                                >
                                    Forgot password?
                                </button>

                            </div>


                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>


                        {/* Login Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign in"
                            }

                        </button>

                    </form>


                    {/* =================================
                        Divider
                    ================================= */}

                    <div className="my-6 flex items-center gap-4">

                        <div className="h-px flex-1 bg-slate-800" />

                        <span className="text-xs text-slate-500">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-800" />

                    </div>


                    {/* =================================
                        Google Login
                    ================================= */}

                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    >

                        <span className="text-base font-bold">
                            G
                        </span>

                        Continue with Google

                    </button>

                </div>


                {/* =================================
                    Register
                ================================= */}

                <p className="mt-6 text-center text-sm text-slate-500">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                        className="ml-1 font-medium text-white transition hover:underline"
                    >
                        Create account
                    </button>

                </p>

            </div>

        </main>

    );

};


export default Login;

