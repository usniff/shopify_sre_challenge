class Logistics_Company{
    constructor(){
        this.inventory = new Inventory()
        this.warehouses = new Array()
    }
    // constructor(warehouses, inventory){
    //     this.inventory = Inventory
    //     this.warehouses = Warehouse
    // }
    

    listWarehouses(){        
        if (this.warehouses.length <= 0){
            return document.getElementById("resMessage").innerHTML = "Inventory is empty!"
        }
        var output = ""
        for (let x = 0; x <this.warehouses.length; x++){
            var tempItem = this.warehouses[x]
            output += `<div> ${tempItem.warehouse_name} </div>`
        }
        document.getElementById("resMessage").innerHTML = output
        
    }

    warehouseExists(warehouseName){
        if (this.warehouses.length <= 0){
            return false;
        }
        for (let x = 0; x < this.warehouses.length; x ++){
            var temp = this.warehouses[x]
            if (temp.warehouse_name == warehouseName){
                return true
            }
        }
        return false
    }

    listInventory(){
        if (this.warehouses.size <= 0){
            return document.getElementById("resMessage").innerHTML = "Inventory is empty!"
        }
        var output = ""
        for (let [key, value] of this.inventory.inventory){
            output +=  `<div> ${key} : ${value} </div>`
        }
        return document.getElementById("resMessage").innerHTML = output
    }
}
