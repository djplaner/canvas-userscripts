/**
 * canvas-userscripts - collection of kludges to upgrade Canvas LMS functionality
 * - main entry point
 * - waits for page load and then launches the controller
 */
import { Controller } from './controller.js';


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