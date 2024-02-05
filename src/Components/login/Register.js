import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import axios from "axios";
import "./design.css";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");

  const resetForm = () => {
    setName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setUserName("");
    setPassword("");
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      //const verificationResponse = await axios.post(
        //'https://localhost:7137/api/Email/send-registration-verification-email',
        const verificationResponse = await axios.post(
          'http://aplikacijahost-001-site1.ltempurl.com/api/Email/send-registration-verification-email',
        {
          userEmail: email,  
        }
      );

      if (verificationResponse.status === 200) {
        setSuccessMessage("Uspešna verifikacija! Nastavite s registracijom.");
        setShowVerification(true);
      } else {
        console.error("Greška prilikom slanja verifikacionog koda");
        setError("Nije moguće poslati verifikacioni kod.");
      }
    } catch (error) {
      console.error("Greška prilikom slanja verifikacionog koda", error);
      setError("Nije moguće poslati verifikacioni kod.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    if (showVerification) {
      try {
        setLoading(true);
  
       
        const isVerificationCodeValid = await checkVerificationCode();
        
        if (isVerificationCodeValid) {
          //const response = await axios.post('https://localhost:7137/api/KorisnikKontroler/register', {
          const response = await axios.post('http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/register', { 
          ime: name,
            prezime: lastName,
            adresa: address,
            email,
            korisnickoIme: userName,
            lozinka: password,
            verificationCode: verificationCodeInput,
          });
  
          setSuccessMessage("Uspešno kreiran nalog!");
          resetForm();
          navigate('/Prijava');
        } else {
          setError("Uneti kod nije ispravan.");
        }
      } catch (error) {
        console.error("Greška prilikom registracije", error);
        console.log("Odgovor servera:", error.response?.data);
        setError(error.response?.data.message || "Greška prilikom kreiranja naloga");
      } finally {
        setLoading(false);
      }
    } else {
      await handleVerificationSubmit(e);
    }
  };
  
  
  const checkVerificationCode = async () => {
    try {
      //const response = await axios.post('https://localhost:7137/api/KorisnikKontroler/check-verification-code', {
      const response = await axios.post('http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/check-verification-code', {
      userEmail: email,
        verificationCode: verificationCodeInput,
      });
  
      return response.data.isValid;
    } catch (error) {
      console.error("Greška prilikom provere verifikacionog koda", error);
      return false;
    }
  };
  

  return (
    <>
      <HeadTitle />
      <section className="forms top">
        <div className="container">
          <div className="sign-box">
            <p>
              Nemate nalog? Kreirajte svoj nalog, traje manje od jednog minuta.
            </p>
            <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ime"
                required
              />
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Prezime"
                required
              />
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresa"
                required
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Korisničko ime"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lozinka"
                required
              />

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Kreiranje..." : showVerification ? "Potvrdi nalog" : "Kreiraj nalog"}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </form>
          </div>
        </div>
      </section>
      {showVerification && (
        <div className="container1">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={verificationCodeInput}
              onChange={(e) => setVerificationCodeInput(e.target.value)}
              placeholder="Unesite kod za verifikaciju"
            />
            <button type="submit">Potvrdi verifikaciju</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
