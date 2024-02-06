import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class ListNonprofitPage {
  constructor() {
    this.pageId = PAGE_IDS.LIST_NONPROFIT;
    this.pageSelector = Selector(`#${this.pageId}`);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  async hasNonprofit(numNonprofits) {
    const nonprofitCount = Selector(`#${COMPONENT_IDS.NONPROFIT_CARD}`).count;
    await t.expect(nonprofitCount).eql(numNonprofits);
  }

  async gotoViewNonprofitPage() {
    const viewLinks = Selector(`#${PAGE_IDS.VIEW_NONPROFIT}`);
    await t.click(viewLinks.nth(0));
  }

}

export const listNonprofitPage = new ListNonprofitPage();
