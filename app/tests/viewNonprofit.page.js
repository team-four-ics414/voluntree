import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class ViewNonprofitPage {
  constructor() {
    this.pageId = PAGE_IDS.VIEW_NONPROFIT;
    this.pageSelector = Selector(`#${this.pageId}`);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  async goBack() {
    const goBackBtn = Selector(`#${COMPONENT_IDS.NONPROFIT_VIEW_GOBACK}`);
    await t.expect(goBackBtn.exists).ok();
    await t.click(goBackBtn);
  }

}

export const viewNonprofitPage = new ViewNonprofitPage();
