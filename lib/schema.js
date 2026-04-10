/**
 * Given a database item object, return the schema that matches its @type. The first @type that
 * matches a schema in the profiles object gets used. If no match is found or `profiles` hasn't yet
 * loaded, return null.
 * @param {object} item A database item object
 * @param {object} profiles Contains all schemas keyed by `@type`; from /profiles endpoint
 * @returns {object} The first schema that matches the item's `@type`
 */
export function itemToSchema(item, profiles) {
  if (profiles && item && item["@type"]) {
    const matchingSchema = item["@type"].find((type) => profiles[type]);
    return matchingSchema ? profiles[matchingSchema] : null;
  }
  return null;
}

/**
 * Given a collection object, return the schema that matches its `@type`.
 * @param {object} collection Collection object including `@type` and `@graph`
 * @param {object} profiles Contains all schemas keyed by `@type`; from /profiles endpoint
 * @returns {object} The schema that matches the collection's `@type`; null if none
 */
export function collectionToSchema(collection, profiles) {
  if (profiles && collection && collection["@type"]) {
    const collectionType = collection["@type"][0];
    if (collectionType) {
      // Extract the collection item `@type` from the collection `@type`.
      const collectionTypeMatch = collectionType.match(
        /^([a-zA-Z0-9]+)Collection$/
      );
      return collectionTypeMatch
        ? profiles[collectionTypeMatch[1]] || null
        : null;
    }
  }
  return null;
}

/**
 * Prepare a value parsed from the JSON editor for PUT: remove properties that are no longer in the
 * schema (e.g. fields removed from the profile but still present on `?frame=edit` responses), and
 * coerce ISO date-time strings to YYYY-MM-DD for properties with JSON Schema `format: "date"`.
 *
 * @param {object} value Parsed object from the editor (mutated in place)
 * @param {object | null} schema Schema from {@link itemToSchema}
 * @returns {object} The same `value` reference
 */
export function sanitizeEditPutPayload(value, schema) {
  if (!schema || typeof value !== "object" || value === null) {
    return value;
  }

  const props = schema.properties;
  if (props && schema.additionalProperties === false) {
    for (const key of Object.keys(value)) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        delete value[key];
      }
    }
  }

  if (props) {
    for (const key of Object.keys(props)) {
      const prop = props[key];
      if (
        prop &&
        prop.type === "string" &&
        prop.format === "date" &&
        typeof value[key] === "string"
      ) {
        const s = value[key];
        if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
          value[key] = s.slice(0, 10);
        }
      }
    }
  }

  return value;
}
