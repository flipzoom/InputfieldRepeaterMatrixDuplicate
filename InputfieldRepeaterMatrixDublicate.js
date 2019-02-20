/**
 * @author  FlipZoom Media Inc. - David Karich
 * @contact David Karich <david.karich@flipzoom.de>
 * @website www.flipzoom.de
 * @create  2019-02-09
 * @style   Tab size: 4 / Soft tabs: YES
 * ----------------------------------------------------------------------------------
 * @licence
 * Copyright (c) 2019 FlipZoom Media Inc. - David Karich
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
 */

/**
 * ------------------------------------------------------------------------
 * Bind dublicate function and insert new icon to matrix item controls after 
 * window and DOM is ready
 * ------------------------------------------------------------------------
 */
$(window).on('load', function(){

    // ------------------------------------------------------------------------
    // Bind function icon and event only if item controls are populated
    // ------------------------------------------------------------------------
    if($('span.InputfieldRepeaterItemControls').length > 0) {

        // ------------------------------------------------------------------------
        // Init vars
        // ------------------------------------------------------------------------
        var $itemControls       = $('span.InputfieldRepeaterItemControls > i.InputfieldRepeaterClone'), 
            $dublicateFunction  = $('<i class="fa fa-clipboard InputfieldRepeaterDublicate"></i>'), 
            pwConfig            = ProcessWire.config.InputfieldRepeaterMatrixDublicate;

        // ------------------------------------------------------------------------
        // Create dublicate icon in control panel
        // ------------------------------------------------------------------------
        $dublicateFunction.attr('title', pwConfig.labels.dublicate);
        $dublicateFunction.insertBefore($itemControls);

        // ------------------------------------------------------------------------
        // Load current clipboard on page load if exists
        // ------------------------------------------------------------------------
        if(localStorage.getItem('rmd-clipboard') != null) {
            var RMD = JSON.parse(localStorage.getItem('rmd-clipboard'));
        }

        // ------------------------------------------------------------------------
        // Process each dublicate item
        // ------------------------------------------------------------------------
        $('i.InputfieldRepeaterDublicate').each(function(){

            // ------------------------------------------------------------------------
            // Try to get current clipboard item on page load and set status on 
            // source page and item
            // ------------------------------------------------------------------------
            try {
                if(RMD.rmdSourceItem == $(this).closest('.InputfieldRepeaterItem').attr('data-page')) {
                    $(this).closest('.InputfieldRepeaterItem').addClass('in-clipboard');
                }
            } catch(e) {}

            // ------------------------------------------------------------------------
            // Dont binde events and remove function if source matrix item is a 
            // nested repeater (MAYBE FUTURE SUPPORT ???)
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
                        $repeaterItems  = $('.InputfieldRepeaterItem');

                    // ------------------------------------------------------------------------
                    // If clicked item twice, remove from clipboard
                    // ------------------------------------------------------------------------
                    if($repeaterItem.hasClass('in-clipboard')) {
                        $repeaterItems.removeClass('in-clipboard');
                        localStorage.removeItem('rmd-clipboard');

                    // ------------------------------------------------------------------------
                    // Else save item to clipboard
                    // ------------------------------------------------------------------------
                    } else {
                        $('.InputfieldRepeaterDublicatePasteWrapper').remove();
                        $repeaterItems.removeClass('in-clipboard');
                        $repeaterItem.addClass('in-clipboard');
                        ProcessWire.alert(pwConfig.labels.clipboard);
                        localStorage.setItem('rmd-clipboard', JSON.stringify({
                            'rmdSourceItem': $repeaterItem.attr('data-page'), 
                            'rmdAllowedTarget': $repeaterItem.attr('data-rmd-target-field'), 
                            'rmdSourcePage': $repeaterItem.attr('data-rmd-current-page')
                        }));
                    }

                    // ------------------------------------------------------------------------
                    // Return false event to prevent toggle
                    // ------------------------------------------------------------------------
                    return false;
                });
            }
        });
    }
});

/**
 * ------------------------------------------------------------------------
 * Bind paste function after window and DOM is ready
 * ------------------------------------------------------------------------
 */
$(window).on('load focus', function(){

    // ------------------------------------------------------------------------
    // Inser paste button
    // ------------------------------------------------------------------------
    if($('.InputfieldRepeaterMatrix').length > 0 && $("body[class*='ProcessPageEdit']").length > 0 && localStorage.getItem('rmd-clipboard') != null) {

        // ------------------------------------------------------------------------
        // Init vars
        // ------------------------------------------------------------------------
        var RMD             = JSON.parse(localStorage.getItem('rmd-clipboard')), 
            currentPageID   = $("body").attr("class").match(/ProcessPageEdit-id-[\w-]*\b/), 
            currentPageID   = (currentPageID != null) ? currentPageID[0] : false, 
            currentPageID   = (currentPageID) ? currentPageID.replace(/\D/g,'') : false;
            pwConfig        = ProcessWire.config.InputfieldRepeaterMatrixDublicate;

        // ------------------------------------------------------------------------
        // Only show paste button on allowed pages and targets
        // ------------------------------------------------------------------------
        if(currentPageID != RMD.rmdSourcePage && $('li.Inputfield_' + RMD.rmdAllowedTarget).length > 0 && $('div.InputfieldRepeaterDublicatePasteWrapper').length <= 0) {
            
            // ------------------------------------------------------------------------
            // Init vars
            // ------------------------------------------------------------------------
            var $matrixTarget       = $('li.Inputfield_' + RMD.rmdAllowedTarget + ' p.InputfieldRepeaterMatrixAddItem'), 
                $rmdButtonWrapper   = $('<div class="InputfieldRepeaterDublicatePasteWrapper"></div>');
                $rmdHiddenSourceID  = $('<input type="hidden" name="rmdSourceItem" value="' + RMD.rmdSourceItem + '">');
                $rmdHiddenFieldName = $('<input type="hidden" name="rmdFieldName" value="' + RMD.rmdAllowedTarget + '">');
                $rmdHiddenTargetID  = $('<input type="hidden" name="rmdTargetPage" value="' + currentPageID + '">');
                $rmdPasteButton     = $('<button type="button" class="ui-button ui-widget InputfieldRepeaterDublicatePaste">' + pwConfig.labels.paste + '</button>');

            // ------------------------------------------------------------------------
            // Insert paste button and hidden fields with data
            // ------------------------------------------------------------------------
            $rmdButtonWrapper.prepend($rmdPasteButton);
            $rmdButtonWrapper.prepend($rmdHiddenSourceID);
            $rmdButtonWrapper.prepend($rmdHiddenTargetID);
            $rmdButtonWrapper.prepend($rmdHiddenFieldName);
            $matrixTarget.prepend($rmdButtonWrapper);

            // ------------------------------------------------------------------------
            // Bind paste function
            // ------------------------------------------------------------------------
            $('.InputfieldRepeaterDublicatePaste').bind('click', function(event) {
                ProcessWire.confirm(pwConfig.labels.confirm, function(){
                    localStorage.removeItem('rmd-clipboard');
                    $('button#submit_save, button#submit_save_unpublished').trigger('click');
                });
            });

        // ------------------------------------------------------------------------
        // Else update current paste buttons with new IDs
        // ------------------------------------------------------------------------
        } else if(currentPageID != RMD.rmdSourcePage && $('li.Inputfield_' + RMD.rmdAllowedTarget).length > 0 && $('div.InputfieldRepeaterDublicatePasteWrapper').length > 0) {
            $("input[name='rmdSourceItem']").val(RMD.rmdSourceItem);
            $("input[name='rmdFieldName']").val(RMD.rmdAllowedTarget);
            $("input[name='rmdTargetPage']").val(currentPageID);
        }
    }
});
