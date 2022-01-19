lastPressed = null
//initialize logistics company
newLogisticsCompany = new Logistics_Company();

//function to load the select drop downs for dynamic adding of warehouses as they are added
function loadSelectWarehouses(option){
    var putThisId = ""
    if (option === "addItem"){
        console.log("Bubbaaa")
        putThisId = "warehouse_add"
    }
    else if (option === "listItems"){
        putThisId = "warehouse_to_display_items"
    }
    else if (option === "deleteItem"){
        putThisId = "warehouse_to_delete_item"
    }
    else if (option === "updateQuantity"){
        putThisId = "warehouse_to_update_item_quantity"
    }

    //adding to the DOM by elementid
    var temp = document.getElementById(putThisId);

    //delete the children before each implementation to avoid duplicated
    if (temp != null){
        temp.replaceChildren()
    }    
    
    //for each warehouse add it to the select drop down
    for(var i = 0; i < newLogisticsCompany.warehouses.length; i++) {        
            var x = newLogisticsCompany.warehouses[i];
            var z = document.createElement("option");
            z.textContent = x.warehouse_name;
            z.value = x.warehouse_name;
            temp.appendChild(z);
        }
        
    //add an all option for add, list, and delete items
    if (option === "addItem" || option === "listItems" || option ==="deleteItem"){
        var allVar = document.createElement("option");
        allVar.textContent = "All"
        allVar.value = "all_warehouses"
        temp.appendChild(allVar);
    }
}

//function to show/hide user input based on the desired option selected
function optionButtonPressed(option){
    //set a last pressed variable to hide after a new option is selected
    if (lastPressed != null){
        document.getElementById(lastPressed).style.display = "none";
    }

    //show the element if it has been selected
    if (option === 'addItem'){
        document.getElementById('addItem').style.display = "block";
        loadSelectWarehouses("addItem")
    }
    else if (option === 'updateQuantity'){
        document.getElementById('updateQuantity').style.display = "block";
        loadSelectWarehouses("updateQuantity");
    }
    else if (option === 'deleteItem'){
        document.getElementById('deleteItem').style.display = "block";
        loadSelectWarehouses("deleteItem");
    }
    else if (option === 'listItems'){
        document.getElementById('listItems').style.display = "block";
        loadSelectWarehouses("listItems");
    }
    else if (option ==='addWarehouse'){
        document.getElementById('addWarehouse').style.display = "block";
    }
    else if (option === 'viewWarehouses'){
        // document.getElementById('viewWarehouses').style.display = "none";
        displayWarehouses();
    }

    if (option != "viewWarehouses"){
        lastPressed = option
    }
    else{
        lastPressed = null
    }
    
}

//function to list the items
function displayItems(warehouse){
    if (warehouse == "all_warehouses"){
        newLogisticsCompany.listInventory()
    }

    //get the warehouse and display its items
    for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
        tempWarehouse = newLogisticsCompany.warehouses[x]
        if (tempWarehouse.warehouse_name == warehouse){
            //call the inventory method to list the warehouse's items
            tempWarehouse.inventory.listItems();
            return true;
        }
    }
    return false;
}
//list all warehouses
function displayWarehouses(){
    newLogisticsCompany.listWarehouses()
}

//add item to the warehouse
function addItem(name, quantity, warehouse) {
    //if its all warehourses, add them to all, and then the main each time
    if (warehouse == "all_warehouses"){
        for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
            tempWarehouse = newLogisticsCompany.warehouses[x]
            if (tempWarehouse.inventory.itemExistsInInventory == false){
                //add it to the inventory
                tempWarehouse.inventory.addItem(name, quantity)
            }
            else{
                tempWarehouse.inventory.addQuantity(name,quantity)
            }
            addToMainInventory(name, quantity)
        }
        return document.getElementById("resMessage").innerHTML = `${name} added to all inventories`
    }
    //update the main inventory


    //get the warehouse
    for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
        tempWarehouse = newLogisticsCompany.warehouses[x]
        if (tempWarehouse.warehouse_name == warehouse){
            if (tempWarehouse.inventory != null){
                if (tempWarehouse.inventory.itemExistsInInventory(name) == true){
                    return document.getElementById("resMessage").innerHTML = `${name} already exists in the warehouse ${warehouse}`
                }
                tempWarehouse.inventory.addItem(name,quantity)
                
                //add it to all the main logicCompany's inventory
                addToMainInventory(name, quantity);
                return document.getElementById("resMessage").innerHTML = `${name} successfully added to the warehouse: ${warehouse}`;
            
                }
            }
           
    }
}


//function to add an item to the main inventory
function addToMainInventory(name, quantity){
    //find the item if it exists
    newLogisticsCompany.inventory.addQuantity(name, quantity)
}

//update quantity given an inventory, itemname
function updateQuantity(name, newQuantity, warehouse){
    for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
        tempWarehouse = newLogisticsCompany.warehouses[x]
        if (tempWarehouse.warehouse_name == warehouse){
            //store old quantity to update the main inventory
            var oldQuantity = tempWarehouse.inventory.getQuantity(name)
            res = tempWarehouse.inventory.updateQuantity(name, newQuantity);
            var difference = newQuantity - oldQuantity

            //update the maininventory
            addToMainInventory(name, difference)
        }
    }
    
    if (res == false){
        document.getElementById("resMessage").innerHTML = `${name} does not exist in ${warehouse} to update the quantity`;
    }
    else{
        document.getElementById("resMessage").innerHTML = `${name} quantity was updated to ${newQuantity} in ${warehouse}`;
    }

}
//delete item from all warehouses and main databse
function deleteItem(name, warehouse) {
    if (warehouse == "all_warehouses"){
        for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
            tempWarehouse = newLogisticsCompany.warehouses[x]
            tempWarehouse.inventory.removeItem(name)
        }
        //update the main inventory
        newLogisticsCompany.inventory.removeItem(name)
        return document.getElementById("resMessage").innerHTML = `All instances of ${name} have been removed`;

    }

    res = false
    //remove the item from the specific warehouse
    for (x = 0; x < newLogisticsCompany.warehouses.length; x ++){
        tempWarehouse = newLogisticsCompany.warehouses[x]
        if (tempWarehouse.warehouse_name == warehouse){
            var removedQuantity = tempWarehouse.inventory.getQuantity(name)
            res = tempWarehouse.inventory.removeItem(name);
            //remove the old quantity from the main inventory
            if (res == true){
                newLogisticsCompany.inventory.addQuantity(name, 0-removedQuantity)
            }
        }
    }
 
    if (res == false){
        document.getElementById("resMessage").innerHTML = `${name} does not exist in ${warehouse}`;
    }
    else if (res == true) {
        document.getElementById("resMessage").innerHTML = `${name} was deleted successfully from ${warehouse}`
    }
}

//create a warehouse
function createWarehouse(nameOfWareHouse){
    //check if the warehouse name aleady exists
    if (newLogisticsCompany.warehouses != null){
        if (newLogisticsCompany.warehouseExists(nameOfWareHouse) ==  true){
            return document.getElementById("resMessage").innerHTML = `${nameOfWareHouse} already exists in your company`
        }
    }

    var addThisWareHouse = new Warehouse(nameOfWareHouse);
    newLogisticsCompany.warehouses.push(addThisWareHouse);
    hideWareHouseEntry()
    showCRUD();
    document.getElementById("resMessage").innerHTML = `${nameOfWareHouse} was successfully added as a warehouse`;

}


//hide the beginning page
function hideWareHouseEntry(){
    var elements = document.getElementsByName('warehouse_entry');
    for (i = 0; i < elements.length; i ++){
        elements[i].style.display = 'none'
    }
}

//show all buttons
function showCRUD(){
    var elems = document.getElementsByName('selected_option');

    for (let i=0;i < elems.length; i ++){
        elems[i].style.display = 'block';
    }
    
}