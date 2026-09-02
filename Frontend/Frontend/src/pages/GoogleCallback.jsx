import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";


const GoogleCallback = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const { login } =
        useAuth();


    useEffect(() => {

        const token =
            searchParams.get("token");


        if (!token) {

            navigate("/login", {
                replace: true
            });

            return;

        }


        const loginSuccess =
            login(token);


        if (!loginSuccess) {

            navigate("/login", {
                replace: true
            });

            return;

        }


        navigate("/dashboard", {
            replace: true
        });

    }, [
        searchParams,
        login,
        navigate
    ]);


    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-slate-950
            text-white
        ">

            Signing you in...

        </div>

    );

};


export default GoogleCallback;