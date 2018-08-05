import { declare } from "@babel/helper-plugin-utils";
import path from "path";

const validate = options => {
  const { alias, path } = options;
  if (typeof alias !== "string") {
    throw new Error(
      `babel-plugin-codemod-aliased-imports expected an \`alias\` option of type string. Received ${alias} instead.`
    );
  }
  if (typeof path !== "string") {
    throw new Error(
      `babel-plugin-codemod-aliased-imports expected an \`path\` option of type string. Received ${path} instead.`
    );
  }
};

export default declare((api, options, dirname) => {
  if (api.version.startsWith("7")) {
    validate(options);
  }
  return {
    name: "codemod-aliased-imports",
    visitor: {
      ImportDeclaration(node, state) {
        if (api.version.startsWith("6")) {
          validate(state.opts);
        }
        const {
          opts: { alias, path: relativeAliasedPath }
        } = state;
        const importPath = node.get("source").node.value;
        const fileDirname = path.dirname(state.filename);
        const absoluteImportPath = path.resolve(fileDirname, importPath);
        const absoluteAliasedPath = path.resolve(dirname, relativeAliasedPath);
        if (
          !node.aliased &&
          absoluteImportPath.startsWith(absoluteAliasedPath)
        ) {
          node.aliased = true;
          node.replaceWith(
            api.types.importDeclaration(
              node.get("specifiers"),
              api.types.stringLiteral(
                absoluteImportPath.replace(absoluteAliasedPath, alias)
              )
            )
          );
        }
      }
    }
  };
});
