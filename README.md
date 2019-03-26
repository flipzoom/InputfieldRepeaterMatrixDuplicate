# ProcessWire InputfieldRepeaterMatrixDuplicate
This module extends the commercial ProModule "[RepeaterMatrix](https://processwire.com/store/pro-fields/repeater-matrix/)" by the function to duplicate repeater items from one page to another page. The condition is that the target field is the same matrix field from which the item is duplicated. This module is currently understood as proof of concept. There are a few limitations that need to be considered. The intention of the module is that this functionality is integrated into the core of RepeaterMatrix and does not require an extra module. With the current RepeaterMatrix module an item can only be duplicated within the same page and field.

## Check out the screencast
[![](http://img.youtube.com/vi/eYX10vmQPhY/0.jpg)](http://www.youtube.com/watch?v=eYX10vmQPhY)

## What the module can do
- Duplicate a repeater item from one page to another
- No matter how complex the item is
- Full support for file and image fields
- Multilingual support
- Support of Min and Max settings
- Live synchronization of clipboard between multiple browser tabs. Copy an item and simply switch the browser tab to the target page and you will immediately see the past button
- Support of multiple RepeaterMatrix fields on one page
- Configurable which roles and fields are excluded
- Duplicated items are automatically pasted to the end of the target field and set to hidden status so that changes are not directly published
- Automatic clipboard update when other items are picked
- Automatically removes old clipboard data if it is not pasted within 6 hours
- Delete clipboard itself by clicking the selected item again
- **Benefit: unbelievably fast workflow and content replication**

## What the module can't do
- Before an item can be duplicated in its current version, the source page must be saved. This means that if you make changes to an item and copy this, the old saved state will be duplicated
- Dynamic loading is currently not possible. Means no AJAX. When pasting, the target page is saved completely
- No support for nested repeater items. Currently only first level items can be duplicated. Means a repeater field in a repeater field cannot be duplicated. Workaround: simply duplicate the parent item
- Dynamic reloading and adding of repeater items cannot be registered. Several interfaces and events from the core are missing. The initialization occurs only once after the page load event

### Changelog
1.0.4
- Bug fix: Various bug fixes and improvements in live synchronization
- Bug fix: Items are no longer inserted when the normal save button is clicked. Only when the past button is explicitly clicked
- Feature: Support of multiple repeater fields in one page
- Feature: Support of repeater Min/Max settings
- Feature: Configurable roles and fields
- Enhancement: Improved clipboard management
- Enhancement: Documentation improvement
- Enhancement: Corrected few typos [#1](https://github.com/FlipZoomMedia/InputfieldRepeaterMatrixDuplicate/issues/1)

1.0.3
- Feature: Live synchronization
- Enhancement: Load the module only in the backend
- Enhancement: Documentation improvement

1.0.2
- Bug fix: Various bug fixes and improvements in JS functions
- Enhancement: Documentation improvement
- Enhancement: Corrected few typos

1.0.1
- Bug fix: Various bug fixes and improvements in the duplication process

1.0.0
- Initial release

### Be involved in the development
Fork this module and improve it. It would be nice if this functionality is natively supported by the repeater matrix module.

### Support this module
**If this module is useful for you, I am very thankful for your small donation: [Donate 5,- Euro](https://www.paypal.me/davidkarich/5)** *(via PayPal – or an amount of your choice. Thank you!)*