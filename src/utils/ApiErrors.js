class ApiError extends Error
{
    constructor(
        statusCode,
        message= "Somthing went wrong",
        errors = [],
        statck = ""
        

    ) {
        super(message),
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors


        if(statck){
            this.statck = statck
        }
        else {
            Error.captureStackTrace(this,this.constructor)
        }
    } // overwrite kerna   ho to use of this{}
}

export {ApiError}