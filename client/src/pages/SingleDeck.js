import React, { useEffect } from "react";
import Auth from "../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_DECK, QUERY_ME } from "../utils/queries";
import { Container, Grid } from "@mui/material";
import { useParams } from "react-router-dom";

import SingleDeckCard from "../components/SingleDeckCard";

const SingleDeck = () => {
  const { deckId } = useParams();

  const { loading, error, data } = useQuery(
    deckId ? QUERY_SINGLE_DECK : QUERY_ME,
    {
      variables: { _id: deckId },
    }
  );

  const deckData = data?.me || data?.deck || data?.cards || [];

  let userQuery = useQuery(QUERY_ME);

  if (userQuery.error) {
    userQuery.data.me.wishList = [];
  }

  //Error handling if user is not logged in
  if (error) {
    console.log(error);
    return (
      <h3
        style={{
          color: "#fff",
          textAlign: "center",
        }}
      >
        {error.toString().replace("ApolloError: ", "")}
      </h3>
    );
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <Container maxWidth="lg" sx={{ margin: ".3em", marginTop: "10em" }}>
      <a href="/decks" style={{ textDecoration: 'none' }}><h4 style={{ color: "white", fontSize: '20px', textDecoration: 'none' }}>⬅ back</h4></a>
      <h2 style={{ color: "#fff", textAlign: "center" }}>{deckData.title}</h2>
      {deckData?.cards?.length > 0 ? (
        <Grid container>
          {deckData?.cards?.map((card) => {
            return (
              <Grid item xs={12} sm={12} md={4} sx={{ maxHeight: "580px" }}>
                <SingleDeckCard
                  card={card}
                  deckId={deckData._id}
                  wishList={userQuery.data?.me.wishList}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <>
        </>
        // <h2 style={{ color: "#fff" }}>This deck has no cards.</h2>
      )}
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

export default SingleDeck;
