import { http, HttpResponse } from "msw";

const baseUrl = "https://esi.evetech.net";

export const assetHandlers = [
    http.get<{ id: string }>(`${baseUrl}/characters/:id/assets`, ({ params, request }) => {
        const id = parseInt(params.id);
        const url = new URL(request.url)
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page') || "") : 1

        const auth = request.headers.get("Authorization");
        if (!auth || !auth.startsWith("Bearer ")) {
            return HttpResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!auth.includes("token")) {
            return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (isNaN(id) || isNaN(page)) {
            return HttpResponse.json(
                {
                    error: "Bad Request",
                },
                { status: 400 }
            );
        }

        if (id !== 90000001 || (page !== 1 && page !== 2)) {
            return HttpResponse.json(
                {
                    error: "Not Found",
                },
                { status: 404 }
            );
        }

        return HttpResponse.json([{
            is_blueprint_copy: true,
            is_singleton: true,
            item_id: 0,
            location_flag: "AssetSafety",
            location_id: 0,
            location_type: "station",
            quantity: 0,
            type_id: 0,
        }]);
    }),

    http.post<{ id: string}>(`${baseUrl}/characters/:id/assets/names`, async ({ params, request }) => {
        const body = await request.json()
        console.log(body)

        const id = parseInt(params.id);

        const auth = request.headers.get("Authorization");
        if (!auth || !auth.startsWith("Bearer ")) {
            return HttpResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!auth.substring(6).includes("token")) {
            return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (
            !body ||
            !Array.isArray(body) ||
            !body.every((item) => typeof item === "number")
        ) {
            return HttpResponse.json(
                {
                    error: "Bad Request",
                },
                { status: 400 }
            );
        }

        if (isNaN(id)) {
            return HttpResponse.json(
                {
                    error: "Bad Request",
                },
                { status: 400 }
            );
        }

        if (id !== 90000001 || JSON.stringify((body as any)) !== JSON.stringify([1])) {
            return HttpResponse.json(
                {
                    error: "Not Found",
                },
                { status: 404 }
            );
        }

        return HttpResponse.json([
            {
                item_id: 0,
                name: "string",
            },
        ]);
    })
];
