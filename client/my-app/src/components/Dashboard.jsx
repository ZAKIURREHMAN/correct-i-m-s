// import React from "react";
// import useOrganizations from "../hooks/useOrganizations";
// import useOrders from "../hooks/useOrders";
// import useCustomers from "../hooks/useCustomers";
// import useAllProducts from "../hooks/useAllProducts";
// import banner from "../assets/banner.jpeg";
// import Navbar from "../components/Navbar";
// import { useQuery } from "@tanstack/react-query";

// export default function Dashboard() {

//     const { getOrganizations } = useOrganizations();

//  const {
//     data: companies = [],
//   } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: getOrganizations,
//   });  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } = useOrders();
//   const { data: customers = [], isLoading: customersLoading, isError: customersError } = useCustomers();
//   const { data: products = [], isLoading: productsLoading, isError: productsError } = useAllProducts();
//   const totalCompanies = companies.length;
//   const totalCustomers = customers.length;
//   const totalProducts = products.length;
//   const totalSales = orders.reduce((sum, o) => sum + (Number(o?.totalPrice) || 0), 0);

//   return (
//     <div className=" w-full " >
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 space-y-8">
//         {/* 🔥 Improved Banner */}
//         <div className="relative rounded-3xl overflow-hidden shadow-xl">
//           <img
//             src={banner}
//             alt="Dashboard Banner"
//             className="w-full h-100 bg-object "
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
//           <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white">
//             <h1 className="text-3xl font-bold tracking-wide">
//               Welcome Back, Admin 👋
//             </h1>
//             <p className="mt-2 text-white/80 text-sm md:text-base">
//               Here is a quick overview of your business performance.
//             </p>
//           </div>
//         </div>

//         {/* 🔥 Modern Stat Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard label="Total Companies" value={totalCompanies} />
//           <StatCard label="Total Sales" value={formatCurrency(totalSales)} />
//           <StatCard label="Total Products" value={totalProducts} />
//           <StatCard label="Total Customers" value={totalCustomers} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
//       <div className="text-gray-500 text-sm font-medium">{label}</div>
//       <div className="mt-3 text-3xl font-bold text-gray-800">{value}</div>

//       {/* Decorative line */}
//       <div className="mt-4 h-1 w-12 bg-blue-500 rounded-full" />
//     </div>
//   );
// }

// function formatCurrency(amount) {
//   try {
//     return new Intl.NumberFormat(undefined, {
//       style: "currency",
//       currency: "PKR",
//     }).format(amount || 0);
//   } catch {
//     return `{(amount || 0).toFixed(2)}`;
//   }
// }import React from "react";
import React from "react";
import useOrganizations from "../hooks/useOrganizations";
import useOrders from "../hooks/useOrders";
import useCustomers from "../hooks/useCustomers";
import useAllProducts from "../hooks/useAllProducts";
import banner from "../assets/banner.jpeg";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { getOrganizations } = useOrganizations();

  const {
    data: companies = [],
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
  
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } = useOrders();
  const { data: customers = [], isLoading: customersLoading, isError: customersError } = useCustomers();
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useAllProducts();
  
  const totalCompanies = companies.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalSales = orders.reduce((sum, o) => sum + (Number(o?.totalPrice) || 0), 0);

  const stats = [
    {
      label: "Total Companies",
      value: totalCompanies,
      emoji: "🏢",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      label: "Total Sales",
      value: formatCurrency(totalSales),
      emoji: "💰",
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      label: "Total Products",
      value: totalProducts,
      emoji: "📦",
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      label: "Total Customers",
      value: totalCustomers,
      emoji: "👥",
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600"
    }
  ];

  return (
    <div className="w-full bg-gray-50">
      <Navbar />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative min-h-screen p-6 md:p-8 space-y-8">
         {/* <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay z-10 animate-pulse" />
          
          <img
            src={banner}
            alt="Dashboard Banner"
            className="w-full h-[280px] md:h-[320px] object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className=" h-[500px] " >

          </div>
          
           <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-10" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 z-10" />
          
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl animate-spin-slow">✨</span>
              <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">Dashboard Overview</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome Back,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Admin
              </span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl max-w-xl flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Here's a quick overview of your business performance
            </p>
            
             <div className="mt-6 flex gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-white text-sm">Today's Summary</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-white text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div> */}


          <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-12 px-6 rounded-2xl shadow-2xl">
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Pak Solar Traders
          </h1>
          
          <p className="text-lg md:text-xl font-medium mb-6 text-indigo-100">
            We Deal All Kinds of Single Phase Hybrid Inverters & 3 Phase VFD
          </p>
        </div>

        {/* Right Side */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-pink-200">
            Visit Our Shop
          </h3>

          <p className="text-lg leading-relaxed text-indigo-100">
            📍 Shop No. 13-A, Ground Floor Harmain Center, 
            <br />
            16-Hall Road, Lahore.
          </p>

          <button className="mt-6 bg-pink-500 hover:bg-pink-600 transition duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-lg">
            Contact Now
          </button>
        </div>

      </div>
    </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              emoji={stat.emoji}
              gradient={stat.gradient}
              bgLight={stat.bgLight}
              textColor={stat.textColor}
              index={index}
            />
          ))}
        </div>

        {/* Quick Actions or Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <ActivityItem title="New order received" time="2 minutes ago" emoji="🛒" />
              <ActivityItem title="Product inventory updated" time="1 hour ago" emoji="📊" />
              <ActivityItem title="New customer registered" time="3 hours ago" emoji="👤" />
              <ActivityItem title="Monthly report generated" time="5 hours ago" emoji="📑" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <MetricBar label="Conversion Rate" percentage={68} emoji="🎯" />
              <MetricBar label="Customer Satisfaction" percentage={92} emoji="⭐" />
              <MetricBar label="Order Fulfillment" percentage={87} emoji="✅" />
              <MetricBar label="Revenue Growth" percentage={45} emoji="📈" />
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, emoji, gradient, bgLight, textColor, index }) {
  const [revealed, setRevealed] = React.useState(false);
  const toggle = () => setRevealed((v) => !v);

  return (
    <div 
      className="group relative transform hover:-translate-y-2 transition-all duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      {/* Main card */}
      <div className={`relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:border-white/80 transition-all duration-500 overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(59,130,246,0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bgLight} group-hover:scale-110 transition-transform duration-300`}>
              <span className={`text-2xl ${textColor}`}>{emoji}</span>
            </div>
            
            {/* Animated ring */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider">
              {label}
            </p>
            <button
              type="button"
              onClick={toggle}
              className="text-3xl font-bold text-gray-800 group-hover:scale-105 origin-left transition-transform focus:outline-none"
              aria-pressed={revealed}
              aria-label={`${revealed ? 'Hide' : 'Reveal'} ${label}`}
              title={revealed ? 'Click to hide' : 'Click to reveal'}
            >
              {revealed ? (
                <span>{value}</span>
              ) : (
                <span className="select-none tracking-widest align-middle">
                  •••
                </span>
              )}
            </button>
            {!revealed && (
              <p className="text-xs text-gray-400">Click to reveal</p>
            )}
          </div>
          
          {/* Decorative progress bar */}
          <div className="mt-6 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full w-2/3 bg-gradient-to-r ${gradient} rounded-full animate-pulse`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, emoji }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
      <div className="flex items-center gap-3">
        <span className="text-xl group-hover:scale-110 transition-transform">{emoji}</span>
        <span className="text-gray-700 font-medium">{title}</span>
      </div>
      <span className="text-gray-500 text-sm">{time}</span>
    </div>
  );
}

function MetricBar({ label, percentage, emoji }) {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-base group-hover:scale-110 transition-transform">{emoji}</span>
          <span className="text-gray-600">{label}</span>
        </div>
        <span className="font-semibold text-gray-800">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "PKR",
    }).format(amount || 0);
  } catch {
    return `Rs. ${(amount || 0).toFixed(2)}`;
  }
}