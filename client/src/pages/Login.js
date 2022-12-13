import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Grid, Button, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormInput = styled(TextField)({
  "& label.Mui-focused": {
    color: "#fff",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "teal",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "teal",
    },
    "&:hover fieldset": {
      borderColor: "teal",
    },
    "&.Mui-focused fieldset": {
      borderColor: "teal",
    },
  },
});

const FormButton = (props) => (
  <Button
    variant="outlined"
    sx={{
      padding: 1,
      borderColor: "teal",
      color: "#fff",
      margin: "8px",
    }}
  >
    {props.children}
  </Button>
);

const Login = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      <Box
        sx={{
          display: "flex",
          color: "#fff",
        }}
      >
        <Grid item>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              borderColor: "teal",
            }}
            noValidate
            autoComplete="off"
          >
            <h2 style={{ color: "#fff" }}>Login</h2>
            <div>
              <FormInput
                id="login-email-input"
                label="Email"
                type="email"
                autoComplete="current-email"
                sx={{ input: { color: "#fff" }, label: { color: "#fff" } }}
              />
              <FormInput
                id="login-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                sx={{ input: { color: "#fff" }, label: { color: "#fff" } }}
              />
              <FormButton>Login</FormButton>
            </div>
            <div>
              <Link href="/signup" underline="none">
                {"Click here to sign up"}
              </Link>
            </div>
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Login;
