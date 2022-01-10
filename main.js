const host = window.location.hostname.replace("www.", "");
chrome.storage.sync.get(host, (items) => {
  items?.[host]?.map((el) => {
    console.log(el, window.location.pathname);
    if (window.location.pathname.includes(el)) {
      document.body.innerHTML = "hi";
    }
  });
});
