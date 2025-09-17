import { http, HttpResponse } from "msw";

const baseUrl = "https://esi.evetech.net";

export const allianceHandlers = [
    http.get<{id: string}>(`${baseUrl}/alliances/:id`, ({ params }) => {
        const id = parseInt(params.id)

        if(isNaN(id)) {
            return HttpResponse.json({
                error: "Bad Request"
            }, {status: 400})
        }

        if (id !== 99000001) {
            return HttpResponse.json(
                {
                    error: "Not Found",
                },
                { status: 404 }
            );
        }
            
        return HttpResponse.json({
            creator_corporation_id: 0,
            creator_id: 0,
            date_founded: "2019-08-24T14:15:22Z",
            executor_corporation_id: 0,
            faction_id: 0,
            name: "string",
            ticker: "string",
        });
    }),
];
