var cooking_convert = {
  "add_select_to_this_node" : function(match,child) {
    let i = cc_util.inc_count();

    match_node = document.createElement("DIV");

    cc_util.create_and_append.quant(match_node,match,i);
    cc_util.create_and_append.quant_to(match_node,match,i);
    cc_util.create_and_append.cur_unit(match_node,match,i);
    let sel_id = cc_util.create_and_append.select(match_node,match,i);
    cc_util.create_and_append.desc(match_node,match,i);

    cc_util.replace_child(match_node, child, match);

    cc_util.add_select_trigger(sel_id);
  },

// TODO add full list of units to select options
// TODO match parenthesis in regex: "1 (0.25 ounce) package yeast", etc.
// TODO add underline/formatting to unit
  "main" : function(node) {

    let count = 0;
    let re = /((?:\d+(?:\s*|.))?\d+(?:\/\d+)?)\s?(?:(?:-|to)\s*((?:\d+(?:\s*|.))?\d+(?:\/\d+))?)?\s?(cup|t(?:b)?sp|t(?:ea|able)spoon|(?:mili|centi)?(?:lit(?:er|re)|gram)|pound|lb|ounce|oz|ml|cl|g|mg|kg|kilogram)(?:s)?\s+((?:\w+[ \t]*){1,3})/i;

    for (let i = 0; i < node.childNodes.length; i++) {
      child = node.childNodes[i];
      let match = re.exec(child.textContent);
      if (match) {
        if (child.childNodes.length > 0) {
          cooking_convert.main(child);
        } else {
          cooking_convert.add_select_to_this_node(match,child);
        }
      }
    }
  }
};

window.onload = function() {
  cooking_convert.main(document.body);
};
