import React from "react";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black transition-colors duration-500">
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
      {children}
    </main>
    <footer className="text-center text-gray-500 py-4 dark:text-gray-300">
      © {new Date().getFullYear()} Excel Analytics Platform
    </footer>
  </div>
);

export default Layout;