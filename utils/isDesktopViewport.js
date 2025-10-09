export const isDesktopViewport = (page) => {
  return page.viewportSize().width >= 600;
  // return true or false
};