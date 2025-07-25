import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from "react-hot-toast";
import Fuse from 'fuse.js';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [IsSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [cartItems, setCartItems] = useState({});

  // Fetch dummy products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  };

  // Add item to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success('Added to Cart');
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove products from Cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    toast.success("Removed from Cart");
    setCartItems(cartData);
  };

  // Fuzzy Search Handler
  const handleSearchQuery = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const fuse = new Fuse(products, {
      keys: ['name', 'description'],
      threshold: 0.3,
    });

    const results = fuse.search(query).map(result => result.item);
    setFilteredProducts(results);
  };

  // get cart item count

  const getCartCount = () =>{
    let totalCount = 0
    for(const item in cartItems){
      totalCount += cartItems[item]
    }

    return totalCount
  }

  // get cart total amount
  const getCartAmount = () =>{
    let totalAmount = 0
    for( const items in cartItems){
      let itemInfo = products.find((product)=>product._id == items)
      if(cartItems[items]>0){
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }

    return Math.floor(totalAmount * 100)/100
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    IsSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    filteredProducts,
    handleSearchQuery,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    getCartAmount,
    getCartCount

  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };
export const useAppContext = () => useContext(AppContext);
