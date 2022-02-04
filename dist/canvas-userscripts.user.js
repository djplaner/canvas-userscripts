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

// src/tweaks/addDeleteAllPagesOption.js
/**
 * deleteAllPagesOptions.js
 * Add a "select all" checkbox to a Canvas pages page
 * When clicked it will 
 * - scroll to the bottom of the page (so that all pages appear)
 * - select the checkboxes for all the pages
 * - scroll back to the top so the user can click the trash button
 */

var ATTEMPT=5;

class addDeleteAllPagesOption {
    constructor(controller) {
        this.controller = controller;
        console.log('CANVAS-USERSCRIPTS: addDeleteAllPagesOption');

        this.addSelectAll();
    }

    /**
     * Add a "select all" checkbox to the page 
     * In the header row of pages table (table.wiki-page-table)
     * first th
     */
    addSelectAll() {
        // check for input#userscript-select-all-checkbox
        if (document.querySelector('input#userscript-select-all-checkbox')) {
            return false;
        }
        //-- get the cell to add the checkbox to
        // kinda kludgey doing each separate one
        let table = document.querySelector('table.wiki-page-table');
        if (!table) {
            console.error('CANVAS-USERSCRIPTS: addDeleteAllPagesOption: no table found');
        }
        let headerRow = table.querySelector('tr.header-row');

        if (!headerRow) {
            console.error('CANVAS-USERSCRIPTS: addDeleteAllPagesOption: no header row found');
        }
        let cell = headerRow.querySelector('th');

        // create checkbox#userscript-select-all-checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        //        checkbox.classList.add("select-page-check-box")
        checkbox.id = "userscript-select-all-checkbox";
        checkbox.ariaLabel = "Select all pages";
        checkbox.title = "Toggle all pages selection (for deletion)";
        checkbox.onclick = () => this.controller.handleClick('deleteAllPages');

        // add checkbox to cell
        cell.appendChild(checkbox);
    }

    /**
     * Handle the event when the user clicks the "select all" checkbox
     * Dynamic scroll to bottom adapted from
     * https://stackoverflow.com/a/54802224
     */

    handleClick(option) {

        console.log('CANVAS-USERSCRIPTS: handleClick: at the bottom');

        console.log('CANVAS-USERSCRIPTS: handleClick: scroll down');
        ATTEMPT = 5;

        let interval = setInterval(function() {
            console.log(`Interval has happened ${ATTEMPT}`);
            ATTEMPT-=1;

            let loading = document.querySelector('div.loading');
            if ( loading && loading.classList.contains('loading-more')) {
                loading.scrollIntoView();
            } else {
                clearInterval(interval);
                console.log("Interval has ended - no more to load");
                selectAll();
            }
            if (ATTEMPT <= 0) {
                clearInterval(interval);
                console.log("Interval has ended");
                selectAll();
            }

        }, 1000);
    }


}

    function selectAll() {
        console.log("---------------- select all");
        // select the checkbox.select-page-checkbox for all the pages
        let checkboxes = document.querySelectorAll('.select-page-checkbox');
        console.log(`found {${checkboxes.length}} checkboxes`);

        // check all the checkboxes
        for (let i = 0; i < checkboxes.length; i++) {
            //checkboxes[i].checked = true;
            // click on the checkbox
            checkboxes[i].click();
        }

        /// scroll back to top
        //                window.scrollTo(0, 0);
        document.querySelector('div.ic-app-crumbs').scrollIntoView();
        // re-enable the button.delete_pages button
        //                document.querySelector('button.delete_pages').disabled = false;
        // add the delete all checkbox again, to allow removal
    }

// src/controller.js
/**
 * Controller.js
 * - detect the type of page we're one and launch the appropriate userscripts
 * - the controller knows when to launch, the models/views know how to update
 */



class Controller {
    constructor() {

        if (this.onPages()) {
            this.deleteAllPages = new addDeleteAllPagesOption(this);
        }

        // kludge check
        this.render();
    }

    render() {
        console.log('CANVAS-USERSCRIPTS: rendering');
    }

    /**
     * Harness to handle clicks from userscripts. Receives the type/name
     * of the userscript as the eventGiven the name of a userscript event 
     * @param {String} type 
     */
    handleClick(type, option = null) {
        console.log('CANVAS-USERSCRIPTS: handleClick: ' + type);

        switch (type) {
            case 'deleteAllPages':
                if (Object.prototype.hasOwnProperty.call(this, 'deleteAllPages')) {
                    this.deleteAllPages.handleClick(option);
                } else {
                    console.error('CANVAS-USERSCRIPTS: handleClick: no deleteAllPages object');
                }
                break;
            default:
                console.error('CANVAS-USERSCRIPTS: handleClick: unknown type: ' + type);
        }
    }

    /** detect if we're on the Canvas pages page */
    onPages() {
        //return window.location.href.indexOf('/pages') > -1;
        return window.location.href.match('/courses/[0-9]+/pages');
    }

 
}

// src/index.js
/**
 * canvas-userscripts - collection of kludges to upgrade Canvas LMS functionality
 * - main entry point
 * - waits for page load and then launches the controller
 */



function canvasUserscriptsLaunch() {

    window.addEventListener('load', function () {
        // getting very kludgy here, haven't got a good solution...yet #14
        // - module content is dynamically loaded, wait (dumbly) for it to finish
        this.setTimeout(
            () => {
                let controller = new Controller();
            }, 2000);
    });
}

canvasUserscriptsLaunch();