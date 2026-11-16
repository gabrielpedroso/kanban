import { Action, PERMISSIONS } from "./permissions";

type Expected = readonly [owner: boolean, editor: boolean, viewer: boolean];

const EXPECTED: Record<Action, Expected> = {
    "board.archive": [true, false, false],
    "board.delete": [true, false, false],
    "board.exit": [false, true, true],
    "board.unarchive": [true, false, false],
    "board.view": [true, true, true],
    "card.create": [true, true, false],
    "card.delete": [true, true, false],
    "card.edit": [true, true, false],
    "card.move": [true, true, true],
    "column.create": [true, true, false],
    "column.delete": [true, true, false],
    "column.move": [true, true, false],
    "member.changeRole": [true, false, false],
    "member.invite": [true, true, false],
    "member.remove": [true, false, false],
    "member.transferOwner": [true, false, false],
};

describe('PERMISSIONS', () => {
    it.each(Object.entries(EXPECTED) as [Action, Expected][])("%s", (action, [owner, editor, viewer]) => {
        expect(PERMISSIONS.Owner.has(action)).toBe(owner);
        expect(PERMISSIONS.Editor.has(action)).toBe(editor);
        expect(PERMISSIONS.Viewer.has(action)).toBe(viewer);
    });
});
