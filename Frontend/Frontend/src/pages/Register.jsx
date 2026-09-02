
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi.js";
import { loginWithGoogle } from "../api/googleApi.js";

import { useAuth } from "../context/AuthContext.jsx";


const Register = () => {

    const navigate = useNavigate();

    const { login } = useAuth();


    // =====================================
    // Form State
    // =====================================

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    // =====================================
    // UI State
    // =====================================

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =====================================
    // Handle Register
    // =====================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);


        try {

       
            // Register User
       

            const data =
                await registerUser(
                    name,
                    email,
                    password
                );


       
            // Get JWT Token
       

            const token =
                data?.data?.token;


       
            // Validate Token
       

            if (!token) {

                throw new Error(
                    "Invalid authentication response from server"
                );

            }


       
            // Save Authentication
       

            const loginSuccess =
                login(token);


            if (!loginSuccess) {

                throw new Error(
                    "Unable to save authentication session"
                );

            }


       
            // Redirect
       

            navigate("/dashboard");


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setError(
                error.message ||
                "Unable to create your account. Please try again."
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

                <div className="mb-8 text-center">

                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-slate-950 shadow-lg">

                        D

                    </div>


                    <h1 className="text-3xl font-bold tracking-tight text-white">

                        Create your DevTrack account

                    </h1>


                    <p className="mt-2 text-sm text-slate-400">

                        Start tracking your GitHub activity.

                    </p>

                </div>


                {/* =================================
                    Register Card
                ================================= */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">


                    {/* =================================
                        Card Header
                    ================================= */}

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold text-white">

                            Create account

                        </h2>


                        <p className="mt-1 text-sm text-slate-400">

                            Enter your information below.

                        </p>

                    </div>


                    {/* =================================
                        Error Message
                    ================================= */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3">

                            <p className="text-sm text-red-400">

                                {error}

                            </p>

                        </div>

                    )}


                    {/* =================================
                        Register Form
                    ================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* =================================
                            Name
                        ================================= */}

                        <div>

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >

                                Full name

                            </label>


                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="John Doe"
                                autoComplete="name"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>


                        {/* =================================
                            Email
                        ================================= */}

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
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>


                        {/* =================================
                            Password
                        ================================= */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >

                                Password

                            </label>


                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Create a password"
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                minLength={8}
                                maxLength={72}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>


                        {/* =================================
                            Register Button
                        ================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Creating account..."
                                : "Create account"
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
                        Google Authentication
                    ================================= */}

                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <span className="text-base font-bold">

                            G

                        </span>


                        Continue with Google

                    </button>

                </div>


                {/* =================================
                    Login Link
                ================================= */}

                <p className="mt-6 text-center text-sm text-slate-500">

                    Already have an account?


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="ml-1 font-medium text-white transition hover:underline"
                    >

                        Sign in

                    </button>

                </p>

            </div>

        </main>

    );

};


export default Register;

