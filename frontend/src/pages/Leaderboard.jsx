import { useState } from "react";
// import { useTheme } from "../hooks/use-theme.jsx";


const mockData = {
  weekly: {
    distance: [
      { name: "Alice", value: 54 },
      { name: "Bob", value: 47 },
      { name: "Charlie", value: 42 },
    ],
    elevation: [
      { name: "Bob", value: 1300 },
      { name: "Alice", value: 1200 },
      { name: "Charlie", value: 800 },
    ],
    hikes: [
      { name: "Charlie", value: 5 },
      { name: "Alice", value: 4 },
      { name: "Bob", value: 3 },
    ],
  },
  monthly: {
    distance: [
      { name: "Alice", value: 214 },
      { name: "Charlie", value: 198 },
      { name: "Bob", value: 176 },
    ],
    elevation: [
      { name: "Bob", value: 5400 },
      { name: "Alice", value: 4900 },
      { name: "Charlie", value: 4200 },
    ],
    hikes: [
      { name: "Charlie", value: 20 },
      { name: "Bob", value: 18 },
      { name: "Alice", value: 15 },
    ],
  },
};

export default function Leaderboard() {
//   const { theme } = useTheme();
  const [period, setPeriod] = useState("weekly");
  const [stat, setStat] = useState("distance");

  const leaderboard = mockData[period][stat];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          {period === "weekly" ? "🏆 Weekly" : "🌍 Monthly"} Leaderboard
        </h1>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Period Switch */}
          <div className="flex bg-white shadow rounded-xl overflow-hidden">
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-4 py-2 text-sm font-medium ${
                period === "weekly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-2 text-sm font-medium ${
                period === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Stat Selector */}
          <select
            value={stat}
            onChange={(e) => setStat(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="distance">Distance (km)</option>
            <option value="elevation">Elevation (m)</option>
            <option value="hikes">Hikes Completed</option>
          </select>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-4">Rank</th>
                <th className="p-4">Name</th>
                <th className="p-4">{statLabel(stat)}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr
                  key={entry.name}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-blue-600">
                    #{i + 1}
                  </td>
                  <td className="p-4">{entry.name}</td>
                  <td className="p-4 font-medium">{entry.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function statLabel(stat) {
  switch (stat) {
    case "distance":
      return "Distance (km)";
    case "elevation":
      return "Elevation Gain (m)";
    case "hikes":
      return "Hikes Completed";
    default:
      return "Value";
  }
}