const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        if (!res.headersSent) { // ✅ Check if headers have already been sent
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            });
        } else {
            console.error("Headers already sent, cannot send response:", error.message);
        }
    }
};

export { asynchandler };
