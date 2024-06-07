import { NextResponse } from "next/server";
import { authMiddleware } from "./middleware/api/authmiddleware";
import { logMiddleware } from "./middleware/api/logMiddleware";

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/:path*',
}

// This function can be marked `async` if using `await` inside
export default async function middleware(request) {

    if( request.url.includes("/api/blogs")){
        const logResult = await logMiddleware(request);
        console.log( "Logsdlkf" + " " +logResult.response)
    }
    const authResult = authMiddleware(request);

    if (!authResult?.isvalid ) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    return NextResponse.next();
}
