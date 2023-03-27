import React from "react";
import Intervals from "./Intervals";

export default function BookedHours(props) {
  const [formData, setFormData] = React.useState({
    fromHour: "",
    fromMin: "",
    toHour: "",
    toMin: "",
    bookedHours: [],
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fromHour = Number(formData.fromHour);
    const fromMin = Number(formData.fromMin);
    const toHour = Number(formData.toHour);
    const toMin = Number(formData.toMin);
    const startingHour = Number(props.startingHour);
    const startingMin = Number(props.startingMin);
    const endingHour = Number(props.endingHour);
    const endingMin = Number(props.endingMin);

    try {
      //Checking if the interval is written correcly
      if (fromHour > toHour) {
        throw Error("Wrong interval. Try again.");
      }
      //Checking if the interval corresponds to the working hours
      if (
        fromHour < startingHour ||
        toHour > endingHour ||
        (fromHour === startingHour && fromMin < startingMin) ||
        (toHour === endingHour && toMin > endingMin)
      )
        throw Error(
          "Outside of the working hours, check the range limit of the working hours or define them if not defined."
        );

      //Transforming the time in miliseconds so we can compare it easly
      const fromInMilisec = fromHour * 60 * 60 * 1000 + fromMin * 60 * 1000;
      const toInMilisec = toHour * 60 * 60 * 1000 + toMin * 60 * 1000;

      //Checking if the interval it's free before submitting the appointment
      const checkingIntervals = formData.bookedHours.some((element, i) => {
        const lowerElemMilisec =
          element[0][0] * 60 * 60 * 1000 + element[0][1] * 60 * 1000;
        const upperElemMilisec =
          element[1][0] * 60 * 60 * 1000 + element[1][1] * 60 * 1000;
        return (
          (fromInMilisec >= lowerElemMilisec &&
            fromInMilisec < upperElemMilisec) ||
          (toInMilisec > lowerElemMilisec && toInMilisec <= upperElemMilisec)
        );
      });
      if (checkingIntervals) throw Error("The interval is already booked.");

      //Saving the data in local storage
      const data = [
        ...formData.bookedHours,
        [
          [fromHour, fromMin],
          [toHour, toMin],
        ],
      ];
      window.localStorage.setItem(props.id, JSON.stringify(data));

      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          bookedHours: [
            ...prevFormData.bookedHours,
            [
              [fromHour, fromMin],
              [toHour, toMin],
            ],
          ],
        };
      });
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }

  //Retrieve data from local storage
  const localData = JSON.parse(window.localStorage.getItem(props.id));
  let displayBookedHours;

  if (localData) {
    displayBookedHours = localData.map((elem, i) => {
      if (i === localData.length - 1)
        return (
          <p key={i}>
            [{elem[0][0]}:{elem[0][1].toString().padStart(2, "0")}, {elem[1][0]}
            :{elem[1][1].toString().padStart(2, "0")}]
          </p>
        );

      return (
        <p key={i}>
          [{elem[0][0]}:{elem[0][1].toString().padStart(2, "0")}, {elem[1][0]}:
          {elem[1][1].toString().padStart(2, "0")}],
        </p>
      );
    });
  }
  return (
    <div>
      <form className="booked-hours" onSubmit={handleSubmit}>
        <p>Book an interval of time:</p>
        <Intervals
          hour={"fromHour"}
          hourValue={formData.fromHour}
          min={"fromMin"}
          minValue={formData.fromMin}
          handleChange={handleChange}
        />
        <Intervals
          hour={"toHour"}
          hourValue={formData.toHour}
          min={"toMin"}
          minValue={formData.toMin}
          handleChange={handleChange}
        />
        <button>Ok</button>
      </form>
      <span className="booked-list">[{displayBookedHours}]</span>
    </div>
  );
}
