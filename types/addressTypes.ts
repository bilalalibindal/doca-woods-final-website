export interface IOrderAddress {
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif: string;
  varsayilan: boolean;
}

export interface IAddress {
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif: string;
  varsayilan: boolean; // Varsayılan adres mi?
}
