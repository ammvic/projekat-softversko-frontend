import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../Components/context/loginregister.js";
import "./Navbar.css";

const AllUsersList = ({ users }) => (
  <div className="all-users-list">
    <h2>Lista svih korisnika</h2>
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.korisnickoIme}</li>
      ))}
    </ul>
  </div>
);

const UserReservationItem = ({ reservation, onDelete }) => (
  <li key={reservation.id}>
    <p>Datum prijave: {reservation.datumPrijave}</p>
    <p>Datum odjave: {reservation.datumOdjave}</p>
    <p>Hotel: {reservation.hotelNaziv}</p>
    <p>Ukupna cena: {reservation.ukupnaCena}$</p>
    <button onClick={() => onDelete(reservation.id)}>Obriši rezervaciju</button>
  </li>
);

const UserReservationsList = ({ reservations, onDelete }) => (
  <ul>
    {reservations.map(reservation => (
      <UserReservationItem key={reservation.id} reservation={reservation} onDelete={onDelete} />
    ))}
  </ul>
);

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [showReservationsForm, setShowReservationsForm] = useState(false);
  const [showAllUsersList, setShowAllUsersList] = useState(false);
  const [showAllReservationsList, setShowAllReservationsList] = useState(false);
  const [allReservations, setAllReservations] = useState([]);


  
  const { loggedIn, setLoggedIn, setToken, setUserFunction, role} = useContext(MyContext);
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState({ text: "", type: "" });
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });
  const [reservationsMessage, setReservationsMessage] = useState({ text: "", type: "" });
  const [allUsers, setAllUsers] = useState([]);

  const handleAllReservationsListClick = async () => {
    try {
      setShowAllReservationsList(true);
      setShowUserOptions(false);
  
      // Implementirajte logiku za dobavljanje rezervacija svih korisnika i prikazivanje odgovarajućeg prozora
      const token = localStorage.getItem("token");
      //const response = await fetch("https://localhost:7137/api/Reservations/all-reservations", {
        const response = await fetch("http://aplikacijahost-001-site1.ltempurl.com/api/Reservations/all-reservations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch all reservations. Status: ${response.status}`);
      }
  
      const data = await response.json();
      setAllReservations(data);
    } catch (error) {
      console.error("Greška pri prikazu liste svih rezervacija:", error.message);
    }
  };
  
  const handleCloseAllReservationsList = () => {
    setShowAllReservationsList(false);
  };
    
  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch("https://localhost:7137/api/KorisnikKontroler/all-users", {
        const response = await fetch("http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/all-users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch all users. Status: ${response.status}`);
      }
  
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching all users:", error.message);
    }
  };
  
 
    
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUserFunction(null);
    setLoggedIn(false);
    navigate('/Prijava');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    // Prikazivanje rezervacija korisnika samo kada je dugme za rezervacije pritisnuto
    if (showReservationsForm && userInfo.id) {
      fetchUserReservations();
    }
  }, [showReservationsForm, userInfo.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch('https://localhost:7137/api/KorisnikKontroler/update-user', {
      const response = await fetch("http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/update-user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          korisnickoIme: userInfo.korisnickoIme,
          ime: userInfo.ime,
          prezime: userInfo.prezime,
          adresa: userInfo.adresa,
          email: userInfo.email,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Neuspelo ažuriranje informacija o korisniku.");
      }
  
      const data = await response.json();
      setProfileMessage({ text: data.message, type: "success" });
      console.log("Informacije o korisniku su uspešno ažurirane.");
    } catch (error) {
      setProfileMessage({ text: error.message, type: "error" });
      console.error("Greška pri ažuriranju informacija o korisniku:", error.message);
    }
  };
  
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch("https://localhost:7137/api/KorisnikKontroler/current-user", {
      const response = await fetch("http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/current-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Neuspelo dobavljanje informacija o korisniku.");
      }
  
      const data = await response.json();
      setUserInfo(data);
      setServerMessage({ text: "Informacije o korisniku uspešno dobavljene.", type: "success" });
    } catch (error) {
      setServerMessage({ text: error.message, type: "error" });
      console.error("Greška pri dobavljanju informacija o korisniku:", error.message);
    }
  };

  const handleProfileClick = async (e) => {
    e.preventDefault();

    try {
      setShowProfileForm(true);
      setShowUserOptions(false);

      if (!userInfo.id) {
        await fetchUserInfo();
      }
    } catch (error) {
      console.error("Greška pri prikazu informacija o korisniku:", error.message);
    }
  };

  const handleUserIconClick = () => {
    console.log("Pozvan handleUserIconClick");
    setShowUserOptions(!showUserOptions);
  };

  const handleClick = () => {
    setClick(!click);
    setIsMenuActive(!isMenuActive);
  };

  const closeMobileMenu = () => {
    setClick(false);
    setIsMenuActive(false);
  };

  const handleCloseProfileMessage = () => {
    setProfileMessage({ text: "", type: "" });
  };

  const handleCloseReservationsMessage = () => {
    setReservationsMessage({ text: "", type: "" });
  };

  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch(`https://localhost:7137/api/Reservations/UserReservations/${userInfo.id}`, {
     const response = await fetch(`http://aplikacijahost-001-site1.ltempurl.com/api/Reservations/UserReservations/${userInfo.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Neuspelo dobavljanje rezervacija korisnika.");
      }
  
      const data = await response.json();
      setUserReservations(data);
    } catch (error) {
      setReservationsMessage({ text: error.message, type: "error" });
      console.error("Greška pri dobavljanju rezervacija korisnika:", error.message);
    }
  };
  
  const handleDeleteReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch(`https://localhost:7137/api/Reservations/${reservationId}`,{
      const response = await fetch(`http://aplikacijahost-001-site1.ltempurl.com/api/Reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Neuspelo brisanje rezervacije.");
      }
  
      console.log("Rezervacija uspešno obrisana.");
      setReservationsMessage({ text: "Rezervacija uspešno obrisana.", type: "success" });
  
      // Ažuriranje prikaza rezervacija nakon brisanja
      await fetchUserReservations();
    } catch (error) {
      setReservationsMessage({ text: error.message, type: "error" });
      console.error("Greška pri brisanju rezervacije:", error.message);
    }
  };
  
  const handleReservationsClick = async () => {
    try {
      if (!userInfo.id) {
        // Ako nema informacija o korisniku, prvo ih dobavi
        await fetchUserInfo();
      }

      // Prikazivanje forme rezervacija i učitavanje rezervacija
      setShowReservationsForm(true);

      // Ako ima informacija o korisniku, učitaj rezervacije
      if (userInfo.id) {
        await fetchUserReservations();
      }
    } catch (error) {
      console.error("Greška pri prikazu rezervacija:", error.message);
    }
  };
  
  
  const handleCloseProfileForm = () => {
    setShowProfileForm(false);
  };

  const handleCloseReservationsForm = () => {
    setShowReservationsForm(false);
  };
  const handleAllUsersListClick = async () => {
    try {
      setShowAllUsersList(true);
      setShowUserOptions(false);

      // Ako želite da dobijete listu korisnika svaki put kad se otvori ova lista, otkomentarišite sledeću liniju
       await getAllUsers();
    } catch (error) {
      console.error("Greška pri prikazu liste svih korisnika:", error.message);
    }
  };
  const handleDeleteReservation1 = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch(`https://localhost:7137/api/Reservations/sverezervacije${reservationId}`,{
        const response = await fetch(`http://aplikacijahost-001-site1.ltempurl.com/api/Reservations/sverezervacije${reservationId}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Neuspelo brisanje rezervacije.");
      }

      console.log("Rezervacija uspešno obrisana.");
      setReservationsMessage({ text: "Rezervacija uspešno obrisana.", type: "success" });

      // Ažuriranje prikaza rezervacija nakon brisanja
      await handleAllReservationsListClick();
    } catch (error) {
      setReservationsMessage({ text: error.message, type: "error" });
      console.error("Greška pri brisanju rezervacije:", error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      //const response = await fetch(`https://localhost:7137/api/KorisnikKontroler/delete-user/${userId}`, {
        const response = await fetch(`http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Neuspelo brisanje korisnika.");
      }

      console.log("Korisnik uspešno obrisan.");
      
      await getAllUsers();
    } catch (error) {
      console.error("Greška pri brisanju korisnika:", error.message);
    }
  };
  
  return (
    <>
      <nav className="navbar">
        <div className="container flex_space">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : " fas fa-bars"}></i>
          </div>

          <ul className={isMenuActive ? "nav-menu active" : "nav-menu"}>
            <li>
              <Link to="/" onClick={closeMobileMenu}>
                Početna
              </Link>
            </li>
            <li>
              <Link to="/O-nama" onClick={closeMobileMenu}>
                O nama
              </Link>
            </li>
            <li>
              <Link to="/Hoteli" onClick={closeMobileMenu}>
                Hoteli
              </Link>
            </li>
            <li>
              <Link to="/Kontakt" onClick={closeMobileMenu}>
                Kontaktirajte nas
              </Link>
            </li>
          </ul>

          <div className="login-area flex">
            <li>
              <Link to="/Prijava">
                <i className="far fa-chevron-right"></i>Prijava
              </Link>
            </li>
            <li>
              <Link to="/Registracija">
                <i className="far fa-chevron-right"></i>Registracija
              </Link>
            </li>
            {loggedIn ? (
              <li>
                <div className="user-icon" onClick={handleUserIconClick}>
                  <i className="fas fa-user"></i>
                  {showUserOptions && (
                    <div className="user-options">
                      <button onClick={handleLogout}>Odjava</button>
                      <button onClick={handleProfileClick}>Moj profil</button>
                      <button onClick={handleReservationsClick}>Moje rezervacije</button>
                      {loggedIn && role === "Administrator" && (
                        <>
                           <button onClick={handleAllUsersListClick}>Lista svih korisnika</button>
                          <button onClick={handleAllReservationsListClick}>Lista svih rezervacija</button>
                        </>
                      )} </div>
                    )}
                  </div>
                  {showAllUsersList && (
                        <div className="all-users-list">
                          <h2>Lista svih korisnika</h2>
                          <ul>
                            {allUsers.map((user) => (
                              <li key={user.id}>{user.korisnickoIme}</li>
                            ))}
                            <button onClick={handleDeleteUser}>Obriši korisnika</button>
                          </ul>
                          <button onClick={() => setShowAllUsersList(false)}>Zatvori</button>
                        </div>
                      )}
                      {showAllReservationsList && (
                        <div className="all-reservations-list">
                          <h2>Lista svih rezervacija</h2>
                          <ul>
                            {allReservations.map((reservation) => (
                              <li key={reservation.id}>
                                <p>Datum prijave: {reservation.datumPrijave}</p>
                                <p>Datum odjave: {reservation.datumOdjave}</p>
                                <p>Hotel: {reservation.hotelNaziv}</p>
                                <p>Ukupna cena: {reservation.ukupnaCena}$</p>
                                <button onClick={() => handleDeleteReservation1(reservation.id)}>Obriši</button>
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => setShowAllReservationsList(false)}>Zatvori</button>
                        </div>
                      )}

                {showProfileForm && (
                  <div className="profile-form">
                    <form>
                      <h3>Informacije o korisniku</h3>
                      <label>Korisničko ime:</label>
                      <input
                        type="text"
                        value={userInfo.korisnickoIme || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, korisnickoIme: e.target.value })}
                      />

                      <label>Ime:</label>
                      <input
                        type="text"
                        value={userInfo.ime || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, ime: e.target.value })}
                      />
                      <label>Prezime:</label>
                      <input
                        type="text"
                        value={userInfo.prezime || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, prezime: e.target.value })}
                      />
                      <label>Adresa:</label>
                      <input
                        type="text"
                        value={userInfo.adresa || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, adresa: e.target.value })}
                      />
                      <label>Email:</label>
                      <input
                        type="text"
                        value={userInfo.email || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                      <button type="submit" onClick={handleSubmit}>Sačuvaj promene</button>
                      <button type="button" onClick={handleCloseProfileForm}>Zatvori</button>
                      {profileMessage.text && (
                    <div className={`server-message ${profileMessage.type}`}>
                      {profileMessage.text}
                      <button onClick={handleCloseProfileMessage}>&times;</button>
                    </div>
                  )}
                    </form>
                  </div>
                )}
              </li>
            ) : null}
           {showReservationsForm && (
            <div className="reservations-form">
              <h3>Moje rezervacije</h3>
              {userReservations.length > 0 ? (
                <UserReservationsList reservations={userReservations} onDelete={handleDeleteReservation} />
              ) : (
                <p>Trenutno nemate rezervacija.</p>
              )}
              <button type="button" onClick={handleCloseReservationsForm}>Zatvori</button>
              {reservationsMessage.text && (
                <div className={`server-message ${reservationsMessage.type}`}>
                  {reservationsMessage.text}
                  <button onClick={handleCloseReservationsMessage}>&times;</button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </nav>
      <header>
        <div className="container flex_space">
          <div className="logo">
            <Link to="/"><img src="images/logo1.png" alt="" /></Link>
          </div>

          <div className="contact flex_space ">
            <div className="box flex_space">
              <div className="icons">
                <i className="fal fa-clock"></i>
              </div>
              <div className="text">
                <h4>Kontakt centar</h4>
                <Link to="/Kontakt">Ponedeljak - Nedelja: 9.00 do 18.00</Link>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="text">
                <h4>Pozovite nas</h4>
                <a href="sms:+0111234567">+011 123 4567</a>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons">
                <i className="far fa-envelope"></i>
              </div>
              <div className="text">
                <h4>Pišite nam</h4>
                <a href="mailto:info@exampal.com">roomrover11@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
