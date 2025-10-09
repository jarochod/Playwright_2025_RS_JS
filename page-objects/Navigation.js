import { isDesktopViewport } from "./../utils/isDesktopViewport"

export class Navigation {
  constructor(page) {
    this.page = page;
    this.basketCounter = page.locator('[data-qa="header-basket-count"]');
    // this.checkoutLinks = page.locator('[data-qa="desktop-nav-link"]');
    this.checkoutLink = page.getByRole("link", { name: "Checkout" });
    this.burgerButton = page.locator(".burger-button");
  }


  getBasketCount = async () => {
    await this.basketCounter.waitFor();
    const text = await this.basketCounter.innerText();
    return parseInt(text, 10);
  };

  goToCheckout = async () => {
    // if mobile viewport, first open the burger menu
    if (!isDesktopViewport(this.page)) {
      await this.burgerButton.waitFor();
      await this.burgerButton.click();
    }
    // const checkoutLink = this.checkoutLinks.filter({ hasText: "Checkout" });
    // await this.page.pause()
    await this.checkoutLink.waitFor();
    await this.checkoutLink.click();
    await this.page.waitForURL(/\/basket/, { timeout: 2000 });
  };
}
