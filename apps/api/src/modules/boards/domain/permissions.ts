import { BoardRole } from "./board-role";

export type Action = 
    | "board.view" | "board.delete" | "board.archive" | "board.unarchive" | "board.exit"
    | "column.create" | "column.delete" | "column.move"
    | "card.create" | "card.edit" | "card.delete" | "card.move"
    | "member.invite" | "member.remove" | "member.changeRole" | "member.transferOwner";

export const PERMISSIONS: Record<BoardRole, ReadonlySet<Action>> = {
    [BoardRole.Owner]: new Set<Action>([
        "board.view", "board.delete", "board.archive", "board.unarchive", 
        "column.create", "column.delete", "column.move",
        "card.create", "card.edit", "card.delete", "card.move",
        "member.invite", "member.remove", "member.changeRole", "member.transferOwner"
    ]),
    [BoardRole.Editor]: new Set<Action>([
        "board.view", 
        "column.create", "column.delete", "column.move",
        "card.create", "card.edit", "card.delete", "card.move",
        "member.invite", "board.exit"
    ]),
    [BoardRole.Viewer]: new Set<Action>(["board.view", "card.move", "board.exit"])
};
