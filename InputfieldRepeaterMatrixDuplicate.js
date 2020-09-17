/**
 * @author  FlipZoom Media Inc. - David Karich
 * @contact David Karich <david.karich@flipzoom.de>
 * @website www.flipzoom.de
 * @create  2019-03-26
 * @updated 2020-09-17
 * @style   Tab size: 4 / Soft tabs: YES
 * ----------------------------------------------------------------------------------
 * @licence
 * Copyright (c) 2020 FlipZoom Media Inc. - David Karich
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished 
 * to do so, subject to the following conditions: The above copyright notice and 
 * this permission notice shall be included in all copies or substantial portions 
 * of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ----------------------------------------------------------------------------------
 * @contributors: The fundament for copying multiple items was created by @Autofahrn - THX!
 * @contributors: A BugFix suggestion when additional repeater fields are present was contributed by @joshua - THX!
 */

/**
 * ------------------------------------------------------------------------
 * Bind duplicate function and insert new icon to matrix item controls after 
 * window and DOM is ready
 * ------------------------------------------------------------------------
 */
$(window).on('load', function(){

    // ------------------------------------------------------------------------
    // Bind function icon and event only if item controls are populated
    // ------------------------------------------------------------------------
    if($('li.InputfieldRepeaterMatrix span.InputfieldRepeaterItemControls').length > 0) {

        // ------------------------------------------------------------------------
        // Init vars
        // ------------------------------------------------------------------------
        var $itemControls       = $('li.InputfieldRepeaterMatrix span.InputfieldRepeaterItemControls > i.InputfieldRepeaterClone'), 
            $duplicateFunction  = $('<i class="fa fa-clipboard InputfieldRepeaterDuplicate"></i>'), 
            pwConfig            = ProcessWire.config.InputfieldRepeaterMatrixDuplicate;

        // ------------------------------------------------------------------------
        // Create duplicate icon in control panel, if allowed
        // ------------------------------------------------------------------------
        if($itemControls.closest('.InputfieldRepeaterItem').attr('data-rmd-target-field')) {
            $duplicateFunction.attr('title', pwConfig.labels.duplicate);
            $duplicateFunction.insertBefore($itemControls);
        }

        // ------------------------------------------------------------------------
        // Load current clipboard on page load if exists
        // ------------------------------------------------------------------------
        if(localStorage.getItem('rmd-clipboard') != null) {
            var RMD = JSON.parse(localStorage.getItem('rmd-clipboard'));
        }

        // ------------------------------------------------------------------------
        // Process each duplicate item
        // ------------------------------------------------------------------------
        try {

            $('i.InputfieldRepeaterDuplicate').each(function(){

                // ------------------------------------------------------------------------
                // Try to get current clipboard item on page load and set status on 
                // source page and item
                // ------------------------------------------------------------------------
                try {
                    if(RMD.rmdSourceItems.includes(parseInt($(this).closest('.InputfieldRepeaterItem').attr('data-page')))) {
                        $(this).closest('.InputfieldRepeaterItem').addClass('in-clipboard');
                    }
                } catch(e) {}

                // ------------------------------------------------------------------------
                // Dont bind events and remove function if source matrix item is a 
                // nested repeater. Nested repeaters are currently not supported!
                // ------------------------------------------------------------------------
                if($(this).closest('.InputfieldRepeaterItem').attr('data-rmd-target-field').match(/repeater[\w-]*\b$/g)) {
                    $(this).remove();

                } else {

                    // ------------------------------------------------------------------------
                    // Bind clipboard event
                    // ------------------------------------------------------------------------
                    $(this).bind('click', function(){
                        
                        // ------------------------------------------------------------------------
                        // Init vars
                        // ------------------------------------------------------------------------
                        var $this           = $(this), 
                            $repeaterItem   = $(this).closest('.InputfieldRepeaterItem'), 
                            $repeaterItems  = $('.InputfieldRepeaterItem'), 
                            sourceItems     = [],
                            itemsAdded      = false;

                        // ------------------------------------------------------------------------
                        // If clicked item twice, remove from clipboard
                        // ------------------------------------------------------------------------
                        if($repeaterItem.hasClass('in-clipboard')) {
                            $repeaterItem.removeClass('in-clipboard');

                        // ------------------------------------------------------------------------
                        // Else save item to clipboard
                        // ------------------------------------------------------------------------
                        } else {

                            // ------------------------------------------------------------------------
                            // Remove wrapper and add clipboard indicator
                            // ------------------------------------------------------------------------
                            $('.InputfieldRepeaterDuplicatePasteWrapper').remove();
                            $repeaterItem.addClass('in-clipboard');
                            itemsAdded = true;
                        }

                        // ------------------------------------------------------------------------
                        // Collect all source items with clipboard indicator and update local storage
                        // ------------------------------------------------------------------------
                        $('.InputfieldRepeaterItem.in-clipboard').each(function(idx) {

                            // ------------------------------------------------------------------------
                            // Push current item
                            // ------------------------------------------------------------------------
                            sourceItems.push($(this).data('page'));

                            // ------------------------------------------------------------------------
                            // Remove indicator and enforce reflow, so all animations run synchronously
                            // ------------------------------------------------------------------------
                            $(this).removeClass('in-clipboard');
                            void this.offsetHeight;
                        });

                        // ------------------------------------------------------------------------
                        // Remove clipboard from local storage if items are empty
                        // ------------------------------------------------------------------------
                        if(sourceItems.length == 0) {
                            localStorage.removeItem('rmd-clipboard');

                        // ------------------------------------------------------------------------
                        // Else add animation and indicator and save all items to local storage
                        // ------------------------------------------------------------------------
                        } else {

                            // ------------------------------------------------------------------------
                            // Add animation for all selected items
                            // ------------------------------------------------------------------------
                            sourceItems.forEach(function(pageID){
                                $('.InputfieldRepeaterItem[data-page="' + pageID + '"]').addClass('in-clipboard');
                            });

                            // ------------------------------------------------------------------------
                            // Show the alert dialog only when an item is added for the first time
                            // ------------------------------------------------------------------------
                            if(itemsAdded && (sourceItems.length == 1) && !pwConfig.config.disableCopyDialog) {
                                ProcessWire.alert(pwConfig.labels.clipboard);
                            }

                            // ------------------------------------------------------------------------
                            // Save all items to clipboard local storage
                            // ------------------------------------------------------------------------
                            localStorage.setItem('rmd-clipboard', JSON.stringify({
                                'rmdSourceItems': sourceItems, 
                                'rmdAllowedTarget': $repeaterItem.attr('data-rmd-target-field'), 
                                'rmdSourcePage': $repeaterItem.attr('data-rmd-current-page'), 
                                'rmdTimestamp': new Date().getTime()
                            }));
                        }

                        // ------------------------------------------------------------------------
                        // Return false event to prevent toggle
                        // ------------------------------------------------------------------------
                        return false;
                    });
                }
            });

        } catch(e) {}
    }
});

/**
 * ------------------------------------------------------------------------
 * Bind paste function after window and DOM is ready
 * ------------------------------------------------------------------------
 */
$(window).on('load focus', function(){

    // ------------------------------------------------------------------------
    // Remove clipboards, older then six hours
    // ------------------------------------------------------------------------
    if(localStorage.getItem('rmd-clipboard') != null) {
        var RMD = JSON.parse(localStorage.getItem('rmd-clipboard'));
        if((RMD.rmdTimestamp + 21600000) < new Date().getTime()) {
            localStorage.removeItem('rmd-clipboard');
        }
    }

    // ------------------------------------------------------------------------
    // Remove clipboard state on page focus after insert
    // ------------------------------------------------------------------------
    if($('.InputfieldRepeaterMatrix').length > 0 && !localStorage.getItem('rmd-clipboard')) {
        $('.InputfieldRepeaterItem').removeClass('in-clipboard');
    }

    // ------------------------------------------------------------------------
    // Insert paste button
    // ------------------------------------------------------------------------
    if($('.InputfieldRepeaterMatrix').length > 0 && $("body[class*='ProcessPageEdit']").length > 0 && localStorage.getItem('rmd-clipboard') != null) {

        // ------------------------------------------------------------------------
        // Init vars
        // ------------------------------------------------------------------------
        var RMD             = JSON.parse(localStorage.getItem('rmd-clipboard')), 
            currentPageID   = $("body").attr("class").match(/ProcessPageEdit-id-[\w-]*\b/), 
            currentPageID   = (currentPageID != null) ? currentPageID[0] : false, 
            currentPageID   = (currentPageID) ? currentPageID.replace(/\D/g,'') : false;
            pwConfig        = ProcessWire.config.InputfieldRepeaterMatrixDuplicate;

        // ------------------------------------------------------------------------
        // Try to remove other past wrapper (on multible MatrixFields)
        // ------------------------------------------------------------------------
        try {
            $('div.InputfieldRepeaterDuplicatePasteWrapper').remove();
        } catch(e) {}

        // ------------------------------------------------------------------------
        // Only show paste button on allowed pages and targets
        // ------------------------------------------------------------------------
        if(currentPageID != RMD.rmdSourcePage && $('li.Inputfield_' + RMD.rmdAllowedTarget).length > 0 && $('div.InputfieldRepeaterDuplicatePasteWrapper').length <= 0) {
            
            // ------------------------------------------------------------------------
            // Init vars
            // ------------------------------------------------------------------------
            var $matrixTarget       = $('li.Inputfield_' + RMD.rmdAllowedTarget + ' p.InputfieldRepeaterMatrixAddItem'), 
                $rmdButtonWrapper   = $('<div class="InputfieldRepeaterDuplicatePasteWrapper"></div>');
                $rmdHiddenSourceID  = $('<input type="hidden" name="rmdSourceItems" value="' + RMD.rmdSourceItems + '">');
                $rmdHiddenFieldName = $('<input type="hidden" name="rmdFieldName" value="' + RMD.rmdAllowedTarget + '">');
                $rmdHiddenTargetID  = $('<input type="hidden" name="rmdTargetPage" value="' + currentPageID + '">');
                $rmdHiddenPaste     = $('<input type="hidden" name="rmdPasteTrigger" value="0">');
                $rmdPasteButton     = $('<button type="button" class="ui-button ui-widget InputfieldRepeaterDuplicatePaste">' + pwConfig.labels.paste + '</button>');

            // ------------------------------------------------------------------------
            // Remove old clipboard classes
            // ------------------------------------------------------------------------
            try {
                $('.InputfieldRepeaterItem').removeClass('in-clipboard');
            } catch(e) {}

            // ------------------------------------------------------------------------
            // Insert paste button and hidden fields with data
            // ------------------------------------------------------------------------
            $rmdButtonWrapper.prepend($rmdPasteButton);
            $rmdButtonWrapper.prepend($rmdHiddenSourceID);
            $rmdButtonWrapper.prepend($rmdHiddenTargetID);
            $rmdButtonWrapper.prepend($rmdHiddenFieldName);
            $rmdButtonWrapper.prepend($rmdHiddenPaste);
            $matrixTarget.prepend($rmdButtonWrapper);

            // ------------------------------------------------------------------------
            // Bind paste function
            // ------------------------------------------------------------------------
            $('.InputfieldRepeaterDuplicatePaste').bind('click', function(event) {
                if(!pwConfig.config.disablePasteDialog) {
                    ProcessWire.confirm(pwConfig.labels.confirm, function(){
                        localStorage.removeItem('rmd-clipboard');
                        $('input[name="rmdPasteTrigger"]').val("1");
                        $('button#submit_save, button#submit_save_unpublished').trigger('click');
                    });
                } else {
                    localStorage.removeItem('rmd-clipboard');
                    $('input[name="rmdPasteTrigger"]').val("1");
                    $('button#submit_save, button#submit_save_unpublished').trigger('click');
                }
            });

        // ------------------------------------------------------------------------
        // Else update current paste buttons with new IDs
        // ------------------------------------------------------------------------
        } else if(currentPageID != RMD.rmdSourcePage && $('li.Inputfield_' + RMD.rmdAllowedTarget).length > 0 && $('div.InputfieldRepeaterDuplicatePasteWrapper').length > 0) {

            $("input[name='rmdSourceItems']").val(RMD.rmdSourceItems);
            $("input[name='rmdFieldName']").val(RMD.rmdAllowedTarget);
            $("input[name='rmdTargetPage']").val(currentPageID);

            // ------------------------------------------------------------------------
            // Remove old clipboard classes
            // ------------------------------------------------------------------------
            try {
                $('.InputfieldRepeaterItem').removeClass('in-clipboard');
            } catch(e) {}

        }

    // ------------------------------------------------------------------------
    // Clipboard deleted, remove paste wrapper
    // ------------------------------------------------------------------------
    } else {
        try {
            $('div.InputfieldRepeaterDuplicatePasteWrapper').remove();
        } catch(e) {}
    }
});