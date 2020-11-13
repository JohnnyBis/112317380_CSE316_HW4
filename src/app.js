let fetchedData = null;

function getAllCourses() {
    fetch("http://localhost:8000/queryDB").then(result => {
        return result.json();
    }).then(data => {
        fetchedData = data;
        let table = document.getElementsByClassName("courses-table");
        table[0].innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let row = table[0].insertRow(0);
            let th = document.createElement('th');
            th.innerHTML = i + 1;
            row.appendChild(th);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);
            let cell6 = row.insertCell(6);
            cell1.innerHTML = data[i]["Title"] + " - " + data[i]["Subj"] + " " + data[i]["CRS"];
            cell2.innerHTML = data[i]["Instr"];
            cell3.innerHTML = "LEC: " + data[i]["Days"] + " " + data[i]["Start Time"] + " - " + data[i]["End Time"];
            cell4.innerHTML = "Room: " + data[i]["Room"];
            cell6.innerHTML = `<button id=${data[i]["_id"]} type="button" class="btn btn-primary add-button" onclick='listenToAddButton(this)'>Add</button>`;
        }

        getCurrentSavedClasses();

    });
}

getAllCourses();

function searchBy(field, fieldValue) {
    let url = "http://localhost:8000/queryDB/";
    switch (field) {
        case "Class number":
            url += "class_number/" + fieldValue;
            break;
        case "Title":
            url += "title/" + fieldValue;
            break;
        case "Day":
            url += "days/" + fieldValue;
            break;
        case "Time":
            url += "time/" + fieldValue;
            break;
        case "All fields":
            url += "all_fields/" + fieldValue;
        default:
            break;
    }

    fetch(url).then(result => {
        return result.json();
    }).then(data => {
        let table = document.getElementsByClassName("courses-table");
        table[0].innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let row = table[0].insertRow(0);
            let th = document.createElement('th');
            th.innerHTML = i + 1;
            row.appendChild(th);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);
            let cell6 = row.insertCell(6);
            cell1.innerHTML = data[i]["Title"] + " - " + data[i]["Subj"] + " " + data[i]["CRS"];
            cell2.innerHTML = data[i]["Instr"];
            cell3.innerHTML = "LEC: " + data[i]["Days"] + " " + data[i]["Start Time"] + " - " + data[i]["End Time"];
            cell4.innerHTML = "Room: " + data[i]["Room"];
            cell6.innerHTML = `<button id=${data[i]["_id"]} type="button" class="btn btn-primary add-button" onclick='listenToAddButton(this)'>Add</button>`;
        }
    });

    getCurrentSavedClasses();

}

let dropdownValue = "All fields";

function listenForSearchInput() {
    $(document).ready(function () {
        $('#find-button').click(function (event) {
            let input = $('#searchField').val();
            if (input == "") {
                getAllCourses();
            }else{
                searchBy(dropdownValue, input);
            }
            event.preventDefault();
        });
    });
}

function getDropdownValue() {
    $('#dropdownMenuButton a').on('click', function () {
        $('#dropdownButton').html($(this).text());
        dropdownValue = $(this).text();
    });
}

let addedClasses = [];

function listenToAddButton(event) {
    let classId = $(event).attr('id');
    if ($(event).html() == "Remove") {
        $(event).html("Add");
        const index = addedClasses.indexOf(classId);
        if (index > -1) {
            addedClasses.splice(index, 1);
        }
    } else {
        $(event).html("Remove");
        addedClasses.push(classId);
    }
}

function saveClasses(event) {
    if (addedClasses.length >= 1) {
        postRequestToDB(addedClasses);
    } else {
        postRequestToDB(null);
    }
}

function postRequestToDB(data) {
    const objectData = {
        course_list: data
    };
    console.log(objectData);
    $.post("http://localhost:8000/queryDB/postSavedClasses", objectData, function (objectData, status) {
        if (status >= 200 && status <= 299) {
            console.log("Success.");
        } else {
            console.log("There was an error.");
        }
    });
}

listenToAddButton();
getDropdownValue();
listenForSearchInput();

$('#myScheduleLink').click(function (event) {
    if (addedClasses.length >= 1) {
        postRequestToDB(addedClasses);
    } else {
        postRequestToDB(null);
    }
});

function getCurrentSavedClasses() {
    fetch("http://localhost:8000/queryDB/getSavedClasses").then(result => {
        return result.json();
    }).then(data => {
        let res = data[0]["saved_courses"];
        console.log(res);
        for (i = 0; i < res.length; i++) {
            let savedClassButton = document.getElementById(res[i]);
            savedClassButton.innerText = "Remove";
        }
        addedClasses = res;
    });
}