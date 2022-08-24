import { createContext, useCallback, useContext, useState } from "react";

const ProductContext = createContext({
  getCategories: () => {},
  getProducts: () => {},
  categories: [],
  products: [],
  isLoading: false,
});

const useProductContext = () => useContext(ProductContext);

const apiURL = "https://fakestoreapi.com";

const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = useCallback(async (category) => {
    setIsLoading(true);
    let productsUrl = `${apiURL}/products`;

    if(category) {
      productsUrl = `${apiURL}/products/category/${category}`;
    }
    try {
      const p = await fetch(productsUrl);
      const fetchedProducts = await p.json();

      //because it's PoC we added merchantId syntheticly
      const productsWithMerchants = fetchedProducts.map((p) => ({
        ...p,
        merchantId: Math.ceil(Math.random() * 10),
      }));

      console.log(productsWithMerchants);
      setProducts(productsWithMerchants);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }, []);

  const getCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await fetch(`${apiURL}/products/categories`);
      const categoriesPayload = await p.json();
      setCategories(categoriesPayload);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }, []);
  return (
    <ProductContext.Provider
      value={{ getCategories, getProducts, categories, products, isLoading }}
      children={children}
    />
  );
};

export { useProductContext as default, ProductProvider };
