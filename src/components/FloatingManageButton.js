import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

function FloatingManageButton() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [linkId, setLinkId] = useState(null);

  useEffect(() => {
    // Extract linkId from path (e.g., /abc123 or /abc123/wishlist)
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentLinkId = pathParts[0];

    // Check if we're on a page with a linkId
    if (currentLinkId && currentLinkId !== 'sean') {
      setLinkId(currentLinkId);

      // Check if user is admin of this link
      const adminLinkId = localStorage.getItem('isAdmin');
      setIsAdmin(adminLinkId === currentLinkId);
    } else {
      setLinkId(null);
      setIsAdmin(false);
    }
  }, [location.pathname]);

  // Don't show on homepage, manage page, or analytics
  const isHomePage = location.pathname === '/';
  const isManagePage = location.pathname.endsWith('/manage');
  const isAnalyticsPage = location.pathname.includes('/sean/analytics');

  if (isHomePage || isManagePage || isAnalyticsPage || !isAdmin || !linkId) {
    return null;
  }

  return (
    <Link
      to={`/${linkId}/manage`}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#D2042D] text-white rounded-full shadow-lg hover:bg-[#B00424] hover:scale-110 transition-all duration-200 group"
      title="Manage Exchange"
    >
      <Settings className="w-6 h-6" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Manage
      </span>
    </Link>
  );
}

export default FloatingManageButton;
