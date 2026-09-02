import rateLimit from "express-rate-limit";




export const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,     // 15 دقيقة

    max: 5,     // 5 محاولات فقط


    message: {

        message:
        "محاولات تسجيل دخول كثيرة، حاول بعد 15 دقيقة"

    },


    standardHeaders: true,

    legacyHeaders: false

});



















// =================================
// General API Protection
// =================================


export const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,


    max: 300,


    message: {

        message:
        "طلبات كثيرة، حاول لاحقاً"

    },


    standardHeaders:true,

    legacyHeaders:false


});