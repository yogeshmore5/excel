//Storage

let sheetDB = [];

for(let i = 0; i < rows; i++) {
  let sheetRow = [];
  for(let j = 0; j < cols; j++) {
    let cellProp = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      BGColor: "#000000", //just for indication purpose
      value: "",
      formula:"",
      children:[],
    }
    sheetRow.push(cellProp);
  }
  sheetDB.push(sheetRow);
}

//selectors for cell properties
let bold = document.querySelector('.bold');
let italic = document.querySelector('.italic');
let underline = document.querySelector('.underline');
let fontSize = document.querySelector('.font-size-props');
let fontFamily = document.querySelector('.font-family-props');
let fontColor = document.querySelector('.font-color-prop');
let BGColor = document.querySelector('.BGcolor-prop');
let alignment = document.querySelectorAll('.alignment');
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

function getCellAndCellProp(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);
  //Access Cell and storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return[cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
  //address -> "A1"
  let rid = Number(address.slice(1)) - 1; //"1" -> 0
  //let cValue = 0; //address.slice(0,1)
  let cid = Number(address.charCodeAt(0)) - 65; //"A" -> 65 -> 0
  return [rid,cid];
}

//Attach property listeners

//Font Style Bold of cell
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.bold = !cellProp.bold; //data changed
  cell.style.fontWeight = cellProp.bold ? "bold": "normal"; // UI Change(1)

  bold.style.backgroundColor = cellProp.bold ? activeColorProp: inactiveColorProp; // UI Change(2)

});

//Font Style Italic of cell
italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.italic = !cellProp.italic; //data changed
  cell.style.fontStyle = cellProp.italic ? "italic": "normal"; // UI Change(1)

  italic.style.backgroundColor = cellProp.italic ? activeColorProp: inactiveColorProp; // UI Change(2)
});

//Font Style Underline of cell
underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  //Modification
  cellProp.underline = !cellProp.underline; //data changed
  cell.style.textDecoration = cellProp.underline ? "underline": "none"; // UI Change(1)
  underline.style.backgroundColor = cellProp.underline ? activeColorProp: inactiveColorProp; // UI Change(2)
});

//Font Size of cell
fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);
  cellProp.fontSize = fontSize.value; //data changed
  cell.style.fontSize = cellProp.fontSize + "px"; // UI Change(1)
  fontSize.value = cellProp.fontSize; // UI Change(2)
});

//Font Family of cell
fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontFamily = fontFamily.value; //data changed
  cell.style.fontFamily = cellProp.fontFamily; // UI Change(1)
  fontFamily.value = cellProp.fontFamily; // UI Change(2)
});

//Font color of cell
fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontColor = fontColor.value; //data changed
  cell.style.color = cellProp.fontColor; // UI Change(1)
  fontColor.value = cellProp.fontColor; // UI Change(2)
});

//Background color of cell
BGColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.BGColor = BGColor.value; //data changed
  cell.style.backgroundColor = cellProp.BGColor; // UI Change(1)
  BGColor.value = cellProp.BGColor; // UI Change(2)
});

//Align property
alignment.forEach((alignElem) => {
  alignElem.addEventListener( "click", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue; //data changed
    cell.style.textAlign = cellProp.alignment // UI Changed(1)

    switch(alignValue) { // UI Changed(2)
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  })
});

//Bind event to each cell
let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

// To apply style to cell content and to action icons accordingly
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e)=> {
    let address = addressBar.value;
    let [rid,cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    //Apply Cell Properties
    cell.style.fontWeight = cellProp.bold ? "bold": "normal";
    cell.style.fontStyle = cellProp.italic ? "italic": "normal";
    cell.style.textDecoration = cellProp.underline ? "underline": "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
    cell.style.textAlign = cellProp.alignment
    //console.log('FONT --> ', cellProp.fontFamily, cellProp.fontSize);

    //Apply Properties to UI props container
    bold.style.backgroundColor = cellProp.bold ? activeColorProp: inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic ? activeColorProp: inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline ? activeColorProp: inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGColor.value = cellProp.BGColor;
    switch(cellProp.alignment) { // UI Changed(2)
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  })
}
