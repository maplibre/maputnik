## Internationalization

The process of internationlization is pretty straight forward for Maputnik.

## Add a new language

#### 1. Edit configuration

In order to add a new translation you'll need to add it to the configuration files. Please put it in alphabetical order.

- Open [/i18next-parser.config.ts](/i18next-parser.config.ts) and add the ISO Code of your language to the `locales` array.
- Now, open [/src/i18n.ts](/src/i18n.ts) and add the ISO Code and localized name to the supported languages.

#### 2. Add the localized strings

Refresh the localization to generate a new directory under `/src/locales/` for your new language.

```bash
npm run i18n:refresh
```

Replace every `__STRING_NOT_TRANSLATED__` value in the newly generated `translation.json` file with the according translation.
Make sure all the keys are translated.

#### 3. Test your new locale

Finally, test your language locally by starting a local instance of Maputnik.

```bash
npm start
```

Consider adding your name as a helping person for the translation of new features.

## Add localization for a new feature

If you happen to add a feature which needs some text to be translated, update the translation files.
After running, check your working copy for files and add/correct as needed.

```bash
npm run i18n:refresh
```

The following users can help you with the relevant languages:

| ISO Code | Language           | User                                       |
|----------|--------------------|--------------------------------------------|
| de       | German             | [@josxha](https://github.com/josxha)       | 
| en       | English            | [@HarelM](https://github.com/HarelM)       | 
| fr       | French             | [@lhapaipai](https://github.com/lhapaipai) | 
| hr       | Hebrew             | [@HarelM](https://github.com/HarelM)       | 
| ja       | Japanese           | [@keichan34](https://github.com/keichan34) | 
| zh       | Simplified Chinese | [@jieme](https://github.com/jieme)         | 

You can test the UI in different languages using the dropdown in the top menu
Note that Maputnik automatically localize based on browser language settings and stores this language in local storage.
You can use incognito mode to check a first time usage.


