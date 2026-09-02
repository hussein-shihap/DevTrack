
const API_URL =
    "http://localhost:3001/api";




const getToken = () => {

    return localStorage.getItem(
        "devtrack_token"
    );

};



// Base Request


const request = async (
    endpoint,
    options = {}
) => {

    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${API_URL}${endpoint}`,
                {

                    ...options,

                    headers: {

                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {}),

                        ...(options.headers || {})

                    }

                }
            );


        // =================================
        // Parse Response
        // =================================

        let data = {};


        try {

            data =
                await response.json();

        } catch {

            data = {};

        }


        // =================================
        // API Error
        // =================================

        if (
            !response.ok
        ) {

            console.error(
                "API Error:",
                data
            );


            const error =
                new Error(
                    data.message ||
                    "Something went wrong"
                );


            error.status =
                response.status;


            error.data =
                data;


            throw error;

        }


        return data;

    } catch (
        error
    ) {

        // =================================
        // Network Error
        // =================================

        if (
            error instanceof TypeError
        ) {

            throw new Error(
                "Unable to connect to the server"
            );

        }


        throw error;

    }

};



// GET


const get = (
    endpoint
) => {

    return request(
        endpoint,
        {
            method: "GET"
        }
    );

};



// POST


const post = (
    endpoint,
    body
) => {

    return request(
        endpoint,
        {

            method: "POST",

            body:
                JSON.stringify(
                    body
                )

        }
    );

};



// PUT


const put = (
    endpoint,
    body
) => {

    return request(
        endpoint,
        {

            method: "PUT",

            body:
                JSON.stringify(
                    body
                )

        }
    );

};



// PATCH


const patch = (
    endpoint,
    body
) => {

    return request(
        endpoint,
        {

            method: "PATCH",

            body:
                JSON.stringify(
                    body
                )

        }
    );

};



// DELETE


const remove = (
    endpoint
) => {

    return request(
        endpoint,
        {

            method: "DELETE"

        }
    );

};



// API Client


const apiClient = {

    get,

    post,

    put,

    patch,

    delete:
        remove

};


export default apiClient;

