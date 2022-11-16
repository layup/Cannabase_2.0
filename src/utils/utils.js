

function testToString(test_values){

    //make customizeable with JSON so users can change it 
    //have a database change option 
    let tests = {
        "2": "Metal", 
        "3": "Potency", 
        "33": "dPotency",
        "4": "Toxins",
        "5": "Pests",
        "7": "Terps",
        "8": "Solv",
        "9": "Oth",
        "1": "M.A",
        "6": "M.B",
        "10": "F.ID",
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
        "3": "Potency", 
        "33": "dPotency",
        "4": "Toxins",
        "5": "Pests",
        "7": "Terps",
        "8": "Solv",
        "9": "Oth",
        "1": "M.A",
        "6": "M.B",
        "10": "F.ID",
        "11": "Mushrooms"
    } 
    return tests[test_value]

}

export {
    testToString,
    matchString
}

