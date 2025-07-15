"use client";

import React, { useEffect, useState } from "react";
import {
  addGoal,
  fetchGoals,
  updateGoal,
  deleteGoal,
  deleteAllGoals,
} from "../services/HealthGoalServices";

export default function HealthGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const loadGoals = async () => {
      const fetched = await fetchGoals();
      setGoals(fetched);
    };
    loadGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;

    await addGoal({ name: newGoal });
    const fetched = await fetchGoals();
    setGoals(fetched);
    setNewGoal("");
  };

  const handleToggleDone = async (goalId, currentState) => {
    await updateGoal(goalId, { done: !currentState });
    const fetched = await fetchGoals();
    setGoals(fetched);
  };

  const handleDelete = async (goalId) => {
    await deleteGoal(goalId);
    const fetched = await fetchGoals();
    setGoals(fetched);
  };

  const handleDeleteAll = async () => {
    await deleteAllGoals();
    setGoals([]);
  };

  const progress =
    goals.length > 0
      ? (goals.filter((g) => g.done).length / goals.length) * 100
      : 0;

  return (
    <div className="bg-white border border-teal-600 rounded-2xl p-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Set Health Goals
      </h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter new health goal..."
          className="flex-1 border border-gray-300 shadow-teal-600 shadow-sm rounded px-3 py-2"
        />
        <button
          onClick={handleAddGoal}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex justify-between items-center border border-gray-200 rounded p-3 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={goal.done}
                onChange={() => handleToggleDone(goal.id, goal.done)}
                className="h-5 w-5 text-teal-600"
              />
              <span
                className={`text-gray-800 ${
                  goal.done ? "line-through text-gray-400" : ""
                }`}
              >
                {goal.name}
              </span>
            </div>
            <button
              onClick={() => handleDelete(goal.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {goals.length > 0 && (
        <>
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className="bg-teal-600 h-4"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Progress: {Math.round(progress)}%
            </p>
          </div>
          <button
            onClick={handleDeleteAll}
            className="mt-4 text-red-500 hover:text-red-700 text-sm"
          >
            Delete All Goals
          </button>
        </>
      )}
    </div>
  );
}
