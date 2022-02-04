/**
 * deleteAllPagesOptions.js
 * Add a "select all" checkbox to a Canvas pages page
 * When clicked it will 
 * - scroll to the bottom of the page (so that all pages appear)
 * - select the checkboxes for all the pages
 * - scroll back to the top so the user can click the trash button
 */

var ATTEMPT=5;

export default class addDeleteAllPagesOption {
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
     * Dynamic scroll to bottom a bit dodgy, but appears to sort of work
     */

    handleClick(option) {

        console.log('CANVAS-USERSCRIPTS: handleClick: at the bottom');

        console.log('CANVAS-USERSCRIPTS: handleClick: scroll down');
        ATTEMPT = 15;

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

