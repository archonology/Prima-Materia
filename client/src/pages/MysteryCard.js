import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CARD_LIST } from "../utils/mutations";
import { Box, Container } from "@mui/material";
import { mysteryCardSearch } from "../utils/API";
import SingleCard from "../components/SingleCard";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";

export const MysteryCard = () => {
  const [mysteryCard, setMysteryCard] = useState([]);
  const [{ error }] = useMutation(ADD_CARD_LIST);
  const { data } = useQuery(QUERY_ME);

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
    try {
      const response = await mysteryCardSearch();

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { cards } = await response.json();
      const cardData = cards.map((card) => ({
        cardId: card.id,
        name: card.name,
        type: card.type,
        text: card.text,
        image: card.imageUrl,
      }));

      setMysteryCard(cardData);
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
          <button className="mystery-button" onClick={handleSubmit}>
            Summon
          </button>
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
