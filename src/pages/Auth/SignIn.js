import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  Typography,
  Container,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { writeDataBase } from "../../lib/function/dataBaseCRUD";
import { stringRegex } from "../../lib/function/stringRegex";

const SignIn = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessageUserName, setErrorMessageUserName] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [showEmailVerificationCard, setShowEmailVerificationCard] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      userEmail === "" ||
      password === "" ||
      confirmPassword === "" ||
      userName === ""
    ) {
      setIsError(true);

      setErrorMessageUserName("tidak boleh kosong");
      setErrorMessageEmail("tidak boleh kosong");
      setErrorMessagePassword("tidak boleh kosong");
      return;
    }

    if (userName.length >= 15 || userName.length <= 5) {
      setErrorMessageUserName("5-15 karakter yang diperbolehkan");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessagePassword("Password tidak sama");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, userEmail, password).then(
        () => {
          const data = {
            email: userEmail,
            userName: userName,
            password: password,
          };
          const path = "users/" + stringRegex(userEmail);
          writeDataBase(path, data);
        }
      );

      await sendEmailVerification(auth.currentUser).then(() => {
        setShowEmailVerificationCard(true);
      });
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setIsError(true);
          setErrorMessageEmail("email tidak valid");
          break;
        case "auth/email-already-in-use":
          setErrorMessageEmail("email sudah digunakan");
          setIsError(true);
          break;
        case "auth/weak-password":
          setIsError(true);
          setErrorMessagePassword("password tidak aman");
          break;
        default:
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LinearProgress />}
      <Container maxWidth="xs">
        {showEmailVerificationCard ? (
          <Card
            sx={{
              mt: 5,
              pt: 8,
              pb: 8,
              pl: 5,
              pr: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="h5" marginBottom={3} fontWeight={"bold"}>
              Please check your email
            </Typography>

            <Typography variant="h6" sx={{ color: "gray", fontSize: 15 }}>
              In order to start using your account, you need conffirm your email
              address
            </Typography>
            <Button
              sx={{
                m: 1,
                width: "39ch",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant="contained"
              onClick={() => navigation("/")}
            >
              go to login
            </Button>
          </Card>
        ) : (
          <Card
            sx={{
              mt: 5,
              p: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              marginBottom={5}
              color="primary"
              fontWeight={"bold"}
            >
              Sign In
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TextField
                error={isError}
                helperText={errorMessageUserName}
                label="User name"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "36ch" }}
                value={userName}
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                  setIsError(false);
                  setErrorMessageUserName("");
                }}
              />
              <TextField
                error={isError}
                helperText={errorMessageEmail}
                label="E-mail"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "36ch" }}
                value={userEmail}
                type="email"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setIsError(false);
                  setErrorMessageEmail("");
                }}
              />

              <TextField
                error={isError}
                helperText={errorMessagePassword}
                label="Password"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "36ch" }}
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsError(false);
                  setErrorMessagePassword("");
                }}
              />
              <TextField
                error={isError}
                helperText={errorMessagePassword}
                label="Confirm Password"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "36ch" }}
                value={confirmPassword}
                type="password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setIsError(false);
                  setErrorMessagePassword("");
                }}
              />

              <Button
                type="submit"
                sx={{
                  m: 1,
                  width: "39ch",
                  color: "#FFF",
                  fontWeight: "bold",
                }}
                variant="contained"
              >
                Sign In
              </Button>
            </form>
            <Stack direction="row" alignItems="center" mt={5}>
              <Typography>Sudah punya akun?</Typography>
              <Link
                style={{ paddingLeft: "10px", textDecoration: "none" }}
                to="/"
              >
                Login
              </Link>
            </Stack>
          </Card>
        )}
      </Container>
    </>
  );
};

export default SignIn;
