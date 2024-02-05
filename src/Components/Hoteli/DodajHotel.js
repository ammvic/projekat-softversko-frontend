import React, { useState } from "react";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import axios from "axios";
import "./dodajhotel.css";

const DodajHotel = () => {
  const [publicId, setPublicId] = useState("");
  const [Slika, setImage] = useState("");
  const [Naziv, setNaziv] = useState("");
  const [Zemlja, setZemlja] = useState("");
  const [Adresa, setAdresa] = useState("");
  const [Telefon, setTelefon] = useState("");
  const [Aerodromi, setAerodromi] = useState("");
  const [Prijava, setPrijava] = useState("");
  const [Odjava, setOdjava] = useState("");
  const [Politika, setPolitika] = useState("");
  const [Parking, setParking] = useState("");
  const [Pogodnosti, setPogodnosti] = useState("");
  const [Zvezdice, setZvezdice] = useState("");
  const [sobe, setSobe] = useState([{ id: 0, tipSobe: "", cenaPoNoci: 0, brojSoba: 0 }]);
  const [hotelAdded, setHotelAdded] = useState(false);

  const handleDodajHotel = async () => {
    try {
      const sobeDTO = sobe.map((soba) => ({
        id: soba.id,
        tipSobe: soba.tipSobe,
        cenaPoNoci: Number(soba.cenaPoNoci),
        brojSoba: Number(soba.brojSoba),
      }));

      const requestData = {
        slika: Slika,
        naziv: Naziv,
        zemlja: Zemlja,
        adresa: Adresa,
        telefon: Telefon,
        aerodromi: Aerodromi,
        prijava: Prijava,
        odjava: Odjava,
        politika: Politika,
        parking: Parking,
        pogodnosti: Pogodnosti,
        zvezdice: Zvezdice,
        sobe: sobeDTO,
      };

      console.log("Request Data:", requestData);

      //const response = await axios.post("https://localhost:7137/api/Hotel/createWithRooms", requestData);
      const response = await axios.post("http://aplikacijahost-001-site1.ltempurl.com/api/Hotel/createWithRooms", requestData);

      if (!Naziv || !Zemlja || !Adresa || !Telefon || !Aerodromi || !Prijava || !Odjava || !Politika || !Parking || !Pogodnosti || !Zvezdice || sobe.length === 0) {
        console.error("Molimo Vas popunite sva obavezna polja.");
        return;
      }

      console.log("Hotel successfully added:", response.data);
      setHotelAdded(true);

      // Resetovanje polja nakon dodavanja hotela
      setNaziv("");
      setZemlja("");
      setAdresa("");
      setTelefon("");
      setAerodromi("");
      setPrijava("");
      setOdjava("");
      setPolitika("");
      setParking("");
      setPogodnosti("");
      setZvezdice("");
      setSobe([{ id: 0, tipSobe: "", cenaPoNoci: 0, brojSoba: 0 }]);
      setPublicId("");
      setImage("");
    } catch (error) {
      console.error("Error adding hotel:", error);
      console.log("Server error details:", error.response.data);
      console.log("Server validation errors:", error.response.data.errors);
    }
  };

  const dodajNovuSobu = () => {
    setSobe([...sobe, { id: 0, tipSobe: "", cenaPoNoci: 0, brojSoba: 0 }]);
  };

  const azurirajInformacijeOSobi = (index, fieldName, value) => {
    const noveInformacije = [...sobe];
    noveInformacije[index][fieldName] = value;
    setSobe(noveInformacije);
  };

  return (
    <div>
      <div className="kartice-container">
        <div className="kartica1">
        <h2>Informacije o hotelu</h2>

        <CloudinaryUploadWidget
          uwConfig={{
            cloudName: "df2oymiyj",
            uploadPreset: "mmhundne",
            cropping: true,
          }}
          setPublicId={setPublicId}
          setImage={setImage}
        />

        {publicId && (
        <div>
            <img src={Slika} alt="Hotel" />
        </div>
        )}



        <div>
          <label>Naziv hotela:</label>
          <input type="text" value={Naziv} onChange={(e) => setNaziv(e.target.value)} />
        </div>

        <div>
          <label>Zemlja:</label>
          <input type="text" value={Zemlja} onChange={(e) => setZemlja(e.target.value)} />
        </div>

        <div>
          <label>Adresa:</label>
          <input type="text" value={Adresa} onChange={(e) => setAdresa(e.target.value)} />
        </div>

        <div>
          <label>Telefon:</label>
          <input type="text" value={Telefon} onChange={(e) => setTelefon(e.target.value)} />
        </div>

        <div>
          <label>Aerodromi:</label>
          <input type="text" value={Aerodromi} onChange={(e) => setAerodromi(e.target.value)} />
        </div>

        <div>
          <label>Prijava:</label>
          <input type="text" value={Prijava} onChange={(e) => setPrijava(e.target.value)} />
        </div>

        <div>
          <label>Odjava:</label>
          <input type="text" value={Odjava} onChange={(e) => setOdjava(e.target.value)} />
        </div>

        <div>
          <label>Politika:</label>
          <input type="text" value={Politika} onChange={(e) => setPolitika(e.target.value)} />
        </div>

        <div>
          <label>Parking:</label>
          <input type="text" value={Parking} onChange={(e) => setParking(e.target.value)} />
        </div>

        <div>
          <label>Pogodnosti:</label>
          <input type="text" value={Pogodnosti} onChange={(e) => setPogodnosti(e.target.value)} />
        </div>

        <div>
          <label>Zvezdice:</label>
          <input
                type="number"
                value={Zvezdice}
                onChange={(e) => setZvezdice(parseInt(e.target.value, 10))}
                min="0"
                max="5"
                />
        </div>
      </div>

       <div className="kartica1">
          <div>
            <h2>Informacije o sobama</h2>
            {sobe.map((soba, index) => (
              <div key={index}>
                <label>Tip sobe:</label>
                <input
                  type="text"
                  value={soba.tipSobe}
                  onChange={(e) => azurirajInformacijeOSobi(index, "tipSobe", e.target.value)}
                />

                <label>Cena po noći:</label>
                <input
                  type="number"
                  value={soba.cenaPoNoci}
                  onChange={(e) => azurirajInformacijeOSobi(index, "cenaPoNoci", e.target.value)}
                />

                <label>Broj soba:</label>
                <input
                  type="number"
                  value={soba.brojSoba}
                  onChange={(e) => azurirajInformacijeOSobi(index, "brojSoba", e.target.value)}
                />
              </div>
            ))}
            <button onClick={dodajNovuSobu}>Dodaj sobu</button>
          </div>
        </div>
      </div>

      <button className="button1" onClick={handleDodajHotel}>
        Dodaj Hotel
      </button>
      {hotelAdded && (
        <div className="success-message">
          Hotel je uspešno dodat!
          <button onClick={() => setHotelAdded(false)}>Zatvori</button>
        </div>
      )}
    </div>
  );
};

export default DodajHotel;