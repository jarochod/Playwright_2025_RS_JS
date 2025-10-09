export class LoginPage {
  constructor(page) {
    this.page = page;
    this.moveToRegisterButton = page.locator('[data-qa="go-to-signup-button"]');
  }

  moveToRegister = async () => {
    await this.moveToRegisterButton.waitFor();
    await this.moveToRegisterButton.click();
    await this.page.waitForURL(/\/signup\?redirect=.+/, { timeout: 2000 });
  };
}
