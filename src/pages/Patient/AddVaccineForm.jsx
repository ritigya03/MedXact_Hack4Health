import { useState } from "react";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddVaccineForm = ({ onAdd }) => {
  const [vaccine, setVaccine] = useState({
    name: "",
    date: "",
    type: "",
    nextDose: "",
    notes: "",
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    let certificateUrl = "";
    if (file) {
      const fileRef = ref(storage, `vaccine_certificates/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      certificateUrl = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, "patients", user.uid, "vaccines"), {
      ...vaccine,
      taken: true,
      certificateUrl,
      createdAt: serverTimestamp(),
    });

    onAdd(); // refresh list
    setVaccine({ name: "", date: "", type: "", nextDose: "", notes: "" });
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 p-6 rounded-xl shadow-md">
  {/* Vaccine Name */}
  <div className="relative">
    <input
      type="text"
      id="vaccineName"
      required
      value={vaccine.name}
      onChange={(e) => setVaccine({ ...vaccine, name: e.target.value })}
      className="peer w-full p-3 pt-6 border border-gray-300 rounded-lg bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Vaccine Name"
    />
    <label
      htmlFor="vaccineName"
      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
    >
      Vaccine Name
    </label>
  </div>

  {/* Date Taken */}
  <div className="relative">
    <input
      type="date"
      id="dateTaken"
      required
      value={vaccine.date}
      onChange={(e) => setVaccine({ ...vaccine, date: e.target.value })}
      className="peer w-full p-3 pt-6 border border-gray-300 rounded-lg bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Date Taken"
    />
    <label
      htmlFor="dateTaken"
      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
    >
      Date Taken
    </label>
  </div>

  {/* Type */}
  <div className="relative">
    <input
      type="text"
      id="vaccineType"
      value={vaccine.type}
      onChange={(e) => setVaccine({ ...vaccine, type: e.target.value })}
      className="peer w-full p-3 pt-6 border border-gray-300 rounded-lg bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Vaccine Type"
    />
    <label
      htmlFor="vaccineType"
      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
    >
      Type (e.g., Booster)
    </label>
  </div>

  {/* Next Dose */}
  <div className="relative">
    <input
      type="date"
      id="nextDose"
      value={vaccine.nextDose}
      onChange={(e) => setVaccine({ ...vaccine, nextDose: e.target.value })}
      className="peer w-full p-3 pt-6 border border-gray-300 rounded-lg bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Next Dose"
    />
    <label
      htmlFor="nextDose"
      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
    >
      Next Dose (Optional)
    </label>
  </div>

  {/* Notes */}
  <div className="relative">
    <textarea
      id="vaccineNotes"
      rows="3"
      value={vaccine.notes}
      onChange={(e) => setVaccine({ ...vaccine, notes: e.target.value })}
      className="peer w-full p-3 pt-6 border border-gray-300 rounded-lg bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Notes"
    ></textarea>
    <label
      htmlFor="vaccineNotes"
      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
    >
      Notes (if any)
    </label>
  </div>

  {/* Upload Certificate */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Certificate (Optional)
    </label>
    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded hover:file:bg-blue-700"
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
  >
    Add Vaccine
  </button>
</form>
    );
    }

export default AddVaccineForm;
