for(let i = 0; i < rows; i++) {
  for(let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;
      if( enteredData === cellProp.value ) {
        return;
      }
      cellProp.value = enteredData;
      //Remove parent-child relation
      removeChildFromParent(cellProp.formula);
      //empty formula
      cellProp.formula = "";
      //update child with modified value
      updateChildrenCells(address);
      console.log(cellProp);
    });
  }
}



let formulaBar = document.querySelector('.formula-bar');
formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if(e.key ==="Enter" && inputFormula) {
    // If change in formula:
    //  Break old parent-child relation,
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if(inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula)
    }


    addChildToGraphComponent(inputFormula, address);
    //check if formula is cyclic or not then only evaluate
    //True = Is Cyclic, False = Is Not Cyclic
    let isCyclic = isGraphCyclic();
    if(isCyclic == true){
      alert("Your Formula is Cyclic");
      removeChildFromGraphComponent(inputFormula, address)
      return;
    }


    //  Evaluate new formula,
    let evaluatedValue = evaluatedFormula(inputFormula);

    //update cell and db(sheetDB)
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    //  Add new parent child relation
    addChildToParent(inputFormula);
    updateChildrenCells(address);
    console.log(sheetDB);
  }
});

function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] =  decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for(let i = 0; i < encodedFormula.length; i++ ) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >=65 && asciiValue <= 90){
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop()
    }
  }
}

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] =  decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for(let i=0; i < encodedFormula.length; i++ ) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >=65 && asciiValue <= 90){
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid])
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parenCell, parentCellProps] = getCellAndCellProp(parentAddress);
  let children = parentCellProps.children;
  for(let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProps] = getCellAndCellProp(childAddress);
    let childFormula = childCellProps.formula;
    let evaluatedValue = evaluatedFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }

}
function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for(let i = 0; i < encodedFormula.length; i++ ) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >= 65 && asciiValue <=90 ){
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula){
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for(let i = 0; i < encodedFormula.length; i++ ) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >=65 && asciiValue <=90){
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluatedFormula(formula) {
  let encodedFormula = formula.split(" ");
  for( let i= 0; i < encodedFormula.length; i++ ) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >= 65 && asciiValue <= 90){
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);

  //UI update
  cell.innerText = evaluatedValue;

  //DB Update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
