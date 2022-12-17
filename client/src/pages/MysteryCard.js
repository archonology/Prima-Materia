import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_CARD_LIST } from "../utils/mutations";
import { ADD_CARD_DECK } from "../utils/mutations";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import { mysteryCardSearch } from "../utils/API";
import SingleCard from "../components/SingleCard";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";

export const MysteryCard = () => {
  const [mysteryCard, setMysteryCard] = useState([]);
  const [addCardToWishList, { error }] = useMutation(ADD_CARD_LIST);
  const { loading, data } = useQuery(QUERY_ME);

  let userData = data?.me || {};
  //If the user is not logged in, create a user object with an empty wishList to pass into SingleCard component
  if (error) {
    if (error.toString() === "ApolloError: You need to be logged in!") {
      userData = {
        wishList: [],
      };
    }
    console.error(error);
  }

  const handleSubmit = async () => {
    // event.preventDefault();
    // console.log(event);
    try {
      const response = await mysteryCardSearch();

      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      console.log(response);
      const { cards } = await response.json();
      console.log(cards);
      const cardData = cards.map((card) => ({
        cardId: card.id,
        name: card.name,
        type: card.type,
        text: card.text,
        image: card.imageUrl,
      }));
      console.log(cardData);
      setMysteryCard(cardData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCardToList = async (cardId) => {
    const cardToSave = mysteryCard.find((card) => card.cardId === cardId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await addCardToWishList({
        variables: { ...cardToSave },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container sx={{ marginTop: "10em" }}>
        <Box
          noValidate
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            sx={{ marginTop: "1em", maxWidth: "400px", padding: "1em" }}
          >
            Get a Mystery Card
          </Button>
        </Box>

        <Box sx={{ paddingTop: "3rem" }}>
          {mysteryCard.map((card) => {
            return <SingleCard card={card} wishList={userData.wishList} />;
          })}
        </Box>
      </Container>
    </>
  );
};

export default MysteryCard;
