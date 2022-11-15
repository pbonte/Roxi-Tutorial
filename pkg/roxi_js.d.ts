/* tslint:disable */
/* eslint-disable */
/**
*/
export class JSBinding {
  free(): void;
/**
* @returns {string}
*/
  getValue(): string;
/**
* @returns {string}
*/
  getVar(): string;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class JSRSPEngine {
  free(): void;
/**
* @param {number} width
* @param {number} slide
* @param {string} rules
* @param {string} abox
* @param {string} query
* @param {Function} f
* @returns {JSRSPEngine}
*/
  static new(width: number, slide: number, rules: string, abox: string, query: string, f: Function): JSRSPEngine;
/**
* @param {string} triple_string
* @param {number} ts
*/
  add(triple_string: string, ts: number): void;
}
/**
*/
export class RoxiReasoner {
  free(): void;
/**
* @returns {RoxiReasoner}
*/
  static new(): RoxiReasoner;
/**
* @param {string} abox
*/
  add_abox(abox: string): void;
/**
* @param {string} rules
*/
  add_rules(rules: string): void;
/**
* @returns {number}
*/
  len_abox(): number;
/**
*/
  materialize(): void;
/**
* @returns {string}
*/
  get_abox_dump(): string;
/**
* @param {string} query
* @returns {Array<any>}
*/
  query(query: string): Array<any>;
}
