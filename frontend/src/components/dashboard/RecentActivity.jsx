export default function RecentActivity() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-sm text-gray-500 hover:underline">
          View all →
        </button>
      </div>

      <div className="rounded-xl border bg-white divide-y">
        <div className="p-4">
          <p className="font-medium">
            New textbook listed: Calculus 101
          </p>
          <p className="text-sm text-gray-500">2 min ago</p>
        </div>

        <div className="p-4">
          <p className="font-medium">
            Study group session starting soon
          </p>
          <p className="text-sm text-gray-500">10 min ago</p>
        </div>
      </div>
    </div>
  );
}
