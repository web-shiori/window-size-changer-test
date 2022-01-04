(function (self) {
    'use strict';

    // Private members
    var _lsName = 'items';
    var _template = null;
    var _listContainer = null;
    var _ignoreItemsChange = false;
    var _resizeTimeout = null;

    // Public members
    self.Items = Bindings.observableArray([]);
    self.IsInEditMode = Bindings.observable(false);
    self.AllowDragging = Bindings.observable(true);
    self.ClassList = Bindings.observable("");
    self.BodyClassList = Bindings.observable("main");
    self.CurrentWindowSize = Bindings.observable("0x0");
    self.CurrentViewportSize = Bindings.observable("0x0");

    // Listeners
    self.IsInEditMode.listen(function(newVal) {
        if (newVal) {
            self.ClassList("edit-state");
            self.BodyClassList("main edit-state");
        } else {
            self.ClassList("");
            self.BodyClassList("main");
        }

        self.AllowDragging(!newVal);
    });

    self.Items.listen(function(newVal) {
        if (!_ignoreItemsChange) {
            self.SaveList();
        }
    });

    // Function to save new items
    self.SaveList = function () {
        // Build the flat item list
        var flatItems = [];

        for (var i = 0; i < self.Items().length; i++) {
            flatItems.push({
                Name: self.Items()[i].Name(),
                Width: self.Items()[i].Width(),
                Height: self.Items()[i].Height()
            });
        }

        // Save the list
        chrome.storage.sync.set({ "ws_items": flatItems });
        //localStorage[_lsName] = JSON.stringify(flatItems);

        // If we're in edit mode, get out
        self.IsInEditMode(false);
    };

    // Loads the items from storage
    self.Load = function () {
        // Get the items from storage
        chrome.storage.sync.get("ws_items", function(result) {
            //var items = localStorage[_lsName] || JSON.stringify([]);
            //items = JSON.parse(items);

            var items = result["ws_items"] || [];

            _ignoreItemsChange = true;

            // Load in the defaults?
            if (items.length == 0) {
                items.push({
                    Name: "Average laptop",
                    Width: 1366,
                    Height: 768
                });

                items.push({
                    Name: "Older desktops",
                    Width: 1024,
                    Height: 768
                });

                items.push({
                    Name: "HD desktops & TVs",
                    Width: 1920,
                    Height: 1080
                });

                items.push({
                    Name: "iPad portrait",
                    Width: 768,
                    Height: 1024
                });

                items.push({
                    Name: "iPad landscape",
                    Width: 1024,
                    Height: 768
                });

                items.push({
                    Name: "iPhone 4 & 4s",
                    Width: 640,
                    Height: 960
                });

                items.push({
                    Name: "iPhone 5 & 5s",
                    Width: 640,
                    Height: 1136
                });
            }

            // Go through them and load each template
            for (var i = 0; i < items.length; i++) {
                var newItem = new Item();
                newItem.Name(items[i].Name);
                newItem.Width(items[i].Width);
                newItem.Height(items[i].Height);

                self.Items.push(newItem);
            }

            // Apply bindings
            Bindings.apply(document.querySelector("body"), self);

            _ignoreItemsChange = false;
        });
    };

    self.SelectItem = function (item) {
        if (!self.IsInEditMode()) {
            // Get the current window
            chrome.windows.getCurrent({ populate: true }, function(currentWindow) {
                // Create the object to update the window
                var updateInfo = {
                    width: item.Width(),
                    height: item.Height(),
                    state: "normal"
                };

                // Resize the window
                chrome.windows.update(currentWindow.id, updateInfo, function (resizedWindow) {
                    // Need to get the window again because the update function doesn't
                    // have the tabs in it
                    chrome.windows.get(currentWindow.id, { populate: true }, function(currentWindow) {
                        // Find the active tab (that's the only that has the height and width updated)
                        var tab = null

                        for (var i = 0; i < currentWindow.tabs.length; i++) {
                            if (currentWindow.tabs[i].active) {
                                tab = currentWindow.tabs[i];
                                break;
                            }
                        }
                        if (tab) {
                            // Set the sizes to show them to the user
                            self.CurrentWindowSize(resizedWindow.width + " x " + resizedWindow.height);
                            self.CurrentViewportSize(tab.width + " x " + tab.height);
                            self.BodyClassList("resize");

                            // Close in a little bit
                            _resizeTimeout = window.setTimeout(function() {
                                window.close();
                            }, 3000);
                        }
                    });
                });
            });
        }
    };

    self.EditItem = function(item) {
        if (!self.IsInEditMode()) {
            item.IsInEditMode(true);
            self.IsInEditMode(true);
        }
    };

    self.Delete = function(item) {
        // Remove the item
        self.Items.remove(item);

        // Save the result
        self.SaveList();
    };

    self.NewItem = function() {
        // Make sure we're not in edit mode
        if (!self.IsInEditMode()) {
            var newItem = new Item();

            // Don't want to save yet
            _ignoreItemsChange = true;
            self.Items.push(newItem, 0);
            newItem.IsNew(true);
            self.EditItem(newItem);
            _ignoreItemsChange = false;
        }
    };

    self.MouseOverCallback = function() {
        // Did the user recent resize?
        if (_resizeTimeout) {
            clearTimeout(_resizeTimeout);
            _resizeTimeout = null;
            self.BodyClassList("");
        }
    };

    // Instantiate it on load
    document.addEventListener("DOMContentLoaded", function() {
        self.Load();
    });
}(window.WindowSizer = window.WindowSizer || {}));
