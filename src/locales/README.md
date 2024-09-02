## Internationalization

The process of internationlization is pretty straight forward for Maputnik.

In order to add a new translation you'll need to create a new folder and a json file with the relevant language code and make sure all the keys are translated.
The following users can help you with the relevant languages:

- English - @HarelM
- Japanese - @keichan34
- Simplified Chinese - @jieme
- Hebrew - @HarelM
- French - @lhapaipai 

If you happen to add a feature which needs some text to be translated, update the translation files.
After running, check your working copy for files and add/correct as needed.

```
npm run i18n:refresh
```

You can test the UI in different languages using the dropdown in the top menu
Note that Maputnik automatically localize based on browser language settings and stores this language in local storage.
You can use incognito mode to check a first time usage.


