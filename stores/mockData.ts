import { IAddress } from "@/types/addressTypes";
import { ICategory } from "@/types/categoryTypes";
import { IProduct as UIProduct } from "@/types/productTypes";
import { IUserData } from "@/types/userTypes";

export const mockProducts: UIProduct[] = [
  {
    id: "68af08fb5b17e0ea3faf0699",
    name: "Dünya Haritası Tablo",
    description:
      "Lazer kesim, 3D ahşap dünya haritası duvar dekoru. Ev ve ofisler için modern bir dokunuş.",
    category: {
      id: "68aedf5d3e88495305f7f5c2",
      name: "Tablo",
    },
    images: [
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756301544/w9bgkvoelibrzc409yhv.jpg",
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756301548/fyiz2daiwgu4zjesxx3d.jpg",
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756301552/skbh1mtcy0y2vvvufgzq.jpg",
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756301558/ucn9dr1iud7uoqf4aqe2.jpg",
    ],
    price: 3500,
    inStock: true,
    stockCount: 200,
    material: "Huş Kontrplak",
    color: "Ceviz",
    size: {
      width: 50,
      height: 40,
      depth: 5,
    },
    // weight alanı boş olduğu için eklenmedi (opsiyonel)
    sku: "TAB-1",
  },
  {
    id: "68af1716ec5d1307b2638d2b",
    name: "Epoksi Sehpa",
    description:
      "Zeytin ağacından, metal ayaklı ve okyanus mavisi epoksi ile tasarlanmış el yapımı orta sehpa.",
    category: {
      id: "68af0a335b17e0ea3faf06bd",
      name: "Sehpa",
    },
    images: [
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756305164/jgmcc4s5bhdssd0rl7wb.jpg",
    ],
    price: 7500,
    inStock: true,
    stockCount: 1,
    material: "Zeytin Ağacı, Epoksi",
    color: "Mavi ve Doğal Ahşap",
    size: {
      width: 60,
      height: 60,
      depth: 5,
    },
    weight: {
      value: 50,
      unit: "kg",
    },
    sku: "EPDC202501",
  },
  {
    id: "68b04822a7a7a29da0c5f0f4",
    name: "Kişiye Özel Ahşap Tabela",
    description:
      "İstediğiniz yazı veya logo ile kişiye özel olarak hazırlanan, dış mekan uyumlu ahşap tabela.",
    category: {
      id: "68b0465ba7a7a29da0c5f0dc",
      name: "Tabela",
    },
    images: [
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756383261/xtlluf9mgcx8nau6szq6.jpg",
    ],
    price: 980, // Fiyatı daha makul bir değere çektim
    inStock: true,
    stockCount: 18,
    material: "Meşe Ağacı",
    color: "Açık Kahverengi",
    size: {
      width: 180,
      height: 90,
      depth: 20,
    },
    weight: {
      value: 15,
      unit: "kg",
    },
    sku: "TABL-1",
  },
  {
    id: "68c12345a7a7a29da0c5f123", // Yeni eklenen örnek ürün
    name: "Ahşap Servis Tepsisi",
    description:
      "Doğal ceviz ağacından yapılmış, özel sunumlar için el yapımı servis tepsisi. Gıda ile temasa uygundur.",
    category: {
      id: "68c12345a7a7a29da0c5f456",
      name: "Mutfak Gereçleri",
    },
    images: [
      // Bu resim linkleri örnektir, kendi resimlerinizle değiştirebilirsiniz.
      "https://res.cloudinary.com/dwahclxhr/image/upload/v1756301552/skbh1mtcy0y2vvvufgzq.jpg",
    ],
    price: 450,
    inStock: false, // Stokta olmayan bir ürün örneği
    stockCount: 0,
    material: "Ceviz Ağacı",
    color: "Koyu Kahverengi",
    size: {
      width: 40,
      height: 25,
      depth: 2,
    },
    weight: {
      value: 1.5,
      unit: "kg",
    },
    sku: "SVTP-01",
  },
];

export const mockUser: IUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  addresses: [],
  orders: [],
  createdAt: new Date(),
};

export const mockAddresses: IAddress[] = [
  {
    addressTitle: "Ev Adresi",
    ulke: "Türkiye",
    sehir: "İstanbul",
    mahalle: "Beşiktaş",
    sokak: "Atatürk Caddesi",
    no: "123",
    postaKodu: "34000",
    tarif: "Ev Adresi",
    varsayilan: true,
  },
];

export const mockCategories: ICategory[] = [
  { id: "68aedf5d3e88495305f7f5c2", name: "Tablo" },
  { id: "68af0a335b17e0ea3faf06bd", name: "Sehpa" },
  { id: "68b0465ba7a7a29da0c5f0dc", name: "Tabela" },
  { id: "68c12345a7a7a29da0c5f456", name: "Mutfak Gereçleri" },
];
