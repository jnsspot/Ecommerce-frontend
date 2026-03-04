import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Shop Everything<br />You Love
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-xl">
            Discover thousands of products at unbeatable prices. Free shipping on orders over $50.
          </p>
          <div className="flex gap-4">
            <Link
              href="/products"
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition flex items-center gap-2"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <Truck size={32} className="text-indigo-600 mx-auto mb-3" />, title: 'Free Shipping', desc: 'On all orders over $50' },
            { icon: <RefreshCw size={32} className="text-indigo-600 mx-auto mb-3" />, title: 'Easy Returns', desc: '30-day hassle-free returns' },
            { icon: <ShieldCheck size={32} className="text-indigo-600 mx-auto mb-3" />, title: 'Secure Payments', desc: 'Protected by Stripe & SSL' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm">
              {f.icon}
              <h3 className="font-semibold text-gray-900 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start shopping?</h2>
          <p className="text-gray-600 mb-8">Browse our full catalog and find exactly what you need.</p>
          <Link
            href="/products"
            className="bg-indigo-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-indigo-700 transition inline-flex items-center gap-2"
          >
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
