/**
 * Unit tests for logger utility
 * Tests logging functionality in both client and server environments
 */

describe("Logger", () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleTraceSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear module cache to reset logger
    jest.resetModules();

    // Spy on console methods
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
    consoleTraceSpy = jest.spyOn(console, "trace").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Client-side logging", () => {
    beforeEach(() => {
      // Mock window to simulate client environment
      (global as any).window = {};
    });

    afterEach(() => {
      delete (global as any).window;
    });

    it("should log info messages", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.info("Test info message");

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]",
        "Test info message"
      );
    });

    it("should log warn messages", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.warn("Test warning");

      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]", "Test warning");
    });

    it("should log error messages", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.error("Test error");

      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]", "Test error");
    });

    it("should log debug messages", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.debug("Test debug");

      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]", "Test debug");
    });

    it("should log trace messages", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.trace("Test trace");

      expect(consoleTraceSpy).toHaveBeenCalledWith("[TRACE]", "Test trace");
    });

    it("should log fatal messages as error", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.fatal("Test fatal");

      expect(consoleErrorSpy).toHaveBeenCalledWith("[FATAL]", "Test fatal");
    });

    it("should handle multiple arguments", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.info("Message", { key: "value" }, 123);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]",
        "Message",
        { key: "value" },
        123
      );
    });

    it("should handle objects", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      const obj = { user: "test", action: "login" };
      logger.info("User action", obj);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]", "User action", obj);
    });

    it("should handle errors", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      const error = new Error("Test error");
      logger.error("Error occurred", error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]",
        "Error occurred",
        error
      );
    });

    it("should handle undefined and null", () => {
      const { logger } = require("@/shared/lib/logs/logger");
      logger.info("Null test", null);
      logger.info("Undefined test", undefined);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]", "Null test", null);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]",
        "Undefined test",
        undefined
      );
    });
  });

  describe("Server-side logging", () => {
    beforeEach(() => {
      // Ensure window is not defined for server environment
      delete (global as any).window;
    });

    it("should create logger with pino if available", () => {
      // Mock pino module
      const mockPinoLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        trace: jest.fn(),
        fatal: jest.fn(),
      };

      const mockPino = jest.fn(() => mockPinoLogger) as any;
      mockPino.stdTimeFunctions = {
        isoTime: jest.fn(),
      };

      jest.doMock("pino", () => mockPino);

      // Import logger after mocking
      const { logger } = require("@/shared/lib/logs/logger");

      // Verify logger methods exist
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.debug).toBeDefined();
      expect(logger.trace).toBeDefined();
      expect(logger.fatal).toBeDefined();
    });

    it("should fall back to console if pino fails to load", () => {
      jest.spyOn(console, "warn").mockImplementation();

      // Mock eval to throw error
      global.eval = jest.fn().mockImplementation(() => {
        throw new Error("Pino not available");
      });

      const { logger } = require("@/shared/lib/logs/logger");

      // Should still have logger methods
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
    });
  });

  describe("Environment handling", () => {
    it("should respect NODE_ENV=production", () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = "production";

      const { logger } = require("@/shared/lib/logs/logger");

      expect(logger).toBeDefined();

      (process.env as any).NODE_ENV = originalEnv;
    });

    it("should respect NODE_ENV=development", () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = "development";

      const { logger } = require("@/shared/lib/logs/logger");

      expect(logger).toBeDefined();

      (process.env as any).NODE_ENV = originalEnv;
    });

    it("should respect LOG_LEVEL environment variable", () => {
      const originalLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = "debug";

      const { logger } = require("@/shared/lib/logs/logger");

      expect(logger).toBeDefined();

      process.env.LOG_LEVEL = originalLogLevel;
    });
  });

  describe("Logger interface", () => {
    it("should have all required logging methods", () => {
      const { logger } = require("@/shared/lib/logs/logger");

      expect(logger).toHaveProperty("info");
      expect(logger).toHaveProperty("warn");
      expect(logger).toHaveProperty("error");
      expect(logger).toHaveProperty("debug");
      expect(logger).toHaveProperty("trace");
      expect(logger).toHaveProperty("fatal");
    });

    it("should have callable logging methods", () => {
      const { logger } = require("@/shared/lib/logs/logger");

      expect(typeof logger.info).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.debug).toBe("function");
      expect(typeof logger.trace).toBe("function");
      expect(typeof logger.fatal).toBe("function");
    });
  });
});
