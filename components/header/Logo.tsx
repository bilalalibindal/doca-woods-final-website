import Image from "next/image";
import Link from "next/link";
import { GiWoodCabin } from "react-icons/gi";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/logo.png" alt="Logo" width={86} height={86} />
    </Link>
  );
};

export default Logo;
