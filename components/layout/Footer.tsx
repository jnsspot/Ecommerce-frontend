import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">ShopNow</h3>
            <p className="text-sm">Your one-stop shop for everything you need. Fast shipping, easy returns.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">My Orders</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@shopnow.com" className="hover:text-white transition">support@shopnow.com</a></li>
              <li><span>Mon–Fri, 9am–6pm</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} ShopNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
