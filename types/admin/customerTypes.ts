import { IAddress } from "../addressTypes";
import { IOrder } from "../orderTypes";

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: IAddress[];
  orders: IOrder[];
  createdAt: Date;
}
