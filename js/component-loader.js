
// This is just a clean up process to remove the inital script
// in head. Consider removing for production.
const removeInitalScript = document.head.querySelector('script');
removeInitalScript.parentNode.removeChild(removeInitalScript);

const componentLoader = async () => {

	// Define keyword
	const keyword = 'component';

	// Assign const componentElemets to all elements with keyword attribute on page
	const componentElemets = document.querySelectorAll(`[${keyword}]`);

	// Run all elements in for loop NOTE: Do not use forEach!
	// For each loop will not wait for all component elements
	// We need to make sure that all component elements
	// are in place before we can continue
	for (let i = 0; i < componentElemets.length; i++) {

		// Define el (const) from componentElemets
		// using iterator index
		const el = componentElemets[i];
		const componentTag = el.tagName;

		// Get file location from element atrribute
		const file = !isGitHub ? el.getAttribute(keyword) : `/${gitHubRepoName}${el.getAttribute(keyword)}`;

		if (file) {
			const fetchResponse = await fetch(file);
			let html = fetchResponse.ok ? await fetchResponse.text() : false;

			// For now we only need to change things in header element
			if (componentTag === 'HEADER') {

				// GitHub pages are on organization
				// We need to fix some src and href to match this
				if (isGitHub) {
					// Parse HTML string to DOM so we can manipulate it
					const nodeList = new DOMParser().parseFromString(html, 'text/html').body;

					const logotypeLink = nodeList.querySelector('a#main-header-logotype');
					logotypeLink.href = `/${gitHubRepoName}/`;

					const headerLogotype = nodeList.querySelector('a#main-header-logotype img');
					headerLogotype.src = headerLogotype.getAttribute('src');

					// Get all anchors in list items from menu (nav)
					const menuItems = nodeList.querySelectorAll('.container nav ul li a');

					// Loop anchors in for each loop
					menuItems.forEach(item => {

						// Get item href
						const itemUrl = item.href;

						// Get anchor URL object using itemUrl (const)
						const menuItemPath = new URL(itemUrl);

						// Create correct path reference
						const itemPathHref = menuItemPath.href;
						const itemPathName = menuItemPath.pathname;
						// const itemPathOrigin = menuItemPath.origin;

						// Check if link has a page assigned
						// I.e. doesn't have hash (#) at the end
						if (!itemPathHref.endsWith('#')) {
							item.href = `/${gitHubRepoName}${itemPathName}`
						}
					});

					// Update HTML that will be in header
					html = nodeList.outerHTML;
				}
			}

			// If HTML string is not false add it to element
			if (html) {
				el.innerHTML = html;
			}
			// Keep source code clean
			// Remove keyword attribute from element
			el.removeAttribute(keyword);
		}
	}

	// Now that all component elements are in place
	// it's safe to continue with the rest of our scripts

	// Create empty script element for body overlay
	const bodyOverlayEl = document.createElement('script');

	// Insert body overlay file in script source
	bodyOverlayEl.src = !isGitHub ? `/js/body-overlay.js` : `/${gitHubRepoName}/js/body-overlay.js`;

	// Create empty script element for menu toggler
	const menuTogglerScriptEl = document.createElement('script');

	// Insert menu toggler file in script source
	menuTogglerScriptEl.src = !isGitHub ? `/js/menu-toggle.js` : `/${gitHubRepoName}/js/menu-toggle.js`;

	// Create empty script element for search
	const searchScripEl = document.createElement('script');

	// Insert search file in script source
	searchScripEl.src = !isGitHub ? `/js/search.js` : `/${gitHubRepoName}/js/search.js`;

	// Create empty script element for scroll to top
	const scrollTopScripEl = document.createElement('script');

	// Insert scroll to top file in script source
	scrollTopScripEl.src = !isGitHub ? `/js/scroll-to-top.js` : `/${gitHubRepoName}/js/scroll-to-top.js`;

	// Append scripts to body. Append, rather than prepend
	// will add script at the end of body since this file
	// must load last (otherwise the function can't find its elements
	// since they don't exist yet)
	document.body.appendChild(bodyOverlayEl);

	document.body.appendChild(menuTogglerScriptEl);
	document.body.appendChild(searchScripEl);
	document.body.appendChild(scrollTopScripEl);

	// A temporary fix for images source ref on GitHub pages
	// Consider removing in production.
	if (isGitHub) {
		const pageImages = document.querySelectorAll('img');
		for (let i = 0; i < pageImages.length; i++) {
			const img = pageImages[i];
			img.src = `/${gitHubRepoName}${img.getAttribute('src')}`;
		}
	}
}

// Run function
componentLoader();