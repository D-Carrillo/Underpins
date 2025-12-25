import {expect, test} from 'vitest';
import {BaseThread} from "../threads/BaseThread.ts";

test('Base thread should load correct ID', () => {
   expect(new BaseThread("originID_destinationID").getThreadID()).toBe("originID_destinationID");
});
