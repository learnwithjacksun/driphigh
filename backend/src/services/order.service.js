import OrderModel from "../model/orders.js";


export const createOrder = async (orderData) => {
        const order = await OrderModel.create(orderData);
        return order
}