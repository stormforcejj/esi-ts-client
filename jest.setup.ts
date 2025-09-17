// jest.setup.js
import { afterAll, afterEach, beforeAll } from "@jest/globals";
import { server } from "./src/mocks/server"

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up once tests are done
afterAll(() => server.close());
