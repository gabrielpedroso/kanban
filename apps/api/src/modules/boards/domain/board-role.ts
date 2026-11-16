export const BoardRole = {
    Owner: "Owner",
    Editor: "Editor",
    Viewer: "Viewer"
} as const;

export type BoardRole = typeof BoardRole[keyof typeof BoardRole];
