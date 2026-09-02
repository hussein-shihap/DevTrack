export const errorHandler = (err, req, res, next) => {

    console.error(err);

    // =================================
    // PostgreSQL Connection Errors
    // =================================

    if (
        err.code === "ECONNREFUSED" ||
        err.code === "57P01" ||
        err.code === "53300"
    ) {
        return res.status(503).json({
            success: false,
            message: "Service is currently unavailable"
        });
    }


    // =================================
    // PostgreSQL Duplicate
    // =================================

    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "The data already exists"
        });
    }


    // =================================
    // PostgreSQL Foreign Key
    // =================================

    if (err.code === "23503") {
        return res.status(400).json({
            success: false,
            message: "Operation cannot be completed because related data exists"
        });
    }


    // =================================
    // PostgreSQL Not Null
    // =================================

    if (err.code === "23502") {
        return res.status(400).json({
            success: false,
            message: "A required field is missing"
        });
    }


    // =================================
    // PostgreSQL Invalid Type
    // =================================

    if (err.code === "22P02") {
        return res.status(400).json({
            success: false,
            message: "Invalid data type"
        });
    }


    // =================================
    // PostgreSQL Undefined Table
    // =================================

    if (err.code === "42P01") {
        return res.status(500).json({
            success: false,
            message: "Database configuration error"
        });
    }


    // =================================
    // Application Error
    // =================================

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "An unexpected error occurred"
                : err.message || "Internal server error"
    };


    // Validation / Additional Errors

    if (err.errors) {
        response.errors = err.errors;
    }


    return res.status(statusCode).json(response);
};