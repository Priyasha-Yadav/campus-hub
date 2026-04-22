import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StudyGroupCard from '../components/studyGroups/StudyGroupCard';
import StudyGroupFilters from '../components/studyGroups/StudyGroupFilters';
import CreateGroupModal from '../components/studyGroups/CreateGroupModal';
import { studyGroupsApi } from '../api/studyGroups';
import { useAuthContext } from '../context/AuthContext';

export default function StudyGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [actionError, setActionError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    myGroups: false
  });
  const { user } = useAuthContext();

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    loadGroups();
  }, [filters, page]);

  const loadGroups = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;
      if (filters.myGroups) params.myGroups = 'true';
      
      const response = await studyGroupsApi.getStudyGroups({ ...params, page, limit: 12 });
      const payload = response.data?.data || {};
      setGroups(payload.groups || []);
      setMeta(payload.meta || null);
    } catch (error) {
      console.error('Error loading study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async ({ data, coverFile }) => {
    try {
      const response = await studyGroupsApi.createStudyGroup(data);
      const createdGroup = response.data?.data;
      if (coverFile && createdGroup?._id) {
        await studyGroupsApi.uploadCover(createdGroup._id, coverFile);
      }
      setShowCreateModal(false);
      setActionError('');
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const handleEditGroup = async ({ data, coverFile }) => {
    if (!editingGroup) return;
    try {
      await studyGroupsApi.updateStudyGroup(editingGroup._id, data);
      if (coverFile) {
        await studyGroupsApi.uploadCover(editingGroup._id, coverFile);
      }
      setEditingGroup(null);
      setActionError('');
      loadGroups();
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await studyGroupsApi.deleteStudyGroup(groupId);
      setActionError('');
      loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      setActionError(error.response?.data?.message || 'Failed to delete group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await studyGroupsApi.joinStudyGroup(groupId);
      setActionError('');
      // Navigate to the study group details page
      navigate(`/study-groups/${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
      setActionError(error.response?.data?.message || 'Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await studyGroupsApi.leaveStudyGroup(groupId);
      setActionError('');
      loadGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      setActionError(error.response?.data?.message || 'Failed to leave group');
    }
  };

  const isUserInGroup = (group) => {
    return user && group.members.some(member => member._id === user._id || member === user._id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus size={20} />
            Create Group
          </button>
        )}
      </div>

      <StudyGroupFilters filters={filters} onFiltersChange={setFilters} />
      {actionError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading study groups...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <StudyGroupCard
              key={group._id}
              group={group}
              currentUser={user}
              isJoined={isUserInGroup(group)}
              onEdit={() => setEditingGroup(group)}
              onDelete={() => handleDeleteGroup(group._id)}
              onJoin={handleJoinGroup}
              onLeave={handleLeaveGroup}
            />
          ))}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No study groups found</div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Create the first group
            </button>
          )}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
            disabled={page >= meta.totalPages}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />

      <CreateGroupModal
        isOpen={Boolean(editingGroup)}
        onClose={() => setEditingGroup(null)}
        onSubmit={handleEditGroup}
        initialData={editingGroup}
        submitLabel="Save Changes"
      />
    </div>
  );
}
