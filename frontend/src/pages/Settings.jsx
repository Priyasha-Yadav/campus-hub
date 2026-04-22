import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';

import { fetchUserSettings } from '../api/settings';

export default function Settings() {
  const [settings, setSettings] = useState({
    notificationPreferences: {
      messages: true,
      studyGroups: true,
      marketplace: true
    },
    privacySettings: {
      profileVisibility: 'everyone',
      showOnlineStatus: true,
      allowDirectMessages: true
    },
    paymentInfo: {
      upiId: '',
      upiQrUrl: ''
    }
  });
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const run = async () => {
      try {
        await loadSettings();
      } finally {
        clearTimeout(timeoutId);
      }
    };

    run();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetchUserSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon size={32} />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      {/* Content */}
      {loading ? (
        <div className="text-gray-500">Loading settings...</div>
      ) : (
        <ProfileSettings settings={settings} onSettingsUpdate={setSettings} />
      )}

    </div>
  );
}
