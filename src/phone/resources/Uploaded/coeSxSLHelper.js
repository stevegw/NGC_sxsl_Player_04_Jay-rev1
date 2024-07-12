
class coeSxSLHelper {
    #sxslData;
    #freshRun;
    #workorder;

    //Constructor Method for the class
    constructor() {
        this.#freshRun = true;
    }

    setWorkOrder (wo) {
        this.#workorder = wo;
    }

    getWorkOrder (wo){
        return this.#workorder;
    }

    setFreshRun (b){
        this.#freshRun = b;
    }

    getFreshRun (){
        return this.#freshRun;
    }

    setSxSL(d) {
        //This function is to set the overall SxSL data;
        this.#sxslData = d;
    }

    getDescription() {
        //Returns the private variable "imageLoaded"
        return this.#sxslData.description;
    }

    getSteps() {
        return this.#sxslData.steps;
    }

    getStepNum (i){
        let stepList = this.#sxslData.statements;
        return stepList[i-1];
    }

    getStepbyID (id){
        let steps = this.getSteps();
        let stepjson = steps.filter(element => element.id === id)        
        return stepjson;
    }

    getStepTitleByID (id) {
        // A LOT of liberties are being taken in this function
        // 
        let stepjson;
        stepjson = this.getStepbyID(id);        
        return stepjson[0]['title']['resources'][0]['text'];
    }

    WOScanNeeded() {
        let scanyesno = false;
        //Get the Statement List
        let stepList = this.#sxslData.statements;

        //Check the first statement - First Action to see if it has tool = barcode and fieldname = "WorkOrderNumber"
        if (stepList.length > 0) {
            let stpid = stepList[0].stepId;
            let actionData = this.getStepActionData(stpid);
            if (actionData.length > 0) {
                let actionDetailData = this.getActionDetailData(actionData[0]);                
                if (actionDetailData != undefined) {
                    if (actionDetailData.hasOwnProperty("ID") && actionDetailData.hasOwnProperty("tool")) {
                        //Check Name = WorkOrderNumber
                        //Check tool = barcode ;
                        let id = actionDetailData.ID
                        let tool = actionDetailData.tool                        
                        if (id === "WorkOrderNumber" && tool === "barcode") {
                            scanyesno = true;
                        }
                    }
                }
            }
        }
        return scanyesno;
    }

    //This gets a Steps Action Data
    getStepActionData(sid) {
        let steps = this.getSteps();
        let stepjson = steps.filter(element => element.id === sid)
        let actions = stepjson[0].actions;
        return actions;
    }

    getActionDetailData(actdata) {
        let json;
        if (actdata.hasOwnProperty("details")) {
            json = actdata.details;
        }
        return json;
    }



}