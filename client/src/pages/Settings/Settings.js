import React from "react";
import Sidebar from "../../components/Sidebar";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import PreferencesSection from "./PreferencesSection";
import DangerZone from "./DangerZone";

const Settings = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <Sidebar />
    <main className="flex-1 p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <ProfileSection />
      <PasswordSection />
      <PreferencesSection />
      <DangerZone />
    </main>
  </div>
);

export default Settings;
