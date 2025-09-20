import { error } from "console";
import { http, HttpResponse } from "msw";

const baseUrl = "https://esi.evetech.net";

export const statusHandlers = [
    http.get(`${baseUrl}/status`, ({request, params}) => {
        const userAgent = request.headers.get('X-User-Agent') || ""

        if(userAgent.includes("500")) {
            return HttpResponse.json({error: "Internal Server Error (Manually Triggered)"}, {
                status: 500
            })
        }
        
        return HttpResponse.json({
            players: 0,
            server_version: "string",
            start_time: "2019-08-24T14:15:22Z",
            vip: true,
        }, {
            headers: {
                Expires: new Date(Date.now() + 60000).toUTCString()
            }
        });
    }),
];
