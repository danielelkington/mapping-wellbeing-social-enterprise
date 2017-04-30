/// <reference path="./node_modules/tns-core-modules/tns-core-modules.d.ts" /> Needed for autocompletion and compilation.

declare interface Array<T> {
  find(predicate: (element: T, index?: number, array?: Array<T>) => boolean): T;
  findIndex(predicate: (element: T, index?: number, array?: Array<T>) => boolean): number;
}