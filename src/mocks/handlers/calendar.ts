import { http, HttpResponse } from "msw";

const baseUrl = "https://esi.evetech.net";

export const calendarHandlers = [
    http.get<{ charid: string; eventid: string }>(
        `${baseUrl}/characters/:charid/calendar/:eventid`,
        ({ params, request }) => {
            const charId = parseInt(params.charid);
            const eventId = parseInt(params.eventid);

            const auth = request.headers.get("Authorization");
            if (!auth || !auth.startsWith("Bearer ")) {
                return HttpResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            if (!auth.includes("token")) {
                return HttpResponse.json(
                    { error: "Forbidden" },
                    { status: 403 }
                );
            }

            if (isNaN(charId) || isNaN(eventId)) {
                return HttpResponse.json(
                    {
                        error: "Bad Request",
                    },
                    { status: 400 }
                );
            }

            if (charId !== 90000001 || eventId !== 0) {
                return HttpResponse.json(
                    {
                        error: "Not Found",
                    },
                    { status: 404 }
                );
            }

            return HttpResponse.json({
                date: "2019-08-24T14:15:22Z",
                duration: 0,
                event_id: 0,
                importance: 0,
                owner_id: 0,
                owner_name: "string",
                owner_type: "eve_server",
                response: "string",
                text: "string",
                title: "string",
            });
        }
    ),

    http.put<{ charid: string; eventid: string }>(
        `${baseUrl}/characters/:charid/calendar/:eventid`,
        async ({ params, request }) => {
            const body = await request.json();

            const charId = parseInt(params.charid);
            const eventId = parseInt(params.eventid)

            const auth = request.headers.get("Authorization");
            if (!auth || !auth.startsWith("Bearer ")) {
                return HttpResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            if (!auth.substring(6).includes("token")) {
                return HttpResponse.json(
                    { error: "Forbidden" },
                    { status: 403 }
                );
            }

            if (
                !body ||
                !(body as any).response
            ) {
                return HttpResponse.json(
                    {
                        error: "Bad Request",
                    },
                    { status: 400 }
                );
            }

            if (isNaN(charId) || isNaN(eventId)) {
                return HttpResponse.json(
                    {
                        error: "Bad Request",
                    },
                    { status: 400 }
                );
            }

            if (
                charId !== 90000001 ||
                JSON.stringify((body as any).response) !== JSON.stringify("accepted")
            ) {
                return HttpResponse.json(
                    {
                        error: "Not Found",
                    },
                    { status: 404 }
                );
            }

            return HttpResponse.json({ status: 204 });
        }
    ),
];
