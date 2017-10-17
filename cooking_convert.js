// TODO put these functions in proper place, call add_select_to_units on page load
// TODO more unit types
// TODO is there a way to combine e.g. g, grams? could do when adding select opts
var convert = function(quant, from_unit, to_unit){
  // relative to grams
  let units = {
      "g": 1,
      "gram": 1,
      "oz": 28.3495,
      "lb": 453.592,
      "kg": 1000,
      "cup": {
          "sugar": 201,
          "brown_sugar": 220,
          "oats": 85,
          "syrup": 340,
          "flour": 128,
          "bread_flour": 136,
          "butter": 227
      },
      "teaspoon": 4.76,
      "tablespoon": 14.3
  };
  from_unit = from_unit.replace(/s$/,'');
  to_unit = to_unit.replace(/s$/,'');
  new_quant = quant * units[from_unit] / units[to_unit];
  return new_quant;
};

// TODO: deal with different types of cups
// TODO: deal with fractional (1/2, 1 1/2, etc.) quants
var change_unit = function(e){
  sel_elem = e.target;
  sel_id =  sel_elem.id;

  i = sel_id.split('_')[1];
  quant_id = 'UNIT_' + i;
  quant_to_id = 'UNIT_TO_' + i;
  cur_unit_id = 'CUR_UNIT_' + i;

  quant_elem = document.getElementById(quant_id);
  quant = quant_elem.innerText;

  cur_unit_elem = document.getElementById(cur_unit_id);
  cur_unit = cur_unit_elem.value;
  new_unit = sel_elem.value;

  quant_elem.textContent = convert(quant, cur_unit, new_unit);

  quant_to_elem = document.getElementById(quant_to_id);
  if(quant_to_elem){
    quant_to = quant_to_elem.innerText;
    quant_to_elem.textContent = convert(quant_to, cur_unit, new_unit);
  }

  cur_unit_elem.value = new_unit;
};

// TODO add full list of units to select options
// TODO add underline/formatting to unit
var add_select_to_units = function(node) {
  if(!node){
    node = document.body;
  }
  var re = /((?:\d+(?:\s*|.))?\d+(?:\/\d+)?)\s?(?:(?:-|to)\s*((?:\d+(?:\s*|.))?\d+(?:\/\d+))?)?\s?(cup|tbsp|tablespoon|tsp|teaspoon|(?:mili|centi)?(?:lit(?:er|re)|gram)|pound|lb|ounce|oz|ml|cl|g|mg|kg|kilogram)(?:s)?\s+((?:\w+[ \t]*){1,3})/i;
  let i = 0;
  while(match = re.exec(node.innerHTML)){
    ++i;

    let sel_id = "SEL_" + i;
    let quant_id = "UNIT_" + i;
    let quant_to_id = "UNIT_TO_" + i;
    let cur_unit_id = "CUR_UNIT_" + i;
    let repl = '<div id="'+quant_id+'" class="UNDERLINECLASS">$1</div> ';
    if(quant_to) {
      repl += ' - <div id="'+quant_to_id+'" class="UNDERLINECLASS">$2</div> ';
    }
    repl += '<select id="'+sel_id+'" TODOADDALLTHEOPTIONSANDANONCHANGE>' +
              '<option>$3</option>' +
              '<option>tablespoons</option>' +
              '</select> $4';

    quant_to = match[2]; // "X - Y oz" -> quant_from = X, quant_to = Y
    cur_unit = match[3];
    node.innerHTML = node.innerHTML.replace(re, repl);
    hidden = document.createElement("INPUT");
    hidden.setAttribute("id", cur_unit_id);
    hidden.setAttribute("value", cur_unit);
    hidden.setAttribute("type", "hidden");
    document.body.appendChild(hidden);
    document.getElementById(sel_id).addEventListener("change", change_unit); // TODO: this doesn't work, fix it
  }
};

