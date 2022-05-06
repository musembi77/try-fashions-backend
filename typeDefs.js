const typeDefs = `
type Product {
    id: ID!
    name: String!
    price: Int!
    colors:[String]
    sizes:[String]
    previousPrice: Int
    showPreviousPrice:Boolean
    category:String!
    subCategory: String!
    deleted: Boolean
    createdAt: String
    photos:[String]
    description: String

    reviews: [Review]
    orders: [Order]    
    suggestions: [Product]
}

type Order {
    id: ID!
    customer: Customer
    product: Product
    quantity: Int
    size: String
    createdAt: String
    deliveryDate: String
    paid: Boolean
    cancelled: Boolean
    transaction: Transaction
}

type Customer {
    id: ID!
    name: String!
    email: String
    phoneNumber: String
    password: String
    photoUrl: String
    recentSearches: [String]

    basket: [Order]
    oldOrders:[Order]
    reviews: [Review]  
}

type Transaction {
    id: ID!
    order : ID!
    paymentAmount: Int!
    paymentMode: String
    createdAt: String
    senderRef: String
}

type Review {
    message: String
    id:ID!
    product: ID!
    customer: Customer!
    createdAt: String
}

type Query {
    getProduct(id:ID!) : Product
    getProducts(
        category: String
        subCategory: String   
        limit:Int
        index:Int
        latest: Boolean
        recommended: Boolean     
    ): [Product]
    getCustomer(
        id: ID
        email:String
        password: String
    ): Customer
    getProductCount(
        subCategory: String
    ): Int
    getCustomerCount: Int
    getSalesCount: Int
    getOrdersCount: Int
    getOrders: [Order]
}

type Mutation{
    addProduct(
        name:String
        price: Int
        previousPrice: Int
        category: String
        subCategory: String
        colors:[String]
        sizes:[String]
        photos: [String]
        description: String
    ):Product
    addCustomer(
        name: String
        email: String
        password: String
        photoUrl: String
        phoneNumber: String
    ):Customer
    addOrder(
        product:ID!
        customer:ID!
        size: String        
    ): Order
    addReview(
        message: String
        customer: ID!
        product:ID!
    ): Review
    incrementOrderCount(
        id:ID!
    ): Order
    decrementOrderCount(
        id:ID!
    ): Order
    removeFromCart(
        id: ID!
    ): Order
    checkOrders(
        ids:[ID!]
    ): [Order]
}

type Subscription{
    orderIncremented: Order
}
`;

export default typeDefs;
