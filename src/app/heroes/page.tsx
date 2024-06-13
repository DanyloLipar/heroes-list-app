"use client";

import { useState } from "react";
import { getHeroes } from "../../../utils/http";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Container,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import styles from "../../../assets/styles/heroes.module.scss";
import { IHero } from "../../../types/hero";
import Link from "next/link";
import { AttackType, PrimaryAttribute } from "../../../types/enums";

const HeroesList = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [primaryAttrFilter, setPrimaryAttrFilter] = useState<string>("all");
  const [attackTypeFilter, setAttackTypeFilter] = useState<string>("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["heroes", { search: searchTerm }],
    queryFn: ({ signal }) => getHeroes({ signal, searchTerm }),
  });

  let filteredData = data;

  if (data) {
    filteredData = (Object.values(data) as IHero[]).filter((hero: IHero) => {
      const matchesName = hero.localized_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPrimaryAttr =
        primaryAttrFilter === PrimaryAttribute.All ||
        hero.primary_attr === primaryAttrFilter;
      const matchesAttackType =
        attackTypeFilter === AttackType.All ||
        hero.attack_type === attackTypeFilter;

      return matchesName && matchesPrimaryAttr && matchesAttackType;
    });
  }

  let content: React.ReactNode = "";

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isError) {
    content = <Typography color="error">Error: {error.message}</Typography>;
  } else if (filteredData) {
    content = (
      <Grid container spacing={2}>
        {filteredData.map((hero: IHero) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hero.id}>
            <Link
              href={`/heroes/${hero.name.slice(14, hero.name.length)}`}
              className={styles.link}
            >
              <Card className={styles.card}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`https://cdn.cloudflare.steamstatic.com${hero.img}`}
                  alt={hero.localized_name}
                />
                <CardContent>
                  <Typography variant="h6">{hero.localized_name}</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Primary Attribute: {hero.primary_attr}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Container sx={{ marginBottom: "35px" }}>
      <Typography variant="h4" gutterBottom>
        Heroes List
      </Typography>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Primary Attribute</InputLabel>
          <Select
            value={primaryAttrFilter}
            onChange={(e) => setPrimaryAttrFilter(e.target.value)}
            label="Primary Attribute"
            className={styles.selection}
          >
            <MenuItem value={PrimaryAttribute.All}>All</MenuItem>
            <MenuItem value={PrimaryAttribute.Strength}>Strength</MenuItem>
            <MenuItem value={PrimaryAttribute.Agility}>Agility</MenuItem>
            <MenuItem value={PrimaryAttribute.Intelligence}>
              Intelligence
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Attack Type</InputLabel>
          <Select
            value={attackTypeFilter}
            onChange={(e) => setAttackTypeFilter(e.target.value)}
            label="Attack Type"
          >
            <MenuItem value={AttackType.All}>All</MenuItem>
            <MenuItem value={AttackType.Melee}>Melee</MenuItem>
            <MenuItem value={AttackType.Ranged}>Ranged</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search Heroes"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {content}
    </Container>
  );
};

export default HeroesList;
