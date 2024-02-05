import { FiEye, FiEyeOff } from 'react-icons/fi';
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import HeadTitle from "../../Common/HeadTitle/HeadTitle";
import { MyContext } from "../context/loginregister.js";

const Login = () => {
  const { setUserFunction, setLoggedIn, setToken, loggedIn } = useContext(MyContext);
  const [userId, setUserIdLocal] = useState(""); 
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [serverResponse, setServerResponse] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordToken, setResetPasswordToken] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");

    if (rememberedUsername) {
      setUserName(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleRequestToken = async () => {
    try {
      // Validacija e-mail adrese i novih lozinki
      if (resetPasswordEmail === "" || newPassword === "" || confirmNewPassword === "") {
        setError("Popunite sva polja.");
        return;
      }
  
      if (newPassword !== confirmNewPassword) {
        setError("Lozinke se ne poklapaju.");
        return;
      }
  
      // Slanje zahteva za dobijanje tokena
      const response = await axios.post('http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/promeni-lozinku', {
      //const response = await axios.post('https://localhost:7137/api/KorisnikKontroler/promeni-lozinku', {
        email: resetPasswordEmail,
        newPassword,
        confirmNewPassword,
      });
  
      // Ako je uspešno, direktno postavite stanje za prikaz forme za unos tokena
      setShowTokenForm(true);
      setServerResponse("Token je uspešno poslat na vašu e-mail adresu.");
    } catch (error) {
      console.error("Greška pri slanju zahteva za token", error);
      setServerResponse("Došlo je do greške pri slanju zahteva za token.");
    }
  };
  

  const handleResetPassword = async () => {
    try {
      // Validacija tokena
      if (resetPasswordToken === "") {
        setError("Unesite reset token.");
        return;
      }

      // Slanje zahteva za promenu lozinke
      //const response = await axios.post('https://localhost:7137/api/KorisnikKontroler/izmeni-lozinku', {
      const response = await axios.post('http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/izmeni-lozinku', {
        email: resetPasswordEmail,
        newPassword,
        confirmNewPassword: confirmNewPassword,
        resetPasswordToken,
      });

      // Ukoliko je uspešno, resetujte stanje komponente
      setNewPassword("");
      setConfirmNewPassword("");
      setResetPasswordToken("");
      setShowPasswordForm(false);
      setShowTokenForm(false);
      setServerResponse("Uspešno ste promenili lozinku.");
    } catch (error) {
      console.error("Greška pri promeni lozinke", error);
      setServerResponse("Došlo je do greške pri promeni lozinke.");
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);

    if (!rememberMe) {
      localStorage.setItem("rememberedUsername", userName);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
  };

  const closeModal = () => {
    // Zatvorite prozor za promenu lozinke
    setShowPasswordForm(false);
    setShowTokenForm(false);
  };

  const openModal = () => {
    setShowPasswordForm(true);
    setResetPasswordEmail("");
    setShowTokenForm(false);
  };

  const loginUserHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loggedIn) {
        setServerResponse("Već ste prijavljeni. Da li želite ponovo da se prijavite?");
        return;
      }

     // const response = await axios.post('https://localhost:7137/api/KorisnikKontroler/login', {
        const response = await axios.post('http://aplikacijahost-001-site1.ltempurl.com/api/KorisnikKontroler/login', {
        korisnickoIme: userName,
        lozinka: password,
      });

      const responseData = response.data;

      if (responseData.token) {
        const { token, id, ...userData } = responseData;

        console.log("Odgovor sa servera:", response.data);
        console.log("Dobijeni ID:",responseData.korisnik.id);
        
        setToken(token);
        setUserFunction(userData);
        setUserIdLocal(responseData.korisnik.id); 
        setLoggedIn(true);
      
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userData.uloga);
        localStorage.setItem("userId", responseData.korisnik.id); 
        
        console.log("Navigacija na početnu stranicu");
        navigate('/');
      } else {
        setServerResponse("Neispravni podaci pri prijavljivanju.");
      }
    } catch (e) {
      console.error("Greška pri prijavljivanju", e);
      setServerResponse("Pogrešno korisničko ime ili lozinka");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadTitle />
      <section className="forms top">
        <div className="container">
          <div className="sign-box">
            <p>
              Unesi svoje korisničko ime i lozinku i iskoristi pogodnosti za rezervacije kao prijavljeni korisnik
            </p>
            <form onSubmit={loginUserHandler}>
              <input
                type="text"
                name="korisnickoime"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Korisničko ime"
              />
          <div className="password-input" style={{ position: 'relative' }}>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Lozinka"
    style={{ paddingRight: '30px' }} 
  />
  <div className="eye-icon" style={{ position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <FiEye /> : <FiEyeOff />}
  </div>
</div>



              <div className="flex_space">
                <div className="flex">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label>Zapamti me</label>
                </div>
                <p
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={openModal}
                >
                  Zaboravio/la si lozinku?
                </p>
                {showPasswordForm && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={closeModal}>&times;</span>
                      <input
                        type="email"
                        name="resetPasswordEmail"
                        value={resetPasswordEmail}
                        onChange={(e) => setResetPasswordEmail(e.target.value)}
                        placeholder="Unesite e-mail adresu"
                      />
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova lozinka"
                      />
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Potvrdi novu lozinku"
                      />
                      <button onClick={handleRequestToken} className="primary-btn">
                        Posalji token
                      </button>
                    </div>
                  </div>
                )}
                {showTokenForm && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={closeModal}>&times;</span>
                      <input
                        type="text"
                        name="resetPasswordToken"
                        value={resetPasswordToken}
                        onChange={(e) => setResetPasswordToken(e.target.value)}
                        placeholder="Unesite reset token"
                      />
                      <button onClick={handleResetPassword} className="primary-btn">
                        Promeni lozinku
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="primary-btn">
                Prijavi se
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {serverResponse && <p style={{ color: "green" }}>{serverResponse}</p>}
              <p>
                Nemaš nalog? <Link to="/Registracija">Registruj se!</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
