// lib
import FetchRequest from "./fetch-request";
import { requestUsers } from "./common-requests";
import { DataProviderObject } from "../globals";
import { itemId } from "./general";
import { err, fromOption, ok } from "./result";

/**
 * An interface that for an object which can have attribution
 * information generated.
 *
 * Objects with `lab`, `award`, or `collections`, when passed to
 * `buildAttribution` will have their attribution details built.
 *
 * All properties are optional because some objects may attempt
 * to have attributions made of them when these propertis don't
 * exist, in which case the returned Attribution would be null.
 */
export interface Attributable {
  "@type": string[];
  lab?: string | { "@id": string };
  award?: string | { "@id": string } | Array<string | { "@id": string }>;
  collections?: [string] | null;
}

/**
 * The Attribution of an object. Once an object has its attribution
 * built, the details are collected into an object that has this
 * interface. Attributions are then passed to the Attribution component
 * to be rendered.
 */
export interface Attribution {
  type: string;
  lab: DataProviderObject | null;
  award: DataProviderObject[] | null;
  contactPi: DataProviderObject | null;
  pis: object[] | null;
  collections: string[] | null;
}

/**
 * Generate the attribution data for an object page.
 * @param {object} obj Object for the displayed page
 * @param {string} cookie Server cookie to authenticate the request
 * @returns {object} attribution data for the given page
 */
export default async function buildAttribution(
  obj: Attributable,
  cookie: string
): Promise<Attribution> {
  const request = new FetchRequest({ cookie });

  const lab = (
    await fromOption(obj.lab).and_then_async(async (x) => {
      const id = itemId(x);
      return (await request.getObject(id)).map_err((_x) => null);
    })
  ).optional();

  const award = (
    await fromOption(obj.award).and_then_async(async (awards) => {
      // Handle both single award and array of awards
      const awardArray = Array.isArray(awards) ? awards : [awards];
      const awardResults = await Promise.all(
        awardArray.map(async (award) => {
          const id = itemId(award);
          return await request.getObject(id);
        })
      );
      // Filter out failed requests and extract successful objects
      const successfulAwards = awardResults
        .filter(result => result.isOk())
        .map(result => result.unwrap());
      return ok(successfulAwards);
    })
  ).optional();

  const contactPi = (
    await fromOption(award)
      .and_then((awards) => fromOption(awards[0]?.contact_pi as string))
      .and_then_async(async (p) => {
        return (await request.getObject(p)).map_err((_e) => null);
      })
  ).optional();

  const pis = (
    await fromOption(award)
      .and_then((awards) => fromOption(awards[0]?.pis as Array<string>))
      .map_async(async (ps) => {
        return await requestUsers(ps, request);
      })
  ).optional();

  const collections = fromOption(obj.collections)
    .and_then<[string]>((c) => (c.length > 0 ? ok(c) : err(null)))
    .optional();

  return {
    type: obj["@type"][0],
    lab,
    award,
    contactPi,
    pis,
    collections,
  };
}
