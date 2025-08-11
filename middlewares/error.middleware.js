const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        // mongoose bad objectid
        if(err.name === 'CastError') {
            const message = 'resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // mongoose duplicate key
        if(err.code === 11000) {
            const message = 'duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        //mongoose validation error
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(err.statusCode || 500).json({ success: false, error: error.message || 'Server error' });

    }catch(error) {
        next(error)
    }
}

export default errorMiddleware;