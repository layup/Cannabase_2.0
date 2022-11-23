

function testToString(test_values){

    //make customizeable with JSON so users can change it 
    //have a database change option 
    let tests = {
        "2": "Metal", 
        "3": "Basic Potency", 
        "33": "Deluxe Potency",
        "4": "Toxins",
        "5": "Pesticides",
        "7": "Terpenes",
        "8": "Solvents",
        "9": "Other",
        "1": "Micro A",
        "6": "Micro B",
        "10": "Fungal ID",
        "11": "Mushrooms"
    }

    const tests_lists = test_values.split(",")
    const tests_results = []; 

    //could do with map but O(n) is fast, so will do later 
    for (let i = 0; i < tests_lists.length; i++ ){
        tests_results.push(tests[tests_lists[i]])
    }

    return tests_results.join(", ")
}

function matchString(test_value) {
    let tests = {
        "2": "Metal", 
        "3": "Basic Potency", 
        "33": "Deluxe Potency",
        "4": "Toxins",
        "5": "Pesticides",
        "7": "Terpenes",
        "8": "Solvents",
        "9": "Other",
        "1": "Micro A",
        "6": "Micro B",
        "10": "Fungal ID",
        "11": "Mushrooms"
    } 
    return tests[test_value]
}

function convertForDatabase(arr){

    const convertDatabase = {
        0:1,
        1:2, 
        2:3, 
        3:33, 
        4:4,
        5:5,
        6:6,
        7:7,
        8:8,
        9:9, 
        10:10,
        11:11
    }

    console.log(arr)
    console.log(arr.indexOf(true));

    var index = []; 
    for(var i = 0; i < arr.length; i++ ){
        if(arr[i] === true){
            index.push(convertDatabase[i])
        }
    }
   
    return index; 

}


export {
    testToString,
    matchString,
    convertForDatabase
}

