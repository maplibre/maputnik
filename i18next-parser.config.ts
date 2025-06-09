export default {
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: [ 'de', 'fr', 'he', 'it','ja', 'zh' ],

  // Because some keys are dynamically generated, i18next-parser can't detect them.
  // We add these keys manually, so we don't want to remove them.
  keepRemoved: true,

  // We use plain English keys, so we disable key and namespace separators.
  keySeparator: false,
  namespaceSeparator: false,

  defaultValue: (_locale, _ns, _key) => {
    // The default value is a string that indicates that the string is not translated.
    return '__STRING_NOT_TRANSLATED__';
  }
}
