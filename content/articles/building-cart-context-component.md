---
title: Building a Cart Context Component
date: 2022-02-02
description: Creating a generic cart component that can add and remove a product from the cart using React Context. This component can then be used in any other component or app to create more specific cart components.
image: v1643820029/debbie.codes/blog/2022/cart-context_2x_qlqg5q
provider: cloudinary
tags: [React, all]
---

When I was first asked to create a [shopping cart component](https://bit-shoe-store.netlify.app/product/h-3) I found it really difficult to get my head round it especially when it came to breaking it down into smaller reusable components. I won't lie to you. I actually built it as one big component and then started separating it into smaller pieces. I think sometimes that is also ok to do. It's not always easy to build things individually or at least it does take a bit of practice.

In this article I will go through the process of building a cart context component as a generic component that can then be used by any other component so as to create a shoe cart component for a shoe store or a different type of cart component for a different type of store. In a future post I will show you how I then used this context to do that but for now let's concentrate on getting the generic context created.

![Cart Context Component](https://res.cloudinary.com/debsobrien/image/upload/v1643820029/debbie.codes/blog/2022/cart-context_2x_qlqg5q.png)

To start off with we need to think about what we are trying to create. We want to have a context component that is a generic cart context using generic products with functionality to add and remove a product from the cart. Sounds simple enough and that is exactly what we should build.

## Creating the Context

If we were to split these components by team ownership it would be the e-commerce team who would own and be responsible for building it. The first component we will build is the cart [context component](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~code/cart-context.tsx).

To build our context we start off with creating our types. We want to have an interface for the Cart base Item which will contain the id

```js
export interface CartItemBase {
  id: string;
}
```

The cart list item will extend the cart base item and will show the items in the cart as well as the quantity of items

```js
export type CartListItem<TItemType extends CartItemBase> = {
  /**
   * item in cart
   */
  item: TItemType;
  /**
   * quantity of item in cart
   */
  quantity: number;
};
```

And finally we create the cart Context Type which also extends the cart base item. This gives us the cart as well as the function to add products and the function to remove products. Every cart should have these types.

```js
export type CartContextType<TItemType extends CartItemBase> = {
  /**
   * items in cart
   */
  cart: CartListItem<TItemType>[];
  /**
   * adds products to cart
   */
  addProductToCart: (item: CartListItem<TItemType>) => void;
  /**
   * removes products from cart
   */
  removeProductFromCart: (item: TItemType) => void;
};
```

We can now go ahead and create a default context for our cart to show these cart items and add and remove functions.

```js
const defaultContext: CartContextType<any> = {
  cart: [],
  addProductToCart: () => {},
  removeProductFromCart: () => {}
}
```

And finally we create our CreateCartContext function that will create our context and pass in the default context.

```js
export function CreateCartContext<TItemType extends CartItemBase>() {
  return createContext<CartContextType<TItemType>>(defaultContext);
}
```

## Provider Component

We now need to create our [provider component](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~code/cart-context-provider.tsx). We start by creating our types for the Cart Context.

```js
export type CartContextProps<TItemType extends CartItemBase> = {
  context: React.Context<CartContextType<TItemType>>;
} & HTMLAttributes<HTMLDivElement>;
```

The provider component passes in children and context and uses useState to manage the state of the products or to know if there are any products in the store. Our function getProductsById checks to see if a product already exits in the cart. In this case we would want to update the quantity and not repeat the product.

Our addProductToCart function will use the getProductById function to see if the product already exists in the cart. If it does then we will update the quantity. If it doesn't then we will add the product to the cart.

The removeProductFromCart function filters the products by id and removes the product from the cart.

```js
export function CartContextProvider<TItemType extends CartItemBase>({
  children,
  context
}: CartContextProps<TItemType>) {
  const [products, setProducts] = useState<CartListItem<TItemType>[]>([]);

  const getProductById = (id: string): CartListItem<TItemType> | undefined => {
    return products.find((p) => p.item.id === id);
  };

  const addProductToCart = (product: CartListItem<TItemType>): void => {
    {
      const existingProduct = getProductById(product.item.id);
      let newState: CartListItem<TItemType>[] = [];
      if (existingProduct) {
        newState = products.map((p) => {
          if (p.item.id === existingProduct.item.id) {
            return {
              item: p.item,
              quantity: p.quantity + product.quantity
            };
          }
          return p;
        });
        setProducts(newState);
      }
      setProducts([...products, product]);
    }
  };
  const removeProductFromCart = (product: TItemType) => {
    const newProducts = products.filter((p) => p.item.id !== product.id);

    setProducts(newProducts);
  };

  const contextValue: CartContextType<TItemType> = {
    cart: products,
    addProductToCart: addProductToCart,
    removeProductFromCart: removeProductFromCart
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
}
```

## Displaying the Cart

We can now use our provider component to wrap our cart components so that anything inside the provider has access to the products in the cart. This means we could have the shopping cart itself as well as component in the header that shows the cart icon with a number beside it so you know how many items are in the cart. Because you want both of these components to have access to the state of the cart we would wrap them in the provider component.

We start of by creating the context with the type of Product which we have already created. Feel free to check out [the code for the product types](https://bit.dev/learn-bit-react/ecommerce/entity/product?version=1.0.7) yourself to see how it works but it is simply just types that every product should have such as an id, title, text, price, etc.

```js
const contextObject = CreateCartContext<Product>();
```

I am now going to create two mock components just so we cans see the cart works in isolation before actually using it inside your app or inside another component. This is our way of testing our component works and does exactly what we want it to do. We do this by using compositions which I am using Bit for however feel free to just create regular components inside your app to test it out.

The first mock component we need is the cart display component. This should use map over the context and print out the title and price of the product as well as add a button to remove the product from the cart. For this example we are not adding the image or anything else but just showing a basic example of how it works.

```js
const MockCartDisplay = () => {
  const context = useContext(contextObject)

  return (
    <div>
      <h2>Cart:</h2>
      {context.cart.map((cartItem, index) => {
        return (
          <div key={index}>
            <h2>{cartItem.item.title}</h2>
            <p> {cartItem.item.price}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded p-20"
              onClick={() => context.removeProductFromCart(cartItem.item)}
            >
              Remove from Cart
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

We then need a mock component that updates the context when we add a new product. We start by using the context and passing in the contextObject. We then create an item. We could have manually created a JSON with some data but instead we will get some products randomly from an API. This is one we have created previously and just gives us some mock data to use.

Our addProductToCart function uses the context addProductToCart function passing in the item that we get from our mock API as well as the quantity.

Finally we return a button component with an onClick function that calls the addProductToCart function.

```js
const MockUpdateContextComponent = () => {
  const context = useContext(contextObject)

  const item = Product.fromApiObject(
    mockProductFromApi[Math.floor(Math.random() * 9)]
  )

  function addProductToCart() {
    context.addProductToCart({ item, quantity: 1 })
  }

  return (
    <div>
      <button
        className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-20"
        onClick={() => addProductToCart()}
      >
        Add to Cart
      </button>
    </div>
  )
}
```

We can now create our component that is responsible for showing how the cart works. This component will show the cart display component as well as the button to add a product to the cart and both of these components as they need access to the cart context will be wrapped in the context provider. The context passed into the provider is the contextObject.

```js
export const BasicCartUsage = () => {
  return (
    <CartContextProvider<Product> context={contextObject}>
      <MockCartDisplay />
      <MockUpdateContextComponent />
    </CartContextProvider>
  );
};
```

This component now works as it should and can be used in your app by simply installing the component and passing in your own contextObject and creating your own cart display and update context button.

## Install and Use

To install the component and play around with it yourself you can use npm or yarn and install it in your React app like you would with any other package:

```bash
yarn add @learn-bit-react/ecommerce.ui.cart.cart-context
```

Then import it into the app and use it just like we did. You can add your own display components or copy the mock ones to see how it works and then modify it to how you like.

Check out a [simple example I have created here](https://github.com/debs-obrien/react-cart-context/blob/main/src/App.js) to see it in use in a React app.

### Example Usage

```js
import {
  CartContextProvider,
  CreateCartContext
} from '@learn-bit-react/ecommerce.ui.cart.cart-context'

const contextObject = CreateCartContext<Product>();

// create your mock components here like above

export MyCart(){
  return (
    <CartContextProvider<Product> context={contextObject}>
      <MockCartDisplay />
      <MockUpdateContextComponent />
    </CartContextProvider>
  );
};
```

## Useful Links

- [Context Component Code](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~code/cart-context.tsx)
- [Context Provider Code](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~code/cart-context-provider.tsx)
- [Cart Composition Code](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~code/cart-context.composition.tsx)
- [Cart Docs](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context)
- [Interactive Cart Composition](https://bit.dev/learn-bit-react/ecommerce/ui/cart/cart-context/~compositions)
- [Shoe Store using the Cart component](https://bit-shoe-store.netlify.app/product/h-3)
- [Simple example in React App](https://github.com/debs-obrien/react-cart-context/blob/main/src/App.js)
