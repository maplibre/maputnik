export default {
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: [ 'en', 'ja' ],
  defaultValue: (locale, ns, key) => {
    if (locale === 'en') {
      return key;
    }
    return '__STRING_NOT_TRANSLATED__';
  }
}
