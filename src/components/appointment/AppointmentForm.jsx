import { useState } from "react";

export default function AppointmentForm() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      department,
      doctor,
      date,
      time,
      reason,
    });

    alert("Appointment Booked Successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
    >
      <h2 className="text-3xl font-bold">
        Book Appointment
      </h2>

      <select
        className="w-full border p-3 rounded-xl"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Select Department</option>
        <option>Cardiology</option>
        <option>Dermatology</option>
        <option>Orthopedics</option>
        <option>Neurology</option>
      </select>

      <input
        className="w-full border p-3 rounded-xl"
        placeholder="Doctor Name"
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
      />

      <input
        type="date"
        className="w-full border p-3 rounded-xl"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        className="w-full border p-3 rounded-xl"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded-xl"
        placeholder="Reason for Visit"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button
        className="w-full bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700"
      >
        Confirm Appointment
      </button>
    </form>
  );
}