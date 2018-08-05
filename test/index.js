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
  it("throws if alias not provided", () => {
    expect(() => transform("", withOptions())).toThrow(
      "babel-plugin-codemod-aliased-imports expected an `alias` option of type string. Received undefined instead."
    );
  });

  it("throws if path not provided", () => {
    expect(() =>
      transform(
        "",
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
          alias: "~",
          path: "./test/fixtures/foo"
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
          alias: "~",
          path: "./test/fixtures/bar"
        })
      ).code
    ).toMatchSnapshot();
  });
});
