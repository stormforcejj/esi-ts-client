import { allianceHandlers } from "./handlers/alliance";
import { assetHandlers } from "./handlers/assets";
import { calendarHandlers } from "./handlers/calendar";
import { marketHandlers } from "./handlers/market";
import { statusHandlers } from "./handlers/status";

export const handlers = [
    ...allianceHandlers,
    ...assetHandlers,
    ...calendarHandlers,
    ...marketHandlers,
    ...statusHandlers
];
