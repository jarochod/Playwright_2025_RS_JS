export class RegisterPage {
  constructor(page) {
    this.page = page;
    //this.emailInput = page.getByRole('textbox', { name: 'E-Mail' }) / zalecany – best practice
    this.emailInput = page.getByPlaceholder("E-Mail"); // Wygodny, czytelny, gdy pole ma unikalny placeholder
    //this.emailInput = page.locator('input[placeholder="E-Mail"]') // Daje pełną kontrolę, kruche przy refaktorze HTML/CSS.
    // this.passwordInput = page.getByRole('textbox', { name: 'Password' }) / zalecany – best practice
    this.passwordInput = page.getByPlaceholder("Password");
    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  singUpAsNewUser = async (email, password) => {
    await this.emailInput.waitFor();

    await this.emailInput.fill(email);
    await this.passwordInput.waitFor();

    await this.passwordInput.fill(password);
    await this.registerButton.waitFor();
    await this.registerButton.click();
  };
}
