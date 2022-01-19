class Inventory {
    constructor(){
        //inventory is a collection of items
        this.inventory = new Map()
    }


    getQuantity(name){
        return this.inventory.get(name);
    }
    removeItem(name){
        return this.inventory.delete(name);
    }

    addItem(name, quantity){
        if (this.inventory.has(name) == false){
            this.inventory.set(name, quantity)
            return true;
        }
        return false
  }

    itemExistsInInventory(name){
        if (this.inventory.has(name) == true){
            return true;
        }
        return false;
    }

    listItems(){
        if (this.inventory.size <= 0){
            document.getElementById("resMessage").innerHTML = "Inventory is empty!"
            return
        }
        var output = ""
        for (let [key, value] of this.inventory) {
            output +=  `<div> ${key} : ${value} </div>`
        }
        document.getElementById("resMessage").innerHTML = output
    }

    updateQuantity(name, newQuantity){
        if(this.inventory.has(name)){
            this.inventory.set(name, newQuantity);
            return true;
        }
        else{
            return false;
        }

    }

    addQuantity(name, quantity){
        var currInventoryAmount = 0
        var newInventoryAmount = 0
        if (this.inventory.has(name)){
            currInventoryAmount += parseInt(this.inventory.get(name))
            newInventoryAmount = currInventoryAmount + parseInt(quantity)
            this.inventory.set(name, newInventoryAmount)
            return
        }
        this.inventory.set(name, quantity)
    }

}