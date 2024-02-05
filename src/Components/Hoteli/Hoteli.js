import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { MyContext } from "../context/loginregister.js";
import Cards from "./Cards";
import "./Gallery.css";
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import HotelData from "./GalleryData";
import { useNavigate } from "react-router-dom";

const Hoteli = () => {
  const { setSelectedHotel, role, setRole } = useContext(MyContext);
  const [hotelDataFromDatabase, setHotelDataFromDatabase] = useState([]);
  const navigate = useNavigate();
  
 

  const fetchAllHotelDataFromDatabase = async () => {
    try {
      //const response = await axios.get('https://localhost:7137/api/Hotel');
      const response = await axios.get("http://aplikacijahost-001-site1.ltempurl.com/api/Hotel");
      setHotelDataFromDatabase(response.data);
    } catch (error) {
      console.error("Greška pri dohvatanju podataka iz baze:", error);
      console.log(error.response);
    } 
  };

  useEffect(() => {
    fetchAllHotelDataFromDatabase();
  }, []);  

  const handleDodajHotelClick = () => {
    
    navigate("/DodajHotel");
  };

  return (
    <>
      <HeadTitle />
      {role === "Administrator" && (
            <div className="center">
              <button className="dodajHotelButton" onClick={handleDodajHotelClick}>
                Dodaj Hotel
              </button>
            </div>
          )}
      <section className="gallery top">
        <div className="container grid">
          {hotelDataFromDatabase.map((hotelFromDatabase) => {
            return (
              <div key={hotelFromDatabase.id}>
                <div
                  onClick={(event) => {
                    setSelectedHotel({
                      id: hotelFromDatabase.id,
                      naziv: hotelFromDatabase.naziv,
                      image: hotelFromDatabase.slika,
                      zemlja: hotelFromDatabase.zemlja,
                      cena: hotelFromDatabase.cenaJednosobneSobe,
                      telefon: hotelFromDatabase.telefon,
                      aerodromi: hotelFromDatabase.aerodromi,
                      prijava: hotelFromDatabase.prijava,
                      odjava: hotelFromDatabase.odjava,
                      politika: hotelFromDatabase.politika,
                      parking: hotelFromDatabase.parking,
                      pogodnosti: hotelFromDatabase.pogodnosti,
                    });

                    // Dodat uslov da se ne preusmeri ako je kliknuto na dugme
                    if (!(event.target.tagName === "BUTTON" || event.target.tagName === "INPUT")) {
                      navigate(`/HotelStranica`);
                    }
                  }}
                >
                  <Cards
                    id={hotelFromDatabase.id}
                    image={hotelFromDatabase.slika}
                    naziv={hotelFromDatabase.naziv}
                    adminButtons={role === "Administrator"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Hoteli;
