/**
 * Add or update a value within a map, depending on if the key already exists. This function mimics
 * the equivalent ECMAScript proposal: https://github.com/tc39/proposal-upsert
 */
export const emplaceMap = <K, V>(
  map: Map<K, V>,
  key: K,
  options: {
    insert: (key: K, map: Map<K, V>) => V,
    update: (existing: V, key: K, map: Map<K, V>) => V
  }
) => {
  const existing = map.get(key)

  if (existing !== undefined) {
    map.set(key, options.update(existing, key, map))
  } else {
    map.set(key, options.insert(key, map))
  }
}
