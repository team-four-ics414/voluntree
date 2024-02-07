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

  async hasNonprofits(numNonprofits) {
    const nonprofitCount = Selector(`#${COMPONENT_IDS.NONPROFIT_CARD}`).count;
    await t.expect(nonprofitCount).gte(numNonprofits);
  }

  async gotoViewNonprofitPage() {
    const viewLinks = Selector(`#${COMPONENT_IDS.LIST_NONPROFIT_VIEW}`);
    await t.click(viewLinks.nth(-1));
  }

  async gotoAddNonprofitPage() {
    const addNonprofitBtn = Selector(`#${COMPONENT_IDS.NONPROFIT_ADD_BTN}`);
    await t.click(addNonprofitBtn);
  }

}

export const listNonprofitPage = new ListNonprofitPage();
