import { IAddress } from "./addressTypes";
import { IOrder } from "./orderTypes";

export interface IUserData {
  name: string;
  email: string;
  phone?: string;
  addresses?: IAddress[];
  orders: IOrder[];
  createdAt: Date;
}
