// let addedClasses = JSON.parse(sessionStorage.getItem("globalAddedClasses"));
// console.log(addedClasses);

let currentDate = new Date();
let isoFormatCurrentDate = currentDate.toISOString().split('T')[0];
let daysDict = {
    "M": 25,
    "TU": 26,
    "W": 27,
    "TH": 28,
    "F": 29
}

function createSchedule(courseObjects) {

    var calendarEl = document.getElementById('calendar');
    console.log(courseObjects);
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        initialDate: '2021-01-25',
        headerToolbar: false,
        events: courseObjects
    });
    calendar.render();
}

function fetchSavedCourses() {
    return fetch("http://localhost:8000/queryDB/getSavedClasses").then(result => {
        return result.json();
    }).then(async data => {
        if (data.length == 0) return
        let savedCourses = data[0]["saved_courses"];
        let courseObjects = [];
        for (i = 0; i < savedCourses.length; i++) {
            let id = savedCourses[i];
            let objectResult = await fetchCourseById(id).then(result => {
                return result;
            })
            courseObjects.push(objectResult);
        }
        createSchedule(courseObjects);
    });
}

function loadScheduleAfterCompletion() {
    fetchSavedCourses();
    createSchedule();
}

function fetchCourseById(id) {
    return fetch(`http://localhost:8000/queryDB/id/${id}`).then(result => {
        return result.json();
    }).then(data => {
        if (data == null || data == undefined) return

        let days = data[0]["Days"];
        let startTimeResult = convertTimeToFormat(data[0]["Start Time"]);
        let endTimeResult = convertTimeToFormat(data[0]["End Time"]);
        let i = 0;
        while (i < days.length) {
            const classObject = {
                title: `${data[0]["Subj"]} ${data[0]["CRS"]}`,
                start: '',
                end: ''
            };
            console.log(days[i], days[i+1]);
            if (days[i] == "T" && days[i + 1] == "U") {
                classObject.start = `2021-01-${daysDict["TU"]}T${startTimeResult}`;
                classObject.end = `2021-01-${daysDict["TU"]}T${endTimeResult}`;
                i += 2;

            } else if (days[i] == "T" && days[i + 1] == "H") {
                classObject.start = `2021-01-${daysDict["TH"]}T${startTimeResult}`;
                classObject.end = `2021-01-${daysDict["TH"]}T${endTimeResult}`;
                i += 2;

            } else {
                classObject.start = `2021-01-${daysDict[days[i]]}T${startTimeResult}`;
                classObject.end = `2021-01-${daysDict[days[i]]}T${endTimeResult}`;
                i += 1;
            }
            return classObject;
        }
    });
}

function convertTimeToFormat(timeString) {
    let isPM = timeString.includes("PM");
    let timeArray = timeString.split(":");

    if (isPM) {
        let hour = parseInt(timeArray[0]);
        if (hour != 12) {
            hour += 12;
        }
        let minutes = timeArray[1].split(" ")[0]
        return hour.toString() + ":" + minutes + ":00";
    } else {
        let hour = timeArray[0];
        let minutes = timeArray[1].split(" ")[0]
        return hour + ":" + minutes + ":00";
    }
}

loadScheduleAfterCompletion();