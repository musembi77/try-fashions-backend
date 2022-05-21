import { Product } from "./models/product.js";
import { Customer } from "./models/customer.js";
import { Order } from "./models/order.js";
import { Review } from "./models/review.js";
import { Transaction } from "./models/transaction.js";

const resolvers = {
  Query: {
    getProduct: async (parent, args, context, info) => {
      let product = await Product.findById(args.id);
      return product;
    },
    getProducts: async (parent, args, context, info) => {
      const { category, subCategory, limit, index, latest, recommended } = args;

      let _args = {};

      if (typeof category != "undefined") {
        _args.category = category;
      }
      if (typeof subCategory != "undefined") {
        _args.subCategory = subCategory;
      }

      if (typeof recommended !== "undefined") {
        let products = await Product.aggregate([
          { $sample: { size: limit || 3 } },
        ]);
        return products;
      } else {
        let products = await Product.find(_args)
          .limit(parseInt(limit))
          .sort({ createdAt: -1 })
          .skip(parseInt(index));

        return products;
      }
    },
    getCustomer: async (parent, args, context, info) => {
      const { id, email, password } = args;

      const _args = {};

      if (typeof id != "undefined") {
        _args._id = id;
      }
      if (typeof email != "undefined") {
        _args.email = email;
      }

      if (typeof password != "undefined") {
        _args.password = password;
      }

      let customer = await Customer.findOne(_args);

      return customer;
    },
    getProductCount: async (parent, { subCategory }) => {
      let _args = {};

      if (typeof subCategory != "undefined") {
        _args.subCategory = subCategory;
      }

      let count = await Product.countDocuments(_args);
      return count;
    },
    getCustomerCount: async () => {
      let count = await Customer.countDocuments();
      return count;
    },
    getOrdersCount: async () => {
      let count = await Order.countDocuments({ cancelled: false, paid: true });
      return count;
    },
    getSalesCount: async () => {
      let sales = await Order.find().populate("product");

      let earnings = 0;

      for (let i = 0; i < sales.length; i++) {
        console.log(sales[i]);

        if (sales[i].paid == true) {
          let order_price = sales[i].product.price * sales[i].quantity;
          earnings = earnings + order_price;
        }
      }
      return earnings;
    },
    getOrders: async () => {
      let orders = await Order.find();
      return orders;
    },
  },

  Product: {
    reviews: async (parent) => {
      let reviews = await Review.find({ product: parent.id });
      return reviews;
    },
    orders: async (parent) => {
      let orders = await Order.find({ product: parent.id, paid: true });
      return orders;
    },
    suggestions: async (parent) => {
      let suggestions = await Product.find({
        subCategory: parent.subCategory,
      });
      return suggestions;
    },
  },

  Review: {
    customer: async (parent) => {
      let customer = await Customer.findById(parent.customer);
      return customer;
    },
  },

  Order: {
    customer: async (parent) => {
      let customer = await Customer.findById(parent.customer);
      return customer;
    },
    product: async (parent) => {
      let product = await Product.findById(parent.product);
      return product;
    },
    transaction: async (parent) => {
      let transaction = await Transaction.findById(parent.transaction);
      return transaction;
    },
  },

  Customer: {
    basket: async (parent) => {
      let basket = await Order.find({
        customer: parent.id,
        transaction: null,
        cancelled: false,
        deliveryDate: null,
        paid: false,
      });
      return basket;
    },
    oldOrders: async (parent) => {
      let oldOrders = await Order.find({
        customer: parent.id,
        paid: true,
        cancelled: false,
      });

      return oldOrders;
    },
    reviews: async (parent) => {
      let reviews = await Review.find({
        customer: parent.id,
      });

      return reviews;
    },
  },

  Mutation: {
    addProduct: async (parent, args, context, id) => {
      const {
        name,
        price,
        colors,
        sizes,
        previousPrice,
        category,
        subCategory,
        photos,
        description,
      } = args;

      let newProduct = new Product({
        name,
        price,
        colors,
        sizes,
        category,
        subCategory,
        photos,
        description,
        previousPrice,
      });

      const product = await newProduct.save();
      return product;
    },
    deleteProduct: async (parent, args) => {
      const deletedproduct = await Order.findByIdAndDelete(args.id);
      return deletedproduct ;
    },
    addCustomer: async (parent, args, context, info) => {
      const { name, email, password, photoUrl, phoneNumber } = args;

      let newCustomer = new Customer({
        name,
        email,
        password,
        photoUrl,
        phoneNumber,
      });

      const customer = await newCustomer.save();
      return customer;
    },
    addOrder: async (parent, args, context, info) => {
      const { product, customer, size, quantity } = args;

      let newOrder = new Order({
        product,
        customer,
        size,
        quantity,
      });

      const order = await newOrder.save();
      return order;
    },
    addReview: async (parent, args, context, info) => {
      const { message, product, customer } = args;

      let newReview = new Review({
        message,
        product,
        customer,
      });

      const review = await newReview.save();
      return review;
    },
    incrementOrderCount: async (parent, args, { pubsub }, info) => {
      await Order.updateOne(
        { id: args.id },
        {
          $inc: {
            quantity: 1,
          },
        }
      );

      const order = await Order.findById(args.id);
      pubsub.publish("INCREMENT_ORDER_Q", { orderIncremented: order });
      return order;
    },
    decrementOrderCount: async (parent, args, context, info) => {
      await Order.updateOne(
        { id: args.id },
        {
          $inc: {
            quantity: -1,
          },
        }
      );
      const order = await Order.findById(args.id);
      return order;
    },
    removeFromCart: async (parent, args) => {
      const x = await Order.findByIdAndDelete(args.id);
      return x;
    },
    checkOrders: async (parent, args, context, info) => {
      await Order.updateMany(
        {
          _id: {
            $in: args.ids,
          },
        },
        {
          paid: true,
        }
      );
      const checkedOrders = await Order.find({
        _id: { $in: args.ids },
      });
      return checkedOrders;
    },
  },

  Subscription: {
    orderIncremented: {
      subscribe: (root, args, { pubsub }, info) =>
        pubsub.subscribe("INCREMENT_ORDER_Q"),
      resolve: (payload) => {
        return payload.orderIncremented;
      },
    },
  },
};

export default resolvers;
