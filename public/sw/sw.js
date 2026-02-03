
const swVersion = "60";
const cacheName = "swtest";

// install

addEventListener("install", install);

async function install(installEvent) {
	console.log("install, version: "+swVersion);
	installEvent.waitUntil(preCache());
}

async function preCache() {
	console.log("preCache, version: "+swVersion);
	const urlListResp = await fetch("urls.php");
	if (urlListResp) {
		const urlList = await urlListResp.text();
		if (urlList) {
			const urls = urlList.split(",");
			if (urls) {
				const cache = await caches.open(cacheName);
				if (cache) {
					return cache.addAll(urls);
				}
				else {
					console.log("no cache");
				}
			}
			else {
				console.log("no urls");
			}
		}
		else {
			console.log("no urlList");
		}
	}
	else {
		console.log("no urlList");
	}
}

// activate

self.addEventListener("activate", activate);

function activate(activateEvent) {
	console.log("activate, version: "+swVersion);
}

// fetch

self.addEventListener("fetch",
	function(event) {
		event.respondWith(
			caches.match(event.request)
			.then(
				function(response) {
					if (response) {
						console.log("cached, url: "+event.request.url);
						return response;
					}
					else {
						console.log("retrieved, url: "+event.request.url);
						return fetch(event.request);
					}
				}
			)
		)
	}
);
