import React from 'react';


const Footer = () => {
    return (

       
        <footer className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto p-4">
          <hr className="border-gray-300 dark:border-gray-700 mb-8" />
          <p className="text-center text-gray-600">&copy;{new Date().getFullYear()} - E-commerce</p>
        </div>
      </footer>
       
   


    );


  };
  


export default Footer;