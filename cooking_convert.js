// TODO put these functions in proper place, call add_select_to_units on page load
var convert = function(quant, from_unit, to_unit) {
  // relative to grams
  let units = {
      "g": 1,
      "oz": 28.3495,
      "lb": 453.592,
      "kg": 1000,
      "cup_sugar": 201,
      "cup_brown_sugar": 220,
      "cup_oat": 85,
      "cup_syrup": 340,
      "cup_flour": 128,
      "cup_bread_flour": 136,
      "cup_butter": 227,
      "cup_water": 235,
      "cup_milk": 240,
      "cup_oil": 216,
      "tsp": 4.76,
      "tbsp": 14.3
  };
  new_quant = quant * units[from_unit] / units[to_unit];
  return new_quant;
};

// TODO: deal with fractional (1/2, 1 1/2, etc.) quants
var change_unit = function(e) {
  sel_elem = e.target;
  sel_id =  sel_elem.id;

  i = sel_id.split('_')[1];
  quant_id = 'quant_' + i;
  quant_to_id = 'quant_to_' + i;
  cur_unit_id = 'cur_unit_' + i;

  quant_elem = document.getElementById(quant_id);
  quant = quant_elem.textContent;

  cur_unit_elem = document.getElementById(cur_unit_id);
  cur_unit = cur_unit_elem.value;
  new_unit = sel_elem.value;

  quant_elem.textContent = convert(quant, cur_unit, new_unit);

  quant_to_elem = document.getElementById(quant_to_id);
  if (quant_to_elem) {
    quant_to = quant_to_elem.textContent;
    quant_to_elem.textContent = convert(quant_to, cur_unit, new_unit);
  }

  cur_unit_elem.value = new_unit;
};

var inc_count = function() {
  let i = localStorage.getItem('add_select_match_count');
  if (!i) i = 1;
  localStorage.setItem('add_select_match_count',parseInt(i)+1);
  return i;
};

var get_unit = function(unit, desc) {
  let conversions, default_unit = unit, comp = unit;

  if (unit.match('cup')) {
    // for cups we use the description to make a guess as to what type of density the ingredient has
    conversions =  {
      "brown" : "cup_brown_sugar",
      "sugar" : "cup_sugar",
      "oat" : "cup_oat",
      "honey" : "cup_syrup",
      "syrup" : "cup_syrup",
      "molasses" : "cup_syrup",
      "flour" : "cup_flour",
      "bread" : "cup_bread",
      "butter" : "cup_butter",
      "margarine" : "cup_butter"
    };
    default_unit = "cup_flour";
    comp = desc;
  } else {
    // for other ingredients, we check the unit itself for abbreviations
    conversions = {
      "kilo" : "kg",
      "gram" : "g",
      "pound" : "lb",
      "ounce" : "oz",
      "teaspoon" : "tsp",
      "tablespoon" : "tbsp"
    };
  }

  for (let type in conversions){
    if (comp.match(type)) {
      return conversions[type];
    }
  }
  return default_unit;
};

var quant_int_val = function(i){
  if (!i) return undefined;

  let match = i.match(/\s*(\d+(?!\/))?(?:\s*(\d+)\/(\d+))?/);
  let val = 0;
  if (match[1]) val = parseInt(match[1]);
  if (match[2] && match[3]) val += match[2] / match[3];
  return val;
}

// TODO add full list of units to select options
// TODO match parenthesis in regex: "1 (0.25 ounce) package yeast", etc.
// TODO add underline/formatting to unit
var add_select_to_units = function(node) {

  let count = 0;
  let re = /((?:\d+(?:\s*|.))?\d+(?:\/\d+)?)\s?(?:(?:-|to)\s*((?:\d+(?:\s*|.))?\d+(?:\/\d+))?)?\s?(cup|t(?:b)?sp|t(?:ea|able)spoon|(?:mili|centi)?(?:lit(?:er|re)|gram)|pound|lb|ounce|oz|ml|cl|g|mg|kg|kilogram)(?:s)?\s+((?:\w+[ \t]*){1,3})/i;

  for (let i = 0; i < node.childNodes.length; i++) {
    child = node.childNodes[i];
    let match = re.exec(child.textContent);
    if (match) {
      if (child.childNodes.length > 0) {
        add_select_to_units(child);
      } else {
        let i = inc_count();

        // TODO refactor this into a million functions
        match_node = document.createElement("DIV");

        let quant = quant_int_val(match[1]);
        let quant_id = "quant_"+i;
        let quant_node = document.createElement("DIV");
        quant_node.setAttribute("id", quant_id);
        quant_node.appendChild(document.createTextNode(quant));
        match_node.appendChild(quant_node);

        let quant_to = quant_int_val(match[2]);
        if (quant_to) {
          let quant_to_id = "quant_to_"+i;
          let quant_to_node = document.createElement("DIV");
          quant_to_node.setAttribute("id", quant_to_id);
          quant_to_node.appendChild(document.createTextNode(quant_to));
          let quant_to_wrap_node = document.createElement("DIV");
          quant_to_wrap_node.appendChild(document.createTextNode(" - "));
          quant_to_wrap_node.appendChild(quant_to_node);
          match_node.appendChild(quant_to_wrap_node);
        }

        let cur_unit = get_unit(match[3],match[4]);

        let cur_unit_id = "cur_unit_"+i;
        let hidden_node = document.createElement("INPUT");
        hidden_node.setAttribute("id", cur_unit_id);
        hidden_node.setAttribute("value", cur_unit);
        hidden_node.setAttribute("type", "hidden");
        match_node.appendChild(hidden_node)

        let sel_id = "sel_"+i;
        let sel_node = document.createElement("SELECT");
        sel_node.setAttribute("id", sel_id);
        // TODO add select
        // TODO for all valid options
          let opt = document.createElement("OPTION");
          opt.setAttribute("value", cur_unit);
          opt.textContent = match[3];
          sel_node.appendChild(opt);
          opt = document.createElement("OPTION");
          opt.setAttribute("value", "g");
          opt.textContent = "grams";
          sel_node.appendChild(opt);
        // TODO end for
        match_node.appendChild(sel_node);
 
        let desc = match[4];
        let desc_id = "desc_"+i;
        let desc_node = document.createElement("DIV");
        desc_node.setAttribute("id", desc_id);
        desc_node.appendChild(document.createTextNode(desc));
        match_node.appendChild(desc_node);

        pre_match = child.textContent.substring(0,match["index"]);
        pre_node = child.cloneNode();
        pre_node.textContent = pre_match;

        post_match = child.textContent.substring(match["index"]+match[0].length+1);
        post_node = child.cloneNode();
        post_node.textContent = post_match;

        child.parentElement.insertBefore(pre_node, child)
        child.parentElement.insertBefore(match_node, child)
        child.parentElement.insertBefore(post_node, child)
        child.parentElement.removeChild(child)

        document.getElementById(sel_id).addEventListener("change",change_unit);
      }
    }
  }
};

window.onload = function() {
  add_select_to_units(document.body);
};
