export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} AI Powered Citizen Issue Reporter. All rights reserved.</p>
      </div>
    </footer>
  );
}
