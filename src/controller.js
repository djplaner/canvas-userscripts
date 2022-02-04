/**
 * Controller.js
 * - detect the type of page we're one and launch the appropriate userscripts
 * - the controller knows when to launch, the models/views know how to update
 */

import { addDeleteAllPagesOption } from './tweaks/addDeleteAllPagesOption';

export default class Controller {
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