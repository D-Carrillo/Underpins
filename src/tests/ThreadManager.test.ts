import {test, expect, describe, beforeEach, vi, afterEach} from 'vitest';
import {ThreadManager} from "../managers/ThreadManager.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import {BaseNote} from "../notes/BaseNote.ts";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";
import {BaseThread} from "../threads/BaseThread.ts";

function setupNotesSpy(mockData: BaseNote[]) {
    return vi.spyOn(Object.getPrototypeOf(NotesManager), 'loadNotes')
        .mockReturnValue(mockData);
}

function injectNotes(notes: BaseNote[]) {
    (NotesManager as any).notes = notes;
}

function populateMockThreads(notes: BaseNote[]) {
    ThreadManager.addThread(notes[0].id, notes[1].id);
    ThreadManager.addThread(notes[2].id, notes[1].id);
}

describe("ThreadManager Test Suite", () => {
    let notesSpy: any;

    beforeEach(() => {
        const mockNotes = [
            new TextNote(any<string>(), any<number>(), any<number>()),
            new TextNote(any<string>(), any<number>(), any<number>()),
            new TextNote(any<string>(), any<number>(), any<number>())
        ];

        notesSpy = setupNotesSpy(mockNotes);
        injectNotes(mockNotes);

        ThreadManager.reset();
        populateMockThreads(mockNotes);
    });

    afterEach(() => {
        notesSpy.mockRestore();
    });

    describe("Deletion Logic", () => {
        test("deleteThreadWithThreadID deletes one threadID", () => {
            const notes = NotesManager.getNotes();
            const threadID = notes[0].id + '_' + notes[1].id;
            const initialThreads = ThreadManager.getThreadGraph().getVertexesAmount();

            ThreadManager.deleteThread(threadID);

            expect(ThreadManager.getThreadGraph().getVertexesAmount()).toBe(initialThreads - 1);
            expect(ThreadManager.getDeletedThreads().some(t => t.threadType.getThreadID() === threadID)).toBe(true);
        });

        test("deleteThread with only noteID deletes all linked threads", () => {
            const notes = NotesManager.getNotes();
            const initialThreads = ThreadManager.getThreadGraph().getVertexesAmount();

            ThreadManager.deleteThread(notes[1].id);

            expect(ThreadManager.getThreadGraph().getVertexesAmount()).toBe(initialThreads - 2);
            expect(ThreadManager.getDeletedThreads().length).toBe(2);
        });

        test("deleteThread with only noteID removes connections from graph", () => {
            const notes = NotesManager.getNotes();
            const targetID = notes[1].id;

            ThreadManager.deleteThread(targetID);

            expect(ThreadManager.getThreadGraph().getAllThreadIDsThatConnectTo(targetID)).toStrictEqual([]);
            expect(ThreadManager.getDeletedThreads().some(t => t.threadType.getThreadID() === notes[0].id + '_' + targetID)).toBe(true);
            expect(ThreadManager.getDeletedThreads().some(t => t.threadType.getThreadID() === notes[2].id + '_' + targetID)).toBe(true);
        });

        test('restored thread function restores one thread', () => {
            const dateNow = Date.now();

            const originTarget = "origin_target";
            ThreadManager.getDeletedThreads().push({threadType: new BaseThread(originTarget), date: dateNow});

            ThreadManager.restoreDeletedThreads(dateNow);

            const threadID = ThreadManager.getThreadGraph().returnVertexMap("origin")?.get("target")?.getThreadID();
            const recentlyAddedContains  = ThreadManager.getRecentlyAddedThreads().includes(originTarget);

            expect(threadID).toBe(originTarget);
            expect(recentlyAddedContains).toBe(true);
        });
    });
});