import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;

    this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]');
    this.discountInput = page.getByPlaceholder("Discount code");
    this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]');

    this.totalValue = page.locator('[data-qa="total-value"]');
    this.discountedValue = page.locator('[data-qa="total-with-discount-value"]');
    this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]');

    this.creditCardOwnerInput = page.getByPlaceholder("Credit card owner");
    this.creditCardNumberInput = page.getByPlaceholder("Credit card number");
    this.creditCardValidUntilInput = page.getByPlaceholder("Valid until");
    this.creditCardCvcInput = page.getByPlaceholder("Credit card CVC");

    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText();

    await this.discountInput.waitFor();

    // Option 1 for laggy inputs: using .fill() with await expect()
    await this.discountInput.fill(code);
    await expect(this.discountInput).toHaveValue(code);

    // Option 2 for laggy inputs: slow typing
    // await this.discountInput.focus()
    // await this.page.keyboard.type(code, {delay: 600})
    // expect(await this.discountInput.inputValue()).toBe(code)

    // Option 3 for laggy inputs: slow typing / To samo co Option 2, tylko prościej
    // await this.discountInput.type(code, { delay: 600 });
    // expect(await this.discountInput.inputValue()).toBe(code)

    expect(await this.discountActiveMessage.isVisible()).toBe(false);
    expect(await this.discountedValue.isVisible()).toBe(false);

    await this.activateDiscountButton.waitFor();
    await this.activateDiscountButton.click();

    //check that it display "Discount activated"
    await this.discountActiveMessage.waitFor();
    //check that there is now a discounted price total showing
    await this.discountedValue.waitFor();

    expect(await this.discountActiveMessage.isVisible()).toBe(true);
    expect(await this.discountedValue.isVisible()).toBe(true);

    //totalValue long version 499$ => 499
    const totalValueTexts = await this.totalValue.innerText(); // "499$""
    const totalValueOnlyStringNumber = totalValueTexts.replace("$", ""); // "499"
    const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10); // 499
    //discountedValue long version "499$" => 499
    const discountedValueTexts = await this.discountedValue.innerText(); // "499$""
    const discountedValueOnlyStringNumber = discountedValueTexts.replace("$", ""); // "499"
    const discountedValueNumber = parseInt(discountedValueOnlyStringNumber, 10); // 499
    //check that the discounted price total is smaller than the regular one
    expect(discountedValueNumber).toBeLessThan(totalValueNumber);

    //totalValue short version 499$ => 499
    const totalValueNumber_ = parseInt((await this.totalValue.innerText()).replace("$", "") , 10);
    //discountedValue short version 499$ => 499
    const discountedValueNumber_ = parseInt((await this.discountedValue.innerText()).replace("$", "") , 10);
    //check that the discounted price total is smaller than the regular one
    expect(discountedValueNumber_).toBeLessThan(totalValueNumber_);
  };

  fillPaymentDetails = async (paymentDetails) => {
    await this.creditCardOwnerInput.waitFor();
    await this.creditCardOwnerInput.fill(paymentDetails.owner);
    await this.creditCardNumberInput.waitFor();
    await this.creditCardNumberInput.fill(paymentDetails.number);
    await this.creditCardValidUntilInput.waitFor();
    await this.creditCardValidUntilInput.fill(paymentDetails.validUntil);
    await this.creditCardCvcInput.waitFor();
    await this.creditCardCvcInput.fill(paymentDetails.cvc);
  };
  completePayment = async () => {
    await this.payButton.waitFor();
    await this.payButton.click();
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
  };
}
