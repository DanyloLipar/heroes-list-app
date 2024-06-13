"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import styles from "../../../../assets/styles/hero.module.scss";
import { useState } from "react";
import Abilities from "../../../../components/Abilities";
import { getHeroDetails, getHeroLore } from "../../../../utils/http";

const HeroPage = () => {
  const { heroName } = useParams();
  const router = useRouter();
  const [showFullLore, setShowFullLore] = useState(false);

  const {
    data: hero,
    isLoading: isHeroLoading,
    isError: isHeroError,
    error: heroError,
  } = useQuery({
    queryKey: ["hero", heroName],
    queryFn: () => getHeroDetails(heroName.toString()),
    enabled: !!heroName,
  });

  const {
    data: lore,
    isLoading: isLoreLoading,
    isError: isLoreError,
    error: loreError,
  } = useQuery({
    queryKey: ["lore", heroName],
    queryFn: () => getHeroLore(heroName.toString()),
    enabled: !!heroName,
  });

  if (isHeroLoading || isLoreLoading) {
    return <CircularProgress />;
  }

  if (isHeroError || isLoreError) {
    return (
      <Typography color="error">
        {heroError?.message || loreError?.message}
      </Typography>
    );
  }

  return (
    <Container>
      <Button onClick={() => router.back()} className={styles.btn}>
        Back
      </Button>
      <Card className={styles.card}>
        <Box className={styles.box}>
          <CardContent>
            <Typography variant="h3" color="textPrimary">
              {hero?.localized_name}
            </Typography>
            <Box
              className={`${styles["lore-container"]} ${
                showFullLore ? styles.expanded : ""
              }`}
            >
              <Typography variant="body1" color="textPrimary" marginTop={2}>
                {lore}
              </Typography>
            </Box>
            {!showFullLore && <Typography color="textPrimary">...</Typography>}
            <Button
              variant="text"
              color="primary"
              className={styles.showMore}
              onClick={() => setShowFullLore(!showFullLore)}
            >
              {showFullLore ? "Show Less" : "Show More"}
            </Button>
          </CardContent>
          <CardMedia
            component="img"
            sx={{
              objectFit: "cover",
              marginTop: "25px",
              marginRight: "15px",
              borderRadius: "10px",
            }}
            height="350"
            image={`https://cdn.cloudflare.steamstatic.com${hero?.img}`}
            alt={hero?.localized_name}
          />
        </Box>
        <Abilities heroName={String(hero?.name)} />
      </Card>
    </Container>
  );
};

export default HeroPage;
