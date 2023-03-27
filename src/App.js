import "./App.css";
import React from "react";
import Calendar from "./components/Calendar";

function App() {
  const [meetingTimeMin, setMeetingTimeMin] = React.useState(0);

  function handleChange(event) {
    setMeetingTimeMin(Number(event.target.value));
    // console.log(typeof event.target.value, event.target.value);
  }

  function parseTime(timeInterval) {
    const [hours, minutes] = timeInterval;
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  }

  function formatTime(timeInMilisec) {
    const hours = timeInMilisec / 1000 / 60 / 60;
    const minutes = (timeInMilisec / 1000 / 60) % 60;
    return [Math.floor(hours), minutes];
  }

  function findAvailableTime(
    calendar1,
    calendar1Limits,
    calendar2,
    calendar2Limits
  ) {
    const [calendar1Start, calendar1End] = calendar1Limits.map((elem) =>
      parseTime(elem)
    );
    const [calendar2Start, calendar2End] = calendar2Limits.map((elem) =>
      parseTime(elem)
    );
    const meetingTimeMilisec = meetingTimeMin * 60 * 1000;
    const bookedTimes = [...calendar1, ...calendar2].map(([start, end]) => [
      parseTime(start),
      parseTime(end),
    ]);
    // console.log(calendar1);
    // console.log(calendar2);
    // console.log(calendar1Start, calendar1End);
    // console.log(bookedTimes);

    bookedTimes.sort((a, b) => a[0] - b[0]); // sort by start time

    const availableTimes = [];
    let lastEnd = calendar1Start; // start from the beginning of calendar 1
    for (const [start, end] of bookedTimes) {
      //checking if the intervals correspond to the working hours and if the meeting time is the one that the user asks for
      if (start - lastEnd >= meetingTimeMilisec && lastEnd >= calendar2Start) {
        availableTimes.push([formatTime(lastEnd), formatTime(start)]);
      }
      lastEnd = Math.max(lastEnd, end); // update lastEnd to the end of the last booked time
    }
    if (
      calendar1End - lastEnd >= meetingTimeMilisec &&
      calendar2End - lastEnd >= meetingTimeMilisec
    ) {
      availableTimes.push([
        formatTime(lastEnd),
        formatTime(Math.min(calendar1End, calendar2End)),
      ]);
    }
    return availableTimes;
  }

  function displayAvailableTimes() {
    const calendar1 = JSON.parse(window.localStorage.getItem("calendar1"));
    const calendar2 = JSON.parse(window.localStorage.getItem("calendar2"));
    const calendar1Limits = JSON.parse(
      window.localStorage.getItem("calendar1Limits")
    );
    const calendar2Limits = JSON.parse(
      window.localStorage.getItem("calendar2Limits")
    );

    //Checking if the data has been declared
    if (calendar1 && calendar2 && meetingTimeMin <= 15) return;

    const available = findAvailableTime(
      calendar1,
      calendar1Limits,
      calendar2,
      calendar2Limits
    ).map(([start, end]) => (
      <p>
        [{start[0]}:{start[1].toString().padStart(2, "0")}],[{end[0]}:
        {end[1].toString().padStart(2, "0")}];
      </p>
    ));
    return available;
  }
  const available = displayAvailableTimes();

  return (
    <div className="App">
      <div className="calendars">
        <Calendar id="calendar1" />
        <Calendar id="calendar2" />
      </div>
      <div className="meeting">
        <p>Meeting Time Minutes:</p>
        <input
          type="number"
          name="meetingTimeMin"
          value={meetingTimeMin}
          onChange={handleChange}
        />
        <p>(has to be at least 15 minutes long)</p>
      </div>
      <div className="available-times">
        <p>Available meeting times:</p>
        {available}
      </div>
    </div>
  );
}

export default App;
