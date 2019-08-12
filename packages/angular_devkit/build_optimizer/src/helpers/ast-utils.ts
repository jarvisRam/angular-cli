/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib from 'tslib';
import * as ts from 'typescript';

const pureFunctionComment = '@__PURE__';

// We include only exports that start with '__' because tslib helpers
// all start with a suffix of two underscores.
const tslibHelpers = new Set<string>(Object.keys(tslib).filter(h => h.startsWith('__')));

// Find all nodes from the AST in the subtree of node of SyntaxKind kind.
export function collectDeepNodes<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T[] {
  const nodes: T[] = [];
  const helper = (child: ts.Node) => {
    if (child.kind === kind) {
      nodes.push(child as T);
    }
    ts.forEachChild(child, helper);
  };
  ts.forEachChild(node, helper);

  return nodes;
}

export function addPureComment<T extends ts.Node>(node: T): T {
  return ts.addSyntheticLeadingComment(
    node,
    ts.SyntaxKind.MultiLineCommentTrivia,
    pureFunctionComment,
    false,
  );
}

export function hasPureComment(node: ts.Node): boolean {
  if (!node) {
    return false;
  }

  const leadingComment = ts.getSyntheticLeadingComments(node);

  return !!leadingComment && leadingComment.some(comment => comment.text === pureFunctionComment);
}

export function isHelperName(name: string): boolean {
  return tslibHelpers.has(name);
}
