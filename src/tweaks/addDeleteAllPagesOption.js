/**
 * deleteAllPagesOptions.js
 * Add a "select all" checkbox to a Canvas pages page
 * When clicked it will 
 * - scroll to the bottom of the page (so that all pages appear)
 * - select the checkboxes for all the pages
 * - scroll back to the top so the user can click the trash button
 */

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
     * Dynamic scroll to bottom adapted from
     * https://stackoverflow.com/a/54802224
     */

    handleClick(option) {

        console.log('CANVAS-USERSCRIPTS: handleClick: at the bottom');

        const scrollDistance = 100;
        const pause = 260;
        console.log('CANVAS-USERSCRIPTS: handleClick: scroll down');

        let promise = new Promise((resolve, reject) => {


        /// start the interval with the pause in between executions
        interval = setInterval(
            (this.addSelectAll) => function(callback) {
            /// denife values, not necessary but easyier to read
            let scrolled = window.pageYOffset;
            let scroll_size = document.body.scrollHeight;
            let scroll_remaining = scroll_size - scrolled;

            /// check if scrolling is necessary
            console.log(`scroll_remaining: ${parseInt(scroll_remaining)} window.innerHeight: ${window.innerHeight}`);
            // necessary kludge - somehow getting 620.333
            if ( parseInt(scroll_remaining) <= window.innerHeight) {
                console.log(' ---- clearing interval - at the end of page?')
                clearInterval(interval);


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
                callback();

            } else {
                console.log(` ---- scrolling down by ${scrollDistance} pausing ${pause}`);
                window.scrollBy(0, scrollDistance);
            };

        }, pause);
    }
}