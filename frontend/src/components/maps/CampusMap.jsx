import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";

export default function CampusMap() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const buildings = [
    {
      id: 1,
      name: "Library",
      type: "Academic",
      x: 30,
      y: 40,
      description: "Main campus library with study rooms",
    },
    {
      id: 2,
      name: "Student Center",
      type: "Student Life",
      x: 50,
      y: 30,
      description: "Food court, bookstore, and student services",
    },
    {
      id: 3,
      name: "Engineering Building",
      type: "Academic",
      x: 70,
      y: 50,
      description: "Computer labs and engineering classrooms",
    },
    {
      id: 4,
      name: "Science Hall",
      type: "Academic",
      x: 20,
      y: 60,
      description: "Chemistry and biology labs",
    },
    {
      id: 5,
      name: "Dormitory A",
      type: "Housing",
      x: 80,
      y: 20,
      description: "Freshman housing complex",
    },
    {
      id: 6,
      name: "Gymnasium",
      type: "Recreation",
      x: 60,
      y: 70,
      description: "Sports facilities and fitness center",
    },
    {
      id: 7,
      name: "Admin Building",
      type: "Administrative",
      x: 40,
      y: 20,
      description: "Registrar, financial aid, and administration",
    },
    {
      id: 8,
      name: "Cafeteria",
      type: "Dining",
      x: 25,
      y: 35,
      description: "Main dining hall",
    },
  ];

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBuildingColor = (type) => {
    const colors = {
      Academic: "bg-blue-500",
      "Student Life": "bg-green-500",
      Housing: "bg-purple-500",
      Recreation: "bg-orange-500",
      Administrative: "bg-red-500",
      Dining: "bg-yellow-500",
    };

    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin size={24} />
            Campus Map
          </h2>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {[
            "Academic",
            "Student Life",
            "Housing",
            "Recreation",
            "Administrative",
            "Dining",
          ].map((type) => (
            <div key={type} className="flex items-center gap-1 text-xs">
              <div
                className={`w-3 h-3 rounded-full ${getBuildingColor(type)}`}
              />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-green-50 h-96">
          <div className="absolute inset-4 bg-green-100 rounded-lg">
            {/* Pathways */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-300 -translate-x-1/2" />

            {/* Buildings */}
            {filteredBuildings.map((building) => (
              <div
                key={building.id}
                className={`absolute w-8 h-8 rounded-lg cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                  getBuildingColor(building.type)
                } ${
                  selectedBuilding?.id === building.id
                    ? "ring-4 ring-black"
                    : ""
                }`}
                style={{
                  left: `${building.x}%`,
                  top: `${building.y}%`,
                }}
                onClick={() => setSelectedBuilding(building)}
                title={building.name}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {building.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Building List */}
        <div className="w-80 border-l bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-3">Buildings</h3>

            <div className="space-y-2">
              {filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBuilding?.id === building.id
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedBuilding(building)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedBuilding?.id === building.id
                          ? "bg-white"
                          : getBuildingColor(building.type)
                      }`}
                    />
                    <span className="font-medium text-sm">
                      {building.name}
                    </span>
                  </div>

                  <div
                    className={`text-xs ${
                      selectedBuilding?.id === building.id
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {building.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Building Details */}
      {selectedBuilding && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-start gap-3">
            <div
              className={`w-6 h-6 rounded-lg ${getBuildingColor(
                selectedBuilding.type
              )} flex items-center justify-center text-white text-xs font-bold`}
            >
              {selectedBuilding.id}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold">
                {selectedBuilding.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selectedBuilding.type}
              </p>
              <p className="text-sm">
                {selectedBuilding.description}
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded-lg hover:opacity-90">
              <Navigation size={14} />
              Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const defaultIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// export default function CampusMap({
//   universityName = "Rai University",
//   centerLat = 22.816989,
//   centerLng = 72.473361,
//   buildings = [],
// }) {
//   const center = [Number(centerLat), Number(centerLng)];

//   return (
//     <div className="w-full h-[520px] rounded-xl overflow-hidden border bg-white">
//       <MapContainer
//         center={center}
//         zoom={17}
//         scrollWheelZoom
//         className="w-full h-full"
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* 🔴 University Marker */}
//         <Marker position={center} icon={defaultIcon}>
//           <Popup>
//             <div>
//               <h3 className="font-semibold">{universityName}</h3>
//               <p className="text-sm text-gray-600">
//                 Main Campus Location
//               </p>
//             </div>
//           </Popup>
//         </Marker>

//         {/* 🏢 Building Markers */}
//         {buildings.map((building) => (
//           <Marker
//             key={building.id}
//             position={[building.lat, building.lng]}
//             icon={defaultIcon}
//           >
//             <Popup>
//               <div>
//                 <h3 className="font-semibold">{building.name}</h3>
//                 <p className="text-sm text-gray-600">
//                   {building.description}
//                 </p>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }
