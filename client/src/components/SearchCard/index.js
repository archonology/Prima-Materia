import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  ThemeProvider,
  createTheme,
  ModalRoot,
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
import { ADD_CARD_LIST, ADD_CARD_DECK, REMOVE_CARD_LIST } from "../../utils/mutations";
import Auth from "../../utils/auth";
import ViewImage from "../ViewImage";

const cardTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#424242",
          border: "solid 2px teal",
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

const SearchCard = ({ card, wishList }) => {
  // console.log(wishList);
  // console.log("This is the card:", card)
  let wishState = false;
  //TODO: Figure out how to handle wishList if user is not logged in. 
  if(Auth.loggedIn()){
    // console.log("This logged in checker is functioning")
    //APPROACH: Map through the array of cards in the wishList to check if the cardId exists
    // wishState = wishList.includes(card) ? true : false
    const listChecker = wishList.filter( cardObj => cardObj.cardId === card.cardId)
    if(listChecker.length > 0){
      wishState = true;
    }
    // console.log("This is the wishState: ", wishState)
  }

  // console.log("The state of all the cards in the wishlist tab should display true", wishState);
  const [clicked, setClicked] = useState(wishState);
  const [openDeck, setOpenDeck] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [searchedCard, setSearchedCard] = useState([]);
  const [addCardToWishList, { error }] = useMutation(ADD_CARD_LIST);
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
    // console.log("This is the state of clicked", clicked);
    // console.log("This is the state of clicked!", !clicked);
    if(!clicked){
      console.log("This is the if statement state of clicked: ", clicked)
      try {
        const { data } = await addCardToWishList({
          variables: { ...card },
        });
        // to change the icon to the filled heart
        setClicked(true);//sets clicked to true
        console.log("This is the state of clicked after i set it to !clicked: ", clicked)
        return
      } catch (err) {
        console.error(err);
      }
    }

    if(clicked){//if the current wish state is set to true and the user clicks the button, we want to remove it from our wishlist
      try{
        const { data } = await removeCardFromList({
          variables: {idCard: card._id}//TODO: Change this to card.cardId
        })
        setClicked(false)
      } catch (err) {
        console.error(err)
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
        <Grid item key={card.cardId}>
          <ThemeProvider theme={cardTheme}>
            <Card sx={{ color: "#fff", width: "250px" }}>
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
                    sx={{ color: "#fff", height: "75px", overflow: "auto" }}
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
        <AddToDeckDialog />
      </Dialog>
      <Modal
        open={openImage}
        onClose={handleCloseImage}
        style={{
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

export default SearchCard;
