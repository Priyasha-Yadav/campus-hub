import { Search, Filter } from 'lucide-react';

export default function StudyGroupFilters({ filters, onFiltersChange }) {
  const subjects = [
    'Computer Science',
    'Mathematics', 
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Other'
  ];

  return (
    <div className="bg-white rounded-xl border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search study groups..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <select
          value={filters.subject}
          onChange={(e) => onFiltersChange({ ...filters, subject: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-black"
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={filters.myGroups}
            onChange={(e) => onFiltersChange({ ...filters, myGroups: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">My Groups</span>
        </label>
      </div>
    </div>
  );
}