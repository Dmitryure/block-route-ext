const button = document.getElementById("button");
const input = document.getElementById("input");
const sites = document.getElementById("sites");

const refresh = () => {
  chrome.storage.sync.get(null, function (items) {
    let innerHTML = "";
    Object.keys(items).map((site) => {
      innerHTML += siteInfo({ site, routes: items[site] });
    });
    sites.innerHTML = innerHTML;
  });
};

const addRoute = (siteName, route) => {
  chrome.storage.sync.get(siteName, (items) => {
    if (!items[siteName].includes(route)) {
      chrome.storage.sync.set({ [siteName]: [route, ...items[siteName]] });
    }
    refresh();
  });
};

const deleteRoute = (siteName, route) => {
  chrome.storage.sync.get(siteName, (items) => {
    if (items[siteName].includes(route)) {
      chrome.storage.sync.set({
        [siteName]: [...items[siteName].filter((el) => el !== route)],
      });
    }
    refresh();
  });
};
const addSite = (siteName) => {
  chrome.storage.sync.get(siteName, (items) => {
    if (!items[siteName]) {
      chrome.storage.sync.set({ [siteName]: [] });
    }
    refresh();
  });
};

const routeInfo = ({ site, route }) => {
  return `<span>${route}<span class="delete-button" data-delete-button data-site="${site}" data-route="${route}">X</span></span>`;
};

const siteInfo = ({ site, routes }) => {
  if (!routes) {
    return `<div>
    <div class="site">${site}</div>
    <input data-site-input="${site + "input"}"/>
    <button data-site-button="${site + "data"}">add route</button>
</div>`;
  }
  let lis = "";
  console.log(site, routes);
  routes.map((route) => (lis += `<li>${routeInfo({ site, route })}</li>`));
  return `<div>
        <div class="site">${site}</div>
        ${lis}
        <input data-site-input="${site + "-input"}"/>
        <button data-site-button="${site + "-button"}">add route</button>
    </div>`;
};

button.addEventListener("click", () => {
  addSite(input.value);
});

document.body.addEventListener("click", (e) => {
  console.log(e.target.dataset);
  const data = e.target.dataset;
  switch (Object.keys(data)[0]) {
    case "siteButton": {
      const site = data["siteButton"].replace("-button", "");
      const input = document.querySelector(
        `[data-site-input="${site + "-input"}"]`
      );
      addRoute(site, input.value);
      break;
    }
    case "deleteButton": {
      const site = data["site"];
      const route = data["route"];
      deleteRoute(site, route);
      break;
    }
    default:
      break;
  }
});

refresh();
