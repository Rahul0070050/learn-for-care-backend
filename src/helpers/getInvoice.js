import { stripeObj } from "../conf/stripe.js";

export function getInvoice(id) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id);
      const invoice = await stripeObj.invoices.retrieve(id);
      resolve(invoice);
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}

export function getAllInvoice(limit) {
  return new Promise(async (resolve, reject) => {
    try {
      const invoices = await stripeObj.invoices.list();
      resolve(invoices);
    } catch (error) {
      console.log(error);
      reject(error?.message);
    }
  });
}