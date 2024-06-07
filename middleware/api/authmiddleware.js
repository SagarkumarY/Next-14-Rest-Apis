const validate = (token) => {
    const validateToken = true;
    if(!validateToken  || !token){
        return false;
    }

    return true;
}

export function authMiddleware(req){
    
    const token = req.headers.get("authorization")?.split(" ")[1];
    return {isvalid: validate(token)}
}