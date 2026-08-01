import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  color,
  link,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={link}
        className="block bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40"
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={30} className="text-white" />
        </div>

        <h2 className="mt-5 text-xl font-bold">
          {title}
        </h2>

        <p className="text-gray-500 mt-2">
          {description}
        </p>
      </Link>
    </motion.div>
  );
}