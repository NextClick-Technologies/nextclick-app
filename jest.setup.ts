import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Polyfill for Request/Response/Headers (needed for Next.js server components)
if (typeof Request === "undefined") {
  global.Request = class Request {
    constructor(public url: string, public init?: any) {}
  } as any;
}
if (typeof Response === "undefined") {
  global.Response = class Response {
    constructor(public body?: any, public init?: any) {}
  } as any;
}
if (typeof Headers === "undefined") {
  global.Headers = class Headers {
    constructor(public init?: any) {}
  } as any;
}

// Mock fetch globally for jsdom environment
global.fetch = jest.fn();

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock Next.js auth
jest.mock("next-auth", () => ({
  default: jest.fn(),
}));

jest.mock("next-auth/next", () => ({
  auth: jest.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Not implemented: HTMLFormElement.prototype.submit"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
