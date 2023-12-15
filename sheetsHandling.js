let sheetsFolderCont = document.querySelector('.sheets-folder-cont')
let addSheetBtn = document.querySelector('.sheet-add-icon')
addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div")
  sheet.setAttribute("class","sheet-folder")

  let allSheetFolders = document.querySelectorAll('.sheet-folder')
  sheet.setAttribute("id", allSheetFolders.length)

  sheet.innerHTML = `
    <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
  `;
  sheetsFolderCont.appendChild(sheet);
  createSheetDB();
  createGraphComponentMatrix();

  handleSheetActiveness(sheet);
})

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"))
    handleSheetDB(sheetIdx)
    handleSheetProperties();
  })
}

function handleSheetDB(sheetIdx) {
  sheetDB = collectedSheetDB[sheetIdx]
  graphComponentMatrix = collectedGraphComponent[sheetIdx]

}

function handleSheetProperties(){
  for(let i = 0; i < rows; i++ ){
    for(let j = 0; j < cols; j++ ) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`)
      cell.click();

    }
  }
  // By default click on first cell via DOM
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function createSheetDB() {
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
  collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {

  let graphComponentMatrix = [];

  for(let i = 0; i < rows ; i++) {
    let row = [];
    for(let j = 0; j < cols ; j++){
      //Why Array -> More than 1 child relation(Dependency)
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }

  collectedGraphComponent.push(graphComponentMatrix)
}