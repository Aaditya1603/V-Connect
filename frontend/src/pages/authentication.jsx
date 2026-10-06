import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // Standard v6 import
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleTabChange = (state) => {
    setFormState(state);
    setError("");
    setUsername("");
    setPassword("");
    setName("");
  };

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setMessage(result || "Registration successful!");
        setOpen(true);
        setError("");
        setFormState(0);
        setUsername("");
        setPassword("");
        setName("");
      }
    } catch (err) {
      console.log(err);
      let errMsg =
        err.response?.data?.message || err.message || "Authentication failed";
      setError(errMsg);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh", width: "100vw" }}>
        <CssBaseline />

        <Grid
          size={{ xs: false, sm: 5, md: 7 }}
          sx={{
            display: { xs: "none", sm: "block" },
            backgroundImage: "url('/background.png')",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#757575",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        />

        {/* Right Side: Sign-In/Sign-Up Form */}
        <Grid
          // 3. FIXED FOR MUI v6: Transformed legacy props to modern size structure
          size={{ xs: 12, sm: 7, md: 5 }}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant={formState === 0 ? "contained" : "text"}
                onClick={() => handleTabChange(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "text"}
                onClick={() => handleTabChange(1)}
              >
                Sign Up
              </Button>
            </Box>

            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
              />

              {error && (
                <p style={{ color: "red", margin: "8px 0 0 0" }}>{error}</p>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setOpen(false)}
      />
    </ThemeProvider>
  );
}
