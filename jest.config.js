module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".spec\\.ts$", // Asegúrate de que tus tests terminen en .spec.ts
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/$1"
  },  
  roots: ["<rootDir>/test/unit-tests/"],  // Ubicación de tus tests
};

