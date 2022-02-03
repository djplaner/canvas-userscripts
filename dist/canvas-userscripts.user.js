// ==UserScript==
// @name         canvas-userscripts
// @namespace    https://github.com/djplaner/
// @version      0.0.0
// @description  Collection of userscripts to provide missing features for supporting Canvas course sites
// @author       David Jones
// @match        https://*/courses/*
// @grant        none
// @source       https://github.com/djplaner/canvas-userscripts.git
// @license      MIT
// @homepage     https://github.com/djplaner/canvas-userscripts#readme
// ==/UserScript==

// src/controller.js
/**
 * Controller.js
 * - detect the type of page we're one and launch the appropriate userscripts
 */

class Controller {
	constructor() {

		// TODO replace this with some sort of factory for
		// both model and view?
		//this.model = new c2m_Model();

		this.render();
	}

	render() {
		console.log('CANVAS-USERSCRIPTS: rendering');
	}
}

// src/index.js
/**
 * canvas-userscripts - collection of kludges to upgrade Canvas LMS functionality
 * - main entry point
 * - waits for page load and then launches the controller
 */



(function () {

    window.addEventListener('load', function () {
        // getting very kludgy here, haven't got a good solution...yet #14
        // - module content is dynamically loaded, wait (dumbly) for it to finish
        this.setTimeout(
            () => {
                let controller = new Controller();
            }, 2000);
    });
}
);