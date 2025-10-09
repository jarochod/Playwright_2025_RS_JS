import { expect } from "@playwright/test";
import { Navigation } from "./Navigation";
import { isDesktopViewport } from "./../utils/isDesktopViewport"

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.addButtons = page.locator('[data-qa="product-button"]');
    this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
    this.productTitle = page.locator('[data-qa="product-title"]');
    this.navigation = new Navigation(page);
  }

  visit = async () => {
    await this.page.goto("/");
  };

  addProductToBasket = async (index) => {
    const specificAddButon = this.addButtons.nth(index);
    await specificAddButon.waitFor();
    await expect(specificAddButon).toHaveText("Add to Basket");
    const navigation = new Navigation(this.page);
    // only desktop viewport
    let basketCounterBeforeAdding;
    if (isDesktopViewport(this.page)) {
    basketCounterBeforeAdding = await navigation.getBasketCount();
    }
    await specificAddButon.click();
    await expect(specificAddButon).toHaveText("Remove from Basket");
    // only desktop viewport
    if (isDesktopViewport(this.page)) {
      const basketCounterAfterAdding = await navigation.getBasketCount();
      expect(basketCounterAfterAdding).toBeGreaterThan(
        basketCounterBeforeAdding
      );
    }
  };

  sortByCheapest = async () => {
    await this.sortDropdown.waitFor();
    await this.productTitle.first().waitFor();
    const productTitlesBeforeSorting = await this.productTitle.allInnerTexts();
    await this.sortDropdown.selectOption("price-asc");
    const productTitlesAfterSorting = await this.productTitle.allInnerTexts();
    expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting);
  };
}
