This Chrome extension scans web pages on load for units commonly used in cooking, such as grams, teaspoons, cups, etc., and dynamically adds a select box to allow conversion into a variety of metric and imperial units.

Still fairly buggy, haven't had much time to put in on this. If anyone wants to help with any of the below issues it'd be much appreciated!

Known Issues:
* Need to add more unit conversion options.
  * Ideally would like to intelligently select what units to offer, i.e. water -> mL, flour -> grams, cups, etc.
* Doesn't properly handle descriptions of the form "X - Y tbsp", etc.
  * Probably an issue with regex, haven't gotten around to checking it yet. Should be easy to fix.
  * Additionally, something like "1 package (15 grams) yeast" doesn't get captured.
* Breaks formatting on a lot of pages
  * I don't really understand much about HTML, maybe this could be fixed with some clever CSS?
