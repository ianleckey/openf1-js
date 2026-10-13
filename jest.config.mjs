import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({ tsconfig: "tsconfig.test.json" }).transform;

/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // Source files import siblings with `.js` extensions (NodeNext); map them back to `.ts`.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
