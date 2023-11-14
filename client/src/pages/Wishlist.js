import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Container, Grid } from "@mui/material";

import SingleCard from "../components/SingleCard";

const Wishlist = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  const userData = data?.me || {};

  //Error handling if user is not logged in
  if (error) {
    if (error) {
      window.location.assign('/login');
    }
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <Container sx={{ justifyContent: "center", marginTop: '9em' }}>
      <h3
        style={{
          color: "#fff",
          textAlign: "center",
          paddingBottom: '1.2em',
          fontSize: '30px'
        }}
      >
        Wishlist
      </h3>
      <Grid container>
        {userData.wishList.map((card) => {
          const cardData = {
            cardId: card.cardId,
            name: card.name,
            type: card.type,
            text: card.text,
            image: card.image,
          };
          return (
            <Grid item xs={12} sm={6} md={4} sx={{ maxHeight: "640px" }}>
              <SingleCard card={cardData} wishList={userData.wishList} />;
            </Grid>
          );
        })}
      </Grid>
      <div className="toTop">
        <button
          className="toTop-button"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo(0, 0);
          }}
        >TO TOP</button>
      </div>
    </Container>
  );
};

export default Wishlist;
