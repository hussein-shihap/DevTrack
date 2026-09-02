import jwt from "jsonwebtoken";



// =====================================
// Authentication Middleware
// =====================================

export const authMiddleware = (
    req,
    res,
    next
) => {

    try {

       
        // Get Authorization Header
       

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authorization token is required"

            });

        }


       
        // Parse Bearer Token
       

        const parts =
            authHeader.trim().split(/\s+/);


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authorization header must be: Bearer <token>"

            });

        }


        const token =
            parts[1];


       
        // Verify JWT
       

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


       
        // Validate JWT subject
       

        const userId =
            Number(decoded?.sub);


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token"

            });

        }


       
        // Attach Authenticated User
       

        req.user = {

            id:
                userId

        };


       
        // Continue
       

        return next();

    } catch {

        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

};