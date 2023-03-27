import React from "react";
import BookedHours from "./BookedHours";
import Intervals from "./Intervals";

export default function Calendar(props) {
  const [formData, setFormData] = React.useState({
    startingHour: "",
    startingMin: "",
    endingMin: "",
    endingHour: "",
  });
  const [render, setRender] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    try {
      //Checking if the interval is written correcly
      if (
        Number(formData.startingHour) > Number(formData.endingHour) ||
        (Number(formData.startingHour) === Number(formData.endingHour) &&
          Number(formData.startingMin) >= Number(formData.endingMin))
      )
        throw Error("Wrong interval. Try again.");

      //Guard clause so the user can't submit if the values are not declared
      if (
        !(
          formData.startingHour &&
          formData.startingMin &&
          formData.endingHour &&
          formData.endingMin
        )
      )
        return;

      window.localStorage.setItem(
        props.id + "Limits",
        JSON.stringify([
          [Number(formData.startingHour), Number(formData.startingMin)],
          [Number(formData.endingHour), Number(formData.endingMin)],
        ])
      );
      setRender(true);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }

  return (
    <div>
      <p>Calendar range limits:</p>
      <form onSubmit={handleSubmit}>
        <Intervals
          hour={"startingHour"}
          hourValue={formData.startingHour}
          min={"startingMin"}
          minValue={formData.startingMin}
          handleChange={handleChange}
        />
        <Intervals
          hour={"endingHour"}
          hourValue={formData.endingHour}
          min={"endingMin"}
          minValue={formData.endingMin}
          handleChange={handleChange}
        />
        <button>Ok</button>
      </form>

      {render && (
        <span>
          Range limits: [{formData.startingHour}:{formData.startingMin},
          {formData.endingHour}:{formData.endingMin}]
        </span>
      )}

      <BookedHours {...formData} id={props.id} />

      <span></span>
    </div>
  );
}
