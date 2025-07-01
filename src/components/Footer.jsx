import react from "react"

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm mt-6">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">

        {/* About */}
        <div className="col-span-2 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">About Us</h2>
          <p className="leading-relaxed">
            We are a leading eCommerce platform offering quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Men</a></li>
            <li><a href="#" className="hover:underline">Women</a></li>
            <li><a href="#" className="hover:underline">Electronics</a></li>
            <li><a href="#" className="hover:underline">Accessories</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 sm:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Subscribe</h2>
          <p className="mb-3">Get the latest updates and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded text-black flex-1"
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-red-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-red-700 text-center py-3 mt-4">
        © {new Date().getFullYear()} KHARIDAAR. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
