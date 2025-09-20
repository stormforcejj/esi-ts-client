import { http, HttpResponse } from "msw";

const baseUrl = "https://esi.evetech.net"

export const marketHandlers = [
    http.get<{id: string}>(`${baseUrl}/markets/:id/history`, ({ params, request }) => {
        const id = parseInt(params.id);
        const url = new URL(request.url)
        const type_id = url.searchParams.get('type_id') ? parseInt(url.searchParams.get('type_id')!) : 1

        if (isNaN(id) || isNaN(type_id)) {
            return HttpResponse.json(
                {
                    error: "Bad Request",
                },
                { status: 400 }
            );
        }

        if (id !== 1 || type_id !== 2) {
            return HttpResponse.json(
                {
                    error: "Not Found",
                },
                { 
                    status: 404, 
                    headers: [
                        ['X-ESI-Error-Limit-Remain', id.toString()],
                        ["X-ESI-Error-Limit-Reset", type_id.toString()]
                    ]
                }
            );
        }

        return HttpResponse.json([
            {
                average: 0,
                date: "2019-08-24",
                highest: 0,
                lowest: 0,
                order_count: 0,
                volume: 0,
            },
        ]);
    })
]