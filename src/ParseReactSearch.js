/* eslint-disable no-underscore-dangle,max-len */
import Parse from 'parse';
import { ParseService } from '@owsas/parse-service';

export default class ParseReactSearch {
  /**
   * An object in which each key is a className,
   * and each value is a string, or an array of strings, with
   * the keys that are going to be matched
   * @param {{ [key:string]: { search: string|string[], include?: string[], select?: string[] } }} keyValues
   * @example
   * const config = {
        _User: {
          search: ['name', 'email'],
          include: [''],
          select: ['name', 'pic'],
          textKey: 'name',
          imgKey: 'pic',
        },
        Other: {
          search: 'name',
        },
      };
   */
  static configure(keyValues) {
    ParseReactSearch.CONFIG = keyValues;
  }

  /**
   * Gets the results for a text search, in the given scope
   * You MUST configure the class before calling this
   * @param {string} text
   * @param {{ scope: string[], queryOptions: Parse.Query.FindOptions, limit: number }} params
   */
  static async getResultsForSearch(text, params) {
    const promises = [];

    params.scope.forEach((className) => {
      // run only if the className was configured
      if (ParseReactSearch.CONFIG[className]) {
        const keys = ParseReactSearch.CONFIG[className].search;

        // for string types
        if (typeof keys === 'string') {
          const query = ParseReactSearch.getSearchQuery(
            text,
            { className, limit: params.limit, key: keys },
          );

          promises.push(ParseService.find(query, params.queryOptions));

        // for array types
        } else {
          keys.forEach((key) => {
            const query = ParseReactSearch.getSearchQuery(
              text,
              { className, limit: params.limit, key },
            );

            promises.push(ParseService.find(query, params.queryOptions));
          });
        }
      }
    });

    return Parse.Promise.when(promises);
  }

  /**
   * Gets a query for the text, given the options
   * @param {*} text
   * @param {{ className: string, limit: number, key: string }} options
   */
  static getSearchQuery(text, options) {
    const keys = ParseReactSearch.CONFIG[options.className].search;
    const { select, include } = ParseReactSearch.CONFIG[options.className];

    const query = new Parse.Query(options.className);

    // run the regexp
    query.matches(keys, new RegExp(text, 'ig'));
    query.limit(options.limit || ParseReactSearch.defaultLimit);

    if (include) {
      query.include(include);
    }

    query.select(select || [keys]);

    return query;
  }
}

ParseReactSearch.CONFIG = {};
ParseReactSearch.defaultLimit = 10;
