import { Selector } from 'testcafe';

class OpportunitiesPage {
  constructor() {
    this.pageId = '#opportunities-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const opportunitiesPage = new OpportunitiesPage();
