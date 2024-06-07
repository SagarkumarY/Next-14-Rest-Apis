export async function logMiddleware(req) {
    return { response: req.method + " " + req.url };
}
