import { test } from "@playwright/test";
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { getLoginToken } from "../api-calls/getLoginToken";
import { adminDetails } from "../data/userDetails";

test("My Account using cookie injection and mocking network request", async ({ page }) => {
  const loginToken = await getLoginToken(adminDetails.username,adminDetails.password);
  
  await page.route("http://**/api/user**", async (route, request) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({message: "PLAYWIGHT ERROR FROM MOCKING"})
    });
  });

  const myAccount = new MyAccountPage(page);
  await myAccount.visit();

  // Ustawianie cookie przez document.cookie / działa w przeglądarce (JS)
  await page.evaluate(([loginTokenInsideBrowserCode]) => {
      document.cookie = "token=" + loginTokenInsideBrowserCode;
    },[loginToken]);

  /* To co powyżej (document.cookie) w krótszej formie
   await page.evaluate((token) => {
    document.cookie = "token=" + token;
  }, loginToken);
  /*

  /* używając kontekstu strony
  Ustawianie cookie przez page.context().addCookies / to lepsze bardziej profesionalne podejscie
  dostępne już przy pierwszym request’cie, pełna kontrola 
  */
  
  /* await page.context().addCookies([
    {
      name: "token",
      value: loginToken,
      domain: "localhost",
      path: "/",
      httpOnly: false, // true jeśli chcesz HttpOnly (ale wtedy nie dostępne w JS)
      secure: false,
    },
  ]);
  */

  await myAccount.visit();
  await myAccount.waitForPageHeading();
  await myAccount.waitForErrorMessage();
});
