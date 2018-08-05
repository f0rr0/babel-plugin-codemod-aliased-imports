import path from "path";
import { transform, transformFileSync } from "@babel/core";
import plugin from "../src";

const withOptions = (options = {}) => ({
  babelrc: false,
  plugins: [[plugin, options]]
});

const getFixture = filename =>
  path.join(__dirname, `./fixtures/${filename}.js`);

describe("codemod-aliased-imports", () => {
  it("throws if root not provided", () => {
    expect(() =>
      transform(
        "import a from 'b'",
        withOptions({
          root: null
        })
      )
    ).toThrow(
      "babel-plugin-codemod-aliased-imports expected an `root` option of type string. Received null instead."
    );
  });

  it("throws if alias not provided", () => {
    expect(() => transform("import a from 'b'", withOptions({}))).toThrow(
      "babel-plugin-codemod-aliased-imports expected an `alias` option of type string. Received undefined instead."
    );
  });

  it("throws if path not provided", () => {
    expect(() =>
      transform(
        "import a from 'b'",
        withOptions({
          alias: ""
        })
      )
    ).toThrow(
      "babel-plugin-codemod-aliased-imports expected an `path` option of type string. Received undefined instead."
    );
  });

  it("handles imports correctly", () => {
    expect(
      transformFileSync(
        getFixture("sibling"),
        withOptions({
          root: "./test",
          alias: "~",
          path: "./fixtures/foo"
        })
      ).code
    ).toMatchSnapshot();

    expect(
      transformFileSync(
        getFixture("ancestor"),
        withOptions({
          alias: "~",
          path: "./"
        })
      ).code
    ).toMatchSnapshot();

    expect(
      transformFileSync(
        getFixture("child"),
        withOptions({
          root: "./test",
          alias: "~",
          path: "./fixtures/bar"
        })
      ).code
    ).toMatchSnapshot();

    expect(
      transformFileSync(
        getFixture("named"),
        withOptions({
          root: "./test",
          alias: "~",
          path: "./fixtures/bar"
        })
      ).code
    ).toMatchSnapshot();

    expect(
      transformFileSync(
        getFixture("node-module"),
        withOptions({
          root: "./test",
          alias: "~",
          path: "./fixtures/foo"
        })
      ).code
    ).toMatchSnapshot();
  });
});
