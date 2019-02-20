# InputfieldRepeaterMatrixDublicate
Proof of concept: This module allows you to clone a repeater matrix item from one page to another. Currently only support for non nested items and from field to field with the same name. No max/min check and no dynamic loading via AJAX.

## Check out the screencast
https://www.youtube.com/watch?v=eYX10vmQPhY

## Version update 1.0.2
The current version 1.0.2 (1.0.3 InputfieldRepeaterMatrixDublicate.js) has some minor improvements. Items are inserted at the last position on the target page and set to the status unpublished. Furthermore, the clipboard is synchronized live, so you can jump between browser tabs without reloading the target page, for direct pasting.

### Be involved in the development
Fork this module and improve it. It would be nice if this functionality is natively supported by the repeater matrix module. But not at the moment.

I lack the time and detailed understanding of repeaters. The MatrixModule is not as hookable as needed. Especially JS-side. Here it would be nice to bring this function into the module core in cooperation with Ryan.
