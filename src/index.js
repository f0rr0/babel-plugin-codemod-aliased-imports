import path from "path";

const validate = options => {
  const { root = process.cwd(), alias, path } = options;
  if (typeof root !== "string") {
    throw new Error(
      `babel-plugin-codemod-aliased-imports expected an \`root\` option of type string. Received ${root} instead.`
    );
  }
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

export default api => {
  return {
    name: "codemod-aliased-imports",
    visitor: {
      ImportDeclaration(node, state) {
        validate(state.opts);
        const {
          opts: { root = process.cwd(), alias, path: relativeAliasedPath }
        } = state;
        const source = node.get("source");
        if (!node.aliased && source.node.value.startsWith(".")) {
          const importPath = source.node.value;
          const fileDirname = path.dirname(state.filename);
          const absoluteImportPath = path.resolve(fileDirname, importPath);
          const absoluteAliasedPath = path.resolve(
            path.resolve(process.cwd(), root),
            relativeAliasedPath
          );
          node.aliased = true;
          source.replaceWith(
            api.types.stringLiteral(
              absoluteImportPath.replace(absoluteAliasedPath, alias)
            )
          );
        }
      }
    }
  };
};
