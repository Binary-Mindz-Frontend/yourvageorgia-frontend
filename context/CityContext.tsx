"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type City = "dubai" | "london";

interface CityContextType {
  city: City;
  setCity: (city: City) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [city, setCityState] = useState<City>("dubai");

  // Load from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity") as City;
    if (savedCity && (savedCity === "dubai" || savedCity === "london")) {
      setCityState(savedCity);
    }
  }, []);

  const setCity = (newCity: City) => {
    setCityState(newCity);
    localStorage.setItem("selectedCity", newCity);
  };

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
