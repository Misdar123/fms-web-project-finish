import React, { useState } from "react";
import { useContextApi } from "../../lib/hooks/useContexApi";
import {
  Button,
  Card,
  Typography,
  Container,
  Stack,
  Box,
  LinearProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link } from "react-router-dom";

const Login = () => {
  const { setIsAuth } = useContextApi();
  const [email, setEmail] = useState("");
  const [emailResetPassword, setEmailResetPassword] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleResetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, emailResetPassword)
      .then(() => {
        alert("please chek your email");
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const submitForm = (event) => {
    event.preventDefault();

    if (email === "" || password === "") {
      setIsError(true);
      setErrorMessageEmail("tidak boleh kosong");
      setErrorMessagePassword("tidak boleh kosong")
      return;
    }

    setIsLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => setIsLoading(false))
      .then((userCredential) => {
        const isVerified = userCredential?.user?.emailVerified;
        if (isVerified) {
          setIsAuth(true);
          console.log("success");
        } else {
          console.log("email is not verified");
          setErrorMessageEmail("email belum terverifikasi");
          setIsError(true);
        }
      })
      .catch((error) => {
        console.log(error.code);
        setIsError(true);
        switch (error.code) {
          case "auth/invalid-email":
            setErrorMessageEmail("email tidak valid");
            break;
          case "auth/email-already-in-use":
            setErrorMessageEmail("email sudah digunakan");
            break;
          case "auth/user-not-found":
            setErrorMessageEmail("email belum terdaftar, silahkan buat akun");
            break;
          case "auth/wrong-password":
            setErrorMessagePassword("Password salah");
            break;
          default:
        }
      })
      .finally(() => setIsLoading(false));
  };


  return (
    <>
      {isLoading && <LinearProgress />}
      <Container maxWidth="xs">
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
            Login
          </Typography>
          <Box
            onSubmit={submitForm}
            component="form"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TextField
              error={isError}
              helperText={errorMessageEmail}
              label="E-mail"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "36ch" }}
              value={email}
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
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

            <Button
              type="submit"
              sx={{
                m: 1,
                width: "39ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant={"contained"}
            >
              Login
            </Button>
          </Box>

          <Link
            style={{ textDecoration: "none" }}
            onClick={handleDialog}
            to="/"
          >
            Lupa password
          </Link>

          <Stack direction="row" alignItems="center" mt={5}>
            <Typography>Belum punya akun?</Typography>
            <Link
              style={{ paddingLeft: "10px", textDecoration: "none" }}
              to="SignIn"
            >
              Buat akun
            </Link>
          </Stack>
        </Card>

        <Dialog open={openDialog} onClose={handleDialog}>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              enter your email and we'll send you a link to reset your password
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={emailResetPassword}
              onChange={(e) => setEmailResetPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleDialog();
                handleResetPassword();
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Login;
