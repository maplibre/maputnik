export default {
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: [ 'en', 'ja' ],

  // Because some keys are dynamically generated, i18next-parser can't detect them.
  // We add these keys manually, so we don't want to remove them.
  keepRemoved: true,

  // We use plain English keys, so we disable key and namespace separators.
  keySeparator: false,
  namespaceSeparator: false,

  defaultValue: (locale, ns, key) => {
    if (locale === 'en') {
      return key;
    }
    return '__STRING_NOT_TRANSLATED__';
  }
}
