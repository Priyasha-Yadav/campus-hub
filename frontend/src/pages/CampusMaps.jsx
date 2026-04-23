import { useState } from "react";
import CampusMap from "../components/maps/CampusMap";
import Card from "../components/ui/Card";

export default function CampusMaps() {
  const [activeTab, setActiveTab] = useState("map");

  const buildings = [
    { id: 1, name: "Library", lat: 23.1925, lng: 72.6315, description: "Main library" },
    { id: 2, name: "Student Center", lat: 23.1930, lng: 72.6320, description: "Student services" },
  ];

  

  const tabs = [
    { id: "map", label: "Interactive Map" },
    { id: "info", label: "Campus Info" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Campus Maps & Info</h1>

        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Tab */}
      {activeTab === "map" && (
        <div className="space-y-6">
          <CampusMap
            centerLat={22.816989}
            centerLng={72.473361}
            buildings={buildings}
          />
        </div>
      )}

      {/* Info Tab */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold mb-4">Getting Around Campus</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Shuttle Service</h4>
                <p className="text-gray-600">
                  Free campus shuttle runs every 15 minutes during peak hours
                </p>
              </div>
              <div>
                <h4 className="font-medium">Bike Rentals</h4>
                <p className="text-gray-600">
                  Available at Student Center and Library
                </p>
              </div>
              <div>
                <h4 className="font-medium">Parking</h4>
                <p className="text-gray-600">
                  Student parking available in lots A, B, and C
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Campus Services</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Health Center</h4>
                <p className="text-gray-600">
                  Located in Student Center, 2nd floor
                </p>
              </div>
              <div>
                <h4 className="font-medium">Career Services</h4>
                <p className="text-gray-600">
                  Admin Building, Room 201
                </p>
              </div>
              <div>
                <h4 className="font-medium">IT Help Desk</h4>
                <p className="text-gray-600">
                  Library, Ground floor
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Dining Options</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Main Cafeteria</h4>
                <p className="text-gray-600">
                  All-you-can-eat dining with multiple stations
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  Student Center Food Court
                </h4>
                <p className="text-gray-600">
                  Pizza, sandwiches, and coffee
                </p>
              </div>
              <div>
                <h4 className="font-medium">Library Café</h4>
                <p className="text-gray-600">
                  Light snacks and beverages
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Study Spaces</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Library Study Rooms</h4>
                <p className="text-gray-600">
                  Bookable group and individual study rooms
                </p>
              </div>
              <div>
                <h4 className="font-medium">Student Center Lounge</h4>
                <p className="text-gray-600">
                  Casual study area with comfortable seating
                </p>
              </div>
              <div>
                <h4 className="font-medium">24/7 Study Hall</h4>
                <p className="text-gray-600">
                  Engineering Building, always open for students
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
