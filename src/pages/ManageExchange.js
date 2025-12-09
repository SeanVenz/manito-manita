import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, ArrowRight, UserPlus, Lock, Unlock, ChevronDown } from 'lucide-react';
import useRetrieveNameDetails from '../hooks/useRetrieveNameDetails';
import { addLateParticipant, swapManitos } from '../utils/actions';
import Loading from '../components/Loading';

function ManageExchange() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { names, isValid, isLoading } = useRetrieveNameDetails(linkId);

  const [isAdmin, setIsAdmin] = useState(false);
  const [lockedIds, setLockedIds] = useState([]);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const adminLinkId = localStorage.getItem('isAdmin');
    setIsAdmin(adminLinkId === linkId);

    // Load locked assignments from localStorage
    const savedLocked = localStorage.getItem(`locked_${linkId}`);
    if (savedLocked) {
      setLockedIds(JSON.parse(savedLocked));
    }
  }, [linkId]);

  // Save locked assignments to localStorage
  const toggleLocked = (id) => {
    const newLockedIds = lockedIds.includes(id)
      ? lockedIds.filter(lockedId => lockedId !== id)
      : [...lockedIds, id];

    setLockedIds(newLockedIds);
    localStorage.setItem(`locked_${linkId}`, JSON.stringify(newLockedIds));
  };

  // Find insertion point (first unlocked assignment)
  const findInsertionPoint = () => {
    return names.find(assignment => !lockedIds.includes(assignment.id));
  };

  // Handle adding new participant
  const handleAddParticipant = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const insertionPoint = findInsertionPoint();
    if (!insertionPoint) {
      return; // All locked - button should be disabled
    }

    const success = await addLateParticipant(linkId, trimmedName, insertionPoint.id, setIsAdding);
    if (success) {
      setNewName('');
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  // Handle manito swap
  const handleManitoChange = async (personId, newManitoName) => {
    if (isSwapping) return;
    await swapManitos(linkId, personId, newManitoName, names, setIsSwapping);
  };

  // Get all possible manitos (all names in the exchange)
  const getAllManitos = () => {
    return names.map(n => n.name);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Exchange Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-[#D2042D] hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only the link creator can manage this exchange.</p>
          <button
            onClick={() => navigate(`/${linkId}`)}
            className="text-[#D2042D] hover:underline"
          >
            Go to exchange
          </button>
        </div>
      </div>
    );
  }

  const insertionPoint = findInsertionPoint();
  const allLocked = !insertionPoint;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <Settings className="w-12 h-12 text-[#D2042D] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Manage Exchange</h1>
          <p className="text-gray-600">View assignments and add late participants</p>
        </div>

        {/* Current Assignments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Current Assignments ({names.length})
            </h2>
            <span className="text-sm text-gray-500">
              {lockedIds.length} locked
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Use the dropdown to swap manitos. Lock assignments where gifts have already been bought.
          </p>

          <div className="border border-gray-200 rounded-md overflow-hidden">
            {names.map((assignment) => {
              const isLocked = lockedIds.includes(assignment.id);
              const availableManitos = getAllManitos().filter(m => m !== assignment.name);

              return (
                <div
                  key={assignment.id}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                    isLocked ? 'bg-amber-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleLocked(assignment.id)}
                      className={`p-1 rounded transition-colors ${
                        isLocked
                          ? 'text-amber-600 hover:text-amber-700'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={isLocked ? 'Unlock assignment' : 'Lock assignment (gift bought)'}
                    >
                      {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    </button>
                    <span className="font-medium text-gray-700 min-w-[80px]">{assignment.name}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />

                    {/* Manito Dropdown */}
                    <div className="relative">
                      <select
                        value={assignment.manito}
                        onChange={(e) => handleManitoChange(assignment.id, e.target.value)}
                        disabled={isSwapping}
                        className={`appearance-none bg-white border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent cursor-pointer ${
                          isSwapping ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {availableManitos.map((manito) => (
                          <option key={manito} value={manito}>
                            {manito}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignment.isTaken && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Claimed
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        Gift Bought
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isSwapping && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              Swapping manitos...
            </div>
          )}
        </div>

        {/* Add Late Participant */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#D2042D]" />
            <h2 className="text-lg font-semibold text-gray-800">Add Late Participant</h2>
          </div>

          {allLocked ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">
                All assignments are locked. Unlock at least one assignment to add a new participant.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter participant's name"
                  className="flex-1 border border-gray-200 p-3 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent"
                  disabled={isAdding}
                />
                <button
                  onClick={handleAddParticipant}
                  disabled={!newName.trim() || isAdding}
                  className="bg-[#D2042D] text-white px-6 py-3 rounded-md hover:bg-[#B00424] transition-colors disabled:bg-gray-300 flex items-center gap-2"
                >
                  {isAdding ? 'Adding...' : 'Add'}
                </button>
              </div>

              {newName.trim() && insertionPoint && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Preview:</strong> {insertionPoint.name} → <strong>{newName.trim()}</strong> → {insertionPoint.manito}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {newName.trim()} will give a gift to {insertionPoint.manito}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(`/${linkId}`)}
            className="text-[#D2042D] hover:underline"
          >
            ← Back to exchange
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageExchange;
