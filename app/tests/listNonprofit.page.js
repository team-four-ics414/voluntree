import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class ListNonprofitPage {
  constructor() {
    this.pageId = PAGE_IDS.LIST_NONPROFIT;
    this.pageSelector = Selector(`#${this.pageId}`);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasNonprofit(testController) {
    const nonprofitCount = Selector('card').count;
    await testController.expect(nonprofitCount).gte(3);
  }

  async gotoViewNonprofitPage(testController) {
    await testController.click(`#${PAGE_IDS.VIEW_NONPROFIT}`);
  }

}

export const listNonprofitPage = new ListNonprofitPage();
