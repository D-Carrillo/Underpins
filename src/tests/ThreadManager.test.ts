import {test, expect, describe, beforeEach} from 'vitest';
import {ThreadManager} from "../managers/ThreadManager.ts";
import {NotesManager} from "../managers/NoteManager.ts";

test("GetSeparateIDs would return the correct IDs", () => {
    const threadID =  "Origin_Destination";

    const parts = ThreadManager.getSeparateIDs(threadID);

    expect(parts.originID).toBe("Origin");
    expect(parts.destinationID).toBe("Destination");
});

describe("GetSeparateIDs would throw an Error if there is no Origin or Destination", () => {
    test.each([
        ["Origin_"],
        ["_Destination"]
    ])("Would throw error with (%s)", (threadID) => {

        expect(() => ThreadManager.getSeparateIDs(threadID)).toThrowError("No Origin or Destination in the thread");
    });
});

describe("DeleteThread should catch the Error from getSeparateIDs", () => {
    test.each([
        ["Origin_"],
        ["_Destination"]
    ])("Would throw error with (%s)", (threadID) => {

        expect(() => ThreadManager.deleteThread(threadID)).toThrowError("No Origin or Destination in the thread");
    });
});

describe("Deletion tests", () => {
    beforeEach(() => {
        ThreadManager.reset();
    });

    test("deleteThreadWithThreadID deletes one threadID", () => {
        const numOfThreads = ThreadManager.getThreadGraph().getVertexesAmount();

        const threadID = NotesManager.getNotes()[0].id + '_' + NotesManager.getNotes()[1].id;

        ThreadManager.deleteThread(threadID);

        expect(ThreadManager.getThreadGraph().getVertexesAmount()).toBe(numOfThreads - 1);
        expect(ThreadManager.getDeletedThreads().has(threadID));
    });

    test("deleteThreadWithThreadID deletes the wanted thread", () => {
        const threadID = NotesManager.getNotes()[0].id + '_' + NotesManager.getNotes()[1].id;

        ThreadManager.deleteThread(threadID);

        expect(ThreadManager.getThreadGraph().containsVertex(NotesManager.getNotes()[0].id)).toBe(false);
        expect(ThreadManager.getDeletedThreads().has(threadID));
    });

    test("deleteThread with only noteID deletes all of thread that are linked to that note", () => {
        const numOfThreads = ThreadManager.getThreadGraph().getVertexesAmount();

        ThreadManager.deleteThread(NotesManager.getNotes()[1].id);

        expect(ThreadManager.getThreadGraph().getVertexesAmount()).toBe(numOfThreads - 2);
        expect(ThreadManager.getDeletedThreads().size).toBe(2);
    });

    test("deleteThread with only noteID delete all of the threads that contain that note", () => {
        ThreadManager.deleteThread(NotesManager.getNotes()[1].id);

        expect(ThreadManager.getThreadGraph().getAllThreadIDsThatConnectTo(NotesManager.getNotes()[1].id)).toStrictEqual([]);
        expect(ThreadManager.getDeletedThreads().has(NotesManager.getNotes()[0].id + '_' + NotesManager.getNotes()[1].id));
        expect(ThreadManager.getDeletedThreads().has(NotesManager.getNotes()[2].id + '_' + NotesManager.getNotes()[1].id));

    });
});
