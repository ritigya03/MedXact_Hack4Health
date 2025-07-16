import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // adjust the path if needed
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function AppointmentsList({ doctorId }) {
const [appointments, setAppointments] = useState([]);

useEffect(() => {
if (!doctorId) return;

const q = query(
  collection(db, "appointments"),
  where("doctorId", "==", doctorId)
);

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const data = [];
  querySnapshot.forEach((doc) =>
    data.push({ id: doc.id, ...doc.data() })
  );
  setAppointments(data);
});

return () => unsubscribe();
}, [doctorId]);

return (
<div className="p-4">
<h2 className="text-xl font-semibold text-teal-800 mb-4 text-center">
🗓️ Appointments
</h2>
{appointments.length === 0 ? (
<p className="text-gray-600 text-sm text-center">No appointments scheduled yet.</p>
) : (
<div className="flex flex-col gap-4">
{appointments.map((appt) => (
<div key={appt.id} className="border border-teal-200 bg-white shadow-md rounded-lg p-4" >
<div className="text-sm text-gray-700">
<span className="font-medium">👤 Patient:</span> {appt.patientName}
</div>
<div className="text-sm text-gray-700">
<span className="font-medium">📅 Date:</span> {appt.date}
</div>
<div className="text-sm text-gray-700">
<span className="font-medium">⏰ Time:</span> {appt.time}
</div>
<div className="text-sm text-gray-700">
<span className="font-medium">📝 Notes:</span> {appt.notes || "N/A"}
</div>
<div className="text-sm text-gray-700">
<span className="font-medium">📌 Status:</span>{" "}
<span className="capitalize text-teal-600">{appt.status}</span>
</div>
</div>
))}
</div>
)}
</div>
);
}


