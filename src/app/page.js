import HeroSection from "@/Components/banner";
import CategoriesSection from "@/Components/categories";
import CategoryWiseProduct from "@/Components/categoriesWise";
import ProductsLike from "@/Components/productLike";
import RoleWiseProduct from "@/Components/roleWise";
import HowItWorks from "@/Components/workStep";
import React from "react";

const Home = () => {
  return (
    <>
      <div>
        <HeroSection />
      </div>
      <div className="my-5">
        <ProductsLike />
      </div>
      <div className="my-5">
        <CategoryWiseProduct categoryName={'Vegetables'} />
      </div>
      <div className="my-5">
        <RoleWiseProduct roleName={'admin'} />
      </div>
      <div className="my-5">
        <CategoryWiseProduct categoryName={'Fruits'} />
      </div>
      <div className="my-5">
        <RoleWiseProduct roleName={'apmcConnect'} />
      </div>
      <div className="my-5">
        <CategoryWiseProduct categoryName={'Groceries'} />
      </div>
      <div className="my-5">
        <RoleWiseProduct roleName={'fpoConnect'} />
      </div>
      <div className="my-5">
        <HowItWorks />
      </div>
      <div className="">
        <CategoriesSection />
      </div>
    </>
  );
};
export default Home;
