export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5 text-center">
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Taj Khunkhun. All rights reserved.
      </p>
    </footer>
  );
}
