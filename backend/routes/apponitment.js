import express from "express";
import { db } from "../../firebase.js";

const router = express.Router();

// 📌 Book appointment (POST)
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;

    const appointment = {
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("appointments").add(appointment);
    res.status(201).send({ id: docRef.id, ...appointment });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// 📌 Get appointments for doctor (GET)
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const snapshot = await db.collection("appointments")
      .where("doctorId", "==", doctorId)
      .orderBy("date")
      .get();

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

export default router;