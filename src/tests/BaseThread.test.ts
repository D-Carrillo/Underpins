import { test, expect } from 'vitest';
import {BaseThread} from "../threads/BaseThread.ts";

test("BaseThreads gives correct destinationID", () => {
    expect(new BaseThread("3idtew33string").getDestination()).toEqual("3idtew33string");
});
