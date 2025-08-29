import Link from "next/link";
import { GiWoodCabin } from "react-icons/gi";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center">
        <GiWoodCabin className="text-white text-2xl" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Doca Woods</h1>
        <p className="text-sm text-amber-600">El İşçiliği Ahşap Atölyesi</p>
      </div>
    </Link>
  );
};

export default Logo;
