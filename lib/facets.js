/**
 * Helpers for the facet (filter) area of search and report pages: which facets are visible, the
 * optional-facets configuration, facet order, and open/closed state. User preferences persist in
 * `localStorage` only; nothing here talks to a server-side preference store.
 *
 * snovault-search doesn't yet forward `optional`, `category`, and `description` on facets in
 * search results, so this module also merges those properties from the search-config registry
 * (`/search-config-registry/`) onto the facets by field name.
 */

// node_modules
import _ from "lodash";

/**
 * Facet fields that don't get displayed as a facet.
 */
const HIDDEN_FACET_FIELDS = ["type"];

/**
 * Facet fields visible only to authenticated users.
 */
const AUTHENTICATED_ONLY_FACET_FIELDS = ["audit.INTERNAL_ACTION.category"];

/**
 * Types that allow optional-facets configuration. The button to configure optional facets appears
 * only when searching for a single type included in this list.
 */
export const OPTIONAL_FACET_TYPES = [
  "AnalysisSet",
  "Biosample",
  "File",
  "HumanBetaCellLines",
  "HumanDonor",
  "MeasurementSet",
  "PrimaryCell",
  "PrimaryIslet",
];

/**
 * Maximum number of types allowed in the optional-facets configuration.
 */
export const MAX_TYPES_IN_CONFIG = 50;

/**
 * Maximum number of facets allowed per type in the optional-facets configuration.
 */
const MAX_FACETS_PER_TYPE = 100;

/**
 * Maximum length of a facet field name.
 */
const FACET_FIELD_NAME_MAX_LENGTH = 100;

/**
 * localStorage key holding the optional-facets configuration for all types.
 */
export const OPTIONAL_FACETS_STORAGE_KEY = "facet-optional";

/**
 * Path to the data provider's search-config registry.
 */
const SEARCH_CONFIG_REGISTRY_PATH = "/search-config-registry/";

/**
 * sessionStorage key caching the reduced search-config registry for the browser session.
 */
const SEARCH_CONFIG_STORAGE_KEY = "search-config-registry";

/**
 * Milliseconds the in-memory registry cache remains valid.
 */
const SEARCH_CONFIG_CACHE_TTL = 10 * 60 * 1000;

/**
 * From a single filter from search results, extract the term for that filter. For example, with
 * the filter for `type=InVitroSystem`, the term is `InVitroSystem`. This function also takes
 * wildcard terms into account. For example, with the filter `type=*`, this function returns is
 * `ANY`. If instead the filter is `type!=*`, this function returns `NOT`.
 * @param {object} filter Search result filter object for a single term
 * @returns {string} Term for the filter, including wildcard terms
 */
export function getFilterTerm(filter) {
  const isAnyOrNot = filter.term === "*";

  let term;
  if (isAnyOrNot) {
    const isNot = filter.field.at(-1) === "!";
    term = isNot ? "NOT" : "ANY";
  } else {
    term = filter.term;
  }

  return term;
}

/**
 * Get all the types selected with `type=` filters in the search results. Negative (`type!=`) and
 * wildcard filters don't count.
 * @param {object} searchResults Search results from the data provider
 * @returns {string[]} All types selected with `type=` filters
 */
export function getSpecificSearchTypes(searchResults) {
  const types = (searchResults.filters || [])
    .filter((filter) => filter.field === "type" && filter.term !== "*")
    .map((filter) => filter.term);
  return _.uniq(types);
}

/**
 * Filter out the facets the user shouldn't see: hidden fields, fields restricted to authenticated
 * users, and optional facets the user hasn't chosen to display.
 * @param {array} facets Property of search results
 * @param {string[]} optionalFacetsConfigForType Fields of the optional facets the user chose to
 *   display for `selectedType`
 * @param {string} selectedType Single type being searched; empty string for none or multiple types
 * @param {boolean} isAuthenticated True if the user has authenticated
 * @returns {array} Facets that the user can see
 */
export function getVisibleFacets(
  facets,
  optionalFacetsConfigForType = [],
  selectedType = "",
  isAuthenticated = true
) {
  const hiddenFields = isAuthenticated
    ? HIDDEN_FACET_FIELDS
    : HIDDEN_FACET_FIELDS.concat(AUTHENTICATED_ONLY_FACET_FIELDS);

  return facets
    .filter((facet) => !hiddenFields.includes(facet.field))
    .filter((facet) => {
      if (!facet.optional) {
        return true;
      }
      return (
        OPTIONAL_FACET_TYPES.includes(selectedType) &&
        optionalFacetsConfigForType.includes(facet.field)
      );
    });
}

/**
 * Filter out the hidden fields from the given array of filters. This is useful for showing only
 * the facet tags the user is allowed to see.
 * @param {array} filters Search result filters
 * @param {boolean} isAuthenticated True if the user has authenticated
 * @returns {array} Filters that the user can see
 */
export function getVisibleFilters(filters, isAuthenticated = true) {
  const hiddenFields = isAuthenticated
    ? HIDDEN_FACET_FIELDS
    : HIDDEN_FACET_FIELDS.concat(AUTHENTICATED_ONLY_FACET_FIELDS);
  return filters.filter((filter) => !hiddenFields.includes(filter.field));
}

/**
 * Get the selected terms, negative-selected terms, and non-selected terms for a facet.
 * @param {object} facet Facet containing the terms to determine their selection state
 * @param {array} filters Search-result filters to use to determine the current selections
 * @returns {object} Selected terms, negative-selected terms, and non-selected terms
 */
export function getTermSelections(facet, filters) {
  const selectedTerms = filters
    .filter((filter) => filter.field === facet.field)
    .map((filter) => filter.term);
  const negativeTerms = filters
    .filter((filter) => filter.field === `${facet.field}!`)
    .map((filter) => filter.term);
  const nonSelectedTerms = Array.isArray(facet.terms)
    ? facet.terms
        .map((term) => term.key.toString())
        .filter(
          (term) =>
            !selectedTerms.includes(term) && !negativeTerms.includes(term)
        )
    : [];

  return { selectedTerms, negativeTerms, nonSelectedTerms };
}

/**
 * Check if a facet appears to be a boolean facet. A boolean facet has one or two terms, either
 * with `key_as_string` of "false" and `key` of 0, or with `key_as_string` of "true" and `key` of
 * 1, or both. The schema `type` property does not get carried over to the facet terms, so we can't
 * just check for the type.
 * @param {object} facet Facet to check if it is a boolean facet
 * @returns {boolean} True if the facet is a boolean facet
 */
export function checkForBooleanFacet(facet) {
  const facetTerms = Array.isArray(facet.terms) ? facet.terms : [];
  if (facetTerms.length > 0 && facetTerms.length <= 2) {
    const falseTerms = facetTerms.filter(
      (term) => term.key_as_string === "false" && term.key === 0
    );
    const trueTerms = facetTerms.filter(
      (term) => term.key_as_string === "true" && term.key === 1
    );
    return falseTerms.length === 1 || trueTerms.length === 1;
  }
  return false;
}

/**
 * Check whether the optional-facets configuration button should be shown for the search.
 * @param {string} selectedType Single `@type` for the search results; empty string if none
 * @returns {boolean} True if the user can configure optional facets for the type
 */
export function checkOptionalFacetsConfigurable(selectedType) {
  return OPTIONAL_FACET_TYPES.includes(selectedType);
}

/**
 * Safe access to localStorage, which doesn't exist on the server and can throw when the browser
 * disables it.
 * @returns {Storage|null} localStorage object if usable; null otherwise
 */
function getLocalStorage() {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

/**
 * Check that a value is an array of non-empty strings, the expected structure for the facet order
 * and the optional-facets configuration of a single type.
 * @param {*} configForType Value to validate
 * @returns {boolean} True if the value is a valid optional-facets configuration for one type
 */
export function isValidOptionalFacetConfigForType(configForType) {
  return (
    Array.isArray(configForType) &&
    configForType.length <= MAX_FACETS_PER_TYPE &&
    configForType.every(
      (item) =>
        typeof item === "string" &&
        item.length > 0 &&
        item.length < FACET_FIELD_NAME_MAX_LENGTH
    )
  );
}

/**
 * Check that a value is an object mapping type names to arrays of optional-facet field names.
 * @param {*} config Value to validate
 * @returns {boolean} True if the value is a valid optional-facets configuration for all types
 */
export function isValidOptionalFacetConfig(config) {
  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    return false;
  }
  const entries = Object.entries(config);
  return (
    entries.length <= MAX_TYPES_IN_CONFIG &&
    entries.every(
      ([key, value]) =>
        key.length > 0 && isValidOptionalFacetConfigForType(value)
    )
  );
}

/**
 * Read and validate the optional-facets configuration for all types from localStorage.
 * @returns {object} Map of type to optional-facet fields; empty object if none or invalid
 */
function readOptionalFacetsConfig() {
  const storage = getLocalStorage();
  const configString = storage?.getItem(OPTIONAL_FACETS_STORAGE_KEY);
  if (configString) {
    try {
      const config = JSON.parse(configString);
      if (isValidOptionalFacetConfig(config)) {
        return config;
      }
    } catch {
      // Fall through to return the empty configuration.
    }
  }
  return {};
}

/**
 * Get the optional facets the user chose to display for the given type.
 * @param {string} selectedType Single search `@type` to get the configuration for
 * @returns {string[]} Fields of the optional facets to display; empty array if none configured
 */
export function getOptionalFacetsConfigForType(selectedType) {
  return readOptionalFacetsConfig()[selectedType] || [];
}

/**
 * Save the optional facets the user chose to display for the given type.
 * @param {string} selectedType Single search `@type` to save the configuration for
 * @param {string[]} newConfigForType Fields of the optional facets to display
 */
export function saveOptionalFacetsConfigForType(
  selectedType,
  newConfigForType
) {
  const storage = getLocalStorage();
  if (storage && selectedType) {
    const config = readOptionalFacetsConfig();
    config[selectedType] = newConfigForType;
    try {
      storage.setItem(OPTIONAL_FACETS_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn("Failed to save optional facets to localStorage:", error);
    }
  }
}

/**
 * Generate the localStorage key holding the facet order for a type.
 * @param {string} selectedType Search `@type` to generate the key for
 * @returns {string} localStorage key
 */
function buildFacetOrderStorageKey(selectedType) {
  return `facet-order-${encodeURIComponent(selectedType)}`;
}

/**
 * Generate the localStorage key holding the open/closed facet state for a type.
 * @param {string} selectedType Search `@type` to generate the key for
 * @returns {string} localStorage key
 */
function buildFacetOpenStorageKey(selectedType) {
  return `facet-open-${encodeURIComponent(selectedType)}`;
}

/**
 * Check that a value is a valid facet order: an array of non-empty strings.
 * @param {*} order Value to validate
 * @returns {boolean} True if `order` is a valid facet order
 */
function isValidFacetOrder(order) {
  return (
    Array.isArray(order) &&
    order.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

/**
 * Check that a value is a valid open/closed facet state: an object mapping facet fields to
 * booleans.
 * @param {*} state Value to validate
 * @returns {boolean} True if `state` is a valid open/closed state
 */
function isValidFacetOpenState(state) {
  return (
    typeof state === "object" &&
    state !== null &&
    !Array.isArray(state) &&
    Object.values(state).every((value) => typeof value === "boolean")
  );
}

/**
 * Read and validate a JSON value from localStorage, removing the entry if it fails validation.
 * @param {string} key localStorage key to read
 * @param {function} isValid Returns true if the parsed value is acceptable
 * @returns {*} Parsed value; null if absent or invalid
 */
function readValidatedStorage(key, isValid) {
  const storage = getLocalStorage();
  const stored = storage?.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      // Fall through to remove the invalid entry.
    }
    storage.removeItem(key);
  }
  return null;
}

/**
 * Get the saved facet order for a type.
 * @param {string} selectedType Single search `@type` to get the facet order for
 * @returns {string[]|null} Ordered facet fields; null if none saved
 */
export function getFacetOrder(selectedType) {
  return selectedType
    ? readValidatedStorage(
        buildFacetOrderStorageKey(selectedType),
        isValidFacetOrder
      )
    : null;
}

/**
 * Save the facet order for a type.
 * @param {string} selectedType Single search `@type` to save the facet order for
 * @param {string[]} orderedFacetFields Ordered facet fields to save
 * @returns {boolean} True if the order saved
 */
export function setFacetOrder(selectedType, orderedFacetFields) {
  const storage = getLocalStorage();
  if (!storage || !selectedType || !isValidFacetOrder(orderedFacetFields)) {
    return false;
  }
  try {
    storage.setItem(
      buildFacetOrderStorageKey(selectedType),
      JSON.stringify(orderedFacetFields)
    );
    return true;
  } catch (error) {
    console.warn("Failed to save facet order to localStorage:", error);
    return false;
  }
}

/**
 * Remove the saved facet order for a type, restoring the default order.
 * @param {string} selectedType Single search `@type` to remove the facet order for
 */
export function clearFacetOrder(selectedType) {
  getLocalStorage()?.removeItem(buildFacetOrderStorageKey(selectedType));
}

/**
 * Get the saved open/closed state of the facets for a type.
 * @param {string} selectedType Single search `@type` to get the state for
 * @returns {object|null} Map of facet field to open state; null if none saved
 */
export function getFacetOpenState(selectedType) {
  return selectedType
    ? readValidatedStorage(
        buildFacetOpenStorageKey(selectedType),
        isValidFacetOpenState
      )
    : null;
}

/**
 * Save the open/closed state of the facets for a type.
 * @param {string} selectedType Single search `@type` to save the state for
 * @param {object} openState Map of facet field to open state
 * @returns {boolean} True if the state saved
 */
export function setFacetOpenState(selectedType, openState) {
  const storage = getLocalStorage();
  if (!storage || !selectedType || !isValidFacetOpenState(openState)) {
    return false;
  }
  try {
    storage.setItem(
      buildFacetOpenStorageKey(selectedType),
      JSON.stringify(openState)
    );
    return true;
  } catch (error) {
    console.warn("Failed to save facet open state to localStorage:", error);
    return false;
  }
}

/**
 * Sort facets by a saved order. Facets in the saved order come first, in that order, followed by
 * any other facets (e.g. newly added or newly enabled optional facets) in their original order.
 * Saved fields that have no matching facet get ignored.
 * @param {array} facets Facets to sort
 * @param {string[]|null} savedOrder Ordered facet fields; null or empty for the original order
 * @returns {array} Sorted facets
 */
export function applyFacetOrder(facets, savedOrder) {
  if (!savedOrder || savedOrder.length === 0) {
    return facets;
  }
  const facetMap = new Map(facets.map((facet) => [facet.field, facet]));
  const ordered = _.uniq(savedOrder)
    .filter((field) => facetMap.has(field))
    .map((field) => facetMap.get(field));
  const orderedFields = new Set(ordered.map((facet) => facet.field));
  const remaining = facets.filter((facet) => !orderedFields.has(facet.field));
  return [...ordered, ...remaining];
}

/**
 * Extract the facet properties we care about from one facet-config entry of the registry.
 * @param {object} facetConfig Facet configuration from the search-config registry
 * @returns {object} `title`, `optional`, `category`, and `description` properties that have values
 */
function reduceFacetConfig(facetConfig) {
  const reduced = {};
  if (facetConfig && typeof facetConfig === "object") {
    if (typeof facetConfig.title === "string") {
      reduced.title = facetConfig.title;
    }
    if (typeof facetConfig.optional === "boolean") {
      reduced.optional = facetConfig.optional;
    }
    if (typeof facetConfig.category === "string") {
      reduced.category = facetConfig.category;
    }
    if (typeof facetConfig.description === "string") {
      reduced.description = facetConfig.description;
    }
  }
  return reduced;
}

/**
 * Reduce the data provider's search-config registry to just the facet properties the UI needs,
 * keyed by type and then by facet field. This keeps the cached copy small. The registry maps each
 * config name (usually a type) to a config object that includes a `facets` property, either an
 * object keyed by field or an array of facet objects with a `field` property.
 * @param {object} registry Response from `/search-config-registry/`
 * @returns {object} Map of type to map of facet field to `optional`/`category`/`description`
 */
export function reduceSearchConfigRegistry(registry) {
  const reduced = {};
  if (registry && typeof registry === "object") {
    Object.entries(registry).forEach(([name, config]) => {
      const facets = config?.facets;
      if (Array.isArray(facets)) {
        reduced[name] = Object.fromEntries(
          facets
            .filter((facet) => facet && typeof facet.field === "string")
            .map((facet) => [facet.field, reduceFacetConfig(facet)])
        );
      } else if (facets && typeof facets === "object") {
        reduced[name] = Object.fromEntries(
          Object.entries(facets).map(([field, facet]) => [
            field,
            reduceFacetConfig(facet),
          ])
        );
      }
    });
  }
  return reduced;
}

/**
 * Combine the facet configurations of all the given types into one map by facet field. A facet
 * is optional only if every selected type that configures it marks it optional.
 * @param {object} reducedRegistry Output of `reduceSearchConfigRegistry()`
 * @param {string[]} types Types selected in the search
 * @returns {object} Map of facet field to `optional`/`category`/`description`
 */
export function getFacetConfigForTypes(reducedRegistry, types) {
  const typeConfigs = types
    .map((type) => reducedRegistry?.[type])
    .filter((config) => config);
  const fields = _.uniq(typeConfigs.flatMap((config) => Object.keys(config)));

  return Object.fromEntries(
    fields.map((field) => {
      const entries = typeConfigs
        .filter((config) => field in config)
        .map((config) => config[field]);
      const merged = {
        optional: entries.every((entry) => entry.optional === true),
      };
      ["title", "category", "description"].forEach((property) => {
        const value = entries.find((entry) => entry[property])?.[property];
        if (value) {
          merged[property] = value;
        }
      });
      return [field, merged];
    })
  );
}

/**
 * Build facet objects for all the optional facets in the facet config, whether or not they appear
 * in the current search results. A facet can drop out of the search results when the user's
 * selections leave it with no terms, but the user should still be able to choose it in the
 * optional-facets configuration.
 * @param {object|null} facetConfig Output of `getFacetConfigForTypes()`
 * @returns {array} Facet-like objects (`field`, `title`, `optional`, etc.) for optional facets
 */
export function getOptionalFacetsFromConfig(facetConfig) {
  return Object.entries(facetConfig || {})
    .filter(([, config]) => config.optional)
    .map(([field, config]) => ({
      ...config,
      field,
      title: config.title || field,
      optional: true,
      terms: [],
    }));
}

/**
 * Merge `optional`, `category`, and `description` from the search config onto each facet by field
 * name. Properties the data provider already supplies on a facet win, so this becomes a no-op
 * once snovault-search forwards these properties itself. The facet's own `title` always stays.
 * @param {array} facets Facets from search results
 * @param {object|null} facetConfig Output of `getFacetConfigForTypes()`; null if not loaded
 * @returns {array} Facets with the search-config properties merged in
 */
export function mergeSearchConfigIntoFacets(facets, facetConfig) {
  if (!facetConfig) {
    return facets;
  }
  return facets.map((facet) => {
    const config = facetConfig[facet.field];
    if (!config) {
      return facet;
    }
    const merged = { ...facet };
    ["optional", "category", "description"].forEach((property) => {
      if (merged[property] === undefined && config[property] !== undefined) {
        merged[property] = config[property];
      }
    });
    return merged;
  });
}

// In-memory cache of the reduced registry, shared by all components on the page.
let registryCache = null;

/**
 * Read the reduced registry from the browser session cache.
 * @returns {object|null} Reduced registry; null if not cached or unusable
 */
function readSessionRegistry() {
  try {
    if (typeof sessionStorage !== "undefined") {
      const stored = sessionStorage.getItem(SEARCH_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }
      }
    }
  } catch {
    // Unusable session cache; fetch the registry instead.
  }
  return null;
}

/**
 * Write the reduced registry to the browser session cache.
 * @param {object} reducedRegistry Reduced registry to cache
 */
function writeSessionRegistry(reducedRegistry) {
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(
        SEARCH_CONFIG_STORAGE_KEY,
        JSON.stringify(reducedRegistry)
      );
    }
  } catch {
    // Session cache unavailable or full; the in-memory cache still works.
  }
}

/**
 * Clear the in-memory and session caches of the search-config registry.
 */
export function clearSearchConfigCache() {
  registryCache = null;
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(SEARCH_CONFIG_STORAGE_KEY);
    }
  } catch {
    // Nothing to clear.
  }
}

/**
 * Get the reduced search-config registry, fetching it from the data provider only if neither the
 * in-memory nor session cache has it. Concurrent callers share one request. Failures aren't
 * cached, so a later call retries.
 * @param {FetchRequest} request Request object to fetch the registry with
 * @returns {Promise<object|null>} Reduced registry; null if it couldn't be loaded
 */
export async function getSearchConfigRegistry(request) {
  if (
    registryCache &&
    Date.now() - registryCache.timestamp < SEARCH_CONFIG_CACHE_TTL
  ) {
    return registryCache.promise;
  }

  const sessionRegistry = readSessionRegistry();
  if (sessionRegistry) {
    registryCache = {
      promise: Promise.resolve(sessionRegistry),
      timestamp: Date.now(),
    };
    return sessionRegistry;
  }

  const cacheEntry = {
    timestamp: Date.now(),
    promise: request
      .getObject(SEARCH_CONFIG_REGISTRY_PATH)
      .then((result) => {
        const registry = result.optional();
        if (registry && !("isError" in registry)) {
          const reduced = reduceSearchConfigRegistry(registry);
          writeSessionRegistry(reduced);
          return reduced;
        }
        return null;
      })
      .catch(() => null),
  };
  registryCache = cacheEntry;

  const reducedRegistry = await cacheEntry.promise;
  if (!reducedRegistry && registryCache === cacheEntry) {
    registryCache = null;
  }
  return reducedRegistry;
}

/**
 * Load the facet config (`optional`, `category`, `description` by facet field) for the types in
 * the given search results, using the cached search-config registry.
 * @param {object} searchResults Search results from the data provider
 * @param {FetchRequest} request Request object to fetch the registry with if not cached
 * @returns {Promise<object|null>} Facet config by field; null if the registry couldn't be loaded
 */
export async function loadFacetConfig(searchResults, request) {
  const types = getSpecificSearchTypes(searchResults);
  if (types.length === 0) {
    return {};
  }
  const registry = await getSearchConfigRegistry(request);
  return registry ? getFacetConfigForTypes(registry, types) : null;
}
