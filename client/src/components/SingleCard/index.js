import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
  ThemeProvider,
  createTheme,
  Tooltip,
  IconButton,
  Dialog,
  Modal,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import AddToDeckDialog from "../AddToDeckDialog";
import { useMutation } from "@apollo/client";
import { ADD_CARD_LIST, REMOVE_CARD_LIST } from "../../utils/mutations";
import Auth from "../../utils/auth";
import ViewImage from "../ViewImage";

const cardTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#080808",
          boxShadow: "black -15px 7px 14px",
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: ".75rem",
          "&:last-child": {
            paddingBottom: ".75rem",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#fff",
          fontSize: "large",
        },
      },
    },
  },
});

const SingleCard = ({ card, wishList }) => {
  let wishState = false;
  //If user is logged in, check their wishlist if the card is in their wishlist and change the heart icon to red
  if (Auth.loggedIn()) {
    const listChecker = wishList.filter(
      (cardObj) => cardObj.cardId === card.cardId
    );
    if (listChecker.length > 0) {
      wishState = true;
    }
  }

  const [clicked, setClicked] = useState(wishState);
  const [openDeck, setOpenDeck] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [addCardToWishList] = useMutation(ADD_CARD_LIST);
  const [removeCardFromList] = useMutation(REMOVE_CARD_LIST);

  const handleClickOpenDecks = () => {
    setOpenDeck(true);
  };

  const handleCloseDecks = () => {
    setOpenDeck(false);
  };

  const handleClickOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleSaveCardToList = async (card) => {
    //If the clicked state is currently set to false, change it to true and add card to user's wishlist
    if (!clicked) {
      //!clicked = false
      try {
        await addCardToWishList({
          variables: { ...card },
        });
        setClicked(true);
        return;
      } catch (err) {
        console.error(err);
      }
    }
    //if the current wish state is set to true and the user clicks the button, we want to remove it from our wishlist
    if (clicked) {
      //clicked = true
      try {
        await removeCardFromList({
          variables: { idCard: card.cardId }, //Remove the card based on the cardId value
        });
        setClicked(false);
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <ThemeProvider theme={cardTheme}>
            <Card
              sx={{
                color: "#fff",
                width: "290px",
                transition: "1s ease-in-out",
              }}
            >
              <CardContent>
                <CardActionArea onClick={handleClickOpenImage}>
                  <Tooltip title="Click to view bigger" followCursor={true}>
                    <CardMedia
                      component="img"
                      image={card.image}
                      alt={card.name}
                    />
                  </Tooltip>
                </CardActionArea>
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      height: "40px",
                      size: "2vw",
                    }}
                    component="div"
                  >
                    {card.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#fff", height: "95px", overflow: "auto" }}
                  >
                    {card.text}
                  </Typography>
                </CardContent>
                <CardActions>
                  <div onClick={() => handleSaveCardToList(card)}>
                    {clicked ? (
                      <Tooltip title="Remove from wishlist">
                        <IconButton>
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Add to wishlist">
                        <IconButton>
                          <FavoriteBorderIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    <Tooltip title="Add to a deck">
                      <IconButton onClick={handleClickOpenDecks}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </CardActions>
              </CardContent>
            </Card>
          </ThemeProvider>
        </Grid>
      </Grid>
      <Dialog open={openDeck} onClose={handleCloseDecks}>
        <AddToDeckDialog card={card} />
      </Dialog>
      <Modal
        open={openImage}
        onClose={handleCloseImage}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ViewImage card={card} />
      </Modal>
    </>
  );
};

export default SingleCard;
