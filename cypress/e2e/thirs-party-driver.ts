export default class ThirdPartyDriver {
  public given = {
    /**
         * 
         * @param url a url to a file, this assumes the file name is the last part of the url
         * @param alias 
         */
    interceptGetToFile(url: string) {
      let fileNameAndAlias = url.split('/').pop();
      cy.intercept('GET', url, { fixture: fileNameAndAlias }).as(fileNameAndAlias!);
    },

    interceptAndIgnore(url: string) {
      cy.intercept({ method: "GET", url }, []);
    }
  }

  public get = {
    element(slector: string) {
      return cy.get(slector);
    }
  }

  public when = {
    confirmAlert() {
      cy.on("window:confirm", () => true);
    }
  }
}