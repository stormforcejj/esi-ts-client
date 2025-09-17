import { allianceHandlers } from "./handlers/alliance";
import { assetHandlers } from "./handlers/assets";
import { statusHandlers } from "./handlers/status";

export const handlers = [
    ...allianceHandlers,
    ...assetHandlers,
    ...statusHandlers
];
