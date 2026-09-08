export default function Footer() {
  return (
    <div>
      <hr className="my-4 w-full border-t border-slate-300" />
      <div className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-bold">Product</p>
          <ul className="space-y-2 py-2 text-sm text-slate-600">
            <li>Pricing</li>
            <li>Solutions</li>
          </ul>
        </div>
        <div>
          <p className="font-bold">About Us</p>
          <ul className="space-y-2 py-2 text-sm text-slate-600">
            <li>About</li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Help and support</p>
          <ul className="space-y-2 py-2 text-sm text-slate-600">
            <li>Help center</li>
            <li>Contact</li>
            <li>Privacy &amp; Terms</li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Community</p>
          <ul className="space-y-2 py-2 text-sm text-slate-600">
            <li>Agencies</li>
          </ul>
        </div>
      </div>
      <hr className="my-4 w-full border-t border-slate-300" />
      <p className="px-2 text-sm">© 2026 Wasel. All rights reserved.</p>
    </div>
  );
}
