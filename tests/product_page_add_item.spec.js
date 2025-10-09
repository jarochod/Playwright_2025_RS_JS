import { test, expect } from "@playwright/test";

test.skip("Product Page Add to Basket", async ({ page }) => {
  // Otwórz stronę główną
  await page.goto("/");

  // Lokatory
  const addToBasketButton = page.locator('[data-qa="product-button"]').first();
  const basketCounter = page.locator('[data-qa="header-basket-count"]');
  const checkoutLink = page
    .locator('[data-qa="desktop-nav-link"]')
    .filter({ hasText: "Checkout" });

  // Sprawdzenie stanu początkowego
  await addToBasketButton.waitFor();
  await expect(addToBasketButton).toHaveText("Add to Basket");
  await expect(basketCounter).toHaveText("0");

  // Kliknięcie przycisku dodania do koszyka
  await addToBasketButton.click();

  // Sprawdzenie zmiany tekstu przycisku i licznika koszyka
  await expect(addToBasketButton).toHaveText("Remove from Basket");
  await expect(basketCounter).toHaveText("1");

  // Przejście do strony koszyka
  await checkoutLink.waitFor();
  await checkoutLink.click();

  // Weryfikacja adresu URL
  await page.waitForURL("/basket");
  await expect(page).toHaveURL("/basket");

  await page.pause();
});
