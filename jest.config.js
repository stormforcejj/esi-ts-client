const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/src/generated/apis/",
        "/src/generated/models/",
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
    ],
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};