export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5 text-center">
      <p className="text-sm text-gray-600 font-mono">
        &copy; {new Date().getFullYear()} Taj Khunkhun
      </p>
    </footer>
  );
}
